'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Flame, Sparkles, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import {
  SERVER_PACKAGES_LIST,
  ServerPackage,
} from '@/lib/server-api';
import { useAuth } from '@/context/AuthContext';
import CheckoutModal from '@/components/pricing/CheckoutModal';

export default function PricingSection() {
  const { user, openAuthModal } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'popular' | 'starter' | 'vip'>('popular');
  const [selectedPlan, setSelectedPlan] = useState<ServerPackage>(SERVER_PACKAGES_LIST[2]); // PLAN_WEEK
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Filter plans by category for clean, non-cluttered display on homepage
  const displayedPlans = SERVER_PACKAGES_LIST.filter((pkg) => {
    if (activeCategory === 'popular') return pkg.id === 'PLAN_WEEK' || pkg.id === 'PLAN_MONTH';
    if (activeCategory === 'starter') return pkg.id === 'PLAN_1H' || pkg.id === 'PLAN_10H';
    if (activeCategory === 'vip') return pkg.id === 'PLAN_VIP';
    return true;
  });

  const handleBuyClick = (pkg: ServerPackage) => {
    if (!user || !user.auto_account) {
      openAuthModal('login', pkg);
      return;
    }
    setSelectedPlan(pkg);
    setIsCheckoutOpen(true);
  };

  return (
    <section id="pricing" className="relative py-14 sm:py-20 border-t border-slate-300 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blood-500/30 bg-blood-50 px-3.5 py-1 text-xs font-black text-blood-700 dark:bg-blood-950/40 dark:text-blood-400">
            💎 BẢNG GIÁ MÁY CHỦ CHÍNH HÃNG
          </div>
          <h2 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white leading-tight">
            GÓI CƯỚC <span className="text-blood-gradient">BẢN QUYỀN AUTO</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
            Chỉ tính giờ khi bật tool trong game. Mua gói bằng số dư tài khoản. Nạp tiền ngân hàng tự động cộng số dư 24/7 qua VietQR (3-5 giây).
          </p>
        </div>

        {/* Category Switcher - Keeps homepage tidy and prevents endless scrolling */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-300 dark:border-slate-700 max-w-full overflow-x-auto">
            <button
              onClick={() => setActiveCategory('popular')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap ${
                activeCategory === 'popular'
                  ? 'bg-blood-600 text-white shadow-md shadow-blood-600/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Flame className="h-4 w-4 text-amber-300" /> Bán Chạy Nhất (Khuyên Dùng)
            </button>
            <button
              onClick={() => setActiveCategory('starter')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap ${
                activeCategory === 'starter'
                  ? 'bg-blood-600 text-white shadow-md shadow-blood-600/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Gói Dùng Thử & Tiết Kiệm
            </button>
            <button
              onClick={() => setActiveCategory('vip')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap ${
                activeCategory === 'vip'
                  ? 'bg-blood-600 text-white shadow-md shadow-blood-600/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              👑 Gói Cày Top VIP (600h)
            </button>
          </div>
        </div>

        {/* Compact Package Grid */}
        <div
          className={`mt-10 grid grid-cols-1 gap-6 max-w-4xl mx-auto ${
            displayedPlans.length === 1 ? 'max-w-md' : 'sm:grid-cols-2'
          }`}
        >
          {displayedPlans.map((pkg) => {
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 ${
                  pkg.isPopular
                    ? 'border-2 border-blood-600 bg-white shadow-xl scale-[1.01] ring-4 ring-blood-500/10 dark:bg-slate-900 dark:border-blood-500'
                    : 'glass-milky-card border border-slate-300 hover:border-slate-400 hover:shadow-xl dark:bg-slate-900/95 dark:border-slate-700'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blood-600 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md shadow-blood-600/30">
                    BÁN CHẠY NHẤT ⭐
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block rounded-md px-2.5 py-0.5 text-[10px] font-black ${
                        pkg.isPopular
                          ? 'bg-blood-100 text-blood-800 dark:bg-blood-900/60 dark:text-blood-300'
                          : 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {pkg.badge}
                    </span>
                    <Link
                      href={`/bang-gia/${pkg.id.toLowerCase().replace('_', '-')}`}
                      className="text-[11px] font-bold text-slate-500 hover:text-blood-600 dark:hover:text-blood-400 flex items-center gap-0.5"
                    >
                      Chi tiết <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <h3 className="mt-3 text-lg font-black text-slate-950 dark:text-white">
                    {pkg.name}
                  </h3>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-mono">
                      {formatVND(pkg.price)}
                    </span>
                    <span className="text-xs font-bold text-slate-500 line-through">
                      Gốc: {formatVND(pkg.originalPrice)}
                    </span>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-950 border border-amber-300 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
                    <Clock className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                    <span>{pkg.active_hours} Giờ Treo ({pkg.validity_days} ngày hạn)</span>
                  </div>

                  <ul className="mt-5 space-y-2.5 border-t border-slate-200 dark:border-slate-800 pt-4 text-xs font-medium text-slate-800 dark:text-slate-200">
                    {pkg.features.map((feat: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => handleBuyClick(pkg)}
                    className={`w-full py-3 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      pkg.isPopular
                        ? 'bg-blood-600 text-white hover:bg-blood-700 shadow-blood-600/30'
                        : 'bg-slate-950 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Flame className="h-4 w-4" />
                    <span>Mua Ngay ({formatVND(pkg.price)})</span>
                  </button>
                  <p className="mt-1.5 text-[10px] text-center text-slate-500 font-semibold">
                    * Yêu cầu đăng nhập, nạp thẳng vào tài khoản của bạn
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Plans CTA to dedicated /bang-gia page */}
        <div className="mt-10 text-center">
          <Link
            href="/bang-gia"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-xs sm:text-sm font-black text-white hover:bg-blood-700 shadow-lg shadow-slate-900/20 active:scale-95 transition-all dark:bg-blood-600 dark:hover:bg-blood-700"
          >
            <span>Xem Bảng So Sánh Chi Tiết Tất Cả 5 Gói Cước</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Free Tier Callout */}
        <div className="mt-10 rounded-3xl glass-milky-card p-5 sm:p-6 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-amber-300 bg-amber-50/80 dark:bg-amber-950/20 dark:border-amber-900/40">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xs">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-950 dark:text-white">Tặng 15 phút miễn phí mỗi ngày vĩnh viễn!</h4>
              <p className="text-xs text-slate-800 dark:text-slate-300 font-medium">
                Chưa cần nạp tiền vẫn được dùng thử 15 phút/ngày để trải nghiệm tự động rèn đồ, leo tháp, phụ bản.
              </p>
            </div>
          </div>
          <Link
            href="/#guide"
            className="shrink-0 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 whitespace-nowrap"
          >
            Xem Hướng Dẫn
          </Link>
        </div>
      </div>

      {/* Checkout Modal (Strictly locks to logged-in user) */}
      {user && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          selectedPlan={selectedPlan}
          currentUser={user}
        />
      )}
    </section>
  );
}
