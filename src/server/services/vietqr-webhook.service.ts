import { prisma } from '@/lib/prisma';
import { generateUniqueCode } from '@/lib/utils';
import { Prisma } from '@prisma/client';

export interface VietQrWebhookPayload {
  gateway?: string; // sepay, casso, web2m, momo
  transactionDate?: string;
  accountNumber?: string;
  code?: string;
  content?: string; // Ví dụ: "TNAUTO user_12345 naptien"
  transferType?: string; // "in"
  transferAmount?: number;
  accumulated?: number;
  subAccount?: string;
  referenceCode?: string; // Mã tham chiếu ngân hàng duy nhất (Idempotency key)
  description?: string;
}

export interface WebhookProcessResult {
  success: boolean;
  message: string;
  userId?: string;
  amount?: number;
  transCode?: string;
  isDuplicate?: boolean;
}

export class VietQrWebhookService {
  /**
   * Xử lý Webhook biến động số dư VietQR tự động 24/7
   * Đảm bảo Idempotency (xử lý trùng lặp) và Transaction an toàn
   */
  public static async processWebhook(
    payload: VietQrWebhookPayload,
    apiKeyHeader?: string
  ): Promise<WebhookProcessResult> {
    // 1. Kiểm tra API Key bảo mật Webhook (cấu hình trong biến môi trường)
    const expectedApiKey = process.env.PAYMENT_WEBHOOK_SECRET;
    if (expectedApiKey && apiKeyHeader !== expectedApiKey) {
      return { success: false, message: 'UNAUTHORIZED: Webhook API Key không hợp lệ!' };
    }

    const amount = Number(payload.transferAmount || 0);
    const content = String(payload.content || payload.description || '').trim();
    const referenceId = String(payload.referenceCode || payload.code || '').trim();

    if (amount <= 0) {
      return { success: false, message: 'IGNORE: Số tiền chuyển khoản phải lớn hơn 0' };
    }

    if (!referenceId) {
      return { success: false, message: 'INVALID_PAYLOAD: Thiếu mã tham chiếu ngân hàng (referenceCode)' };
    }

    // 2. Trích xuất User ID từ nội dung chuyển khoản theo cú pháp: TNAUTO <User_ID> hoặc TNAUTO <Username>
    // Regex linh hoạt bắt: TNAUTO <id_or_username> hoặc TNAUTO_<id>
    const match = content.match(/TNAUTO[\s_]+([A-Za-z0-9_-]+)/i);
    if (!match || !match[1]) {
      return {
        success: false,
        message: `NO_MATCH_USER: Không tìm thấy cú pháp TNAUTO <UserID> trong nội dung: "${content}"`,
      };
    }

    const userIdentifier = match[1].trim();

    try {
      return await prisma.$transaction(
        async (tx) => {
          // 3. KIỂM TRA TRÙNG LẶP (IDEMPOTENCY CHECK)
          // Nếu mã giao dịch ngân hàng đã được xử lý thành công trước đó -> Bỏ qua ngay lập tức
          const existingTx = await tx.transaction.findUnique({
            where: { referenceId },
          });

          if (existingTx) {
            return {
              success: true,
              isDuplicate: true,
              message: `IDEMPOTENT: Giao dịch ${referenceId} đã được cộng tiền trước đó rồi!`,
              transCode: existingTx.transCode,
              userId: existingTx.userId,
              amount: Number(existingTx.amount),
            };
          }

          // 4. Tìm kiếm người dùng theo ID hoặc Username
          const targetUser = await tx.user.findFirst({
            where: {
              OR: [{ id: userIdentifier }, { username: userIdentifier }],
            },
            select: { id: true, balance: true, email: true, username: true },
          });

          if (!targetUser) {
            // Lưu lại giao dịch Pending để Admin tra soát thủ công
            const pendTransCode = generateUniqueCode('TX_ERR');
            await tx.transaction.create({
              data: {
                transCode: pendTransCode,
                referenceId,
                userId: 'SYSTEM', // Placeholder hoặc gán tạm
                type: 'DEPOSIT',
                amount: new Prisma.Decimal(amount),
                balanceBefore: new Prisma.Decimal(0),
                balanceAfter: new Prisma.Decimal(0),
                status: 'FAILED',
                provider: 'VIETQR',
                description: `Sai UserIdentifier [${userIdentifier}] từ nội dung: ${content}`,
                rawWebhookData: payload as unknown as Prisma.InputJsonValue,
              },
            });

            return {
              success: false,
              message: `USER_NOT_FOUND: Không tìm thấy tài khoản tương ứng với mã [${userIdentifier}]`,
            };
          }

          // 5. Khóa User bằng Row-Level Locking (FOR UPDATE) để cộng tiền an toàn tuyệt đối
          const lockedUsers = await tx.$queryRaw<Array<{ id: string; balance: Prisma.Decimal }>>`
            SELECT id, balance FROM "User" WHERE id = ${targetUser.id} FOR UPDATE
          `;

          const currentBalance = Number(lockedUsers[0].balance);
          const newBalance = currentBalance + amount;

          // 6. Cập nhật số dư và tổng tiền nạp của User
          await tx.user.update({
            where: { id: targetUser.id },
            data: {
              balance: new Prisma.Decimal(newBalance),
              totalDeposited: { increment: new Prisma.Decimal(amount) },
            },
          });

          // 7. Tạo bản ghi Transaction nạp tiền thành công
          const transCode = generateUniqueCode('TX_DEP');
          await tx.transaction.create({
            data: {
              transCode,
              referenceId,
              userId: targetUser.id,
              type: 'DEPOSIT',
              amount: new Prisma.Decimal(amount),
              balanceBefore: new Prisma.Decimal(currentBalance),
              balanceAfter: new Prisma.Decimal(newBalance),
              status: 'SUCCESS',
              provider: 'VIETQR',
              description: `Nạp tiền tự động qua VietQR (+${amount.toLocaleString('vi-VN')}đ). Ref: ${referenceId}`,
              rawWebhookData: payload as unknown as Prisma.InputJsonValue,
            },
          });

          // 8. Ghi Audit Log nạp tiền
          await tx.auditLog.create({
            data: {
              userId: targetUser.id,
              action: 'DEPOSIT_AUTO_VIETQR',
              targetResource: 'Transaction',
              targetId: transCode,
              details: {
                referenceId,
                amount,
                previousBalance: currentBalance,
                newBalance,
                bankContent: content,
              },
            },
          });

          return {
            success: true,
            message: `Cộng thành công ${amount.toLocaleString('vi-VN')}đ vào tài khoản [${targetUser.username}]`,
            userId: targetUser.id,
            amount,
            transCode,
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000,
          timeout: 10000,
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi ngoại lệ khi xử lý Webhook VietQR!';
      return { success: false, message: msg };
    }
  }
}
