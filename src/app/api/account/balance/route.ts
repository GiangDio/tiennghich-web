export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerAccountBalance } from '@/lib/server-api';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ success: false, error: 'Thiếu username' }, { status: 400 });
    }

    const data = await getServerAccountBalance(username);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ success: false, balance: 0, total_deposited: 0 }, { status: 500 });
  }
}
