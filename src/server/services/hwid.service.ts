import { prisma } from '@/lib/prisma';
import { generateUniqueCode } from '@/lib/utils';
import { Prisma } from '@prisma/client';

export interface ResetHwidInput {
  userId: string;
  licenseKeyId: string;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ResetHwidResult {
  success: boolean;
  message: string;
  resetsLeftThisMonth?: number;
  feeCharged?: number;
  newBalance?: number;
}

const HWID_RESET_OVER_QUOTA_FEE = 10000; // 10,000 VND khi vượt quá lượt miễn phí/tháng

export class HwidService {
  /**
   * Reset HWID cho License Key với hạn mức miễn phí và trừ phí tự động nếu vượt quá
   * Đặt trong Transaction và Row-Locking để đảm bảo toàn vẹn tài chính
   */
  public static async resetHwid(input: ResetHwidInput): Promise<ResetHwidResult> {
    const { userId, licenseKeyId, reason, ipAddress, userAgent } = input;

    if (!userId || !licenseKeyId) {
      return { success: false, message: 'Dữ liệu yêu cầu không hợp lệ!' };
    }

    try {
      return await prisma.$transaction(
        async (tx) => {
          // 1. Khóa và lấy thông tin User
          const lockedUsers = await tx.$queryRaw<
            Array<{
              id: string;
              balance: Prisma.Decimal;
              hwidResetFreeQuota: number;
              hwidResetCountMonth: number;
              hwidResetLastDate: Date | null;
            }>
          >`
            SELECT id, balance, "hwidResetFreeQuota", "hwidResetCountMonth", "hwidResetLastDate"
            FROM "User" WHERE id = ${userId} FOR UPDATE
          `;

          if (!lockedUsers || lockedUsers.length === 0) {
            throw new Error('Người dùng không tồn tại!');
          }

          const user = lockedUsers[0];
          const currentBalance = Number(user.balance);

          // 2. Lấy thông tin License Key thuộc quyền sở hữu của User
          const license = await tx.licenseKey.findFirst({
            where: {
              id: licenseKeyId,
              userId: userId,
            },
            include: { plan: true },
          });

          if (!license) {
            throw new Error('Không tìm thấy License Key hoặc bạn không có quyền thao tác trên Key này!');
          }

          if (license.status === 'BANNED') {
            throw new Error('Key đã bị khóa vi phạm, không thể thực hiện đổi máy!');
          }

          if (license.status === 'EXPIRED') {
            throw new Error('Key đã hết hạn sử dụng, vui lòng gia hạn trước khi đổi máy!');
          }

          if (!license.hwid) {
            throw new Error('Key này chưa được kích hoạt trên máy nào, bạn có thể nhập thẳng vào máy mới!');
          }

          const now = new Date();

          // 3. Kiểm tra chu kỳ tháng để reset số lượt miễn phí nếu sang tháng mới
          let resetCount = user.hwidResetCountMonth;
          const lastReset = user.hwidResetLastDate;

          if (lastReset) {
            const isSameMonth =
              lastReset.getMonth() === now.getMonth() && lastReset.getFullYear() === now.getFullYear();
            if (!isSameMonth) {
              resetCount = 0; // Đã sang tháng mới -> hoàn lại lượt reset
            }
          }

          const freeQuota = user.hwidResetFreeQuota || 3;
          let feeCharged = 0;
          let newBalance = currentBalance;

          // 4. Kiểm tra phí nếu đã dùng hết lượt miễn phí trong tháng
          if (resetCount >= freeQuota) {
            feeCharged = HWID_RESET_OVER_QUOTA_FEE;
            if (currentBalance < feeCharged) {
              throw new Error(
                `Bạn đã sử dụng hết ${freeQuota} lượt Reset HWID miễn phí trong tháng này. Phí đổi máy phát sinh là ${feeCharged.toLocaleString('vi-VN')}đ, nhưng số dư ví của bạn chỉ còn ${currentBalance.toLocaleString('vi-VN')}đ. Vui lòng nạp thêm tiền!`
              );
            }
            newBalance = currentBalance - feeCharged;

            // Trừ tiền số dư
            await tx.user.update({
              where: { id: userId },
              data: {
                balance: new Prisma.Decimal(newBalance),
                totalSpent: { increment: new Prisma.Decimal(feeCharged) },
              },
            });

            // Ghi nhận Transaction phí Reset HWID
            const transCode = generateUniqueCode('TX_HWID');
            await tx.transaction.create({
              data: {
                transCode,
                userId,
                type: 'HWID_RESET_FEE',
                amount: new Prisma.Decimal(feeCharged),
                balanceBefore: new Prisma.Decimal(currentBalance),
                balanceAfter: new Prisma.Decimal(newBalance),
                status: 'SUCCESS',
                provider: 'MANUAL_ADMIN',
                description: `Phí đổi máy / Reset HWID cho Key [${license.key}] (Vượt hạn mức ${freeQuota} lần/tháng)`,
              },
            });
          }

          // 5. Cập nhật số lần reset của User
          await tx.user.update({
            where: { id: userId },
            data: {
              hwidResetCountMonth: resetCount + 1,
              hwidResetLastDate: now,
            },
          });

          const oldHwid = license.hwid;

          // 6. Xóa HWID gắn trên LicenseKey và hủy toàn bộ phiên đang chạy
          await tx.licenseKey.update({
            where: { id: license.id },
            data: {
              hwid: null, // Gỡ bỏ liên kết để máy mới có thể kích hoạt
              hwidResetsUsed: { increment: 1 },
            },
          });

          await tx.clientSession.deleteMany({
            where: { licenseKeyId: license.id },
          });

          // 7. Ghi Log lịch sử đổi HWID
          await tx.hwidLog.create({
            data: {
              licenseKeyId: license.id,
              oldHwid: oldHwid,
              newHwid: 'UNBOUND',
              reason: reason || 'Người dùng đổi máy tính / cài lại Windows',
              feeCharged: new Prisma.Decimal(feeCharged),
              resetBy: 'USER',
              ipAddress,
            },
          });

          // 8. Ghi Audit Log
          await tx.auditLog.create({
            data: {
              userId,
              action: 'HWID_RESET',
              targetResource: 'LicenseKey',
              targetId: license.id,
              ipAddress,
              userAgent,
              details: {
                keyCode: license.key,
                oldHwid,
                feeCharged,
                resetsThisMonth: resetCount + 1,
              },
            },
          });

          const remainingFree = Math.max(0, freeQuota - (resetCount + 1));

          return {
            success: true,
            message:
              feeCharged > 0
                ? `Đã gỡ liên kết máy cũ thành công! Đã trừ ${feeCharged.toLocaleString('vi-VN')}đ phí phát sinh. Bây giờ bạn có thể nhập Key vào máy mới.`
                : `Đã gỡ liên kết máy cũ thành công! Bạn còn ${remainingFree} lượt đổi máy miễn phí trong tháng này. Bây giờ bạn có thể nhập Key vào máy mới.`,
            resetsLeftThisMonth: remainingFree,
            feeCharged,
            newBalance,
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000,
          timeout: 10000,
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi hệ thống khi Reset HWID!';
      return { success: false, message: msg };
    }
  }
}
