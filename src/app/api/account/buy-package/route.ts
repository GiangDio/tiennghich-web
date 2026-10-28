export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { buyPackageWithBalance } from '@/lib/server-api';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, plan_id } = body;

    if (!username || !plan_id) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin tài khoản hoặc gói cước.' },
        { status: 400 }
      );
    }

    const result = await buyPackageWithBalance(username, plan_id);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Số dư không đủ!',
          current_balance: result.current_balance,
          needed_amount: result.needed_amount,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ khi mua gói bằng số dư.' },
      { status: 500 }
    );
  }
}
