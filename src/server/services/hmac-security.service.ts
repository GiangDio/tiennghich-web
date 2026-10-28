import crypto from 'crypto';

/**
 * ============================================================================
 * HMAC SECURITY SERVICE - CHỐNG CRACK & GIẢ MẠO CLIENT-SERVER
 * ============================================================================
 * Cơ chế bảo vệ:
 * 1. Chữ ký số HMAC-SHA256 trên mọi request/response giữa tool game và web.
 * 2. Kiểm tra Timestamp: Chênh lệch không vượt quá MAX_TIME_SKEW_SEC (chống Replay).
 * 3. Cache Nonce: Mỗi nonce chỉ được sử dụng đúng 1 lần trong cửa sổ thời gian.
 * 4. Chuẩn hóa Payload (Canonical JSON): Đảm bảo thứ tự key không bị sai lệch chữ ký.
 */

const CLIENT_HMAC_SECRET = process.env.CLIENT_API_HMAC_SECRET || 'TN_SECRET_MA_DAO_9999_HUYET_SAC_CYBERPUNK';
const MAX_TIME_SKEW_SEC = 90; // Tối đa 90 giây lệch đồng hồ giữa client và server

// In-memory Nonce Cache (Đối với cụm production lớn có thể cắm Redis)
const usedNonces = new Map<string, number>();

// Dọn dẹp nonce cũ định kỳ mỗi 5 phút
setInterval(() => {
  const now = Date.now();
  for (const [nonce, expireTime] of usedNonces.entries()) {
    if (now > expireTime) {
      usedNonces.delete(nonce);
    }
  }
}, 300000);

export class HmacSecurityService {
  /**
   * Tạo chữ ký số HMAC-SHA256 cho payload
   */
  public static signPayload(payload: Record<string, unknown>, secret: string = CLIENT_HMAC_SECRET): string {
    const canonicalString = this.canonicalize(payload);
    return crypto.createHmac('sha256', secret).update(canonicalString).digest('hex');
  }

  /**
   * Xác minh tính toàn vẹn của request từ phần mềm Tiên Nghịch Auto
   */
  public static verifyRequest(
    payload: Record<string, unknown>,
    receivedSignature: string,
    timestamp: number,
    nonce?: string,
    secret: string = CLIENT_HMAC_SECRET
  ): { isValid: boolean; error?: string } {
    if (!receivedSignature) {
      return { isValid: false, error: 'MISSING_SIGNATURE: Thiếu chữ ký số bảo mật' };
    }

    // 1. Kiểm tra độ lệch thời gian (Chống tấn công Replay cũ)
    const nowSec = Math.floor(Date.now() / 1000);
    const diff = Math.abs(nowSec - timestamp);
    if (diff > MAX_TIME_SKEW_SEC) {
      return {
        isValid: false,
        error: `INVALID_TIMESTAMP: Thời gian hệ thống máy tính của bạn bị lệch quá ${diff}s. Vui lòng đồng bộ lại giờ Internet!`,
      };
    }

    // 2. Kiểm tra Nonce nếu được cung cấp (Mỗi request chỉ dùng 1 lần)
    if (nonce) {
      if (usedNonces.has(nonce)) {
        return { isValid: false, error: 'REPLAY_ATTACK_DETECTED: Nonce đã được sử dụng!' };
      }
      // Lưu nonce với thời hạn sống = 2 lần MAX_TIME_SKEW_SEC
      usedNonces.set(nonce, Date.now() + MAX_TIME_SKEW_SEC * 2000);
    }

    // 3. Chuẩn hóa payload và tính toán chữ ký kỳ vọng
    // Khi ký, loại bỏ trường signature nếu có sẵn trong payload
    const payloadCopy = { ...payload };
    delete payloadCopy.signature;
    delete payloadCopy.sign;

    const expectedSignature = this.signPayload(payloadCopy, secret);

    // 4. So sánh chuỗi với thời gian hằng số (Chống Timing Attack)
    try {
      const isMatch = crypto.timingSafeEqual(
        Buffer.from(receivedSignature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
      if (!isMatch) {
        return { isValid: false, error: 'TAMPERED_REQUEST: Chữ ký HMAC không khớp! Dữ liệu đã bị can thiệp' };
      }
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'INVALID_SIGNATURE_FORMAT: Định dạng chữ ký không hợp lệ' };
    }
  }

  /**
   * Tạo payload phản hồi đã được ký số để gửi về cho tool game
   */
  public static createSignedResponse<T extends Record<string, unknown>>(data: T, secret: string = CLIENT_HMAC_SECRET): T & {
    timestamp: number;
    signature: string;
  } {
    const timestamp = Math.floor(Date.now() / 1000);
    const basePayload = {
      ...data,
      timestamp,
    };
    const signature = this.signPayload(basePayload, secret);
    return {
      ...basePayload,
      signature,
    };
  }

  /**
   * Chuẩn hóa object thành chuỗi JSON sắp xếp thứ tự key từ A-Z
   */
  private static canonicalize(obj: Record<string, unknown>): string {
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj: Record<string, unknown> = {};
    for (const key of sortedKeys) {
      const val = obj[key];
      if (val !== undefined && val !== null) {
        sortedObj[key] = val;
      }
    }
    return JSON.stringify(sortedObj);
  }
}
