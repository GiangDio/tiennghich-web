'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Download, Clock, Users, Cpu, Smartphone } from 'lucide-react';
import { AUTO_SERVER_URL } from '@/lib/server-api';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 md:pt-16 md:pb-24">
      {/* Background Glow Orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-blood-600/10 blur-[130px] dark:bg-blood-600/20" />
      <div className="pointer-events-none absolute top-1/3 -right-20 -z-10 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[120px] dark:bg-amber-500/15" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Top SEO Keywords Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-slate-300 bg-white/95 px-3 py-1 sm:px-4 sm:py-1.5 shadow-sm dark:bg-slate-900/95 dark:border-blood-500/40 max-w-full">
          <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-blood-600 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-black text-slate-900 dark:text-slate-100">
            <span className="text-blood-700 dark:text-blood-400">Tool Auto Tiên Nghịch Mobile</span> • Cày Tự Động v1.0.0 Beta • Rèn Khí Đỉnh • Chiếm Cực Âm Địa
          </span>
        </div>

        {/* Hero Title (Crisp & proportional on both Android phone screens and PC) */}
        <h1 className="mt-5 sm:mt-6 text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 font-cinzel dark:text-white leading-[1.2]">
          AUTO TIÊN NGHỊCH <span className="text-blood-gradient">MOBILE</span>
          <br />
          TOOL CÀY TỰ ĐỘNG <span className="text-gold-gradient">ĐỈNH CAO 24/7</span>
        </h1>

        {/* Subtitle (High contrast dark slate in Light Mode, crisp light gray in Dark Mode) */}
        <p className="mx-auto mt-4 sm:mt-5 max-w-3xl text-xs sm:text-base md:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed font-sans">
          Website chính thức phân phối <b className="text-slate-950 dark:text-white font-extrabold">Tool Auto Tiên Nghịch Mobile</b> và <b className="text-slate-950 dark:text-white font-extrabold">Tiên Nghịch Mobile Auto</b> chuẩn nhất. Tự động rèn tiên khí & gom đá nâng cấp khí đỉnh, leo Thông Thiên Tháp, vượt Vực U Minh, đánh chiếm Cực Âm Địa và tự đi ải chính tuyến nhẹ máy, mượt mà và an toàn 100%.
        </p>

        {/* Primary CTAs - Touch friendly, optimized for Android and PC */}
        <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto sm:max-w-none">
          <Link
            href="/bang-gia"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blood-700 via-blood-600 to-blood-700 px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-black text-white shadow-lg shadow-blood-600/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <Flame className="h-4 w-4 text-amber-300 animate-bounce" />
            <span>Xem Bảng Giá & Mua Gói</span>
          </Link>

          <a
            href={`${AUTO_SERVER_URL}/download/TienNghichAuto.apk`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 sm:px-7 py-3.5 text-xs sm:text-sm font-black text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all"
          >
            <Smartphone className="h-4 w-4 text-emerald-200" />
            <span>Tải Trực Tiếp APK Android (v1.0.0 Beta)</span>
          </a>

          <Link
            href="/#guide"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-extrabold text-slate-900 hover:border-blood-600 hover:text-blood-700 hover:bg-slate-50 shadow-sm transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <Download className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span>Hướng Dẫn Cài Đặt</span>
          </Link>
        </div>

        {/* Real-Time Live Server Stats */}
        <div className="mt-10 sm:mt-14 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
          <div className="rounded-2xl glass-milky-card p-3.5 sm:p-4.5 text-center dark:bg-slate-900/95 dark:border-slate-700">
            <div className="flex items-center justify-center gap-1.5 text-blood-700 dark:text-blood-400">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-lg sm:text-2xl font-black text-slate-950 dark:text-white font-mono">5,840+</span>
            </div>
            <div className="mt-1 text-[11px] sm:text-xs text-slate-900 dark:text-slate-200 font-bold">Đạo Hữu Đang Treo</div>
          </div>

          <div className="rounded-2xl glass-milky-card p-3.5 sm:p-4.5 text-center dark:bg-slate-900/95 dark:border-slate-700">
            <div className="flex items-center justify-center gap-1.5 text-amber-700 dark:text-amber-400">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-lg sm:text-2xl font-black text-slate-950 dark:text-white font-mono">99.98%</span>
            </div>
            <div className="mt-1 text-[11px] sm:text-xs text-slate-900 dark:text-slate-200 font-bold">Uptime Máy Chủ 24/7</div>
          </div>

          <div className="rounded-2xl glass-milky-card p-3.5 sm:p-4.5 text-center dark:bg-slate-900/95 dark:border-slate-700">
            <div className="flex items-center justify-center gap-1.5 text-sky-700 dark:text-sky-400">
              <Cpu className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-lg sm:text-2xl font-black text-slate-950 dark:text-white font-mono">v1.0.0 Beta</span>
            </div>
            <div className="mt-1 text-[11px] sm:text-xs text-slate-900 dark:text-slate-200 font-bold">Bản Cập Nhật Mới Nhất</div>
          </div>

          <div className="rounded-2xl glass-milky-card p-3.5 sm:p-4.5 text-center dark:bg-slate-900/95 dark:border-slate-700">
            <div className="flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-lg sm:text-2xl font-black text-emerald-800 dark:text-emerald-400 font-mono">100% SAFE</span>
            </div>
            <div className="mt-1 text-[11px] sm:text-xs text-slate-900 dark:text-slate-200 font-bold">An Toàn Tuyệt Đối</div>
          </div>
        </div>
      </div>
    </section>
  );
}
