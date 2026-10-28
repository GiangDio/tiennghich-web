// ============================================================================
// TIÊN NGHỊCH AUTO - LIVE SERVER INTEGRATION BRIDGE
// Kết nối trực tiếp với Server Cloud Render 24/7: https://tiennghich-payos.onrender.com
// Đồng bộ tài khoản, số giờ thực tế, tạo mã thanh toán VietQR / PayOS
// ============================================================================

export const AUTO_SERVER_URL = 'https://tiennghich-payos.onrender.com';

export interface AutoPackage {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  active_hours: number;
  validity_days: number;
  badge: string;
  description: string;
  unitPriceDesc: string;
  isPopular?: boolean;
  features: string[];
}

export type ServerPackage = AutoPackage;

export const SERVER_PACKAGES: Record<string, AutoPackage> = {
  PLAN_1H: {
    id: 'PLAN_1H',
    name: 'Gói 1 Giờ (Trải Nghiệm)',
    price: 20000,
    originalPrice: 30000,
    active_hours: 1,
    validity_days: 1,
    badge: 'DÙNG THỬ',
    description: '1 Giờ treo Auto (Hạn 1 Ngày)',
    unitPriceDesc: '20.000đ / giờ',
    features: [
      'Đầy đủ tất cả 5 phân hệ tính năng',
      'Tự động rèn tiên khí & tăng cấp đỉnh',
      'Leo tháp, phụ bản ngày, vực u minh',
      'Chỉ trừ giờ khi BẬT Auto trong game',
      'Đồng bộ dùng chung Android & PC',
    ],
  },
  PLAN_10H: {
    id: 'PLAN_10H',
    name: 'Gói 10 Giờ (Tiết Kiệm)',
    price: 40000,
    originalPrice: 80000,
    active_hours: 10,
    validity_days: 3,
    badge: 'TIẾT KIỆM 80%',
    description: '10 Giờ treo Auto (Hạn 3 Ngày - Hời gấp 5 lần)',
    unitPriceDesc: '4.000đ / giờ',
    features: [
      '10 Giờ cày cuốc thoải mái',
      'Tự động đánh chiếm Cực Âm Địa',
      'Tự động đi ải chính tuyến & Rút X1000',
      'Bảo lưu giờ khi tắt Auto hoặc thoát game',
      'Cập nhật tự động (OTA 24/7)',
    ],
  },
  PLAN_WEEK: {
    id: 'PLAN_WEEK',
    name: 'Gói 100 Giờ (Gói Tuần Chuẩn)',
    price: 80000,
    originalPrice: 150000,
    active_hours: 100,
    validity_days: 7,
    badge: 'BÁN CHẠY NHẤT ⭐',
    isPopular: true,
    description: '100 Giờ treo Auto (Hạn 7 Ngày - Siêu hời!)',
    unitPriceDesc: '800đ / giờ',
    features: [
      'Gói được 85% tu sĩ lựa chọn nhiều nhất',
      'Tự động mọi hoạt động từ A - Z cả tuần',
      'Tối đa tốc độ x3 và skip trận tức thì',
      'Chống phát hiện, an toàn tài khoản 100%',
      'Tặng 3 lượt Reset HWID đổi máy miễn phí',
      'Hỗ trợ kỹ thuật ưu tiên 24/7',
    ],
  },
  PLAN_MONTH: {
    id: 'PLAN_MONTH',
    name: 'Gói 300 Giờ (Tháng VIP)',
    price: 180000,
    originalPrice: 300000,
    active_hours: 300,
    validity_days: 30,
    badge: 'THÁNG VIP 💎',
    description: '300 Giờ treo Auto (Hạn 30 Ngày - Cày cả tháng)',
    unitPriceDesc: '600đ / giờ',
    features: [
      '300 Giờ sử dụng trong suốt 30 ngày',
      'Tự động rèn tiên khí & gom đá nâng đỉnh',
      'Cày sự kiện đua top liên server',
      'Đền bù ngày dùng khi game bảo trì',
      'Tặng huy hiệu VIP trên hệ thống',
    ],
  },
  PLAN_VIP: {
    id: 'PLAN_VIP',
    name: 'Gói 600 Giờ (Cày Top Vô Địch)',
    price: 290000,
    originalPrice: 500000,
    active_hours: 600,
    validity_days: 60,
    badge: 'CÀY TOP 👑',
    description: '600 Giờ treo Auto (Hạn 60 Ngày - Rẻ nhất hệ thống)',
    unitPriceDesc: '483đ / giờ',
    features: [
      'Thời lượng khủng 600 giờ trong 60 ngày',
      'Đơn giá siêu rẻ: chỉ 483đ cho mỗi giờ treo',
      'Bảo lưu giờ triệt để khi offline',
      'Đổi máy / Reset HWID không giới hạn',
      'Hỗ trợ cấu hình riêng qua Ultraview/AnyDesk',
    ],
  },
};

