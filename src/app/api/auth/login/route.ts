import { NextResponse } from 'next/server';
import { findUserByAccountOrEmail } from '@/lib/auth-store';
import { checkServerAccount } from '@/lib/server-api';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập tên tài khoản/Gmail và mật khẩu.' },
        { status: 400 }
      );
    }

    const user = findUserByAccountOrEmail(username);
    if (!user || user.password_hash !== password) {
      return NextResponse.json(
        { success: false, error: 'Tên tài khoản hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    // Đồng bộ số giờ trực tiếp từ máy chủ Render 24/7
    const liveLicense = await checkServerAccount(user.auto_account);

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        id: user.id,
        auto_account: user.auto_account,
        email: user.email,
        role: user.role,
      },
      licenseData: liveLicense.success ? liveLicense.data : null,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: 'Lỗi khi xử lý đăng nhập hệ thống.' },
      { status: 500 }
    );
  }
}
