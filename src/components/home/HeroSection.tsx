'use client';

import React, { useState, useEffect } from 'react';
import { Flame, ShieldCheck, Download, Search, CheckCircle2, AlertCircle, Clock, Zap, Users, Cpu, ArrowRight, Sparkles } from 'lucide-react';
import { checkServerAccount, AccountLicenseInfo, AUTO_SERVER_URL } from '@/lib/server-api';

export default function HeroSection() {
  const [accountInput, setAccountInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<AccountLicenseInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('tn_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.auto_account) {
          setAccountInput(u.auto_account);
          // auto trigger lookup
          checkServerAccount(u.auto_account).then((res) => {
            if (res.success && res.data) setSearchResult(res.data);
          });
        }
      } catch {}
    }
  }, []);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = accountInput.trim();
    if (!trimmed) {
      setErrorMsg('Vui lòng nhập tên tài khoản Auto của bạn (Ví dụ: Thuctk95)');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSearchResult(null);

    const result = await checkServerAccount(trimmed);
    setLoading(false);

    if (result.success && result.data) {
      setSearchResult(result.data);
    } else {
      setErrorMsg(result.error || 'Không tìm thấy tài khoản hoặc máy chủ đang phản hồi chậm.');
    }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
      {/* Background Glow Orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-blood-600/10 blur-[130px] dark:bg-blood-600/20" />
      <div className="pointer-events-none absolute top-1/3 -right-20 -z-10 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[120px] dark:bg-amber-500/15" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Top SEO Keywords Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/95 px-4 py-1.5 shadow-sm dark:bg-slate-900/95 dark:border-blood-500/40">
          <span className="flex h-2.5 w-2.5 rounded-full bg-blood-600 animate-pulse" />
          <span className="text-xs font-black text-slate-900 dark:text-slate-100">
            <span className="text-blood-700 dark:text-blood-400">Tool Auto Tiên Nghịch Mobile</span> • Cày Tự Động v3.1.0 • Rèn Khí Đỉnh • Chiếm Cực Âm Địa
          </span>
        </div>

        {/* Hero Title (Super sharp contrast in both Light & Dark mode) */}
        <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl md:text-7xl font-cinzel dark:text-white">
          AUTO TIÊN NGHỊCH <span className="text-blood-gradient">MOBILE</span>
          <br />
          TOOL CÀY TỰ ĐỘNG <span className="text-gold-gradient">ĐỈNH CAO 24/7</span>
        </h1>

        {/* Subtitle (High contrast dark slate in Light Mode, crisp light gray in Dark Mode) */}
        <p className="mx-auto mt-5 max-w-3xl text-sm sm:text-base md:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed font-sans">
          Website chính thức phân phối <b className="text-slate-950 dark:text-white font-extrabold">Tool Auto Tiên Nghịch Mobile</b> và <b className="text-slate-950 dark:text-white font-extrabold">Tiên Nghịch Mobile Auto</b> chuẩn nhất. Tự động rèn tiên khí & gom đá nâng cấp khí đỉnh, leo Thông Thiên Tháp, vượt Vực U Minh, đánh chiếm Cực Âm Địa và tự đi ải chính tuyến nhẹ máy, mượt mà và an toàn 100%.
        </p>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blood-700 via-blood-600 to-blood-700 px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-blood-600/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <Flame className="h-4 w-4 text-amber-300 animate-bounce" />
            Xem 5 Gói Server & Mua Giờ
          </a>

          <a
            href="#guide"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl border-2 border-slate-300 bg-white px-7 py-3.5 text-sm font-extrabold text-slate-900 hover:border-blood-600 hover:text-blood-700 hover:bg-slate-50 shadow-sm transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <Download className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            Hướng Dẫn Cài Đặt (Android & PC)
          </a>
        </div>

        {/* Tra Cứu Tài Khoản Auto Trực Tiếp Từ Server */}
        <div id="lookup" className="mt-12 max-w-2xl mx-auto rounded-3xl glass-milky-card p-6 sm:p-8 text-left shadow-xl dark:bg-slate-900/95 dark:border-slate-700">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blood-600 text-white shadow-xs">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950 dark:text-white">Tra Cứu Dữ Liệu Tài Khoản Auto</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                Đồng bộ trực tiếp với máy chủ <span className="font-mono text-blood-700 dark:text-blood-400 font-bold">tiennghich-payos.onrender.com</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleLookup} className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                placeholder="Nhập tên tài khoản Auto (VD: Thuctk95)"
                className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-950 placeholder-slate-500 focus:border-blood-600 focus:outline-none focus:ring-2 focus:ring-blood-500/20 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-xs font-black text-white shadow-md hover:bg-slate-800 disabled:opacity-50 transition-all shrink-0 dark:bg-blood-600 dark:hover:bg-blood-700"
            >
              {loading ? (
                <span>Đang kiểm tra...</span>
              ) : (
                <>
                  <Search className="h-4 w-4 text-amber-300" />
                  <span>Kiểm Tra Giờ</span>
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-bold text-red-800 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Account Result Card */}
          {searchResult && (
            <div className="mt-5 rounded-2xl border-2 border-slate-200 bg-white p-5 space-y-4 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-950 dark:text-white">Tài khoản:</span>
                  <span className="rounded-md bg-blood-100 px-2.5 py-0.5 font-mono text-sm font-black text-blood-700 dark:bg-blood-900/60 dark:text-blood-300">
                    {searchResult.autoAccount}
                  </span>
                </div>
                <div>
                  {searchResult.isExpired ? (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-black text-red-800 dark:bg-red-900/40 dark:text-red-300">
                      Đã hết giờ
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-800 flex items-center gap-1 dark:bg-emerald-900/40 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" /> Đang hoạt động
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-100 p-3 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Giờ Còn Lại</div>
                  <div className="mt-1 font-mono text-xl font-black text-slate-950 dark:text-white">
                    {searchResult.hoursRemaining}h {searchResult.minutesRemaining}m
                  </div>
                </div>

                <div className="rounded-xl bg-slate-100 p-3 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Miễn Phí Hôm Nay</div>
                  <div className="mt-1 font-mono text-xl font-black text-amber-700 dark:text-amber-400">
                    {searchResult.freeMinutesRemaining} phút
                  </div>
                </div>

                <div className="rounded-xl bg-slate-100 p-3 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Hạn Đến</div>
                  <div className="mt-1 font-mono text-xs font-black text-slate-900 dark:text-slate-200 truncate">
                    {searchResult.expiresAt ? new Date(searchResult.expiresAt).toLocaleDateString('vi-VN') : 'Theo giờ chạy'}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  * Hệ thống chỉ trừ giờ khi bật nút Bắt Đầu Auto trong game.
                </span>
                <a
                  href="#pricing"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-blood-600 px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-blood-700 transition-colors"
                >
                  <span>Gia Hạn Thêm Giờ</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Real-Time Live Server Stats */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
          <div className="rounded-2xl glass-milky-card p-4.5 text-center dark:bg-slate-900/95 dark:border-slate-700">
            <div className="flex items-center justify-center gap-2 text-blood-700 dark:text-blood-400">
              <Users className="h-5 w-5" />
              <span className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-mono">5,840+</span>
            </div>
            <div className="mt-1 text-xs text-slate-900 dark:text-slate-200 font-bold">Đạo Hữu Đang Treo</div>
          </div>

          <div className="rounded-2xl glass-milky-card p-4.5 text-center dark:bg-slate-900/95 dark:border-slate-700">
            <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-400">
              <Clock className="h-5 w-5" />
              <span className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-mono">99.98%</span>
            </div>
            <div className="mt-1 text-xs text-slate-900 dark:text-slate-200 font-bold">Uptime Máy Chủ 24/7</div>
          </div>

          <div className="rounded-2xl glass-milky-card p-4.5 text-center dark:bg-slate-900/95 dark:border-slate-700">
            <div className="flex items-center justify-center gap-2 text-sky-700 dark:text-sky-400">
              <Cpu className="h-5 w-5" />
              <span className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-mono">v3.1.0</span>
            </div>
            <div className="mt-1 text-xs text-slate-900 dark:text-slate-200 font-bold">Bản Cập Nhật Mới Nhất</div>
          </div>

          <div className="rounded-2xl glass-milky-card p-4.5 text-center dark:bg-slate-900/95 dark:border-slate-700">
            <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-400 font-mono">100% SAFE</span>
            </div>
            <div className="mt-1 text-xs text-slate-900 dark:text-slate-200 font-bold">An Toàn Tuyệt Đối</div>
          </div>
        </div>
      </div>
    </section>
  );
}
