'use client';

import React, { useState } from 'react';
import { Key, RefreshCw, Copy, Check, Laptop, Clock, AlertTriangle, ShieldCheck, Flame, Plus } from 'lucide-react';
import { formatDurationHours } from '@/lib/utils';

interface LicenseItem {
  id: string;
  key: string;
  planName: string;
  durationText: string;
  status: 'ACTIVE' | 'UNACTIVATED' | 'EXPIRED' | 'BANNED';
  hwid: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
  resetsUsed: number;
}

const mockLicenses: LicenseItem[] = [
  {
    id: 'lic_01',
    key: 'TN-9K7X-M4W2-H8Q1-V5P9',
    planName: 'Gói 30 Ngày Cao Cấp',
    durationText: '30 Ngày',
    status: 'ACTIVE',
    hwid: 'BFEBFBFF000906EA-7C10-4A3B-89E1',
    activatedAt: '2026-10-20T10:00:00Z',
    expiresAt: '2026-11-19T10:00:00Z',
    resetsUsed: 1,
  },
  {
    id: 'lic_02',
    key: 'TN-3F8Y-R2B5-N9P7-K4L6',
    planName: 'Gói Tuần Chiến Lệnh',
    durationText: '7 Ngày',
    status: 'UNACTIVATED',
    hwid: null,
    activatedAt: null,
    expiresAt: null,
    resetsUsed: 0,
  },
  {
    id: 'lic_03',
    key: 'TN-1X4Z-C7M9-T3D2-W8H5',
    planName: 'Gói Trải Nghiệm (Ngày)',
    durationText: '24 Giờ',
    status: 'EXPIRED',
    hwid: 'A1B2C3D4E5F60708-99AA-BBCC-DDEE',
    activatedAt: '2026-10-15T08:00:00Z',
    expiresAt: '2026-10-16T08:00:00Z',
    resetsUsed: 0,
  },
];

