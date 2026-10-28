import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminKey = req.headers.get('x-admin-key') || body.adminKey;

    const expectedAdminKey = process.env.ADMIN_SECRET_KEY || 'TN_ADMIN_SUPER_SECRET_KEY_9999';
    if (adminKey !== expectedAdminKey) {
      return NextResponse.json({ success: false, message: 'UNAUTHORIZED: Quyền Admin bị từ chối!' }, { status: 403 });
    }

    const hoursToAdd = Number(body.hoursToAdd || 0);
    const reason = body.reason || 'Đền bù bảo trì máy chủ game';

    if (hoursToAdd <= 0) {
      return NextResponse.json({ success: false, message: 'Số giờ cộng thêm phải lớn hơn 0!' }, { status: 400 });
    }

    const secondsToAdd = hoursToAdd * 3600;
    const now = new Date();

    // Lấy toàn bộ các Key đang còn hiệu lực
    const activeKeys = await prisma.licenseKey.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: { gt: now },
      },
      select: { id: true, expiresAt: true },
    });

    if (activeKeys.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Không có Key nào đang hoạt động để cộng giờ.',
        updatedCount: 0,
      });
    }

    // Cập nhật gia hạn hàng loạt
    const updatePromises = activeKeys.map((k) => {
      const currentExpiry = k.expiresAt || now;
      const newExpiry = new Date(currentExpiry.getTime() + secondsToAdd * 1000);
      return prisma.licenseKey.update({
        where: { id: k.id },
        data: {
          expiresAt: newExpiry,
          durationSeconds: { increment: BigInt(secondsToAdd) },
        },
      });
    });

    await prisma.$transaction(updatePromises);

    // Ghi Audit Log cho hành động đền bù bảo trì
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_MASS_ADD_TIME',
        targetResource: 'LicenseKey',
        details: {
          hoursAdded: hoursToAdd,
          reason,
          affectedKeysCount: activeKeys.length,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã cộng thành công ${hoursToAdd} giờ sử dụng cho toàn bộ ${activeKeys.length} Key đang hoạt động!`,
      affectedKeysCount: activeKeys.length,
      hoursAdded: hoursToAdd,
      reason,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi hệ thống khi đền bù bảo trì!';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
