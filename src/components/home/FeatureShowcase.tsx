'use client';

import React from 'react';
import { Hammer, Mountain, Zap, Shield, Sparkles, RefreshCw, Trophy, Skull, Users, Swords, Flame, CheckCircle2 } from 'lucide-react';

const featureTabs = [
  {
    icon: Hammer,
    tabNum: 'PHÂN HỆ 1',
    tabName: 'ĐẠO THÀNH',
    title: 'Rèn Tiên Khí & Nâng Khí Đỉnh Tự Động',
    desc: 'Tự động chọn lọc thuộc tính đánh giá tăng, lưu & rèn. So sánh trang bị mới thay thế đồ cũ và phân tách. Khi đủ Đá Sao Trời sẽ tự động nâng cấp Khí Đỉnh và dừng tool an toàn. Kèm tính năng Đấu Tiên Đài tự động.',
    badge: 'ĐÃ CẬP NHẬT v3.1.0',
    iconColor: 'bg-blood-100 text-blood-700 dark:bg-blood-950/60 dark:text-blood-400',
  },
  {
    icon: Users,
    tabNum: 'PHÂN HỆ 2',
    tabName: 'TU SĨ',
    title: 'Cập Nhật Cảnh Giới & Tu Vi Nhân Vật',
    desc: 'Theo dõi chỉ số Level, lực chiến, cảnh giới, kinh mạch và tu vi. Tự động hóa các hoạt động bồi dưỡng nhân vật khi đạt mốc đột phá cảnh giới.',
    badge: 'ĐANG HOÀN THIỆN',
    iconColor: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  },
  {
    icon: Swords,
    tabNum: 'PHÂN HỆ 3',
    tabName: 'TRỢ CHIẾN',
    title: 'Linh Thú & Trận Pháp Hỗ Trợ',
    desc: 'Hỗ trợ thiết lập linh thú xuất chiến, phối hợp trận pháp tăng lực chiến theo thuộc tính tương sinh tương khắc khi vượt phó bản khó.',
    badge: 'ĐANG HOÀN THIỆN',
    iconColor: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  },
  {
    icon: Mountain,
    tabNum: 'PHÂN HỆ 4',
    tabName: 'LỊCH LUYỆN',
    title: 'Leo Tháp, Vực U Minh & Chiếm Cực Âm Địa',
    desc: 'Tự động leo Thông Thiên Tháp liên tục thu thập mốc quà. Vượt Vực U Minh nhận tài nguyên hiếm. Tự động quét Cực Âm Địa ưu tiên chọn động phủ còn chỗ trống (10/10, 25/25, 50/50, 200/200) để đánh chiếm tu luyện.',
    badge: 'ĐÃ CẬP NHẬT v3.1.0',
    iconColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400',
  },
  {
    icon: Trophy,
    tabNum: 'PHÂN HỆ 5',
    tabName: 'MA ĐẠO',
    title: 'Ải Chính Tuyến, Treo Máy & Rút X1000',
    desc: 'Tự động nhận thưởng treo máy & mua thêm lượt. Tự động đi Ải Chính Tuyến (bắt đầu, tự xếp đội hình, skip tức thì, tự qua ải kế, nhận thưởng vượt). Tự làm nhiệm vụ Quà Tiên Duyên trong sự kiện Rút X1000.',
    badge: 'ĐÃ CẬP NHẬT v3.1.0',
    iconColor: 'bg-blood-100 text-blood-700 dark:bg-blood-950/60 dark:text-blood-400',
  },
  {
    icon: Zap,
    tabNum: 'ĐẶC QUYỀN',
    tabName: 'CHỐNG XUNG ĐỘT',
    title: 'Bỏ Qua Trận Thần Tốc & Chạy Song Song',
    desc: 'Mỗi tính năng tự động hoạt động độc lập chống xung đột luồng; riêng tính năng Bỏ qua trận đấu thần tốc và Tối đa tốc độ x3 có thể chạy kèm song song cùng tất cả tính năng khác siêu nhẹ máy!',
    badge: 'TỐI ƯU SIÊU TỐC',
    iconColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-400',
  },
];

export default function FeatureShowcase() {
  return (
    <section id="features" className="relative py-20 border-t border-slate-300 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blood-500/30 bg-blood-50 px-3.5 py-1 text-xs font-black text-blood-700 dark:bg-blood-950/40 dark:text-blood-400">
            ⚡ CẤU TRÚC MENU 5 PHÂN MỤC CHUẨN
          </div>
          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl font-cinzel dark:text-white">
            TÍNH NĂNG <span className="text-blood-gradient">MA ĐẠO TU TIÊN</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">
            Hệ thống phân chia 5 tab chức năng rõ ràng, chống lỗi xung đột dữ liệu và bảo toàn 100% thời gian của khách hàng qua mọi lần cập nhật.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureTabs.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl glass-milky-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/95 dark:border-slate-700 dark:hover:border-blood-500/60"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feat.iconColor} shadow-sm`}>
                    <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-900 dark:bg-slate-800 dark:text-slate-200">
                    {feat.tabNum}: {feat.tabName}
                  </span>
                </div>

                <div className="mt-4">
                  <span className="inline-block rounded-md bg-blood-100 px-2.5 py-0.5 text-[10px] font-black text-blood-800 border border-blood-200 dark:bg-blood-950/60 dark:border-blood-900 dark:text-blood-300">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-black text-slate-950 group-hover:text-blood-700 transition-colors dark:text-white dark:group-hover:text-blood-400">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans font-medium dark:text-slate-300">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
