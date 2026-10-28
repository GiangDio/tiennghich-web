export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { findUserByAccountOrEmail, generatePasswordOtp } from '@/lib/auth-store';
import { sendOtpEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập địa chỉ Gmail của bạn.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = findUserByAccountOrEmail(cleanEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tài khoản nào gắn với địa chỉ Gmail này.' },
        { status: 404 }
      );
    }

    // Sinh mã OTP 6 số bảo mật
    const otpCode = generatePasswordOtp(cleanEmail);

    // Gửi email thực tế đến Gmail của người dùng
    const mailRes = await sendOtpEmail(cleanEmail, otpCode);

    if (!mailRes.success) {
      return NextResponse.json(
        { success: false, error: mailRes.error || 'Lỗi khi gửi email xác thực qua Gmail.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Mã OTP xác thực 6 chữ số đã được gửi đến hộp thư Gmail (${cleanEmail}). Vui lòng mở Gmail (kiểm tra cả mục Hộp thư đến và Thư rác/Spam) và nhập mã vào bên dưới.`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ khi gửi mã xác nhận qua Gmail.' },
      { status: 500 }
    );
  }
}
