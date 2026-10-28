import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVND(amount: number | string | { toString(): string }): string {
  const num = typeof amount === 'number' ? amount : Number(amount.toString());
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDurationHours(hours: number): string {
  if (hours >= 876000) return 'Vĩnh Viễn';
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return remHours > 0 ? `${days} ngày ${remHours} giờ` : `${days} ngày`;
  }
  return `${hours} giờ`;
}

/**
 * Sinh mã License Key chuẩn bảo mật cao: TN-XXXX-XXXX-XXXX-XXXX
 * Sử dụng crypto.randomBytes đảm bảo entropy ngẫu nhiên tuyệt đối chống dò mã
 */
export function generateLicenseKeyCode(): string {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Loại bỏ 0, O, 1, I để tránh nhầm lẫn khi nhập
  const segmentLength = 4;
  const segments = 4;
  const result: string[] = [];

  for (let s = 0; s < segments; s++) {
    const bytes = crypto.randomBytes(segmentLength);
    let seg = '';
    for (let i = 0; i < segmentLength; i++) {
      seg += charset[bytes[i] % charset.length];
    }
    result.push(seg);
  }

  return `TN-${result.join('-')}`;
}

/**
 * Sinh mã đơn hàng hoặc giao dịch duy nhất
 */
export function generateUniqueCode(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}_${timestamp}${randomSuffix}`;
}
