'use client';

import React, { useState } from 'react';
import { User, Mail, Lock, KeyRound, CheckCircle2, AlertCircle, X, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register' | 'forgot';
  onAuthSuccess?: (user: any, licenseData?: any) => void;
}

export default function AuthModal({ isOpen, onClose, initialTab = 'login', onAuthSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);

  // Form states
  const [loginAccount, setLoginAccount] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regAccount, setRegAccount] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Forgot Password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpStep, setOtpStep] = useState<1 | 2>(1);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginAccount, password: loginPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('Đăng nhập thành công!');
        localStorage.setItem('tn_user', JSON.stringify(data.user));
        if (data.licenseData) {
          localStorage.setItem('tn_license', JSON.stringify(data.licenseData));
        }
        if (onAuthSuccess) onAuthSuccess(data.user, data.licenseData);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setErrorMsg(data.error || 'Đăng nhập thất bại.');
      }
    } catch {
      setErrorMsg('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auto_account: regAccount,
          email: regEmail,
          password: regPassword,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('Đăng ký tài khoản thành công!');
        localStorage.setItem('tn_user', JSON.stringify(data.user));
        if (data.licenseData) {
          localStorage.setItem('tn_license', JSON.stringify(data.licenseData));
        }
        if (onAuthSuccess) onAuthSuccess(data.user, data.licenseData);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setErrorMsg(data.error || 'Đăng ký thất bại.');
      }
    } catch {
      setErrorMsg('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrorMsg('Vui lòng nhập địa chỉ Gmail của bạn.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message || 'Mã OTP đã được gửi đến Gmail của bạn.');
        setOtpCode('');
        setOtpStep(2);
      } else {
        setErrorMsg(data.error || 'Không thể gửi mã OTP.');
      }
    } catch {
      setErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otp: otpCode,
          new_password: newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        setTimeout(() => {
          setTab('login');
          setOtpStep(1);
          setForgotEmail('');
          setOtpCode('');
          setNewPassword('');
          setSuccessMsg('Vui lòng đăng nhập bằng mật khẩu mới vừa đổi!');
        }, 1500);
      } else {
        setErrorMsg(data.error || 'Đặt lại mật khẩu thất bại.');
      }
    } catch {
      setErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 dark:border-2 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95 duration-200 text-slate-950 dark:text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Tab Selection Header */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 pb-3 gap-6">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`text-sm font-black pb-1 transition-all ${
              tab === 'login'
                ? 'text-blood-700 border-b-2 border-blood-700 dark:text-blood-400'
                : 'text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Đăng Nhập
          </button>

          <button
            onClick={() => {
              setTab('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`text-sm font-black pb-1 transition-all ${
              tab === 'register'
                ? 'text-blood-700 border-b-2 border-blood-700 dark:text-blood-400'
                : 'text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Đăng Ký Mới
          </button>

          <button
            onClick={() => {
              setTab('forgot');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`text-sm font-black pb-1 transition-all ${
              tab === 'forgot'
                ? 'text-blood-700 border-b-2 border-blood-700 dark:text-blood-400'
                : 'text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Quên Mật Khẩu
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-300 p-3 text-xs text-red-800 font-bold dark:bg-red-950/40 dark:border-red-900 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 p-3 text-xs text-emerald-900 font-bold dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. FORM ĐĂNG NHẬP */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-950 dark:text-white mb-1">
                Tài khoản Auto hoặc Gmail:
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={loginAccount}
                  onChange={(e) => setLoginAccount(e.target.value)}
                  placeholder="Ví dụ: Thuctk95 hoặc email"
                  className="w-full rounded-xl border-2 border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-bold text-slate-950 placeholder-slate-500 focus:border-blood-600 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black text-slate-950 dark:text-white">
                  Mật khẩu:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setTab('forgot');
                    setForgotEmail(loginAccount.includes('@') ? loginAccount : '');
                  }}
                  className="text-[11px] font-black text-blood-700 hover:underline dark:text-blood-400"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full rounded-xl border-2 border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-bold text-slate-950 placeholder-slate-500 focus:border-blood-600 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blood-600 text-white font-black text-xs shadow-md shadow-blood-600/30 hover:bg-blood-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              <span>Đăng Nhập Ngay</span>
            </button>
          </form>
        )}

        {/* 2. FORM ĐĂNG KÝ */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-950 dark:text-white mb-1">
                Tên tài khoản Auto (Dùng trong game):
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={regAccount}
                  onChange={(e) => setRegAccount(e.target.value)}
                  placeholder="Ví dụ: Thuctk95 (viết liền không dấu)"
                  className="w-full rounded-xl border-2 border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-bold text-slate-950 placeholder-slate-500 focus:border-blood-600 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                * Đây là tên tài khoản bạn sẽ đăng nhập trên App/Extension để cày Auto.
              </p>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-950 dark:text-white mb-1">
                Địa chỉ Gmail xác thực:
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full rounded-xl border-2 border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-bold text-slate-950 placeholder-slate-500 focus:border-blood-600 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                * Dùng để khôi phục mật khẩu qua mã OTP khi cần.
              </p>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-950 dark:text-white mb-1">
                Mật khẩu (Tối thiểu 6 ký tự):
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Nhập mật khẩu an toàn"
                  className="w-full rounded-xl border-2 border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-bold text-slate-950 placeholder-slate-500 focus:border-blood-600 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blood-600 text-white font-black text-xs shadow-md shadow-blood-600/30 hover:bg-blood-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              <span>Đăng Ký & Đồng Bộ Máy Chủ</span>
            </button>
          </form>
        )}

        {/* 3. FORM QUÊN MẬT KHẨU QUA GMAIL */}
        {tab === 'forgot' && (
          <div className="space-y-4">
            {otpStep === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  Nhập địa chỉ Gmail bạn đã đăng ký để hệ thống gửi <b>mã xác thực OTP 6 chữ số</b> nhằm đặt lại mật khẩu an toàn.
                </p>

                <div>
                  <label className="block text-xs font-black text-slate-950 dark:text-white mb-1">
                    Địa chỉ Gmail của bạn:
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Nhập địa chỉ Gmail..."
                      className="w-full rounded-xl border-2 border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-bold text-slate-950 placeholder-slate-500 focus:border-blood-600 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blood-600 text-white font-black text-xs shadow-md shadow-blood-600/30 hover:bg-blood-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  <span>Gửi Mã Xác Thực OTP Về Gmail</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-950 font-medium dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-200 leading-relaxed">
                  📩 Mã xác thực OTP 6 số đã được gửi tới <b>{forgotEmail}</b>. Vui lòng mở Gmail (kiểm tra cả mục <b>Hộp thư đến</b> và <b>Thư rác/Spam</b>), sau đó tự tay nhập mã vào ô bên dưới.
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-950 dark:text-white mb-1">
                    Nhập mã OTP 6 số từ Gmail:
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-center font-mono text-xl font-black tracking-widest text-slate-950 focus:border-blood-600 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-950 dark:text-white mb-1">
                    Mật khẩu mới (Tối thiểu 6 ký tự):
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full rounded-xl border-2 border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-bold text-slate-950 placeholder-slate-500 focus:border-blood-600 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpStep(1)}
                    className="px-4 py-2.5 rounded-xl border-2 border-slate-300 text-xs font-black text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
                  >
                    Gửi Lại
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-blood-600 text-white font-black text-xs shadow-md shadow-blood-600/30 hover:bg-blood-700 disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Đang xác thực...' : 'Đổi Mật Khẩu Mới'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
