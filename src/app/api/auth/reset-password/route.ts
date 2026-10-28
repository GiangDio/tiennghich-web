export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { verifyOtpAndResetPassword } from '@/lib/auth-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, new_password } = body;

    if (!email || !otp || !new_password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng cung cấp đầy đủ Gmail, mã OTP và Mật khẩu mới.' },
        { status: 400 }
      );
    }

    if (new_password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' },
        { status: 400 }
      );
    }

    const resetRes = verifyOtpAndResetPassword(email, otp, new_password);

    if (!resetRes.success) {
      return NextResponse.json({ success: false, error: resetRes.error }, { status: 400 });
    }

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
