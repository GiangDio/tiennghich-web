'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Download, Menu, X, BookOpen, Clock, User as UserIcon, LogOut } from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import AuthModal from '@/components/auth/AuthModal';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [licenseData, setLicenseData] = useState<any>(null);

  useEffect(() => {
    // Check local storage for user session
    const savedUser = localStorage.getItem('tn_user');
    const savedLicense = localStorage.getItem('tn_license');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {}
    }
    if (savedLicense) {
      try {
        setLicenseData(JSON.parse(savedLicense));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tn_user');
    localStorage.removeItem('tn_license');
    setCurrentUser(null);
    setLicenseData(null);
  };

  const openAuth = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
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
            <a
              href="#lookup"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 transition-colors hover:text-blood-600 dark:text-slate-300 dark:hover:text-blood-400"
            >
              <Clock className="h-4 w-4 text-blood-600 dark:text-blood-400" />
              Tra Cứu Giờ
            </a>
            <a
              href="#features"
              className="text-xs font-bold text-slate-700 transition-colors hover:text-blood-600 dark:text-slate-300 dark:hover:text-blood-400"
            >
              Tính Năng (5 Mục)
            </a>
            <a
              href="#guide"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 transition-colors hover:text-blood-600 dark:text-slate-300 dark:hover:text-blood-400"
            >
              <BookOpen className="h-4 w-4 text-amber-600" />
              Hướng Dẫn Cài Đặt
            </a>
            <a
              href="#pricing"
              className="text-xs font-bold text-slate-700 transition-colors hover:text-blood-600 dark:text-slate-300 dark:hover:text-blood-400"
            >
              5 Gói Cước
            </a>
            <a
              href="#download"
              className="flex items-center gap-1 text-xs font-bold text-slate-700 transition-colors hover:text-blood-600 dark:text-slate-300 dark:hover:text-blood-400"
            >
              <Download className="h-3.5 w-3.5 text-sky-600" />
              Tải APK/PC
            </a>
          </nav>

          {/* Action Buttons & Theme Switcher */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Theme Toggle (Sáng / Tối) */}
            <ThemeToggle />

            {/* User Session */}
            {currentUser ? (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-3 py-1.5 shadow-xs dark:bg-slate-800 dark:border-slate-700">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blood-600 text-white font-bold text-xs">
                  {currentUser.auto_account?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-slate-900 dark:text-white leading-none">
                    {currentUser.auto_account}
                  </div>
                  {licenseData?.remainingHoursStr && (
                    <div className="text-[10px] text-blood-600 dark:text-blood-400 font-bold">
                      {licenseData.remainingHoursStr}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="ml-1 p-1 hover:bg-slate-100 rounded dark:hover:bg-slate-700 text-slate-400 hover:text-red-500"
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
              </div>
            )}

            <a
              href="#pricing"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <Flame className="h-3.5 w-3.5 text-amber-200" />
              Nạp Giờ
            </a>
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
              {currentUser ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-800 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blood-600 text-white font-bold">
                      {currentUser.auto_account?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {currentUser.auto_account}
                      </div>
                      <div className="text-[10px] text-slate-500">{currentUser.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-red-500 px-2 py-1"
                  >
                    Đăng Xuất
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => openAuth('login')}
                    className="flex-1 py-2 text-center rounded-xl border border-slate-300 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    Đăng Nhập
                  </button>
                  <button
                    onClick={() => openAuth('register')}
                    className="flex-1 py-2 text-center rounded-xl bg-blood-600 text-white text-xs font-bold"
                  >
                    Đăng Ký
                  </button>
                </div>
              )}

              <a
                href="#lookup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Clock className="h-4 w-4 text-blood-600" /> Tra Cứu Giờ Tài Khoản
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                ⚡ 5 Phân Hệ Tính Năng
              </a>
              <a
                href="#guide"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <BookOpen className="h-4 w-4 text-amber-600" /> Hướng Dẫn Cài Đặt (Android & PC)
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                💰 5 Gói Cước Server
              </a>
              <a
                href="#download"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                📥 Tải Bản Cài Đặt APK / Extension PC
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
        onAuthSuccess={(user, license) => {
          setCurrentUser(user);
          if (license) setLicenseData(license);
        }}
      />
    </>
  );
}
