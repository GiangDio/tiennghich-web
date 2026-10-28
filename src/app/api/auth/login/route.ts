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

    // 1. Luôn ưu tiên xác thực và đồng bộ từ Máy Chủ Auto Render (Source of Truth)
    let user = null;
    const serverAuth = await loginServerAccount(cleanInput, cleanPassword);
    
    if (serverAuth.success && serverAuth.username) {
      const autoUser = serverAuth.username;
      const autoEmail = serverAuth.email || (cleanInput.includes('@') ? cleanInput : '');
      const regRes = await registerNewUser(autoUser, autoEmail, cleanPassword);
      user = regRes.user || findUserByAccountOrEmail(autoUser);
      if (user) {
        if (autoEmail) user.email = autoEmail;
        user.password_hash = cleanPassword;
      }
    } else {
      // Fallback: Kiểm tra local store nếu máy chủ Render đang bận hoặc offline tạm thời
      const localUser = findUserByAccountOrEmail(cleanInput);
      if (localUser && localUser.password_hash === cleanPassword) {
        user = localUser;
      } else {
        return NextResponse.json(
          { success: false, error: serverAuth.error || 'Tên tài khoản/Gmail hoặc mật khẩu không chính xác.' },
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
