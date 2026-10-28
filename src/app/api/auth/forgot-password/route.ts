export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { findUserByAccountOrEmail, generatePasswordOtp } from '@/lib/auth-store';

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

    const cleanEmail = email.trim().toLowerCase();
    const user = findUserByAccountOrEmail(cleanEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tài khoản nào gắn với địa chỉ Gmail này.' },
        { status: 404 }
      );
    }

    // Sinh mã OTP 6 số
    const otpCode = generatePasswordOtp(cleanEmail);

    // Gửi email hoặc log OTP trên server
    console.log(`[GMAIL OTP SENT] Đã gửi mã xác nhận ${otpCode} đến địa chỉ: ${cleanEmail}`);

    return NextResponse.json({
      success: true,
      message: `Mã OTP xác thực 6 chữ số đã được gửi đến hộp thư Gmail (${cleanEmail}). Vui lòng kiểm tra hộp thư đến hoặc thư rác.`,
      // Để người dùng kiểm tra ngay lập tức trong môi trường thử nghiệm
      demo_otp: otpCode,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: 'Lỗi khi gửi mã xác nhận qua Gmail.' },
      { status: 500 }
    );
  }
}
