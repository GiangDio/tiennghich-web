'use client';

import React, { useState, useEffect } from 'react';
import { Check, Flame, Sparkles, Shield, Clock, Zap, QrCode, AlertCircle, Copy, ExternalLink, CheckCircle2, X } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import {
  SERVER_PACKAGES_LIST,
  ServerPackage,
  createServerOrder,
  checkServerOrderStatus,
  CreateOrderResponse,
} from '@/lib/server-api';

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<ServerPackage>(SERVER_PACKAGES_LIST[2]); // Default: Gói Tuần 100h
  const [autoAccountInput, setAutoAccountInput] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isPaidSuccess, setIsPaidSuccess] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    // Prefill account if logged in
    const savedUser = localStorage.getItem('tn_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.auto_account) setAutoAccountInput(u.auto_account);
      } catch {}
    }
  }, []);

  const handleOpenBuyModal = (pkg: ServerPackage) => {
    setSelectedPlan(pkg);
    setIsModalOpen(true);
    setOrderData(null);
    setOrderError(null);
    setIsPaidSuccess(false);

    // Refresh account from storage if available
    const savedUser = localStorage.getItem('tn_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.auto_account) setAutoAccountInput(u.auto_account);
      } catch {}
    }
  };

  const handleCreateOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const account = autoAccountInput.trim();
    if (!account) {
      setOrderError('Vui lòng nhập tên tài khoản Auto game để hệ thống cộng giờ.');
      return;
    }

    setIsCreatingOrder(true);
    setOrderError(null);

    const res = await createServerOrder(account, selectedPlan.id);
    setIsCreatingOrder(false);

    if (res.success && res.data) {
      setOrderData(res.data);
    } else {
      setOrderError(res.error || 'Không thể tạo đơn hàng. Vui lòng thử lại sau.');
    }
  };

  // Poll order status when order is created
  useEffect(() => {
    if (!orderData || !orderData.order_id || isPaidSuccess) return;

    const interval = setInterval(async () => {
      const res = await checkServerOrderStatus(orderData.order_id);
      if (res.success && (res.status === 'PAID' || res.status === 'COMPLETED')) {
        setIsPaidSuccess(true);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderData, isPaidSuccess]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section id="pricing" className="relative py-20 border-t border-slate-300 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blood-500/30 bg-blood-50 px-3.5 py-1 text-xs font-black text-blood-700 dark:bg-blood-950/40 dark:text-blood-400">
            💎 5 GÓI CƯỚC MÁY CHỦ CHÍNH THỨC
          </div>
          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl font-cinzel dark:text-white">
            BẢNG GIÁ <span className="text-blood-gradient">NẠP GIỜ AUTO</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">
            Chỉ tính giờ khi mở tool chạy trong game. Thanh toán quét mã VietQR tự động cộng giờ vào tài khoản ngay lập tức (3-5 giây).
          </p>
        </div>

        {/* 5 Plans Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {SERVER_PACKAGES_LIST.map((pkg) => {
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 ${
                  pkg.isPopular
                    ? 'border-2 border-blood-600 bg-white shadow-xl scale-[1.02] ring-4 ring-blood-500/10 dark:bg-slate-900 dark:border-blood-500'
                    : 'glass-milky-card border border-slate-300 hover:border-slate-400 hover:shadow-xl dark:bg-slate-900/95 dark:border-slate-700'
                }`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blood-600 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md shadow-blood-600/30">
                    BÁN CHẠY NHẤT ⭐
                  </div>
                )}

                <div>
                  {/* Tag */}
                  <span
                    className={`inline-block rounded-md px-2.5 py-0.5 text-[10px] font-black ${
                      pkg.isPopular
                        ? 'bg-blood-100 text-blood-800 dark:bg-blood-900/60 dark:text-blood-300'
                        : 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {pkg.badge}
                  </span>

                  <h3 className="mt-3 text-base font-black text-slate-950 dark:text-white">{pkg.name}</h3>

                  {/* Price */}
                  <div className="mt-3">
                    <span className="text-2xl font-black text-slate-950 dark:text-white font-mono">
                      {formatVND(pkg.price)}
                    </span>
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 line-through">
                      Gốc: {formatVND(pkg.originalPrice)}
                    </div>
                  </div>

                  {/* Duration Text */}
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-950 border border-amber-300 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
                    <Clock className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                    <span>{pkg.active_hours} Giờ ({pkg.validity_days} ngày hạn)</span>
                  </div>

                  {/* Features list */}
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
                    onClick={() => handleOpenBuyModal(pkg)}
                    className={`w-full py-2.5 rounded-xl text-xs font-black shadow-md transition-all ${
                      pkg.isPopular
                        ? 'bg-blood-600 text-white hover:bg-blood-700 shadow-blood-600/30'
                        : 'bg-slate-950 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700'
                    }`}
                  >
                    Mua Ngay ({formatVND(pkg.price)})
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Tier Callout */}
        <div className="mt-12 rounded-3xl glass-milky-card p-6 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-amber-300 bg-amber-50/80 dark:bg-amber-950/20 dark:border-amber-900/40">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xs">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-950 dark:text-white">Mỗi ngày nhận 20 phút miễn phí vĩnh viễn!</h4>
              <p className="text-xs text-slate-800 dark:text-slate-300 font-medium">
                Chưa cần nạp tiền vẫn được dùng thử 20 phút/ngày để trải nghiệm tính năng rèn đồ, leo tháp, phụ bản.
              </p>
            </div>
          </div>
          <a
            href="#guide"
            className="shrink-0 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Xem Hướng Dẫn
          </a>
        </div>
      </div>

      {/* Real-time Order & VietQR Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 dark:bg-slate-900 dark:border-2 dark:border-slate-800">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blood-600 text-white shadow-xs">
                <Flame className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-950 dark:text-white">
                  Thanh Toán: {selectedPlan.name}
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                  Giá: <b className="text-blood-700 dark:text-blood-400 font-mono text-sm">{formatVND(selectedPlan.price)}</b> • Cộng {selectedPlan.active_hours} Giờ
                </p>
              </div>
            </div>

            {/* Step 1: Input Account if order not created */}
            {!orderData && !isPaidSuccess && (
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-950 dark:text-white mb-1">
                    Tên tài khoản Auto của bạn:
                  </label>
                  <input
                    type="text"
                    required
                    value={autoAccountInput}
                    onChange={(e) => setAutoAccountInput(e.target.value)}
                    placeholder="Nhập tên tài khoản Auto (VD: Thuctk95)"
                    className="w-full rounded-xl border-2 border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-950 placeholder-slate-500 focus:border-blood-600 focus:outline-none focus:ring-2 focus:ring-blood-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                  <p className="mt-1 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    * Là tên tài khoản bạn đăng nhập trên App/Extension Tiên Nghịch Auto.
                  </p>
                </div>

                {orderError && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-300 p-3 text-xs text-red-800 font-bold dark:bg-red-950/40 dark:border-red-900 dark:text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{orderError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="w-full py-3 rounded-xl bg-blood-600 text-white font-black text-xs shadow-md shadow-blood-600/30 hover:bg-blood-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isCreatingOrder ? (
                    <span>Đang kết nối PayOS máy chủ...</span>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4" />
                      <span>Tạo Mã VietQR Thanh Toán ({formatVND(selectedPlan.price)})</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Show QR & Transfer Info */}
            {orderData && !isPaidSuccess && (
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-950 border border-amber-300 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
                  <span className="flex h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
                  Đang chờ bạn quét mã thanh toán...
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="p-3 bg-white rounded-2xl border-2 border-slate-300 shadow-inner">
                    <img
                      src={
                        orderData.qr_url ||
                        `https://img.vietqr.io/image/970422-VQRQANDYQ4244-compact2.png?amount=${orderData.amount}&addInfo=${encodeURIComponent(
                          orderData.transfer_content || orderData.order_id
                        )}&accountName=DANG%20HOANG%20GIANG`
                      }
                      alt="VietQR Tiên Nghịch Auto"
                      className="w-48 h-48 object-contain mx-auto"
                    />
                  </div>
                </div>

                {/* Bank Details Table */}
                <div className="rounded-2xl bg-slate-100 p-4 border border-slate-300 text-left text-xs space-y-2 dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Ngân hàng:</span>
                    <span className="font-black text-slate-950 dark:text-white">
                      {orderData.bank_info?.bank_name || 'MB Bank (Quân Đội)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Số tài khoản:</span>
                    <div className="flex items-center gap-1 font-mono font-black text-slate-950 dark:text-white">
                      <span>{orderData.bank_info?.account_no || 'VQRQANDYQ4244'}</span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            orderData.bank_info?.account_no || 'VQRQANDYQ4244',
                            'accountNumber'
                          )
                        }
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                        title="Sao chép STK"
                      >
                        <Copy className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Chủ tài khoản:</span>
                    <span className="font-black text-slate-950 dark:text-white">
                      {orderData.bank_info?.account_name || 'DANG HOANG GIANG'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Số tiền:</span>
                    <span className="font-mono font-black text-blood-700 dark:text-blood-400 text-sm">
                      {formatVND(orderData.amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700">
                    <span className="text-slate-950 dark:text-slate-100 font-black">Nội dung chuyển:</span>
                    <div className="flex items-center gap-1 font-mono font-black text-blood-700 dark:text-blood-400 text-sm">
                      <span>{orderData.transfer_content || orderData.order_id}</span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            orderData.transfer_content || orderData.order_id,
                            'content'
                          )
                        }
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        title="Sao chép nội dung"
                      >
                        <Copy className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {copiedField && (
                  <div className="text-[11px] font-black text-emerald-700 dark:text-emerald-400">
                    Đã sao chép vào bộ nhớ tạm!
                  </div>
                )}

                {/* Direct PayOS Link */}
                {orderData.checkout_url && (
                  <div>
                    <a
                      href={orderData.checkout_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800 shadow-xs dark:bg-blood-600 dark:hover:bg-blood-700"
                    >
                      <span>Mở Trang Thanh Toán PayOS</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Success Screen */}
            {isPaidSuccess && (
              <div className="text-center py-6 space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto dark:bg-emerald-950/60 dark:text-emerald-400">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h4 className="text-lg font-black text-slate-950 dark:text-white">Nạp Giờ Thành Công!</h4>
                <p className="text-xs text-slate-800 dark:text-slate-300 max-w-sm mx-auto font-medium">
                  Máy chủ đã tự động cộng <b className="text-blood-700 dark:text-blood-400 font-bold">{selectedPlan.active_hours} Giờ</b> vào tài khoản{' '}
                  <b className="font-mono text-slate-950 dark:text-white">{autoAccountInput}</b>. Bạn có thể mở tool và bắt đầu tu luyện ngay!
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-slate-950 px-6 py-2.5 text-xs font-black text-white hover:bg-slate-800"
                >
                  Hoàn Tất
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
