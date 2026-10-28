'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ExternalLink, ShieldCheck, Settings, Users, Database, Clock, RefreshCw, Key, ArrowRight } from 'lucide-react';
import { AUTO_SERVER_URL } from '@/lib/server-api';

export default function AdminBridgePage() {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blood-500/30 bg-blood-500/10 px-3 py-0.5 text-xs font-bold text-blood-600 dark:text-blood-400">
              ⚡ TRUNG TÂM ĐIỀU HÀNH MÁY CHỦ
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold font-cinzel text-slate-900 dark:text-white">
              QUẢN TRỊ VIÊN <span className="text-blood-gradient">TIÊN NGHỊCH AUTO SERVER</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Kết nối trực tiếp máy chủ Cloud Render: <b className="font-mono text-blood-600 dark:text-blood-400">https://tiennghich-payos.onrender.com/admin</b>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://tiennghich-payos.onrender.com/admin"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-blood-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blood-600/30 hover:bg-blood-700 transition-all"
            >
              <span>Mở Tab Admin Riêng Biệt</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Stats & Features */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl glass-milky-card p-4 dark:bg-slate-900/90 dark:border-slate-800">
            <div className="flex items-center gap-2 text-blood-600 dark:text-blood-400 text-xs font-bold">
              <Users className="h-4 w-4" /> Quản Lý Khách Hàng
            </div>
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Xem danh sách tài khoản, kiểm tra giờ còn lại, hạn dùng và kích hoạt.
            </div>
          </div>

          <div className="rounded-2xl glass-milky-card p-4 dark:bg-slate-900/90 dark:border-slate-800">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Database className="h-4 w-4" /> Doanh Thu PayOS
            </div>
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Theo dõi biến động số dư VietQR, webhook thanh toán 24/7 tự động.
            </div>
          </div>

          <div className="rounded-2xl glass-milky-card p-4 dark:bg-slate-900/90 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-bold">
              <Clock className="h-4 w-4" /> Đền Bù Giờ (Mass Add)
            </div>
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Cộng thêm giờ đồng loạt cho toàn bộ khách hàng khi game bảo trì.
            </div>
          </div>

          <div className="rounded-2xl glass-milky-card p-4 dark:bg-slate-900/90 dark:border-slate-800">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Key className="h-4 w-4" /> Sinh Key Hàng Loạt
            </div>
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Tạo mã bản quyền sỉ cho đại lý/CTV phân phối bên ngoài.
            </div>
          </div>
        </div>

        {/* Embedded Admin Frame */}
        <div className="rounded-3xl glass-milky-card overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-850 dark:bg-slate-800 px-5 py-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                https://tiennghich-payos.onrender.com/admin
              </span>
            </div>
            <a
              href="https://tiennghich-payos.onrender.com/admin"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-blood-600 hover:underline flex items-center gap-1 dark:text-blood-400"
            >
              Phóng to toàn màn hình <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="relative w-full h-[750px] bg-slate-900">
            <iframe
              src="https://tiennghich-payos.onrender.com/admin"
              title="Tiên Nghịch Auto Server Admin Portal"
              className="w-full h-full border-0"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
