'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Flame,
  Check,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Zap,
  ArrowRight,
  Star,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { SERVER_PACKAGES_LIST, ServerPackage } from '@/lib/server-api';
import { useAuth } from '@/context/AuthContext';
import CheckoutModal from '@/components/pricing/CheckoutModal';

export default function PricingPage() {
  const { user, openAuthModal } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<ServerPackage>(SERVER_PACKAGES_LIST[2]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'starter' | 'standard' | 'vip'>('all');

  const filteredPlans = SERVER_PACKAGES_LIST.filter((p) => {
    if (filter === 'starter') return p.id === 'PLAN_1H' || p.id === 'PLAN_10H';
    if (filter === 'standard') return p.id === 'PLAN_WEEK' || p.id === 'PLAN_MONTH';
    if (filter === 'vip') return p.id === 'PLAN_VIP';
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
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Header & Breadcrumb */}
      <section className="relative pt-10 pb-12 sm:pt-16 sm:pb-16 overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[450px] w-[550px] -translate-x-1/2 rounded-full bg-blood-600/10 blur-[120px] dark:bg-blood-600/20" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-semibold mb-4">
            <Link href="/" className="hover:text-blood-600 transition-colors">
              Trang Chủ
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-900 dark:text-white font-black">Bảng Giá 5 Gói Cước</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-blood-500/30 bg-blood-50 px-3.5 py-1 text-xs font-black text-blood-700 dark:bg-blood-950/40 dark:text-blood-400">
            💎 BẢNG GIÁ MÁY CHỦ CHÍNH THỨC
          </div>

          <h1 className="mt-3 text-3xl sm:text-5xl font-black text-slate-950 font-cinzel dark:text-white leading-tight">
            BẢNG GIÁ <span className="text-blood-gradient">NẠP GIỜ TIÊN NGHỊCH AUTO</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
            Chọn gói cước phù hợp với nhu cầu tu luyện của bạn. Quét mã VietQR tự động cộng giờ trong 3-5 giây, bảo hành giờ chơi và hỗ trợ 24/7.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                filter === 'all'
                  ? 'bg-blood-600 text-white shadow-md shadow-blood-600/30'
                  : 'bg-white border border-slate-300 text-slate-800 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              Tất Cả 5 Gói
            </button>
            <button
              onClick={() => setFilter('starter')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                filter === 'starter'
                  ? 'bg-blood-600 text-white shadow-md shadow-blood-600/30'
                  : 'bg-white border border-slate-300 text-slate-800 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              Gói Dùng Thử (1h & 10h)
            </button>
            <button
              onClick={() => setFilter('standard')}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                filter === 'standard'
                  ? 'bg-blood-600 text-white shadow-md shadow-blood-600/30'
                  : 'bg-white border border-slate-300 text-slate-800 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <Star className="h-3.5 w-3.5 text-amber-500" /> Gói Chuẩn Tuần & Tháng VIP
            </button>
            <button
              onClick={() => setFilter('vip')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                filter === 'vip'
                  ? 'bg-blood-600 text-white shadow-md shadow-blood-600/30'
                  : 'bg-white border border-slate-300 text-slate-800 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              👑 Gói Cày Top Vô Địch (600h)
            </button>
          </div>
        </div>
      </section>

      {/* Package Grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {filteredPlans.map((pkg) => {
              const planSlug = pkg.id.toLowerCase().replace('_', '-');
              return (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-all duration-300 ${
                    pkg.isPopular
                      ? 'border-2 border-blood-600 bg-white shadow-xl scale-[1.02] ring-4 ring-blood-500/10 dark:bg-slate-900 dark:border-blood-500'
                      : 'bg-white border border-slate-300 hover:border-slate-400 hover:shadow-xl dark:bg-slate-900 dark:border-slate-700'
                  }`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blood-600 px-3.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md shadow-blood-600/30">
                      BÁN CHẠY NHẤT ⭐
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-block rounded-md px-2.5 py-0.5 text-[10px] font-black ${
                          pkg.isPopular
                            ? 'bg-blood-100 text-blood-800 dark:bg-blood-900/60 dark:text-blood-300'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {pkg.badge}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">{pkg.unitPriceDesc}</span>
                    </div>

                    <h2 className="mt-3 text-lg sm:text-xl font-black text-slate-950 dark:text-white font-cinzel">
                      {pkg.name}
                    </h2>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-950 dark:text-white font-mono">
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

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <button
                      onClick={() => handleBuyClick(pkg)}
                      className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        pkg.isPopular
                          ? 'bg-blood-600 text-white hover:bg-blood-700 shadow-blood-600/30'
                          : 'bg-slate-950 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Flame className="h-4 w-4" />
                      <span>Mua Ngay ({formatVND(pkg.price)})</span>
                    </button>

                    <Link
                      href={`/bang-gia/${planSlug}`}
                      className="block text-center text-xs font-bold text-slate-600 hover:text-blood-600 dark:text-slate-400 dark:hover:text-blood-400 py-1"
                    >
                      Xem trang giới thiệu riêng của gói này →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-cinzel dark:text-white">
              BẢNG SO SÁNH <span className="text-blood-gradient">CHI TIẾT 5 GÓI</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
              Xem chi tiết quyền lợi và thông số kỹ thuật của từng gói cước
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5 font-black text-slate-900 dark:text-white">Tính Năng / Đặc Quyền</th>
                  <th className="p-3.5 font-black text-slate-900 dark:text-white text-center">Gói 1h</th>
                  <th className="p-3.5 font-black text-slate-900 dark:text-white text-center">Gói 10h</th>
                  <th className="p-3.5 font-black text-blood-700 dark:text-blood-400 text-center bg-blood-500/10">Gói Tuần ⭐</th>
                  <th className="p-3.5 font-black text-amber-700 dark:text-amber-400 text-center">Gói Tháng 💎</th>
                  <th className="p-3.5 font-black text-purple-700 dark:text-purple-400 text-center">Gói Top 👑</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3.5 font-bold">Số giờ cày Auto</td>
                  <td className="p-3.5 text-center font-mono">1 Giờ</td>
                  <td className="p-3.5 text-center font-mono">10 Giờ</td>
                  <td className="p-3.5 text-center font-mono font-black text-blood-700 dark:text-blood-400 bg-blood-500/5">100 Giờ</td>
                  <td className="p-3.5 text-center font-mono font-black text-amber-700 dark:text-amber-400">300 Giờ</td>
                  <td className="p-3.5 text-center font-mono font-black text-purple-700 dark:text-purple-400">600 Giờ</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Thời hạn sử dụng</td>
                  <td className="p-3.5 text-center">1 Ngày</td>
                  <td className="p-3.5 text-center">3 Ngày</td>
                  <td className="p-3.5 text-center font-bold bg-blood-500/5">7 Ngày</td>
                  <td className="p-3.5 text-center font-bold">30 Ngày</td>
                  <td className="p-3.5 text-center font-bold">60 Ngày</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Đơn giá trung bình / giờ</td>
                  <td className="p-3.5 text-center">20.000đ/h</td>
                  <td className="p-3.5 text-center">4.000đ/h</td>
                  <td className="p-3.5 text-center font-black text-emerald-700 dark:text-emerald-400 bg-blood-500/5">800đ/h</td>
                  <td className="p-3.5 text-center font-black text-emerald-700 dark:text-emerald-400">600đ/h</td>
                  <td className="p-3.5 text-center font-black text-emerald-700 dark:text-emerald-400">483đ/h (Rẻ nhất)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Đầy đủ 5 phân hệ tính năng</td>
                  <td className="p-3.5 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                  <td className="p-3.5 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                  <td className="p-3.5 text-center bg-blood-500/5"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                  <td className="p-3.5 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                  <td className="p-3.5 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Dùng chung Android & PC</td>
                  <td className="p-3.5 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                  <td className="p-3.5 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                  <td className="p-3.5 text-center bg-blood-500/5"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                  <td className="p-3.5 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                  <td className="p-3.5 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Bảo lưu giờ khi tắt Auto</td>
                  <td className="p-3.5 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                  <td className="p-3.5 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                  <td className="p-3.5 text-center bg-blood-500/5"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                  <td className="p-3.5 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                  <td className="p-3.5 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline" /></td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">Hỗ trợ kỹ thuật ưu tiên 24/7</td>
                  <td className="p-3.5 text-center text-slate-400">Tiêu chuẩn</td>
                  <td className="p-3.5 text-center text-slate-400">Tiêu chuẩn</td>
                  <td className="p-3.5 text-center font-bold text-blood-700 dark:text-blood-400 bg-blood-500/5">Ưu tiên cao</td>
                  <td className="p-3.5 text-center font-bold text-amber-700 dark:text-amber-400">Ưu tiên VIP</td>
                  <td className="p-3.5 text-center font-bold text-purple-700 dark:text-purple-400">Hỗ trợ 1-1 riêng</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ & Purchase Assurance */}
      <section className="py-14 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-cinzel dark:text-white">
              CÂU HỎI THƯỜNG GẶP VỀ NẠP TIỀN & MUA GÓI
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 space-y-1">
              <h3 className="font-black text-slate-950 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blood-600" />
                Tại sao web bắt buộc phải đăng nhập trước khi mua gói?
              </h3>
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                Để bảo vệ quyền lợi tối đa của bạn. Khi đăng nhập, máy chủ sẽ ghi nhận và <b>cộng trực tiếp vào tài khoản</b> của bạn ngay khi giao dịch VietQR hoàn tất, tránh hoàn toàn trường hợp gõ sai hoặc nhầm tài khoản của người khác.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 space-y-1">
              <h3 className="font-black text-slate-950 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blood-600" />
                Sau khi chuyển khoản bao lâu thì có giờ trong tool?
              </h3>
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                Hệ thống tích hợp cổng PayOS nhận diện biến động số dư ngân hàng MB Bank tự động 100%. Thông thường chỉ từ <b>3 đến 5 giây</b> sau khi ngân hàng báo trừ tiền là tài khoản của bạn sẽ nhận được giờ ngay lập tức.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 space-y-1">
              <h3 className="font-black text-slate-950 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blood-600" />
                Khi tôi tắt game hoặc dừng tool thì có bị trừ giờ không?
              </h3>
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                <b>Hoàn toàn không!</b> Hệ thống chỉ trừ giây khi bạn bật công tắc Auto chạy trong game. Khi bạn tắt tool, offline hoặc thoát game, số giờ còn lại được bảo lưu nguyên vẹn 100%.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Checkout Modal (Strictly locks to logged-in user) */}
      {user && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          selectedPlan={selectedPlan}
          currentUser={user}
        />
      )}
    </main>
  );
}