export const SERVER_PACKAGES_LIST: AutoPackage[] = Object.values(SERVER_PACKAGES);

export interface AccountLicenseInfo {
  autoAccount: string;
  isActive: boolean;
  activeSeconds: number;
  hoursRemaining: number;
  minutesRemaining: number;
  remainingHoursStr: string;
  validityLeftStr: string;
  freeMinutesRemaining: number;
  expiresAt: string | null;
  isExpired: boolean;
  message: string;
}

export interface BankInfo {
  bank_name: string;
  account_no: string;
  account_name: string;
}

export interface CreateOrderResponse {
  order_id: string;
  payos_order_code?: number;
  plan_id: string;
  plan_name: string;
  amount: number;
  active_hours: number;
  validity_days: number;
  transfer_content: string;
  qr_url: string;
  checkout_url?: string;
  bank_info: BankInfo;
  plan_info?: Record<string, unknown>;
}

/**
 * Tra cứu tài khoản và kiểm tra số giờ thực tế trên server
 */
export async function checkServerAccount(autoAccount: string): Promise<{
  success: boolean;
  data?: AccountLicenseInfo;
  error?: string;
}> {
  try {
    const res = await fetch(`${AUTO_SERVER_URL}/api/check-license`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auto_account: autoAccount.trim() }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return {
        success: false,
        error: json.message || 'Tài khoản chưa được kích hoạt hoặc chưa nạp giờ.',
      };
    }

    const totalSeconds = Number(json.active_seconds) || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const freeSec = Number(json.daily_free_left) || 0;
    const freeMinutes = Math.floor(freeSec / 60);

    const expiryDate = json.expires_at ? new Date(json.expires_at * 1000).toISOString() : null;

    return {
      success: true,
      data: {
        autoAccount: json.auto_account || autoAccount,
        isActive: Boolean(json.is_active),
        activeSeconds: totalSeconds,
        hoursRemaining: hours,
        minutesRemaining: minutes,
        remainingHoursStr: json.remaining_hours_str || `${hours}h ${minutes}m`,
        validityLeftStr: json.validity_left_str || '',
        freeMinutesRemaining: freeMinutes,
        expiresAt: expiryDate,
        isExpired: totalSeconds <= 0 && freeSec <= 0,
        message: json.message || '',
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: 'Không thể kết nối máy chủ Auto Render. Vui lòng thử lại sau ít phút.',
    };
  }
}

/**
 * Tạo đơn thanh toán nạp giờ PayOS / VietQR MB Bank trên server
 */
export async function createServerOrder(
  autoAccount: string,
  planId: string
): Promise<{
  success: boolean;
  data?: CreateOrderResponse;
  error?: string;
}> {
  try {
    const res = await fetch(`${AUTO_SERVER_URL}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auto_account: autoAccount.trim(),
        plan_id: planId,
        uid: '',
        role_name: autoAccount.trim(),
      }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return {
        success: false,
        error: json.message || 'Không thể tạo đơn hàng trên máy chủ.',
      };
    }

    return {
      success: true,
      data: json as CreateOrderResponse,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: 'Lỗi mạng khi tạo mã đơn thanh toán!',
    };
  }
}

/**
 * Kiểm tra trạng thái đơn hàng (PAID / PENDING / COMPLETED)
 */
export async function checkServerOrderStatus(orderId: string): Promise<{
  success: boolean;
  status?: string;
  message?: string;
}> {
  try {
    const res = await fetch(`${AUTO_SERVER_URL}/api/order-status/${orderId}?t=${Date.now()}`);
    const json = await res.json();
    return {
      success: Boolean(json.success),
      status: json.status,
      message: json.message,
    };
  } catch {
    return { success: false };
  }
}

/**
 * Lấy thông tin phiên bản mới nhất từ server
 */
export async function fetchServerVersion() {
  try {
    const res = await fetch(`${AUTO_SERVER_URL}/api/version?t=${Date.now()}`);
    return await res.json();
  } catch {
    return {
      success: true,
      version: '3.1.0',
      apk_download_url: `${AUTO_SERVER_URL}/download/TienNghichAuto.apk`,
      extension_download_url: `${AUTO_SERVER_URL}/download/TienNghichAuto_Extension_PC.zip`,
    };
  }
}
