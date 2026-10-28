import React from 'react';
import { Flame, ShieldCheck, HeartHandshake, Zap, MessageSquare, Terminal, Settings } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-xl text-slate-600 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blood-600 text-white shadow-xs">
                <Flame className="h-5 w-5 text-amber-300" />
              </div>
              <span className="font-black text-lg text-slate-900 tracking-wider font-cinzel dark:text-white">
                TIÊN NGHỊCH AUTO
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Giải pháp <b>Tool Auto Tiên Nghịch Mobile</b> và <b>Tiên Nghịch Mobile Auto</b> hàng đầu. Tự động rèn tiên khí, leo thông thiên tháp, đánh chiếm cực âm địa 24/7 nhẹ máy an toàn.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Máy Chủ & PayOS: ONLINE 24/7
            </div>
          </div>

          {/* Cột 2: Sản phẩm & Tính năng */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">5 Phân Hệ Tính Năng</h4>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="hover:text-blood-600 dark:hover:text-blood-400 transition-colors cursor-pointer">• Đạo Thành: Rèn Tiên Khí & Nâng Khí Đỉnh</li>
              <li className="hover:text-blood-600 dark:hover:text-blood-400 transition-colors cursor-pointer">• Lịch Luyện: Leo Tháp & Chiếm Cực Âm Địa</li>
              <li className="hover:text-blood-600 dark:hover:text-blood-400 transition-colors cursor-pointer">• Ma Đạo: Ải Chính Tuyến & Rút Tiên Duyên X1000</li>
              <li className="hover:text-blood-600 dark:hover:text-blood-400 transition-colors cursor-pointer">• Tu Sĩ & Trợ Chiến: Bồi Dưỡng Nhân Vật</li>
              <li className="hover:text-blood-600 dark:hover:text-blood-400 transition-colors cursor-pointer">• Skip Thần Tốc & Tốc Độ x3 Song Song</li>
            </ul>
          </div>

          {/* Cột 3: Hướng Dẫn & Gói Cước */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Liên Kết & Quản Trị</h4>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <a href="#lookup" className="hover:text-blood-600 dark:hover:text-blood-400 transition-colors">
                  • Tra Cứu Giờ Auto Trực Tiếp
                </a>
              </li>
              <li>
                <a href="#guide" className="hover:text-blood-600 dark:hover:text-blood-400 transition-colors">
                  • Hướng Dẫn Cài Đặt Android & PC
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-blood-600 dark:hover:text-blood-400 transition-colors">
                  • Bảng Giá 5 Gói Server PayOS
                </a>
              </li>
              <li>
                <a
                  href="https://tiennghich-payos.onrender.com/admin"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <Settings className="h-3 w-3" />
                  • Quản Trị Viên (Admin Render)
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Kênh liên hệ nhanh */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Hỗ Trợ Kỹ Thuật</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Cần hỗ trợ cài đặt hoặc giải đáp thắc mắc? Liên hệ ngay:
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-300"
              >
                <MessageSquare className="h-4 w-4" /> Kênh Hỗ Trợ Zalo 24/7
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-700 hover:bg-sky-100 transition-all dark:bg-sky-950/40 dark:border-sky-900 dark:text-sky-300"
              >
                <Terminal className="h-4 w-4" /> Kênh Telegram Cộng Đồng
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200/80 dark:border-slate-800 pt-6 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} <b className="text-slate-800 dark:text-slate-200">Tiên Nghịch Auto Mobile</b>. Mọi quyền được bảo lưu.
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Tool cày tự động Tiên Nghịch Mobile • Phiên bản v3.1.0 Live
          </div>
        </div>
      </div>
    </footer>
  );
}
