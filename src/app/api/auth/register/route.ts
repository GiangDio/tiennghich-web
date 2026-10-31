export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { registerNewUser } from '@/lib/auth-store';
import { checkServerAccount, registerServerAccount } from '@/lib/server-api';

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

    const cleanAccount = String(auto_account).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    if (cleanAccount.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Tên tài khoản Auto phải từ 3 ký tự trở lên.' },
        { status: 400 }
      );
    }

    if (cleanPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.' },
        { status: 400 }
      );
    }

    // 1. Đăng ký và đồng bộ trực tiếp lên Máy Chủ Auto Render (SQLite & Cloud 24/7)
    const serverSync = await registerServerAccount(cleanAccount, cleanPassword, cleanEmail);
    if (!serverSync.success) {
      return NextResponse.json(
        { success: false, error: serverSync.error || 'Máy chủ Auto phản hồi lỗi khi đăng ký.' },
        { status: 400 }
      );
    }

    // 2. Lưu vào auth store cục bộ
    const regRes = await registerNewUser(cleanAccount, cleanEmail, cleanPassword);

    // 3. Lấy thông tin bản quyền và 15 phút free vừa được cấp từ server
    const liveLicense = await checkServerAccount(cleanAccount);

    return NextResponse.json({
      success: true,
      message: serverSync.message || 'Đăng ký tài khoản thành công và đã đồng bộ máy chủ Auto!',
      user: {
        id: regRes.user?.id || `user_${cleanAccount}`,
        auto_account: cleanAccount,
        email: cleanEmail,
        role: 'user',
        balance: 0,
        total_deposited: 0,
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
