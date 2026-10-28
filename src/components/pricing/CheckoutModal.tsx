'use client';

import React, { useState } from 'react';
import {
  Flame,
  ShieldCheck,
  Clock,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  X,
  CreditCard,
  Zap,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { ServerPackage } from '@/lib/server-api';
import { UserSession, useAuth } from '@/context/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: ServerPackage;
  currentUser: UserSession;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  selectedPlan,
  currentUser,
}: CheckoutModalProps) {
  const { refreshBalance, openRightSidebar } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    new_balance?: number;
  } | null>(null);

  if (!isOpen) return null;

  const currentBal = currentUser.balance || 0;
  const planPrice = selectedPlan.price;
  const isEnough = currentBal >= planPrice;
  const missing = planPrice - currentBal;
  const remainingAfter = isEnough ? currentBal - planPrice : 0;

  const handleConfirmPurchase = async () => {
    setIsSubmitting(true);
    setPurchaseResult(null);

    try {
      const res = await fetch('/api/account/buy-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.auto_account,
          plan_id: selectedPlan.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPurchaseResult({
          success: true,
          message: data.message || `Kích hoạt thành công gói ${selectedPlan.name}!`,
          new_balance: data.new_balance,
        });
        await refreshBalance();
      } else {
        setPurchaseResult({
          success: false,
          error: data.error || 'Không thể thanh toán gói bằng số dư.',
        });
      }
    } catch {
      setPurchaseResult({
        success: false,
        error: 'Lỗi kết nối máy chủ khi mua gói.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeposit = () => {
    onClose();
    openRightSidebar('deposit', missing > 0 ? missing : 50000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 dark:bg-slate-900 dark:border-2 dark:border-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
          title="Đóng"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5 pr-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blood-600 to-amber-600 text-white shadow-md shadow-blood-600/30">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base font-cinzel dark:text-white leading-tight">
              MUA GÓI BẰNG SỐ DƯ
            </h3>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Tài khoản: <b className="text-blood-600 dark:text-blood-400">{currentUser.auto_account}</b>
            </p>
          </div>
        </div>

        {/* Success Screen */}
        {purchaseResult?.success ? (
          <div className="py-6 text-center space-y-3 animate-in zoom-in-95">
            <div className="text-4xl">🎉</div>
            <h4 className="text-base font-black text-emerald-600 dark:text-emerald-400">
              THANH TOÁN THÀNH CÔNG!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed px-4">
              Đã kích hoạt <b className="text-slate-900 dark:text-white">{selectedPlan.name}</b> (+{selectedPlan.active_hours}h Auto, hạn {selectedPlan.validity_days} ngày) vào tài khoản <b className="text-blood-600">{currentUser.auto_account}</b>.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
              Số dư còn lại: <span className="text-emerald-600 dark:text-emerald-400 font-black">{formatVND(purchaseResult.new_balance || 0)}</span>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md mt-2 transition"
            >
              Hoàn Tất & Đóng
            </button>
          </div>
        ) : (
          <>
            {/* Plan Info Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {selectedPlan.name}
                    </span>
                    {selectedPlan.badge && (
                      <span className="rounded-md bg-blood-600/10 px-2 py-0.5 text-[10px] font-black text-blood-600 border border-blood-600/30">
                        {selectedPlan.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedPlan.description}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-blood-600 dark:text-blood-400">
                    {formatVND(selectedPlan.price)}
                  </div>
                  {selectedPlan.originalPrice > selectedPlan.price && (
                    <div className="text-[10px] text-slate-400 line-through">
                      {formatVND(selectedPlan.originalPrice)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700/60 pt-2 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-blood-500" /> Thời gian: {selectedPlan.active_hours} Giờ
                </span>
                <span>Hạn chót: {selectedPlan.validity_days} Ngày</span>
              </div>
            </div>

            {/* Balance Overview & Comparison */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-2 bg-white dark:bg-slate-800/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Số dư hiện có:</span>
                <span className="font-black text-slate-900 dark:text-white">
                  {formatVND(currentBal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Giá gói cước:</span>
                <span className="font-black text-blood-600 dark:text-blood-400">
                  - {formatVND(planPrice)}
                </span>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex items-center justify-between font-bold">
                {isEnough ? (
                  <>
                    <span className="text-slate-700 dark:text-slate-300">Số dư sau khi mua:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {formatVND(remainingAfter)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Số tiền còn thiếu:
                    </span>
                    <span className="font-black text-red-600 dark:text-red-400 text-sm">
                      {formatVND(missing)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Error Message if any */}
            {purchaseResult?.error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-xs font-bold text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{purchaseResult.error}</span>
              </div>
            )}

            {/* Action Buttons */}
            {isEnough ? (
              <div className="space-y-2">
                <button
                  onClick={handleConfirmPurchase}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Đang thanh toán...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" /> Xác Nhận Thanh Toán Bằng Số Dư
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  * Hệ thống sẽ trừ {formatVND(planPrice)} từ số dư và kích hoạt ngay lập tức.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/60 p-3 text-xs text-amber-900 dark:text-amber-200">
                  <div className="font-bold flex items-center gap-1 text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Số dư không đủ để thanh toán!
                  </div>
                  <div className="mt-1 text-[11px]">
                    Bạn cần nạp thêm ít nhất <b>{formatVND(missing)}</b> để kích hoạt gói này.
                  </div>
                </div>

                <button
                  onClick={handleOpenDeposit}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blood-600 to-amber-600 hover:from-blood-700 hover:to-amber-700 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-4 w-4" /> Nạp Thêm {formatVND(missing)} (Quét VietQR)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
