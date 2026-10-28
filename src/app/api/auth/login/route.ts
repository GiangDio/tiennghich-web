export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { findUserByAccountOrEmail, registerNewUser } from '@/lib/auth-store';
import { checkServerAccount, loginServerAccount, getServerAccountBalance } from '@/lib/server-api';

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

    const cleanInput = String(username).trim();
    const cleanPassword = String(password).trim();

    // 1. Kiểm tra tài khoản trong local store
    let user = findUserByAccountOrEmail(cleanInput);

    // 2. Nếu chưa có trong local store, hoặc kiểm tra với máy chủ Auto Render 24/7
    if (!user || user.password_hash !== cleanPassword) {
      const serverAuth = await loginServerAccount(cleanInput, cleanPassword);
      if (serverAuth.success && serverAuth.username) {
        // Đồng bộ tài khoản từ server về local store
        const autoUser = serverAuth.username;
        const autoEmail = cleanInput.includes('@') ? cleanInput : `${autoUser}@tiennghichauto.vn`;
        const regRes = await registerNewUser(autoUser, autoEmail, cleanPassword);
        user = regRes.user;
      } else {
        return NextResponse.json(
          { success: false, error: serverAuth.error || 'Tên tài khoản hoặc mật khẩu không chính xác.' },
          { status: 401 }
        );
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Tên tài khoản hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    // 3. Đồng bộ số giờ & số dư trực tiếp từ máy chủ Render 24/7
    const [liveLicense, liveBalance] = await Promise.all([
      checkServerAccount(user.auto_account),
      getServerAccountBalance(user.auto_account),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        id: user.id,
        auto_account: user.auto_account,
        email: user.email,
        role: user.role,
        balance: liveBalance.balance || 0,
        total_deposited: liveBalance.total_deposited || 0,
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
