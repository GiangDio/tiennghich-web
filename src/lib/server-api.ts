// ============================================================================
// TIÊN NGHỊCH AUTO - LIVE SERVER INTEGRATION BRIDGE
// Kết nối trực tiếp với Server Cloud Render 24/7: https://tiennghich-payos.onrender.com
// Đồng bộ tài khoản, số giờ thực tế, tạo mã thanh toán VietQR / PayOS
// ============================================================================

export const AUTO_SERVER_URL = process.env.AUTO_SERVER_URL || process.env.NEXT_PUBLIC_AUTO_SERVER_URL || 'https://tiennghich-payos.onrender.com';

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
      version: '1.0.5',
      apk_download_url: `${AUTO_SERVER_URL}/download/TienNghichAuto.apk`,
      extension_download_url: `${AUTO_SERVER_URL}/download/TienNghichAuto_Extension_PC.zip`,
    };
  }
}

/**
 * Đăng ký tài khoản Auto đồng bộ trực tiếp lên Server Auto Render (SQLite & Cloud 24/7)
 */
export async function registerServerAccount(
  username: string,
  password: string,
  email: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${AUTO_SERVER_URL}/api/account/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
        email: email.trim(),
        phone_or_note: email.trim(),
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, error: json.message || 'Không thể tạo tài khoản trên máy chủ Auto.' };
    }
    return { success: true, message: json.message || 'Đăng ký thành công!' };
  } catch (err: unknown) {
    return { success: false, error: 'Không thể kết nối máy chủ Auto Render!' };
  }
}

/**
 * Đăng nhập tài khoản Auto trực tiếp từ Server Auto Render
 */
export async function loginServerAccount(
  username: string,
  password: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  username?: string;
  email?: string;
  balance?: number;
  total_deposited?: number;
  remainingHoursStr?: string;
  validityLeftStr?: string;
  isActive?: boolean;
}> {
  try {
    const res = await fetch(`${AUTO_SERVER_URL}/api/account/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, error: json.message || 'Sai tài khoản hoặc mật khẩu trên máy chủ.' };
    }
    return {
      success: true,
      message: json.message,
      username: json.username,
      email: json.email || '',
      balance: Number(json.balance || 0),
      total_deposited: Number(json.total_deposited || 0),
      remainingHoursStr: json.remaining_hours_str || json.hours_str,
      validityLeftStr: json.validity_str,
      isActive: json.is_active,
    };
  } catch {
    return { success: false, error: 'Lỗi kết nối máy chủ Auto!' };
  }
}

/**
 * Tạo đơn nạp tiền tùy ý vào tài khoản (Tối thiểu 10.000 VNĐ)
 */
export async function createDepositOrder(
  username: string,
  amount: number
): Promise<{
  success: boolean;
  data?: CreateOrderResponse;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const res = await fetch(`${AUTO_SERVER_URL}/api/deposit/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.trim(),
        amount: Number(amount),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const text = await res.text();
    let json: any = {};
    try {
      json = JSON.parse(text);
    } catch {
      return { success: false, error: 'Máy chủ đang tải dữ liệu, vui lòng thử lại sau 5 giây.' };
    }

    if (!res.ok || !json.success) {
      return { success: false, error: json.message || json.error || 'Không thể tạo đơn nạp tiền.' };
    }
    return { success: true, data: json };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return { success: false, error: 'Hết thời gian kết nối máy chủ (Timeout). Vui lòng thử lại.' };
    }
    return { success: false, error: 'Lỗi kết nối máy chủ nạp tiền!' };
  }
}

/**
 * Mua gói cước bằng số dư tài khoản
 */
export async function buyPackageWithBalance(
  username: string,
  planId: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  new_balance?: number;
  current_balance?: number;
  needed_amount?: number;
  plan_name?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(`${AUTO_SERVER_URL}/api/account/buy-package`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.trim(),
        plan_id: planId.trim(),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const text = await res.text();
    let json: any = {};
    try {
      json = JSON.parse(text);
    } catch {
      return { success: false, error: 'Máy chủ phản hồi không đúng định dạng.' };
    }

    if (!res.ok || !json.success) {
      return {
        success: false,
        error: json.error || json.message || 'Số dư không đủ để mua gói này!',
        current_balance: json.current_balance,
        needed_amount: json.needed_amount,
      };
    }
    return {
      success: true,
      message: json.message || 'Kích hoạt gói cước thành công!',
      new_balance: json.new_balance,
      plan_name: json.plan_name,
    };
  } catch {
    return { success: false, error: 'Lỗi kết nối máy chủ khi mua gói!' };
  }
}

/**
 * Lấy số dư và trạng thái tài khoản hiện tại
 */
export async function getServerAccountBalance(username: string): Promise<{
  success: boolean;
  balance: number;
  total_deposited: number;
  remainingHoursStr?: string;
  isActive?: boolean;
}> {
  try {
    const res = await fetch(`${AUTO_SERVER_URL}/api/account/balance?username=${encodeURIComponent(username.trim())}`, {
      cache: 'no-store',
    });
    const json = await res.json();
    if (json && json.success) {
      return {
        success: true,
        balance: Number(json.balance || 0),
        total_deposited: Number(json.total_deposited || 0),
        remainingHoursStr: json.hours_str,
        isActive: json.is_active,
      };
    }
    return { success: false, balance: 0, total_deposited: 0 };
  } catch {
    return { success: false, balance: 0, total_deposited: 0 };
  }
}

/**
 * Cập nhật mật khẩu mới đồng bộ lên Server Auto Render
 */
export async function resetServerAccountPassword(
  username: string,
  newPassword: string,
  email?: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`${AUTO_SERVER_URL}/api/account/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username ? username.trim() : '',
        new_password: newPassword.trim(),
        email: email ? email.trim() : '',
      }),
    });
    const json = await res.json();
    return { success: Boolean(json.success), message: json.message, error: json.error || json.message };
  } catch {
    return { success: false, error: 'Lỗi kết nối máy chủ Auto Render khi đổi mật khẩu!' };
  }
}

/**
 * Cập nhật địa chỉ Gmail bảo mật cho tài khoản lên Server Auto Render
 */
export async function updateServerAccountEmail(
  username: string,
  email: string
): Promise<{ success: boolean; message?: string; error?: string; email?: string }> {
  try {
    const res = await fetch(`${AUTO_SERVER_URL}/api/account/update-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.trim(),
        email: email.trim().toLowerCase(),
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, error: json.message || 'Không thể cập nhật Gmail trên máy chủ.' };
    }
    return { success: true, message: json.message, email: json.email };
  } catch {
    return { success: false, error: 'Lỗi kết nối máy chủ khi cập nhật Gmail!' };
  }
}
