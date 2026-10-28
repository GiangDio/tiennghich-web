import nodemailer from 'nodemailer';

export async function sendOtpEmail(
  toEmail: string,
  otpCode: string
): Promise<{ success: boolean; error?: string }> {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS;

  if (!user || !pass) {
    console.warn(`[GMAIL_NOTICE] SMTP chưa cấu hình GMAIL_USER và GMAIL_APP_PASSWORD. OTP: ${otpCode}`);
    return {
      success: false,
      error:
        'Hệ thống gửi thư Gmail đang chờ cấu hình Mật khẩu ứng dụng Gmail (GMAIL_APP_PASSWORD). Vui lòng liên hệ Admin qua Zalo để nhận hỗ trợ!',
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"Tiên Nghịch Auto" <${user}>`,
      to: toEmail,
      subject: `[Tiên Nghịch Auto] Mã xác nhận đặt lại mật khẩu: ${otpCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #070A0F; color: #F8FAFC; border-radius: 14px; overflow: hidden; border: 1px solid #DC2626;">
          <div style="background: linear-gradient(135deg, #DC2626, #991B1B); padding: 20px; text-align: center;">
            <h2 style="color: #FFFFFF; margin: 0; font-size: 20px; letter-spacing: 1px;">⚡ TIÊN NGHỊCH AUTO MOBILE</h2>
            <div style="color: #FDE68A; font-size: 12px; margin-top: 4px;">XÁC THỰC ĐẶT LẠI MẬT KHẨU</div>
          </div>
          <div style="padding: 24px; background: #0D111A;">
            <p style="font-size: 14px; color: #CBD5E1; line-height: 1.6;">Chào đạo hữu,</p>
            <p style="font-size: 14px; color: #CBD5E1; line-height: 1.6;">Bạn vừa yêu cầu đặt lại mật khẩu tài khoản Tiên Nghịch Auto. Đây là mã OTP xác thực của bạn:</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="display: inline-block; background: #1E293B; color: #F59E0B; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 12px 28px; border-radius: 10px; border: 2px dashed #DC2626;">
                ${otpCode}
              </span>
            </div>
            <p style="font-size: 12px; color: #94A3B8; line-height: 1.5;">Mã OTP có hiệu lực trong <b>10 phút</b>. Vui lòng tự tay nhập 6 chữ số này trên website để tạo mật khẩu mới.</p>
            <p style="font-size: 11px; color: #EF4444; margin-top: 10px;">* Tuyệt đối không chia sẻ mã này cho bất kỳ ai để bảo vệ an toàn tài khoản.</p>
          </div>
          <div style="background: #070A0F; padding: 14px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid rgba(255,255,255,0.06);">
            © 2026 Tiên Nghịch Auto Mobile • Hỗ trợ 24/7
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (err: unknown) {
    console.error('[SMTP_SEND_FAILED]', err);
    return {
      success: false,
      error: 'Không thể gửi email OTP qua máy chủ Gmail. Vui lòng kiểm tra lại địa chỉ Gmail hoặc liên hệ Admin!',
    };
  }
}
