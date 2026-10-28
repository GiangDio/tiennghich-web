'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Flame, Smartphone, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AUTO_SERVER_URL } from '@/lib/server-api';

export default function MobileBottomBar() {
  const { user, openAuthModal } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 items-center h-14 px-2">
        {/* Tab 1: Trang Chủ */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-0.5 text-slate-700 dark:text-slate-300 hover:text-blood-600 dark:hover:text-blood-400 active:scale-95 transition-all"
        >
          <Home className="h-4 w-4" />
          <span className="text-[10px] font-black tracking-tight">Trang Chủ</span>
        </Link>

        {/* Tab 2: Bảng Giá */}
        <Link
          href="/bang-gia"
          className="flex flex-col items-center justify-center gap-0.5 text-blood-700 dark:text-blood-400 active:scale-95 transition-all"
        >
          <div className="relative">
            <Flame className="h-4 w-4 text-blood-600 animate-pulse" />
            <span className="absolute -top-1 -right-2 flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          </div>
          <span className="text-[10px] font-black tracking-tight">Bảng Giá</span>
        </Link>

        {/* Tab 3: Tải APK Android */}
        <a
          href={`${AUTO_SERVER_URL}/download/TienNghichAuto.apk`}
          className="flex flex-col items-center justify-center gap-0.5 text-emerald-700 dark:text-emerald-400 active:scale-95 transition-all"
        >
          <Smartphone className="h-4 w-4 text-emerald-600" />
          <span className="text-[10px] font-black tracking-tight">Tải APK</span>
        </a>

        {/* Tab 4: Tài Khoản */}
        {user ? (
          <button
            onClick={() => openAuthModal('login')}
            className="flex flex-col items-center justify-center gap-0.5 text-slate-900 dark:text-white active:scale-95 transition-all"
          >
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blood-600 text-[9px] font-black text-white">
              {user.auto_account?.charAt(0)?.toUpperCase()}
            </div>
            <span className="text-[10px] font-black truncate max-w-[70px]">
              {user.auto_account}
            </span>
          </button>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="flex flex-col items-center justify-center gap-0.5 text-slate-700 dark:text-slate-300 hover:text-blood-600 active:scale-95 transition-all"
          >
            <UserIcon className="h-4 w-4" />
            <span className="text-[10px] font-black tracking-tight">Đăng Nhập</span>
          </button>
        )}
      </div>
    </nav>
  );
}
