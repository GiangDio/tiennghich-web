'use client';

import React, { useState } from 'react';
import { Smartphone, Monitor, BookOpen, HelpCircle, Download, CheckCircle2, ChevronRight, AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { AUTO_SERVER_URL } from '@/lib/server-api';

export default function InstallationGuide() {
  const [activeTab, setActiveTab] = useState<'android' | 'pc' | 'usage' | 'faq'>('android');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <section id="guide" className="relative py-20 border-t border-slate-300 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blood-500/30 bg-blood-50 px-3.5 py-1 text-xs font-black text-blood-700 dark:bg-blood-950/40 dark:text-blood-400">
            📖 CẨM NANG HƯỚNG DẪN CHI TIẾT
          </div>
          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl font-cinzel dark:text-white">
            HƯỚNG DẪN CÀI ĐẶT & <span className="text-blood-gradient">SỬ DỤNG AUTO</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">
            Cài đặt dễ dàng trong 1 phút trên điện thoại Android và máy tính PC. Nhận ngay <b>20 phút miễn phí mỗi ngày</b> để trải nghiệm đầy đủ tất cả tính năng cao cấp!
          </p>
        </div>

        {/* Tab Selection Bar (Responsive 2x2 on mobile / flex on PC) */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto p-1.5 rounded-2xl glass-milky dark:bg-slate-900/95 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'android'
                ? 'bg-blood-600 text-white shadow-md shadow-blood-600/30'
                : 'text-slate-800 hover:text-black hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
            }`}
          >
            <Smartphone className="h-4 w-4" /> Điện Thoại Android
          </button>

          <button
            onClick={() => setActiveTab('pc')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'pc'
                ? 'bg-blood-600 text-white shadow-md shadow-blood-600/30'
                : 'text-slate-800 hover:text-black hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
            }`}
          >
            <Monitor className="h-4 w-4" /> Máy Tính PC
          </button>

          <button
            onClick={() => setActiveTab('usage')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'usage'
                ? 'bg-blood-600 text-white shadow-md shadow-blood-600/30'
                : 'text-slate-800 hover:text-black hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="h-4 w-4" /> Cách Dùng
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'faq'
                ? 'bg-blood-600 text-white shadow-md shadow-blood-600/30'
                : 'text-slate-800 hover:text-black hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="h-4 w-4" /> Câu Hỏi (FAQ)
          </button>
        </div>

        {/* Tab 1: Android Guide */}
        {activeTab === 'android' && (
          <div className="mt-8 max-w-4xl mx-auto rounded-3xl glass-milky-card p-6 sm:p-8 space-y-6 dark:bg-slate-900/95 dark:border-slate-700">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blood-600 text-white shadow-md">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">Cài Đặt Trên Điện Thoại Android & Giả Lập</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  App tích hợp sẵn game Tiên Nghịch và tự động cập nhật OTA khi có bản mới, không bao giờ phải cài lại.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bước 1 */}
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 space-y-3 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blood-600 text-white px-2.5 py-0.5 text-xs font-black">BƯỚC 1</span>
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">Tải File APK</span>
                </div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">Tải TienNghichAuto.apk</h4>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  Bấm nút tải bên dưới để tải file APK về máy. Nếu trình duyệt hiện cảnh báo bảo mật, chọn <b>"Vẫn tải xuống"</b>.
                </p>
                <a
                  href={`${AUTO_SERVER_URL}/download/TienNghichAuto.apk`}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blood-600 py-2.5 text-xs font-black text-white shadow-md hover:bg-blood-700 transition-all"
                >
                  <Download className="h-4 w-4" /> Tải Ngay (v3.1.0 APK)
                </a>
              </div>

              {/* Bước 2 */}
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 space-y-3 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-600 text-white px-2.5 py-0.5 text-xs font-black">BƯỚC 2</span>
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">Cài Đặt Ứng Dụng</span>
                </div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">Mở File & Cài Đặt</h4>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  Mở file vừa tải về và bấm <b>"Cài đặt"</b>. Nếu Google Play Protect cảnh báo, bấm vào <b>"Chi tiết hơn"</b> → Chọn <b>"Vẫn cài đặt"</b>.
                </p>
                <div className="rounded-lg bg-amber-100 border border-amber-300 p-2 text-[11px] font-bold text-amber-950 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
                  💡 Cho phép cài đặt ứng dụng từ nguồn này nếu điện thoại yêu cầu.
                </div>
              </div>

              {/* Bước 3 */}
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 space-y-3 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-xs font-black">BƯỚC 3</span>
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">Mở Game & Dùng</span>
                </div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">Vào Game & Nhận Giờ</h4>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  Mở app Auto Tiên Nghịch → Đăng ký hoặc Đăng nhập Tài khoản Auto → Menu Auto sẽ hiện sẵn trên màn hình game kèm 20 phút miễn phí hôm nay!
                </p>
                <div className="rounded-lg bg-emerald-100 border border-emerald-300 p-2 text-[11px] font-bold text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
                  🎁 Mỗi ngày được tặng thêm 20 phút free tự động làm mới vào 0h00.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PC Extension Guide */}
        {activeTab === 'pc' && (
          <div className="mt-8 max-w-4xl mx-auto rounded-3xl glass-milky-card p-6 sm:p-8 space-y-6 dark:bg-slate-900/95 dark:border-slate-700">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-md">
                <Monitor className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">Cài Đặt Trên Trình Duyệt Máy Tính (Chrome / Edge / Cốc Cốc)</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Chạy mượt mà trực tiếp trên web game tiennghich.joyplay.vn, không làm nặng máy hay tốn dung lượng RAM.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bước 1 */}
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 space-y-3 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-600 text-white px-2.5 py-0.5 text-xs font-black">BƯỚC 1</span>
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">Tải & Giải Nén</span>
                </div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">Tải File ZIP Extension</h4>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  Tải file <b>TienNghichAuto_Extension_PC.zip</b> về máy tính, sau đó nhấp chuột phải chọn <b>"Extract All..."</b> (Giải nén ra 1 thư mục).
                </p>
                <a
                  href={`${AUTO_SERVER_URL}/download/TienNghichAuto_Extension_PC.zip`}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-2.5 text-xs font-black text-white shadow-md hover:bg-amber-700 transition-all"
                >
                  <Download className="h-4 w-4" /> Tải Extension ZIP
                </a>
              </div>

              {/* Bước 2 */}
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 space-y-3 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blood-600 text-white px-2.5 py-0.5 text-xs font-black">BƯỚC 2</span>
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">Cài Tiện Ích</span>
                </div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">Bật Chế Độ Nhà Phát Triển</h4>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  Vào <b>chrome://extensions</b> trên trình duyệt → Bật <b>"Chế độ dành cho nhà phát triển" (Developer mode)</b> ở góc trên bên phải → Bấm nút <b>"Tải tiện ích đã giải nén" (Load unpacked)</b> → Chọn thư mục vừa giải nén.
                </p>
              </div>

              {/* Bước 3 */}
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 space-y-3 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-xs font-black">BƯỚC 3</span>
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">Bật Game & Auto</span>
                </div>
                <h4 className="text-sm font-black text-slate-950 dark:text-white">Mở Trang Game</h4>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  Truy cập vào trang web game <b>tiennghich.joyplay.vn</b>. Menu bong bóng Auto sẽ tự động xuất hiện trên màn hình góc phải để bạn bắt đầu sử dụng!
                </p>
                <a
                  href="https://tiennghich.joyplay.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-slate-300 bg-white py-2 text-xs font-black text-slate-900 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  <span>Mở Game Joyplay</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Usage & 5 Menus Guide */}
        {activeTab === 'usage' && (
          <div className="mt-8 max-w-4xl mx-auto rounded-3xl glass-milky-card p-6 sm:p-8 space-y-6 dark:bg-slate-900/95 dark:border-slate-700">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blood-600 text-white shadow-md">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">Cấu Trúc Menu 5 Phân Hệ & Cách Sử Dụng</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Mỗi tính năng auto hoạt động độc lập chống xung đột luồng; riêng tính năng Skip thần tốc chạy kèm song song.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 dark:bg-slate-800 dark:border-slate-700">
                <h4 className="font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <span className="rounded-md bg-blood-100 text-blood-800 px-2.5 py-0.5 text-xs font-black dark:bg-blood-900/60 dark:text-blood-300">1. ĐẠO THÀNH</span>
                  <span>Tự Động Rèn Tiên Khí & Nâng Khí Đỉnh</span>
                </h4>
                <p className="mt-2 text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium">
                  • <b>Bộ lọc tự động:</b> Chọn lọc các thuộc tính giúp đánh giá tiên khí tăng (công, thủ, bạo kích, né tránh...), tự động lưu bộ lọc và bắt đầu rèn.<br />
                  • <b>Thay & Tách:</b> Khi xuất hiện tiên khí có điểm đánh giá cao hơn, tool tự thay trang bị mới vào nhân vật và phân tách trang bị cũ.<br />
                  • <b>Nâng cấp khí đỉnh:</b> Kiểm tra số lượng Đá Sao Trời, nếu đủ điều kiện sẽ tự động nâng cấp Khí Đỉnh và dừng tool an toàn để tránh lãng phí.<br />
                  • <b>Đấu Tiên Đài:</b> Tự động khiêu chiến đấu trường xếp hạng hàng ngày.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 dark:bg-slate-800 dark:border-slate-700">
                <h4 className="font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <span className="rounded-md bg-amber-100 text-amber-900 px-2.5 py-0.5 text-xs font-black dark:bg-amber-900/60 dark:text-amber-300">2. LỊCH LUYỆN</span>
                  <span>Leo Tháp, Vực U Minh & Đánh Chiếm Cực Âm Địa</span>
                </h4>
                <p className="mt-2 text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium">
                  • <b>Thông Thiên Tháp & Vực U Minh:</b> Tự động leo tháp liên tục, tự chuyển trận pháp tương khắc để vượt ải nhanh nhất.<br />
                  • <b>Cực Âm Địa thông minh:</b> Tự động quét từ tầng cao nhất xuống, ưu tiên chọn các động phủ còn chỗ trống (10/10, 25/25, 50/50, 200/200) để đánh chiếm và tu luyện, không bị tranh chấp.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 dark:bg-slate-800 dark:border-slate-700">
                <h4 className="font-black text-slate-950 dark:text-white flex items-center gap-2">
                  <span className="rounded-md bg-blood-100 text-blood-800 px-2.5 py-0.5 text-xs font-black dark:bg-blood-900/60 dark:text-blood-300">3. MA ĐẠO</span>
                  <span>Ải Chính Tuyến, Treo Máy & Quà Tiên Duyên X1000</span>
                </h4>
                <p className="mt-2 text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium">
                  • <b>Ải Chính Tuyến tự động:</b> Bắt đầu ải → Tự động chọn đội hình mạnh nhất → Skip trận thần tốc → Qua ải tiếp theo → Tự nhận thưởng vượt ải.<br />
                  • <b>Treo máy & Rút X1000:</b> Tự nhận thưởng tích lũy treo máy, tự động làm nhiệm vụ Quà Tiên Duyên trong sự kiện rút X1000.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-sky-300 bg-sky-50 p-5 dark:bg-sky-950/40 dark:border-sky-800">
                <h4 className="font-black text-sky-950 dark:text-sky-200 flex items-center gap-2">
                  <span>⚡ NGUYÊN TẮC CHỐNG XUNG ĐỘT LUỒNG</span>
                </h4>
                <p className="mt-1 text-sky-900 dark:text-sky-200/90 leading-relaxed font-sans text-xs sm:text-sm font-semibold">
                  Để đảm bảo tool không bị loạn lệnh, hệ thống chỉ cho phép chạy 1 tính năng cày cuốc tại một thời điểm. Riêng tính năng <b>"Bỏ qua trận đấu thần tốc"</b> và <b>"Tối đa tốc độ x3"</b> được thiết kế chạy kèm song song với tất cả tính năng khác!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: FAQ */}
        {activeTab === 'faq' && (
          <div className="mt-8 max-w-4xl mx-auto rounded-3xl glass-milky-card p-6 sm:p-8 space-y-4 dark:bg-slate-900/95 dark:border-slate-700">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-950 dark:text-white">Câu Hỏi Thường Gặp Của Tu Sĩ</h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-4.5 dark:bg-slate-800 dark:border-slate-700">
                <h4 className="font-black text-slate-950 dark:text-white">Khi nào hệ thống mới trừ giờ sử dụng?</h4>
                <p className="mt-1 text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  Hệ thống chỉ đếm và trừ giờ khi bạn thực sự bấm nút <b>"Bắt Đầu Auto"</b> trên menu tool. Khi bạn tắt auto, tắt máy tính hoặc thoát game thì số giờ hoàn toàn được bảo lưu nguyên vẹn, không bị mất đi.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-white p-4.5 dark:bg-slate-800 dark:border-slate-700">
                <h4 className="font-black text-slate-950 dark:text-white">Mỗi lần cập nhật có bị reset thời gian không?</h4>
                <p className="mt-1 text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  Tuyệt đối không! Mọi dữ liệu tài khoản, số giờ đã nạp và thông tin kích hoạt đều được lưu trữ an toàn trên hệ thống máy chủ Cloud Render. Cập nhật bản mới qua OTA hoàn toàn tự động và giữ nguyên 100% quyền lợi của bạn.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-white p-4.5 dark:bg-slate-800 dark:border-slate-700">
                <h4 className="font-black text-slate-950 dark:text-white">Tôi có thể dùng chung tài khoản trên cả điện thoại và máy tính không?</h4>
                <p className="mt-1 text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  Có! Bạn chỉ cần đăng nhập cùng một tên Tài khoản Auto trên cả App Android và Extension PC thì số giờ sẽ tự động đồng bộ xuyên suốt.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
