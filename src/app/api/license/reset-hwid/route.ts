export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { HwidService } from '@/server/services/hwid.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    const userId = body.userId;
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Yêu cầu đăng nhập!' }, { status: 401 });
    }

    const result = await HwidService.resetHwid({
      userId,
      licenseKeyId: body.licenseKeyId,
      reason: body.reason,
      ipAddress,
      userAgent,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi hệ thống khi Reset HWID!';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
