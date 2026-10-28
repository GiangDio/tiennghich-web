import { prisma } from '@/lib/prisma';
import { generateLicenseKeyCode, generateUniqueCode } from '@/lib/utils';
import { Prisma } from '@prisma/client';

export interface PurchaseKeyInput {
  userId: string;
  planId: string;
  quantity: number;
  voucherCode?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface PurchaseKeyResult {
  success: boolean;
  orderCode?: string;
  keys?: string[];
  totalAmount?: number;
  newBalance?: number;
  error?: string;
}

export class PurchaseService {
  /**
   * Thực hiện mua Key với Database Transaction và Row-Level Locking (FOR UPDATE)
   * Tuyệt đối chống Race Condition (Bug nhấn đúp, nhiều tab trừ tiền song song)
   */
  public static async purchaseKeys(input: PurchaseKeyInput): Promise<PurchaseKeyResult> {
    const { userId, planId, quantity, voucherCode, ipAddress, userAgent } = input;

    if (!userId || !planId || quantity <= 0) {
      return { success: false, error: 'Thông tin mua hàng không hợp lệ!' };
    }

    if (quantity > 100) {
      return { success: false, error: 'Mỗi đơn hàng tối đa 100 Key. Mua số lượng lớn vui lòng liên hệ Admin!' };
    }

    try {
      return await prisma.$transaction(
        async (tx) => {
          // 1. Khóa và lấy thông tin User bằng Row-Level Locking (Chống Race Condition)
          const lockedUsers = await tx.$queryRaw<Array<{ id: string; balance: Prisma.Decimal; email: string }>>`
            SELECT id, balance, email FROM "User" WHERE id = ${userId} FOR UPDATE
          `;

          if (!lockedUsers || lockedUsers.length === 0) {
            throw new Error('Người dùng không tồn tại!');
          }

          const user = lockedUsers[0];
          const currentBalance = Number(user.balance);

          // 2. Lấy thông tin Gói cước
          const plan = await tx.productPlan.findUnique({
            where: { id: planId },
          });

          if (!plan || !plan.isActive) {
            throw new Error('Gói bản quyền không tồn tại hoặc đã tạm dừng bán!');
          }

          const unitPrice = Number(plan.price);
          let rawTotal = unitPrice * quantity;

          // Chiết khấu mua sỉ nếu có cấu hình trên gói
          if (plan.isResellerTier && quantity >= plan.minQtyForDiscount && Number(plan.discountPercent) > 0) {
            const resellerDiscount = (rawTotal * Number(plan.discountPercent)) / 100;
            rawTotal -= resellerDiscount;
          }

          // 3. Xử lý Mã giảm giá (Voucher) với khóa hàng nếu có
          let voucherId: string | undefined = undefined;
          let discountAmount = 0;

          if (voucherCode && voucherCode.trim()) {
            const cleanCode = voucherCode.trim().toUpperCase();
            const lockedVouchers = await tx.$queryRaw<
              Array<{
                id: string;
                code: string;
                discountType: string;
                discountValue: Prisma.Decimal;
                minOrderAmount: Prisma.Decimal;
                maxDiscountAmount: Prisma.Decimal | null;
                maxUsage: number;
                currentUsage: number;
                expiresAt: Date | null;
                isActive: boolean;
              }>
            >`
              SELECT * FROM "Voucher" WHERE code = ${cleanCode} AND "isActive" = true FOR UPDATE
            `;

            if (lockedVouchers.length > 0) {
              const voucher = lockedVouchers[0];
              const now = new Date();

              if (voucher.expiresAt && voucher.expiresAt < now) {
                throw new Error('Mã giảm giá đã hết hạn sử dụng!');
              }

              if (voucher.currentUsage >= voucher.maxUsage) {
                throw new Error('Mã giảm giá đã hết lượt sử dụng!');
              }

              if (rawTotal < Number(voucher.minOrderAmount)) {
                throw new Error(
                  `Đơn hàng chưa đạt giá trị tối thiểu ${Number(voucher.minOrderAmount).toLocaleString()}đ để dùng voucher này!`
                );
              }

              if (voucher.discountType === 'PERCENT') {
                discountAmount = (rawTotal * Number(voucher.discountValue)) / 100;
                if (voucher.maxDiscountAmount && discountAmount > Number(voucher.maxDiscountAmount)) {
                  discountAmount = Number(voucher.maxDiscountAmount);
                }
              } else {
                discountAmount = Number(voucher.discountValue);
              }

              voucherId = voucher.id;

              // Tăng số lần sử dụng voucher một cách nguyên tử
              await tx.voucher.update({
                where: { id: voucher.id },
                data: { currentUsage: { increment: 1 } },
              });
            } else {
              throw new Error('Mã giảm giá không hợp lệ hoặc đã bị vô hiệu hóa!');
            }
          }

          const finalAmount = Math.max(0, rawTotal - discountAmount);

          // 4. Kiểm tra số dư tài khoản
          if (currentBalance < finalAmount) {
            throw new Error(
              `Số dư không đủ! Bạn cần ${finalAmount.toLocaleString('vi-VN')}đ nhưng ví chỉ còn ${currentBalance.toLocaleString('vi-VN')}đ. Vui lòng nạp thêm tiền!`
            );
          }

          const newBalance = currentBalance - finalAmount;

          // 5. Cập nhật số dư và tổng chi tiêu của User
          await tx.user.update({
            where: { id: userId },
            data: {
              balance: new Prisma.Decimal(newBalance),
              totalSpent: { increment: new Prisma.Decimal(finalAmount) },
            },
          });

          // 6. Tạo Đơn hàng (Order)
          const orderCode = generateUniqueCode('ORD');
          const order = await tx.order.create({
            data: {
              orderCode,
              userId,
              planId,
              voucherId,
              quantity,
              unitPrice: new Prisma.Decimal(unitPrice),
              discountAmount: new Prisma.Decimal(discountAmount),
              finalAmount: new Prisma.Decimal(finalAmount),
              status: 'COMPLETED',
              ipAddress,
              userAgent,
              completedAt: new Date(),
            },
          });

          // 7. Tạo Giao dịch trừ tiền (Transaction)
          const transCode = generateUniqueCode('TX_BUY');
          await tx.transaction.create({
            data: {
              transCode,
              userId,
              orderId: order.id,
              type: 'PURCHASE',
              amount: new Prisma.Decimal(finalAmount),
              balanceBefore: new Prisma.Decimal(currentBalance),
              balanceAfter: new Prisma.Decimal(newBalance),
              status: 'SUCCESS',
              provider: 'MANUAL_ADMIN',
              description: `Mua ${quantity}x Gói [${plan.name}] qua đơn hàng #${orderCode}`,
            },
          });

          // 8. Sinh danh sách Key bảo mật và chèn vào Database
          const generatedKeys: string[] = [];
          const keyRecords: Prisma.LicenseKeyCreateManyInput[] = [];

          // Tính toán thời hạn giây của Key
          const durationSeconds = plan.isLifetime
            ? BigInt(315360000) // 10 năm coi như vĩnh viễn
            : BigInt(plan.durationHours * 3600);

          for (let i = 0; i < quantity; i++) {
            const keyCode = generateLicenseKeyCode();
            generatedKeys.push(keyCode);
            keyRecords.push({
              key: keyCode,
              userId,
              orderId: order.id,
              planId,
              status: 'UNACTIVATED',
              durationSeconds,
              isFirstUseCounted: false, // Bắt đầu đếm hạn khi nhập vào phần mềm
            });
          }

          await tx.licenseKey.createMany({
            data: keyRecords,
          });

          // 9. Ghi Audit Log giao dịch nhạy cảm
          await tx.auditLog.create({
            data: {
              userId,
              action: 'ORDER_PURCHASE',
              targetResource: 'Order',
              targetId: order.id,
              ipAddress,
              userAgent,
              details: {
                orderCode,
                planCode: plan.code,
                quantity,
                finalAmount,
                keysCount: generatedKeys.length,
              },
            },
          });

          return {
            success: true,
            orderCode,
            keys: generatedKeys,
            totalAmount: finalAmount,
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
      const msg = err instanceof Error ? err.message : 'Lỗi hệ thống khi xử lý thanh toán!';
      return { success: false, error: msg };
    }
  }
}
