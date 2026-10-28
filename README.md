# TIÊN NGHỊCH AUTO - SOFTWARE LICENSING & E-COMMERCE PLATFORM ⚡

Hệ thống E-commerce và Cấp phép phần mềm (Software Licensing & Digital Goods) sản xuất cho công cụ **Tiên Nghịch Auto**. Được thiết kế với kiến trúc Clean Architecture, chuẩn bảo mật ứng dụng AppSec, sẵn sàng triển khai môi trường Production 24/7.

---

## 1. TECH STACK & CÔNG NGHỆ

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **Giao diện:** Dark Mode Tu tiên huyền huyễn Cyberpunk (Đen huyền `#070A0F`, Đỏ huyết ma đạo `#DC2626`, Vàng hoàng kim cổ điển `#F59E0B`).
- **Backend:** Next.js Route Handlers / Node.js chia lớp Controller - Service - Repository.
- **Database & ORM:** PostgreSQL kết hợp Prisma ORM.
- **Bảo mật giao tiếp Tool-Server:** Chữ ký số HMAC-SHA256, Nonce, Timestamp chống Replay Attack và Fiddler/HTTP Debugger Spoofing.
- **Bảo mật tài chính:** Database Transaction + Row-Level Locking (`SELECT ... FOR UPDATE`) chống Race Condition double-spending.

---

## 2. CẤU TRÚC THƯ MỤC CHUẨN CLEAN ARCHITECTURE

```
tiennghich-web/
├── prisma/
│   └── schema.prisma                 # Database Schema đầy đủ 10 bảng, quan hệ, indexes & enums
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── orders/purchase/      # Endpoint mua Key an toàn (Transaction & Row Locking)
│   │   │   ├── webhook/vietqr/       # Webhook nạp tiền tự động (Idempotency & Unique Ref)
│   │   │   ├── license/reset-hwid/   # Endpoint đổi máy HWID có quota miễn phí và tính phí
│   │   │   ├── admin/                # Endpoints quản trị: Đền bù bảo trì hàng loạt, sinh Key sỉ
│   │   │   └── v1/client/            # APIs chuyên biệt cho Game Tool Client:
│   │   │       ├── verify/           # Xác minh Key, gán HWID lần đầu, cấp Session Token
│   │   │       ├── heartbeat/        # Duy trì trạng thái Online mỗi 5 phút, chống lậu 2 máy
│   │   │       └── update/           # Kiểm tra bản cập nhật mới, SHA-256 hash, bảo trì
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Bố cục trang quản trị người dùng
│   │   │   ├── licenses/page.tsx     # Trang Quản Lý Key & Đổi Máy HWID
│   │   │   └── deposit/page.tsx      # Trang Nạp Tiền VietQR động 24/7
│   │   ├── globals.css               # Theme Tu Tiên Cyberpunk, hiệu ứng phát quang
│   │   ├── layout.tsx                # Layout gốc và cấu hình Font Cinzel/Inter
│   │   └── page.tsx                  # Landing Page Storefront đầy đủ Hero, Features, Pricing, Download
│   ├── components/
│   │   ├── home/
│   │   │   ├── HeroSection.tsx       # Banner Hero, thống kê Uptime, CTA mua key
│   │   │   ├── FeatureShowcase.tsx   # 6 tính năng cốt lõi bám sát game Tiên Nghịch
│   │   │   ├── PricingSection.tsx    # Bảng giá 4 gói cước + Mã giảm giá Voucher + Quick Buy
│   │   │   ├── SocialProofToast.tsx  # Thông báo Toast realtime người dùng mua key
│   │   │   └── VerifiedReviews.tsx   # Đánh giá 5 sao từ người mua đã xác thực
│   │   └── layout/
│   │       ├── Navbar.tsx            # Header phát quang, menu điều hướng, nút nạp tiền
│   │       └── Footer.tsx            # Footer chuẩn chỉ, kênh Zalo/Telegram hỗ trợ
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma Client Singleton
│   │   └── utils.ts                  # Tiện ích sinh mã Key TN-XXXX, mã đơn hàng, định dạng VND
│   ├── server/services/
│   │   ├── hmac-security.service.ts  # Dịch vụ chữ ký HMAC-SHA256, Canonical JSON, Nonce cache
│   │   ├── purchase.service.ts       # Service mua Key với Row-Level Locking chống Race Condition
│   │   ├── vietqr-webhook.service.ts # Service xử lý Webhook VietQR tự động 24/7
│   │   ├── client-api.service.ts     # Xử lý verify, heartbeat, update cho client
│   │   └── hwid.service.ts           # Service Reset HWID có hạn mức và tính phí vượt quota
│   └── client-sdk/
│       ├── TienNghichClientAuth.cs   # SDK C# .NET hoàn chỉnh cho tool game C#
│       └── tiennghich_client_auth.py # SDK Python hoàn chỉnh cho tool game Python
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.example
```

---

## 3. HƯỚNG DẪN KHỞI CHẠY & MIGRATION DATABASE

### Bước 1: Cấu hình file môi trường
Tạo file `.env` dựa trên `.env.example`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/tiennghich_db?schema=public"
CLIENT_API_HMAC_SECRET="TN_SECRET_MA_DAO_9999_HUYET_SAC_CYBERPUNK"
PAYMENT_WEBHOOK_SECRET="SEC_PAYMENT_VIETQR_SECRET_TOKEN_247"
ADMIN_SECRET_KEY="TN_ADMIN_SUPER_SECRET_KEY_9999"
JWT_SECRET="TN_JWT_SUPER_SECURE_KEY_2026_MA_DAO"
```

### Bước 2: Sinh Prisma Client & Đồng bộ Database
```bash
npm run prisma:generate
npm run prisma:migrate
```

### Bước 3: Khởi chạy môi trường phát triển (Dev)
```bash
npm run dev
```
Truy cập: `http://localhost:3000`

---

## 4. BẢO MẬT GIAO TIẾP GAME TOOL (HMAC-SHA256 SPECIFICATION)

Mọi request từ Client Tool gửi lên `/api/v1/client/verify` và `/api/v1/client/heartbeat` phải được tính toán chữ ký số như sau:

1. **Tập hợp các tham số** thành key-value (ngoại trừ trường `signature`).
2. **Sắp xếp key theo thứ tự chữ cái A-Z** (Canonical JSON).
3. **Tính mã băm HMAC-SHA256** với `CLIENT_API_HMAC_SECRET`:
   $$\text{Signature} = \text{HMAC-SHA256}(\text{CanonicalJSON}, \text{SecretKey})$$
4. Server kiểm tra:
   - **Timestamp Skew:** Lệch không quá $\pm 90$ giây so với giờ server UTC.
   - **Nonce Cache:** Mỗi chuỗi Nonce ngẫu nhiên chỉ được chấp nhận đúng 1 lần.
   - **Timing-Safe Equal:** So sánh chữ ký bằng thuật toán thời gian hằng số chống Side-Channel Attack.
