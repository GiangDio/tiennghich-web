export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createDepositOrder } from '@/lib/server-api';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, amount } = body;

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập tài khoản trước khi nạp tiền!' },
        { status: 400 }
      );
    }

    const cleanAmount = parseInt(String(amount).replace(/\D/g, '')) || 0;
    if (cleanAmount < 10000) {
      return NextResponse.json(
        { success: false, error: 'Số tiền nạp tối thiểu là 10.000 VNĐ!' },
        { status: 400 }
      );
    }

    const result = await createDepositOrder(username, cleanAmount);
    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || 'Không thể tạo mã VietQR nạp tiền.' },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ khi tạo giao dịch nạp tiền.' },
      { status: 500 }
    );
  }
}
