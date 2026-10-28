'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

const mockEvents = [
  { user: 'hoang***9', plan: 'Gói 300 Giờ (Tháng VIP)', action: 'vừa kích hoạt', time: '1 phút trước' },
  { user: 'tu_si***88', plan: 'Gói 600 Giờ (Vô Địch)', action: 'vừa mua thành công', time: '3 phút trước' },
  { user: '0965***750', plan: '80.000đ qua VietQR MB Bank', action: 'vừa nạp tiền', time: 'Vừa xong' },
  { user: 'thuctk***', plan: 'Gói 100 Giờ (Tuần Chuẩn)', action: 'vừa gia hạn', time: '5 phút trước' },
  { user: 'ma_dao***12', plan: 'Gói 300 Giờ (Tháng VIP)', action: 'vừa mua thành công', time: '2 phút trước' },
  { user: 'khachhang_vip***', plan: '290.000đ qua VietQR MB Bank', action: 'vừa nạp tiền thành công', time: '4 phút trước' },
];

export default function SocialProofToast() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const firstTimeout = setTimeout(() => {
      setVisible(true);
    }, 3000);

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % mockEvents.length);
        setVisible(true);
      }, 800);
    }, 9000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  const event = mockEvents[currentIdx];

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-sm transition-all duration-500 transform translate-y-0 opacity-100">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xl backdrop-blur-xl">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blood-600 to-blood-800 p-0.5 shadow-xs">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        </div>
        <div className="text-xs">
          <div className="flex items-center gap-1 font-semibold text-slate-800">
            <span className="text-blood-600 font-bold">{event.user}</span>
            <span>{event.action}</span>
          </div>
          <div className="font-extrabold text-slate-900 text-[11px] truncate max-w-[200px]">
            {event.plan}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{event.time} • Đã xác thực</div>
        </div>
      </div>
    </div>
  );
}
