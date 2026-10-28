export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { findUserByAccountOrEmail, verifyOtpAndResetPassword } from '@/lib/auth-store';
import { resetServerAccountPassword } from '@/lib/server-api';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, new_password } = body;

    if (!email || !otp || !new_password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng cung cấp đầy đủ Gmail, mã OTP 6 số và Mật khẩu mới.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanOtp = String(otp).trim();
    const cleanPassword = String(new_password).trim();

    if (cleanPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' },
        { status: 400 }
      );
    }

    // 1. Xác thực mã OTP 6 số
    const resetRes = verifyOtpAndResetPassword(cleanEmail, cleanOtp, cleanPassword);

    if (!resetRes.success) {
      return NextResponse.json({ success: false, error: resetRes.error }, { status: 400 });
    }

    // 2. Đồng bộ mật khẩu mới lên máy chủ Auto Render
    const user = findUserByAccountOrEmail(cleanEmail);
    await resetServerAccountPassword(user?.auto_account || '', cleanPassword, cleanEmail);

    return NextResponse.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.',
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: 'Lỗi khi đặt lại mật khẩu.' },
      { status: 500 }
    );
  }
}
