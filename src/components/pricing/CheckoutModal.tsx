'use client';

import React, { useState, useEffect } from 'react';
import { Flame, ShieldCheck, Clock, QrCode, AlertCircle, Copy, ExternalLink, CheckCircle2, X } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import {
  ServerPackage,
  createServerOrder,
  checkServerOrderStatus,
  CreateOrderResponse,
} from '@/lib/server-api';
import { UserSession } from '@/context/AuthContext';

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
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isPaidSuccess, setIsPaidSuccess] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when modal opens or plan changes
    if (isOpen) {
      setOrderData(null);
      setOrderError(null);
      setIsPaidSuccess(false);
      setCopiedField(null);
    }
  }, [isOpen, selectedPlan]);

  const handleCreateOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentUser?.auto_account) {
      setOrderError('Không tìm thấy tài khoản hợp lệ. Vui lòng đăng nhập lại.');
      return;
    }

    setIsCreatingOrder(true);
    setOrderError(null);

    const res = await createServerOrder(currentUser.auto_account, selectedPlan.id);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-5 sm:p-7 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 dark:bg-slate-900 dark:border-2 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
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
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blood-600 to-blood-800 text-white shadow-md shadow-blood-600/30">
            <Flame className="h-6 w-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white leading-tight font-cinzel">
              NẠP GIỜ: {selectedPlan.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-black text-blood-700 dark:text-blood-400 font-mono">
                {formatVND(selectedPlan.price)}
              </span>
              <span className="text-xs text-slate-500 font-semibold">•</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                <Clock className="h-3 w-3 text-amber-600" /> +{selectedPlan.active_hours} Giờ ({selectedPlan.validity_days} ngày)
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Confirm Account & Request VietQR */}
        {!orderData && !isPaidSuccess && (
          <form onSubmit={handleCreateOrder} className="space-y-4">
            {/* Account Card (Read-only, Locked to verified logged-in user) */}
            <div className="rounded-2xl border-2 border-emerald-400/80 bg-emerald-50/80 p-3.5 dark:bg-emerald-950/30 dark:border-emerald-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                      Tài Khoản Nhận Giờ (Chính Chủ):
                    </div>
                    <div className="text-sm sm:text-base font-black font-mono text-slate-950 dark:text-white">
                      🔑 {currentUser.auto_account}
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-200 px-2.5 py-0.5 text-[10px] font-black text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                  Đã Xác Thực
                </span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                * Thanh toán sẽ nạp thẳng <b>{selectedPlan.active_hours} Giờ</b> vào tài khoản <b>{currentUser.auto_account}</b>. Khách hàng không cần nhập lại tên tài khoản, đảm bảo chính xác 100% không bao giờ nhầm lẫn.
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
              className="w-full py-3.5 rounded-xl bg-blood-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-blood-600/30 hover:bg-blood-700 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isCreatingOrder ? (
                <span>Đang kết nối PayOS máy chủ...</span>
              ) : (
                <>
                  <QrCode className="h-4 w-4" />
                  <span>Xác Nhận & Tạo Mã VietQR ({formatVND(selectedPlan.price)})</span>
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
              Đang chờ bạn quét mã thanh toán VietQR...
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
                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain mx-auto"
                />
              </div>
            </div>

            {/* Bank Details Table */}
            <div className="rounded-2xl bg-slate-100 p-3.5 sm:p-4 border border-slate-300 text-left text-xs space-y-2.5 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-bold">Tài khoản nhận giờ:</span>
                <span className="font-mono font-black text-blood-700 dark:text-blood-400">
                  🔑 {currentUser.auto_account}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-bold">Ngân hàng:</span>
                <span className="font-black text-slate-950 dark:text-white">
                  {orderData.bank_info?.bank_name || 'MB Bank (Quân Đội)'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-bold">Số tài khoản:</span>
                <div className="flex items-center gap-1.5 font-mono font-black text-slate-950 dark:text-white">
                  <span>{orderData.bank_info?.account_no || 'VQRQANDYQ4244'}</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        orderData.bank_info?.account_no || 'VQRQANDYQ4244',
                        'accountNumber'
                      )
                    }
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
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
                <div className="flex items-center gap-1.5 font-mono font-black text-blood-700 dark:text-blood-400 text-sm">
                  <span>{orderData.transfer_content || orderData.order_id}</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        orderData.transfer_content || orderData.order_id,
                        'content'
                      )
                    }
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                    title="Sao chép nội dung"
                  >
                    <Copy className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
              </div>
            </div>

            {copiedField && (
              <div className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 animate-in fade-in">
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
            <h4 className="text-lg font-black text-slate-950 dark:text-white font-cinzel">Nạp Giờ Thành Công!</h4>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 max-w-sm mx-auto font-medium leading-relaxed">
              Máy chủ đã tự động nạp <b className="text-blood-700 dark:text-blood-400 font-bold">{selectedPlan.active_hours} Giờ</b> vào chính tài khoản{' '}
              <b className="font-mono text-slate-950 dark:text-white">🔑 {currentUser.auto_account}</b>. Bạn có thể mở tool và bắt đầu cày game ngay!
            </p>
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-950 px-6 py-2.5 text-xs font-black text-white hover:bg-slate-800 dark:bg-blood-600 dark:hover:bg-blood-700"
            >
              Hoàn Tất
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
