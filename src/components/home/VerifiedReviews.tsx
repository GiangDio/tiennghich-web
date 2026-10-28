'use client';

import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

const reviews = [
  {
    author: 'Đạo Hữu Vương Lâm',
    server: 'Server 1 - Thái Cổ',
    avatar: 'VL',
    rating: 5,
    plan: 'Gói 600 Giờ (Vô Địch)',
    date: 'Hôm qua',
    comment:
      'Tool chạy cực kỳ mượt! Tính năng tự động rèn tiên khí lọc đánh giá tăng rồi tự nâng cấp Khí Đỉnh siêu ngon, mình ngủ một đêm sáng dậy đỉnh đã lên cấp 15. Tiết kiệm cả đống thời gian.',
  },
  {
    author: 'Tu Sĩ Hắc Sơn',
    server: 'Server 8 - Chu Tước',
    avatar: 'HS',
    rating: 5,
    plan: 'Gói 300 Giờ (Tháng VIP)',
    date: '3 ngày trước',
    comment:
      'Điểm cộng lớn nhất là khoản Cực Âm Địa, trước kia toàn phải căn giờ vào chiếm mệt mỏi, giờ tool tự tìm động phủ còn chỗ để chiếm. Quá hài lòng với bản cập nhật v3.1.0 này!',
  },
  {
    author: 'Tiêu Diệt Yêu Ma',
    server: 'Server 3 - Triệu Quốc',
    avatar: 'TD',
    rating: 5,
    plan: 'Gói 100 Giờ (Tuần Chuẩn)',
    date: '1 tuần trước',
    comment:
      'Hệ thống nạp tiền VietQR PayOS tự động cực nhanh, chuyển tiền xong đúng 3 giây là máy chủ cộng giờ ngay vào tài khoản. Đổi máy qua app điện thoại cũng dùng chung được.',
  },
];

export default function VerifiedReviews() {
  return (
    <section id="reviews" className="relative py-20 border-t border-slate-300 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50 px-3.5 py-1 text-xs font-black text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
            ⭐ 100% ĐÁNH GIÁ THỰC TẾ TỪ TU SĨ
          </div>
          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl font-cinzel dark:text-white">
            ĐẠO HỮU NÓI GÌ VỀ <span className="text-blood-gradient">TIÊN NGHỊCH AUTO</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">
            Trải nghiệm thực tế từ các cao thủ tu tiên trên khắp các máy chủ Tiên Nghịch.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-3xl glass-milky-card p-6 transition-all hover:border-slate-400 hover:shadow-xl dark:bg-slate-900/95 dark:border-slate-700"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blood-700 to-blood-900 font-bold text-sm text-white font-cinzel shadow-xs">
                      {r.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-950 dark:text-white flex items-center gap-1">
                        {r.author}
                        <span title="Đã xác thực mua hàng">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">{r.server}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(r.rating)].map((_, sIdx) => (
                      <Star key={sIdx} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-slate-900 leading-relaxed font-sans font-medium italic dark:text-slate-200">
                  "{r.comment}"
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3 text-[11px] text-slate-700 dark:text-slate-300 font-bold">
                <span className="font-black text-blood-700 dark:text-blood-400">{r.plan}</span>
                <span>{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
