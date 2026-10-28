import { NextResponse } from 'next/server';
import { registerNewUser } from '@/lib/auth-store';
import { checkServerAccount } from '@/lib/server-api';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { auto_account, email, password } = body;

    if (!auto_account || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ Tên tài khoản, Gmail và Mật khẩu.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.' },
        { status: 400 }
      );
    }

    const regRes = await registerNewUser(auto_account, email, password);
    if (!regRes.success || !regRes.user) {
      return NextResponse.json({ success: false, error: regRes.error }, { status: 400 });
    }

    // Đồng bộ thông tin giờ từ máy chủ Render nếu có
    const liveLicense = await checkServerAccount(auto_account);

    return NextResponse.json({
      success: true,
      message: 'Đăng ký tài khoản thành công và đã đồng bộ máy chủ!',
      user: {
        id: regRes.user.id,
        auto_account: regRes.user.auto_account,
        email: regRes.user.email,
        role: regRes.user.role,
      },
      licenseData: liveLicense.success ? liveLicense.data : null,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ khi xử lý đăng ký tài khoản.' },
      { status: 500 }
    );
  }
}
