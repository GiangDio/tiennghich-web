// ============================================================================
// TIÊN NGHỊCH AUTO - AUTH & SYNC STORE
// Quản lý tài khoản, đồng bộ máy chủ Auto Render và mã OTP xác thực Gmail
// ============================================================================

import { checkServerAccount } from './server-api';

export interface UserAccount {
  id: string;
  auto_account: string;
  email: string;
  password_hash: string;
  created_at: string;
  role: 'user' | 'admin';
}

export interface PasswordResetOtp {
  email: string;
  otp: string;
  expires_at: number; // timestamp
}

// In-memory persistent store across serverless requests in same process
declare global {
  // eslint-disable-next-line no-var
  var __TN_USERS__: Map<string, UserAccount> | undefined;
  // eslint-disable-next-line no-var
  var __TN_OTPS__: Map<string, PasswordResetOtp> | undefined;
}

if (!global.__TN_USERS__) {
  global.__TN_USERS__ = new Map<string, UserAccount>();
  // Pre-seed demo/admin accounts
  global.__TN_USERS__.set('thuctk95', {
    id: 'user_thuctk95',
    auto_account: 'Thuctk95',
    email: 'thuctk95@gmail.com',
    password_hash: '123456', // In production use bcrypt
    created_at: new Date().toISOString(),
    role: 'admin',
  });
  global.__TN_USERS__.set('admin', {
    id: 'user_admin',
    auto_account: 'admin',
    email: 'admin@tiennghichauto.vn',
    password_hash: 'Admin@123',
    created_at: new Date().toISOString(),
    role: 'admin',
  });
}

if (!global.__TN_OTPS__) {
  global.__TN_OTPS__ = new Map<string, PasswordResetOtp>();
}

export const usersStore = global.__TN_USERS__;
export const otpsStore = global.__TN_OTPS__;

/**
 * Tìm user theo auto_account hoặc email
 */
export function findUserByAccountOrEmail(query: string): UserAccount | undefined {
  const q = query.trim().toLowerCase();
  for (const user of usersStore.values()) {
    if (user.auto_account.toLowerCase() === q || user.email.toLowerCase() === q) {
      return user;
    }
  }
  return undefined;
}

/**
 * Đăng ký tài khoản mới đồng bộ máy chủ Auto
 */
export async function registerNewUser(autoAccount: string, email: string, password: string):Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const cleanAccount = autoAccount.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (findUserByAccountOrEmail(cleanAccount) || findUserByAccountOrEmail(cleanEmail)) {
    return { success: false, error: 'Tên tài khoản Auto hoặc Gmail này đã được sử dụng!' };
  }

  // Tự động kiểm tra trên máy chủ Render xem tài khoản này đã có giờ chưa
  const serverCheck = await checkServerAccount(cleanAccount);

  const newUser: UserAccount = {
    id: `user_${Date.now()}`,
    auto_account: cleanAccount,
    email: cleanEmail,
    password_hash: password, // Simple demo / bcrypt in prod
    created_at: new Date().toISOString(),
    role: cleanAccount.toLowerCase() === 'admin' ? 'admin' : 'user',
  };

  usersStore.set(cleanAccount.toLowerCase(), newUser);

  return { success: true, user: newUser };
}

/**
 * Tạo mã OTP xác thực gửi về Gmail
 */
export function generatePasswordOtp(email: string): string {
  const cleanEmail = email.trim().toLowerCase();
  // 6 chữ số ngẫu nhiên
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 phút

  otpsStore.set(cleanEmail, {
    email: cleanEmail,
    otp,
    expires_at: expiresAt,
  });

  return otp;
}

/**
 * Xác thực OTP và đặt lại mật khẩu
 */
export function verifyOtpAndResetPassword(email: string, otp: string, newPass: string): { success: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const record = otpsStore.get(cleanEmail);

  if (!record) {
    return { success: false, error: 'Chưa có yêu cầu gửi mã OTP cho Gmail này!' };
  }

  if (Date.now() > record.expires_at) {
    otpsStore.delete(cleanEmail);
    return { success: false, error: 'Mã OTP đã hết hạn (chỉ có hiệu lực trong 10 phút). Vui lòng gửi lại!' };
  }

  if (record.otp !== otp.trim()) {
    return { success: false, error: 'Mã OTP không chính xác!' };
  }

  // Tìm user và đổi mật khẩu
  const user = findUserByAccountOrEmail(cleanEmail);
  if (!user) {
    return { success: false, error: 'Không tìm thấy tài khoản liên kết với Gmail này!' };
  }

  user.password_hash = newPass;
  otpsStore.delete(cleanEmail);

  return { success: true };
}

/**
 * Cập nhật địa chỉ Gmail cho tài khoản
 */
export function updateUserEmail(autoAccount: string, newEmail: string): { success: boolean; error?: string } {
  const cleanAccount = autoAccount.trim().toLowerCase();
  const cleanEmail = newEmail.trim().toLowerCase();

  const user = findUserByAccountOrEmail(cleanAccount);
  if (!user) {
    return { success: false, error: 'Không tìm thấy tài khoản người dùng!' };
  }

  // Kiểm tra nếu email này đã có người khác dùng
  for (const [k, u] of usersStore.entries()) {
    if (k !== cleanAccount && u.auto_account.toLowerCase() !== cleanAccount && u.email.toLowerCase() === cleanEmail) {
      return { success: false, error: 'Địa chỉ Gmail này đã được liên kết với một tài khoản khác!' };
    }
  }

  user.email = cleanEmail;
  usersStore.set(cleanAccount, user);
  return { success: true };
}
