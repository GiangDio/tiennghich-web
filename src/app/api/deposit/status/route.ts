export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { AUTO_SERVER_URL } from '@/lib/server-api';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Thiếu mã đơn hàng' }, { status: 400 });
    }

    const res = await fetch(`${AUTO_SERVER_URL}/api/order-status/${encodeURIComponent(orderId)}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ success: false, error: 'Lỗi kiểm tra trạng thái đơn nạp' }, { status: 500 });
  }
}
