import { NextRequest, NextResponse } from 'next/server';
import { PurchaseService } from '@/server/services/purchase.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    // Giả sử userId được truyền từ session hoặc auth middleware
    const userId = body.userId;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Bạn cần đăng nhập để mua Key!' }, { status: 401 });
    }

    const result = await PurchaseService.purchaseKeys({
      userId,
      planId: body.planId,
      quantity: Number(body.quantity || 1),
      voucherCode: body.voucherCode,
      ipAddress,
      userAgent,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi hệ thống khi thanh toán!';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
