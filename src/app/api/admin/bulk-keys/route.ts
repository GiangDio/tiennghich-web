import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateLicenseKeyCode } from '@/lib/utils';
import { Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminKey = req.headers.get('x-admin-key') || body.adminKey;

    const expectedAdminKey = process.env.ADMIN_SECRET_KEY || 'TN_ADMIN_SUPER_SECRET_KEY_9999';
    if (adminKey !== expectedAdminKey) {
      return NextResponse.json({ success: false, message: 'UNAUTHORIZED: Quyền Admin bị từ chối!' }, { status: 403 });
    }

    const { planId, quantity, targetUserId } = body;
    const qty = Number(quantity || 1);

    if (!planId || qty <= 0 || qty > 500) {
      return NextResponse.json(
        { success: false, message: 'Thông tin không hợp lệ hoặc số lượng vượt quá 500 Key/lần!' },
        { status: 400 }
      );
    }

    const plan = await prisma.productPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ success: false, message: 'Gói bản quyền không tồn tại!' }, { status: 404 });
    }

    const durationSeconds = plan.isLifetime ? BigInt(315360000) : BigInt(plan.durationHours * 3600);
    const generatedKeys: string[] = [];
    const records: Prisma.LicenseKeyCreateManyInput[] = [];

    const ownerId = targetUserId || 'ADMIN_VAULT';

    for (let i = 0; i < qty; i++) {
      const k = generateLicenseKeyCode();
      generatedKeys.push(k);
      records.push({
        key: k,
        userId: ownerId,
        planId: plan.id,
        status: 'UNACTIVATED',
        durationSeconds,
        isFirstUseCounted: false,
      });
    }

    await prisma.licenseKey.createMany({
      data: records,
    });

    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_BULK_GENERATE_KEYS',
        targetResource: 'LicenseKey',
        details: {
          planCode: plan.code,
          quantity: qty,
          ownerId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã sinh thành công ${qty} Key cho gói [${plan.name}]!`,
      planCode: plan.code,
      quantity: qty,
      keys: generatedKeys,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi hệ thống khi sinh Key!';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
