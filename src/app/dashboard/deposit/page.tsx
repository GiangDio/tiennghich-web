'use client';

import React, { useState } from 'react';
import { CreditCard, Copy, Check, QrCode, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { formatVND } from '@/lib/utils';

const presetAmounts = [20000, 50000, 100000, 200000, 500000, 1000000];

export default function DepositPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bankName = 'MB Bank (Ngân Hàng Quân Đội)';
  const accountNumber = '0965197750';
  const accountName = 'HOANG GIANG';
  const userId = 'tu_si_9999'; // Cố định hoặc lấy từ session người dùng
  const transferMemo = `TNAUTO ${userId}`;

  // URL VietQR tiêu chuẩn
  const vietQrUrl = `https://api.vietqr.io/image/970422-${accountNumber}-compact2.jpg?amount=${selectedAmount}&addInfo=${encodeURIComponent(
    transferMemo
  )}&accountName=${encodeURIComponent(accountName)}`;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-r from-gold-950/30 via-surface to-surface p-5 shadow-card-dark">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap className="h-5 w-5 text-gold-400" /> Nạp Tiền Tự Động 24/7 (VietQR Chuẩn Ngân Hàng)
        </h2>
        <p className="mt-1 text-xs text-gray-400 leading-relaxed">
          Hệ thống kết nối trực tiếp với cổng thanh toán tự động. Sau khi chuyển khoản đúng cú pháp, số dư ví sẽ được cộng tức thì trong vòng <b className="text-white">3 đến 5 giây</b>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Dynamic QR Code Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-surface p-6 text-center shadow-card-dark">
          <div className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5 mb-4">
            <QrCode className="h-4 w-4" /> Quét Mã VietQR Nhanh
          </div>

          <div className="relative rounded-2xl border-2 border-dashed border-gold-500/40 bg-white p-3 shadow-gold-glow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={vietQrUrl}
              alt="VietQR Mã Nạp Tiền Tự Động"
              className="h-64 w-64 object-contain rounded-lg"
            />
          </div>

          <div className="mt-4 text-[11px] text-gray-400">
            Hỗ trợ 50+ ứng dụng ngân hàng: MB, VCB, Techcombank, VPBank, ACB, MoMo...
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Đang lắng nghe biến động số dư...
          </div>
        </div>

        {/* Right: Manual Transfer Details & Amount Selection */}
        <div className="lg:col-span-7 space-y-5 rounded-2xl border border-surface-border bg-surface p-6 shadow-card-dark">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              1. Chọn Mệnh Giá Muốn Nạp:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((amt) => {
                const isSelected = selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`rounded-xl border py-2.5 px-2 text-xs font-bold font-mono transition-all ${
                      isSelected
                        ? 'border-gold-500 bg-gold-500/20 text-gold-400 shadow-gold-glow scale-[1.02]'
                        : 'border-gray-800 bg-surface-light text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    {formatVND(amt)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-800/80 pt-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">
              2. Hoặc Chuyển Khoản Thủ Công:
            </label>

            <div className="space-y-2.5 text-xs">
              {/* Ngân hàng */}
              <div className="flex items-center justify-between rounded-xl bg-surface-light p-3 border border-gray-800">
                <span className="text-gray-400">Ngân hàng:</span>
                <span className="font-bold text-white">{bankName}</span>
              </div>

              {/* Số tài khoản */}
              <div className="flex items-center justify-between rounded-xl bg-surface-light p-3 border border-gray-800">
                <span className="text-gray-400">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-gold-400">{accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(accountNumber, 'acc')}
                    className="rounded bg-gray-800 p-1 text-gray-400 hover:text-white"
                  >
                    {copiedField === 'acc' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Chủ tài khoản */}
              <div className="flex items-center justify-between rounded-xl bg-surface-light p-3 border border-gray-800">
                <span className="text-gray-400">Chủ tài khoản:</span>
                <span className="font-bold text-white uppercase">{accountName}</span>
              </div>

              {/* Số tiền */}
              <div className="flex items-center justify-between rounded-xl bg-surface-light p-3 border border-gray-800">
                <span className="text-gray-400">Số tiền:</span>
                <span className="font-mono text-sm font-black text-white">{formatVND(selectedAmount)}</span>
              </div>

              {/* Nội dung bắt buộc */}
              <div className="rounded-xl border border-blood-500/40 bg-blood-950/20 p-3.5 shadow-blood-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blood-400">
                      Nội Dung Chuyển Khoản (Bắt buộc chính xác):
                    </div>
                    <div className="mt-1 font-mono text-sm font-black text-white select-all">
                      {transferMemo}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(transferMemo, 'memo')}
                    className="flex items-center gap-1 rounded-lg bg-blood-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blood-500 shadow-blood-glow transition-all"
                  >
                    {copiedField === 'memo' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    Chép Cú Pháp
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-black/40 p-3 text-[11px] text-gray-400 leading-relaxed flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
            <span>
              Lưu ý quan trọng: Nhập chính xác nội dung <b className="text-white">{transferMemo}</b> để hệ thống tự động nhận diện và cộng tiền trong 3-5 giây. Nếu quên nội dung, vui lòng liên hệ Admin qua Zalo để được duyệt thủ công.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
