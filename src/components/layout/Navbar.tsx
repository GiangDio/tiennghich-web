'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, Download, Menu, X, BookOpen, Clock, User as UserIcon, LogOut, Smartphone, Wallet, CreditCard } from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { AUTO_SERVER_URL } from '@/lib/server-api';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, license, openAuthModal, logout, openRightSidebar, toggleRightSidebar } = useAuth();

  const openAuth = (tab: 'login' | 'register') => {
    openAuthModal(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs dark:border-slate-800/80 dark:bg-slate-900/90 transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blood-600 via-blood-700 to-blood-800 p-0.5 shadow-md shadow-blood-600/30 transition-transform duration-300 group-hover:scale-105">
              <Flame className="h-6 w-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-slate-900 tracking-wider font-cinzel dark:text-white">
                  TIÊN NGHỊCH
                </span>
                <span className="rounded-md bg-blood-600/10 px-2 py-0.5 text-[11px] font-black text-blood-600 border border-blood-600/30 dark:bg-blood-600/20 dark:text-blood-400">
                  AUTO PRO
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Tự Động Hóa • v3.1.0 Live
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links (Only Customer-Facing Links) */}
          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              href="/#features"
              className="text-xs font-bold text-slate-700 transition-colors hover:text-blood-600 dark:text-slate-300 dark:hover:text-blood-400"
            >
              Tính Năng (5 Mục)
            </Link>
            <Link
              href="/#guide"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 transition-colors hover:text-blood-600 dark:text-slate-300 dark:hover:text-blood-400"
            >
              <BookOpen className="h-4 w-4 text-amber-600" />
              Hướng Dẫn Cài Đặt
            </Link>
            <Link
              href="/bang-gia"
              className="flex items-center gap-1 text-xs font-black text-blood-700 transition-colors hover:text-blood-800 dark:text-blood-400 dark:hover:text-blood-300"
            >
              <Flame className="h-3.5 w-3.5 text-blood-600" />
              Bảng Giá (5 Gói)
            </Link>
            <Link
              href="/#download"
              className="flex items-center gap-1 text-xs font-bold text-slate-700 transition-colors hover:text-blood-600 dark:text-slate-300 dark:hover:text-blood-400"
            >
              <Download className="h-3.5 w-3.5 text-sky-600" />
              Tải APK/PC
            </Link>
          </nav>

          {/* Action Buttons & Theme Switcher */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Theme Toggle (Sáng / Tối) */}
            <ThemeToggle />

            {/* Quick Nạp Tiền Button */}
            <button
              onClick={() => openRightSidebar('deposit')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs hover:from-emerald-700 hover:to-teal-700 shadow-md transition-all active:scale-95"
              title="Nạp tiền vào tài khoản"
            >
              <CreditCard className="h-3.5 w-3.5" />
              Nạp Tiền
            </button>

            {/* User Session */}
            {user ? (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-3 py-1.5 shadow-xs dark:bg-slate-800 dark:border-slate-700">
                <button
                  onClick={() => openRightSidebar('overview')}
                  className="flex items-center gap-2 hover:opacity-80 transition text-left"
                  title="Xem thông tin tài khoản"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blood-600 text-white font-bold text-xs">
                    {user.auto_account?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900 dark:text-white leading-none">
                        {user.auto_account}
                      </span>
                      <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        💰 {(user.balance || 0).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    {license?.remainingHoursStr && (
                      <div className="text-[10px] text-blood-600 dark:text-blood-400 font-bold mt-0.5">
                        ⏳ {license.remainingHoursStr}
                      </div>
                    )}
                  </div>
                </button>
                <button
                  onClick={toggleRightSidebar}
                  title="Mở Bảng Điều Khiển"
                  className="p-1.5 hover:bg-slate-100 rounded-lg dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <button
                  onClick={logout}
                  title="Đăng xuất"
                  className="p-1 hover:bg-slate-100 rounded dark:hover:bg-slate-700 text-slate-400 hover:text-red-500"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('login')}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow-xs hover:border-blood-500 hover:text-blood-600 hover:bg-white transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  Đăng Nhập
                </button>

                <button
                  onClick={() => openAuth('register')}
                  className="flex items-center gap-1.5 rounded-xl bg-blood-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blood-600/30 hover:bg-blood-700 transition-all"
                >
                  Đăng Ký
                </button>
                <button
                  onClick={toggleRightSidebar}
                  title="Bảng Điều Khiển"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-blood-500"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => openRightSidebar('packages')}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blood-600 via-blood-700 to-blood-800 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <Flame className="h-3.5 w-3.5 text-amber-200" />
              Nạp Giờ
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white/80 text-slate-700 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white/95 px-4 py-4 md:hidden shadow-lg backdrop-blur-xl dark:bg-slate-900/95 dark:border-slate-800">
            <div className="flex flex-col gap-2">
              {user ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blood-600 text-white font-bold">
                      {user.auto_account?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        {user.auto_account}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400">{user.email || 'Đã liên kết máy chủ'}</div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="text-xs font-black text-red-600 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    Đăng Xuất
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => openAuth('login')}
                    className="flex-1 py-2.5 text-center rounded-xl border-2 border-slate-300 text-xs font-black text-slate-800 dark:border-slate-700 dark:text-slate-200"
                  >
                    Đăng Nhập
                  </button>
                  <button
                    onClick={() => openAuth('register')}
                    className="flex-1 py-2.5 text-center rounded-xl bg-blood-600 text-white text-xs font-black shadow-md shadow-blood-600/30"
                  >
                    Đăng Ký
                  </button>
                </div>
              )}

              {/* Nạp Tiền & Bảng Điều Khiển trong Menu Mobile */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openRightSidebar('deposit');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-sm"
                >
                  <CreditCard className="h-4 w-4" /> 💳 Nạp Tiền
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openRightSidebar('overview');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black text-xs border border-slate-200 dark:border-slate-700"
                >
                  <Wallet className="h-4 w-4" /> 📊 Bảng Số Dư
                </button>
              </div>

              {/* Quick Android APK Download Button in Mobile Menu */}
              <a
                href={`${AUTO_SERVER_URL}/download/TienNghichAuto.apk`}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-3 text-xs font-black text-white shadow-md shadow-emerald-600/20 mb-1"
              >
                <Smartphone className="h-4 w-4" /> Tải Ngay APK Cho Android (v3.1.0)
              </a>

              <Link
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                ⚡ 5 Phân Hệ Tính Năng
              </Link>
              <Link
                href="/#guide"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <BookOpen className="h-4 w-4 text-amber-600" /> Hướng Dẫn Cài Đặt (Android & PC)
              </Link>
              <Link
                href="/bang-gia"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-black text-blood-700 bg-blood-50/50 hover:bg-blood-100 dark:bg-blood-950/20 dark:text-blood-400 dark:hover:bg-blood-950/40"
              >
                <Flame className="h-4 w-4 text-blood-600" /> 💰 Xem 5 Gói Cước Server
              </Link>
              <Link
                href="/#download"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                📥 Tải Bản Cài Đặt APK / Extension PC
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
