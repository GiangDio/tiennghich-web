export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { updateUserEmail } from '@/lib/auth-store';
import { updateServerAccountEmail } from '@/lib/server-api';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email } = body;

    if (!username || !email) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng cung cấp đầy đủ tên tài khoản và địa chỉ Gmail.' },
        { status: 400 }
      );
    }

    const cleanUser = String(username).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Địa chỉ Gmail không đúng định dạng!' },
        { status: 400 }
      );
    }

    // 1. Cập nhật trên máy chủ Auto Render 24/7
    const serverRes = await updateServerAccountEmail(cleanUser, cleanEmail);
    if (!serverRes.success) {
      return NextResponse.json(
        { success: false, error: serverRes.error || 'Lỗi khi cập nhật Gmail trên máy chủ.' },
        { status: 400 }
      );
    }

    // 2. Cập nhật trong local store
    updateUserEmail(cleanUser, cleanEmail);

    return NextResponse.json({
      success: true,
      message: 'Cập nhật Gmail bảo mật thành công!',
      email: cleanEmail,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ khi xử lý cập nhật Gmail.' },
      { status: 500 }
    );
  }
}
