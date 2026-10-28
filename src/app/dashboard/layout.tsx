'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Key, CreditCard, History, LifeBuoy, ArrowLeft, Shield } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <h1 className="text-2xl font-black text-white">BẢNG ĐIỀU KHIỂN ĐẠO HỮU</h1>
            <p className="text-xs text-gray-400 mt-1">
              Quản lý kho License Key, cấu hình phần cứng HWID và nạp tiền tự động 24/7.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-gold-500/30 bg-surface px-4 py-2 text-right">
              <div className="text-[10px] font-medium text-gray-400 uppercase">Số Dư Khả Dụng</div>
              <div className="font-mono text-base font-extrabold text-gold-400">120.000 đ</div>
            </div>
            <a
              href="/dashboard/deposit"
              className="rounded-xl bg-gold-500 px-4 py-2.5 text-xs font-bold text-black shadow-gold-glow hover:bg-gold-400 transition-all"
            >
              + Nạp Tiền
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <nav className="space-y-1.5 rounded-2xl border border-surface-border bg-surface p-3">
              <a
                href="/dashboard/licenses"
                className="flex items-center gap-2.5 rounded-xl bg-blood-600/20 border border-blood-600/40 px-3.5 py-2.5 text-xs font-bold text-blood-400 shadow-blood-glow transition-all"
              >
                <Key className="h-4 w-4" /> Kho Key & Đổi HWID
              </a>
              <a
                href="/dashboard/deposit"
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-400 hover:bg-surface-light hover:text-white transition-all"
              >
                <CreditCard className="h-4 w-4 text-gold-400" /> Nạp Tiền VietQR 24/7
              </a>
              <a
                href="#history"
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-400 hover:bg-surface-light hover:text-white transition-all"
              >
                <History className="h-4 w-4 text-spirit-400" /> Lịch Sử Giao Dịch
              </a>
              <a
                href="#support"
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-400 hover:bg-surface-light hover:text-white transition-all"
              >
                <LifeBuoy className="h-4 w-4 text-emerald-400" /> Gửi Yêu Cầu Hỗ Trợ
              </a>
            </nav>

            {/* Support Widget in Sidebar */}
            <div className="mt-4 rounded-2xl border border-gray-800 bg-surface/80 p-4 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-400" /> Hạn Mức Đổi Máy
              </div>
              <p className="mt-2 text-[11px] text-gray-400 leading-relaxed">
                Mỗi tài khoản được miễn phí <b className="text-white">3 lần/tháng</b> đổi HWID khi cài lại Win hoặc đổi máy tính mới.
              </p>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