export default function MyLicensesPage() {
  const [licenses, setLicenses] = useState<LicenseItem[]>(mockLicenses);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedKeyForReset, setSelectedKeyForReset] = useState<LicenseItem | null>(null);
  const [resetReason, setResetReason] = useState<string>('');
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleCopy = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(keyText);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConfirmReset = async () => {
    if (!selectedKeyForReset) return;
    setIsResetting(true);
    setResetMessage(null);

    try {
      const res = await fetch('/api/license/reset-hwid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_demo_tu_si',
          licenseKeyId: selectedKeyForReset.id,
          reason: resetReason || 'Đổi máy tính mới / Cài lại Win',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResetMessage(data.message || 'Đã gỡ liên kết máy cũ thành công!');
        // Cập nhật trạng thái hiển thị
        setLicenses((prev) =>
          prev.map((l) => (l.id === selectedKeyForReset.id ? { ...l, hwid: null } : l))
        );
      } else {
        setResetMessage(data.message || 'Lỗi khi reset HWID. Vui lòng kiểm tra lại!');
      }
    } catch {
      // Fallback UI offline demo
      setResetMessage('Đã gỡ liên kết HWID máy tính thành công! Bạn có thể kích hoạt trên máy mới ngay bây giờ.');
      setLicenses((prev) =>
        prev.map((l) => (l.id === selectedKeyForReset.id ? { ...l, hwid: null } : l))
      );
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-blood-500/30 bg-gradient-to-r from-blood-950/40 via-surface to-surface p-5 shadow-card-dark">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-gold-400" /> Danh Sách License Key Của Bạn
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Copy mã Key và nhập vào phần mềm Tiên Nghịch Auto trên máy tính hoặc điện thoại để bắt đầu tự động hóa.
          </p>
        </div>
        <a
          href="/#pricing"
          className="flex items-center gap-1.5 rounded-xl bg-blood-600 px-4 py-2.5 text-xs font-bold text-white shadow-blood-glow hover:bg-blood-500 transition-all shrink-0"
        >
          <Plus className="h-4 w-4" /> Mua Thêm Key Mới
        </a>
      </div>

      {/* License List */}
      <div className="space-y-4">
        {licenses.map((lic) => {
          const isUnactivated = lic.status === 'UNACTIVATED';
          const isActive = lic.status === 'ACTIVE';
          const isExpired = lic.status === 'EXPIRED';

          return (
            <div
              key={lic.id}
              className={`rounded-2xl border bg-surface p-5 transition-all ${
                isActive
                  ? 'border-emerald-500/30 shadow-card-dark'
                  : isUnactivated
                  ? 'border-gold-500/30'
                  : 'border-gray-800 opacity-70'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-base sm:text-lg font-black tracking-wider text-white select-all">
                      {lic.key}
                    </span>
                    <button
                      onClick={() => handleCopy(lic.key)}
                      className="rounded-lg border border-gray-700 bg-surface-light p-1.5 text-gray-400 hover:text-gold-400 transition-all"
                      title="Copy License Key"
                    >
                      {copiedKey === lic.key ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    {copiedKey === lic.key && (
                      <span className="text-[11px] font-bold text-emerald-400">Đã chép!</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span className="font-semibold text-gold-400">{lic.planName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gray-500" /> Thời lượng: {lic.durationText}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Laptop className="h-3.5 w-3.5 text-gray-500" />
                      HWID:{' '}
                      {lic.hwid ? (
                        <b className="text-gray-300">{`${lic.hwid.slice(0, 16)}...`}</b>
                      ) : (
                        <b className="text-emerald-400">Chưa liên kết máy nào</b>
                      )}
                    </span>
                  </div>

                  {lic.expiresAt && (
                    <div className="text-[11px] text-gray-400">
                      Hạn chót sử dụng: <b className="text-white">{new Date(lic.expiresAt).toLocaleDateString('vi-VN')}</b>{' '}
                      (24/7)
                    </div>
                  )}
                  {isUnactivated && (
                    <div className="text-[11px] text-gold-400">
                      ⚡ Key chưa kích hoạt. Hạn dùng <b>chỉ bắt đầu tính</b> khi bạn mở tool trên máy lần đầu!
                    </div>
                  )}
                </div>

                {/* Right Status & Actions */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Status Badges */}
                  {isActive && (
                    <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                      ● Đang Hoạt Động
                    </span>
                  )}
                  {isUnactivated && (
                    <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-xs font-bold text-gold-400">
                      Chưa Sử Dụng
                    </span>
                  )}
                  {isExpired && (
                    <span className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs font-bold text-gray-400">
                      Đã Hết Hạn
                    </span>
                  )}

                  {/* Reset HWID Button */}
                  {lic.hwid && !isExpired && (
                    <button
                      onClick={() => {
                        setSelectedKeyForReset(lic);
                        setResetMessage(null);
                        setResetReason('');
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-gray-700 bg-surface-light px-3.5 py-2 text-xs font-bold text-gray-200 hover:border-gold-500 hover:text-gold-400 transition-all"
                      title="Gỡ liên kết máy tính cũ để chuyển sang máy mới"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Đổi Máy / Reset HWID
                    </button>
                  )}

                  {/* Renew Button */}
                  {isExpired && (
                    <a
                      href="/#pricing"
                      className="flex items-center gap-1.5 rounded-xl bg-blood-600 px-3.5 py-2 text-xs font-bold text-white shadow-blood-glow hover:bg-blood-500 transition-all"
                    >
                      Gia Hạn Ngay
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset HWID Modal */}
      {selectedKeyForReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Laptop className="h-5 w-5 text-gold-400" /> Xác Nhận Đổi Máy / Reset HWID
              </h3>
              <button
                onClick={() => setSelectedKeyForReset(null)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-gray-300">
              <p>
                Bạn đang yêu cầu gỡ liên kết phần cứng (HWID) cho Key:{' '}
                <b className="font-mono text-gold-400">{selectedKeyForReset.key}</b>
              </p>

              <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 p-3 text-[11px] text-gold-300">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="h-4 w-4" /> Chính Sách Đổi Máy:
                </div>
                Mỗi tài khoản được miễn phí <b>3 lần/tháng</b> đổi máy. Nếu vượt quá sẽ tự động tính phí hỗ trợ
                10.000đ/lần trừ vào số dư tài khoản.
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-1">
                  Lý do đổi máy (Tùy chọn):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cài lại Windows, Đổi PC mới..."
                  value={resetReason}
                  onChange={(e) => setResetReason(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-surface-light py-2 px-3 text-xs text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {resetMessage && (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-bold">
                  {resetMessage}
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedKeyForReset(null)}
                className="flex-1 rounded-xl border border-gray-700 py-2.5 text-xs font-bold text-gray-300 hover:bg-surface-light"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="flex-1 rounded-xl bg-blood-600 py-2.5 text-xs font-bold text-white shadow-blood-glow hover:bg-blood-500 disabled:opacity-50"
              >
                {isResetting ? 'Đang Xử Lý...' : 'Gỡ Liên Kết Máy Cũ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
