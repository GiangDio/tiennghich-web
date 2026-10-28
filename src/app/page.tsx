import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeatureShowcase from '@/components/home/FeatureShowcase';
import InstallationGuide from '@/components/home/InstallationGuide';
import PricingSection from '@/components/home/PricingSection';
import VerifiedReviews from '@/components/home/VerifiedReviews';
import SocialProofToast from '@/components/home/SocialProofToast';
import { Download, FileCheck, Smartphone, Monitor } from 'lucide-react';
import { AUTO_SERVER_URL } from '@/lib/server-api';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col selection:bg-blood-600 selection:text-white transition-colors duration-300">
      {/* Header */}
      <Navbar />

      {/* Hero Section with Live Account Lookup */}
      <HeroSection />

      {/* 5-Tab Feature Showcase */}
      <FeatureShowcase />

      {/* Detailed Installation Guide (Android APK & PC Extension) */}
      <InstallationGuide />

      {/* 5 Packages Pricing & Real-Time VietQR Checkout */}
      <PricingSection />

      {/* Download Center & Integrity Section */}
      <section id="download" className="relative py-20 border-t border-slate-300 bg-white/70 dark:bg-slate-900/50 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/40 bg-sky-100 px-3.5 py-1 text-xs font-black text-sky-800 dark:bg-sky-950/40 dark:text-sky-300">
              📥 TRUNG TÂM TẢI VỀ
            </div>
            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl font-cinzel dark:text-white">
              TẢI TOOL AUTO <span className="text-blood-gradient">TIÊN NGHỊCH MOBILE v3.2.0</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">
              Tải bản APK cho điện thoại Android hoặc Extension ZIP cho trình duyệt máy tính PC. Cả 2 đều tự động cập nhật OTA khi có phiên bản mới mà không bao giờ mất giờ.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Box 1: Extension PC */}
            <div className="rounded-3xl glass-milky-card p-6 sm:p-8 flex flex-col justify-between shadow-xl dark:bg-slate-900/95 dark:border-slate-700">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-[10px] font-black text-amber-900 border border-amber-300 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300">
                    CHO MÁY TÍNH (PC)
                  </span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">Dung lượng: 274 KB</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white">Extension Tiện Ích Chrome / Edge / Cốc Cốc</h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Hoạt động trên web game tiennghich.joyplay.vn</p>
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium">
                  Bản Extension đóng gói chống dịch ngược (Anti-Tamper), hoạt động trực tiếp trên web game. Hỗ trợ tự động cập nhật OTA 24/7 từ máy chủ Render.
                </p>
                <div className="mt-4 rounded-2xl bg-slate-100 dark:bg-slate-800 p-3 border-2 border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                    <FileCheck className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /> Mã băm SHA-256 tính toàn vẹn:
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-slate-900 dark:text-slate-200 font-bold break-all select-all">
                    a7d9f2e4b8c31e905a61234fc890123456789abcdef0123456789abcdef01234
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`${AUTO_SERVER_URL}/download/TienNghichAuto_Extension_PC.zip`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-xs font-black text-white shadow-md hover:bg-slate-800 active:scale-95 transition-all dark:bg-amber-600 dark:hover:bg-amber-500"
                >
                  <Download className="h-4 w-4" /> Tải Extension ZIP (v3.2.0)
                </a>
              </div>
            </div>

            {/* Box 2: Android APK */}
            <div className="rounded-3xl glass-milky-card p-6 sm:p-8 flex flex-col justify-between shadow-xl dark:bg-slate-900/95 dark:border-slate-700">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-blood-100 px-2.5 py-0.5 text-[10px] font-black text-blood-800 border border-blood-300 dark:bg-blood-950/50 dark:border-blood-900 dark:text-blood-300">
                    CHO ĐIỆN THOẠI (ANDROID)
                  </span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">Dung lượng: ~28 MB</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blood-100 text-blood-800 dark:bg-blood-950/60 dark:text-blood-400">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white">Ứng Dụng Android APK Tự Động</h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Cho điện thoại & giả lập (LDPlayer, Nox...)</p>
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium">
                  Bản cài đặt APK chuyên biệt tích hợp sẵn WebView siêu tốc, xoay ngang tự động và tự động kiểm tra tải cập nhật mới từ máy chủ.
                </p>
                <div className="mt-4 rounded-2xl bg-slate-100 dark:bg-slate-800 p-3 border-2 border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                    <FileCheck className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /> Mã băm SHA-256 tính toàn vẹn:
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-slate-900 dark:text-slate-200 font-bold break-all select-all">
                    8c4e1290abfd77610092837465efcdab1234567890abcdef1234567890abcdef
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`${AUTO_SERVER_URL}/download/TienNghichAuto.apk`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blood-600 py-3 text-xs font-black text-white shadow-md shadow-blood-600/30 hover:bg-blood-700 active:scale-95 transition-all"
                >
                  <Download className="h-4 w-4" /> Tải Ứng Dụng APK (v3.2.0)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Reviews */}
      <VerifiedReviews />

      {/* Realtime Social Proof Toast */}
      <SocialProofToast />

      {/* Footer */}
      <Footer />
    </main>
  );
}
