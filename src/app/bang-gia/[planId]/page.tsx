'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Flame,
  Check,
  Clock,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Zap,
  HelpCircle,
  QrCode,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { SERVER_PACKAGES, SERVER_PACKAGES_LIST, ServerPackage } from '@/lib/server-api';
import { useAuth } from '@/context/AuthContext';
import CheckoutModal from '@/components/pricing/CheckoutModal';

const SLUG_MAP: Record<string, string> = {
  'plan-1h': 'PLAN_1H',
  'plan-10h': 'PLAN_10H',
  'plan-week': 'PLAN_WEEK',
  'plan-month': 'PLAN_MONTH',
  'plan-vip': 'PLAN_VIP',
};

export default function SinglePlanPage() {
  const params = useParams();
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const rawSlug = String(params?.planId || '').toLowerCase();
  const planId = SLUG_MAP[rawSlug] || rawSlug.toUpperCase().replace('-', '_');
  const plan: ServerPackage | undefined = SERVER_PACKAGES[planId];

  if (!plan) {
    return (
      <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Navbar />
        <div className="mx-auto max-w-md py-24 px-4 text-center space-y-4">
          <h1 className="text-2xl font-black font-cinzel">Không Tìm Thấy Gói Cước</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Gói cước bạn đang tìm kiếm không tồn tại hoặc đã được cập nhật.
          </p>
          <Link
            href="/bang-gia"
            className="inline-flex items-center gap-2 rounded-xl bg-blood-600 px-5 py-2.5 text-xs font-black text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Quay Lại Bảng Giá
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const handleBuyClick = () => {
    if (!user || !user.auto_account) {
      openAuthModal('login', plan);
      return;
    }
    setIsCheckoutOpen(true);
  };

  const otherPlans = SERVER_PACKAGES_LIST.filter((p) => p.id !== plan.id);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Breadcrumb & Hero */}
      <section className="relative pt-10 pb-12 sm:pt-16 sm:pb-16 overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[450px] w-[550px] -translate-x-1/2 rounded-full bg-blood-600/10 blur-[120px] dark:bg-blood-600/20" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-6">
            <Link href="/" className="hover:text-blood-600 transition-colors">
              Trang Chủ
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/bang-gia" className="hover:text-blood-600 transition-colors">
              Bảng Giá
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-900 dark:text-white font-black">{plan.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Details */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block rounded-md bg-blood-100 px-3 py-1 text-xs font-black text-blood-800 dark:bg-blood-950/60 dark:text-blood-300">
                {plan.badge}
              </span>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-950 font-cinzel dark:text-white leading-tight">
                {plan.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {plan.description}. Nạp trực tiếp vào tài khoản qua VietQR tự động 24/7. Hỗ trợ đa nền tảng cả điện thoại Android và máy tính PC.
              </p>

              <div className="flex flex-wrap items-baseline gap-3 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white font-mono">
                  {formatVND(plan.price)}
                </span>
                <span className="text-sm font-bold text-slate-500 line-through">
                  Giá gốc: {formatVND(plan.originalPrice)}
                </span>
                <span className="rounded-lg bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-black dark:bg-emerald-950/40 dark:text-emerald-400">
                  {plan.unitPriceDesc}
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-950 border border-amber-300 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
                <Clock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                <span>Quỹ thời gian: <b>{plan.active_hours} Giờ treo</b> (Thời hạn sử dụng: {plan.validity_days} ngày)</span>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleBuyClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-blood-600 px-8 py-4 text-sm font-black text-white shadow-xl shadow-blood-600/30 hover:bg-blood-700 active:scale-95 transition-all"
                >
                  <Flame className="h-5 w-5 text-amber-300 animate-pulse" />
                  <span>Mua Ngay Gói Này ({formatVND(plan.price)})</span>
                </button>
                <p className="mt-2 text-[11px] text-slate-500 font-medium">
                  * Yêu cầu đăng nhập hoặc đăng ký tài khoản trước khi nạp
                </p>
              </div>
            </div>

            {/* Right Column: Features Card */}
            <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xl space-y-4">
              <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blood-600" />
                Đặc Quyền Của Gói:
              </h3>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Cam kết hoàn tiền 100% nếu phát sinh lỗi không thể khắc phục</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-600" />
                  <span>Tự động cập nhật tính năng mới qua OTA không mất giờ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Packages section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-cinzel dark:text-white">
                CÁC GÓI CƯỚC KHÁC
              </h2>
              <p className="text-xs text-slate-500">Khám phá các lựa chọn thời gian khác</p>
            </div>
            <Link
              href="/bang-gia"
              className="text-xs font-black text-blood-700 hover:text-blood-800 dark:text-blood-400"
            >
              Xem tất cả bảng giá →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {otherPlans.map((op) => (
              <div
                key={op.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between hover:border-slate-400 transition-all shadow-sm"
              >
                <div>
                  <span className="text-[10px] font-black rounded px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                    {op.badge}
                  </span>
                  <h4 className="mt-2 text-sm font-black text-slate-950 dark:text-white">{op.name}</h4>
                  <div className="mt-2 text-base font-black font-mono text-slate-950 dark:text-white">
                    {formatVND(op.price)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 font-bold">{op.active_hours} Giờ</div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/bang-gia/${op.id.toLowerCase().replace('_', '-')}`}
                    className="block text-center py-2 rounded-xl text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-blood-600 hover:text-white transition-all"
                  >
                    Xem Chi Tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Checkout Modal (Strictly locks to logged-in user) */}
      {user && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          selectedPlan={plan}
          currentUser={user}
        />
      )}
    </main>
  );
}
