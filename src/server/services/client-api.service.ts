import { prisma } from '@/lib/prisma';
import { HmacSecurityService } from './hmac-security.service';
import crypto from 'crypto';

export interface VerifyLicenseInput {
  license_key: string;
  hwid: string;
  client_version: string;
  timestamp: number;
  nonce?: string;
  signature: string;
  ipAddress?: string;
}

export interface HeartbeatInput {
  session_token: string;
  hwid: string;
  timestamp: number;
  nonce?: string;
  signature: string;
  ipAddress?: string;
}

export class ClientApiService {
  /**
   * 1. XÁC MINH BẢN QUYỀN (VERIFY LICENSE) TỪ TOOL CLIENT
   * Tự động gán HWID nếu là lần đầu kích hoạt, kiểm tra hạn dùng, cấp Session Token
   */
  public static async verifyLicense(input: VerifyLicenseInput) {
    const { license_key, hwid, client_version, timestamp, nonce, signature, ipAddress } = input;

    // 1. Kiểm tra chữ ký số HMAC-SHA256 và chống Replay Attack
    const authCheck = HmacSecurityService.verifyRequest(
      {
        license_key,
        hwid,
        client_version,
        timestamp,
        nonce,
      },
      signature,
      timestamp,
      nonce
    );

    if (!authCheck.isValid) {
      return {
        status: 401,
        body: HmacSecurityService.createSignedResponse({
          success: false,
          error_code: 'HMAC_VERIFICATION_FAILED',
          message: authCheck.error || 'Xác thực chữ ký số API thất bại!',
        }),
      };
    }

    if (!license_key || !hwid) {
      return {
        status: 400,
        body: HmacSecurityService.createSignedResponse({
          success: false,
          error_code: 'MISSING_PARAMS',
          message: 'Vui lòng cung cấp đầy đủ License Key và Mã phần cứng (HWID)!',
        }),
      };
    }

    const cleanKey = license_key.trim().toUpperCase();
    const cleanHwid = hwid.trim().toUpperCase();

    // 2. Tìm kiếm License Key trong Database
    const license = await prisma.licenseKey.findUnique({
      where: { key: cleanKey },
      include: {
        plan: true,
        user: { select: { id: true, username: true, isActive: true } },
      },
    });

    if (!license) {
      return {
        status: 404,
        body: HmacSecurityService.createSignedResponse({
          success: false,
          error_code: 'KEY_NOT_FOUND',
          message: 'Mã License Key không tồn tại trên hệ thống!',
        }),
      };
    }

    // 3. Kiểm tra nếu tài khoản hoặc key bị cấm (Banned)
    if (license.status === 'BANNED' || !license.user.isActive) {
      return {
        status: 403,
        body: HmacSecurityService.createSignedResponse({
          success: false,
          error_code: 'KEY_BANNED',
          message: `Key bản quyền đã bị khóa! Lý do: ${license.banReason || 'Vi phạm điều khoản dịch vụ'}`,
        }),
      };
    }

    const now = new Date();

    // 4. TRƯỜNG HỢP 1: KEY MỚI CHƯA KÍCH HOẠT (FIRST-USE ACTIVATION)
    // Bắt đầu tính giờ sử dụng và khóa HWID với máy tính này
    if (license.status === 'UNACTIVATED' || !license.hwid) {
      const durationSec = Number(license.durationSeconds);
      const expiresAt = new Date(now.getTime() + durationSec * 1000);

      const sessionToken = 'SES_' + crypto.randomBytes(24).toString('hex');
      const sessionExpiry = new Date(now.getTime() + 10 * 60 * 1000); // Session sống 10 phút, gia hạn qua heartbeat

      await prisma.$transaction([
        prisma.licenseKey.update({
          where: { id: license.id },
          data: {
            status: 'ACTIVE',
            hwid: cleanHwid,
            activatedAt: now,
            expiresAt,
            isFirstUseCounted: true,
            lastHeartbeatAt: now,
            lastIp: ipAddress,
            clientVersion: client_version,
          },
        }),
        prisma.clientSession.create({
          data: {
            licenseKeyId: license.id,
            sessionToken,
            hwid: cleanHwid,
            ipAddress,
            clientVersion: client_version,
            expiresAt: sessionExpiry,
          },
        }),
      ]);

      const remainingSec = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));

      return {
        status: 200,
        body: HmacSecurityService.createSignedResponse({
          success: true,
          message: 'Kích hoạt bản quyền lần đầu thành công!',
          session_token: sessionToken,
          plan_name: license.plan.name,
          is_lifetime: license.plan.isLifetime,
          activated_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          remaining_seconds: remainingSec,
          server_time: Math.floor(now.getTime() / 1000),
        }),
      };
    }

    // 5. TRƯỜNG HỢP 2: KEY ĐÃ KÍCH HOẠT -> KIỂM TRA HWID BINDING (CHỐNG DÙNG CHUNG)
    if (license.hwid !== cleanHwid) {
      return {
        status: 403,
        body: HmacSecurityService.createSignedResponse({
          success: false,
          error_code: 'HWID_MISMATCH',
          message:
            'License Key này đã được liên kết với máy tính khác! Vui lòng vào trang Web quản lý để thực hiện "Đổi máy / Reset HWID" nếu bạn đã nâng cấp máy!',
          bound_hwid_preview: license.hwid ? `${license.hwid.slice(0, 8)}...` : '',
        }),
      };
    }

    // 6. KIỂM TRA HẾT HẠN SỬ DỤNG
    if (license.expiresAt && license.expiresAt < now) {
      if (license.status !== 'EXPIRED') {
        await prisma.licenseKey.update({
          where: { id: license.id },
          data: { status: 'EXPIRED' },
        });
      }
      return {
        status: 403,
        body: HmacSecurityService.createSignedResponse({
          success: false,
          error_code: 'KEY_EXPIRED',
          message: 'Thời hạn bản quyền của Key đã kết thúc! Vui lòng gia hạn thêm trên web để tiếp tục sử dụng.',
          expires_at: license.expiresAt.toISOString(),
        }),
      };
    }

    // 7. CẤP PHIÊN LÀM VIỆC MỚI (CLIENT SESSION)
    const sessionToken = 'SES_' + crypto.randomBytes(24).toString('hex');
    const sessionExpiry = new Date(now.getTime() + 10 * 60 * 1000);

    // Xóa session cũ của key này và tạo session mới
    await prisma.$transaction([
      prisma.clientSession.deleteMany({
        where: { licenseKeyId: license.id },
      }),
      prisma.clientSession.create({
        data: {
          licenseKeyId: license.id,
          sessionToken,
          hwid: cleanHwid,
          ipAddress,
          clientVersion: client_version,
          expiresAt: sessionExpiry,
        },
      }),
      prisma.licenseKey.update({
        where: { id: license.id },
        data: {
          lastHeartbeatAt: now,
          lastIp: ipAddress,
          clientVersion: client_version,
        },
      }),
    ]);

    const remainingSec = license.expiresAt
      ? Math.max(0, Math.floor((license.expiresAt.getTime() - now.getTime()) / 1000))
      : 315360000;

    return {
      status: 200,
      body: HmacSecurityService.createSignedResponse({
        success: true,
        message: 'Xác thực bản quyền thành công!',
        session_token: sessionToken,
        plan_name: license.plan.name,
        is_lifetime: license.plan.isLifetime,
        activated_at: license.activatedAt?.toISOString() || now.toISOString(),
        expires_at: license.expiresAt?.toISOString() || '',
        remaining_seconds: remainingSec,
        server_time: Math.floor(now.getTime() / 1000),
      }),
    };
  }

  /**
   * 2. HEARTBEAT ĐỊNH KỲ (MỖI 5 PHÚT)
   * Giữ trạng thái Online, phát hiện và đá phiên làm việc nếu phát hiện chạy trên 2 máy
   */
  public static async heartbeat(input: HeartbeatInput) {
    const { session_token, hwid, timestamp, nonce, signature, ipAddress } = input;

    // 1. Xác minh chữ ký HMAC
    const authCheck = HmacSecurityService.verifyRequest(
      {
        session_token,
        hwid,
        timestamp,
        nonce,
      },
      signature,
      timestamp,
      nonce
    );

    if (!authCheck.isValid) {
      return {
        status: 401,
        body: HmacSecurityService.createSignedResponse({
          success: false,
          error_code: 'HMAC_VERIFICATION_FAILED',
          message: authCheck.error || 'Chữ ký Heartbeat không hợp lệ',
        }),
      };
    }

    const cleanHwid = hwid.trim().toUpperCase();

    // 2. Tra cứu Session
    const session = await prisma.clientSession.findUnique({
      where: { sessionToken: session_token },
      include: {
        licenseKey: {
          include: { plan: true },
        },
      },
    });

    const now = new Date();

    if (!session) {
      return {
        status: 401,
        body: HmacSecurityService.createSignedResponse({
          success: false,
          error_code: 'SESSION_TERMINATED',
          message: 'Phiên làm việc đã bị hủy hoặc bạn đã đăng nhập ở một máy tính khác!',
        }),
      };
    }

    // 3. Kiểm tra HWID của session
    if (session.hwid !== cleanHwid) {
      return {
        status: 403,
        body: HmacSecurityService.createSignedResponse({
          success: false,
          error_code: 'HWID_HIJACK_DETECTED',
          message: 'Phát hiện mã máy không khớp với phiên làm việc đã cấp!',
        }),
      };
    }

    const key = session.licenseKey;

    // 4. Kiểm tra trạng thái Key
    if (key.status === 'BANNED') {
      return {
        status: 403,
        body: HmacSecurityService.createSignedResponse({
          success: false,
          error_code: 'KEY_BANNED',
          message: 'Key bản quyền đã bị khóa!',
        }),
      };
    }

    if (key.expiresAt && key.expiresAt < now) {
      return {
        status: 403,
        body: HmacSecurityService.createSignedResponse({
          success: false,
          error_code: 'KEY_EXPIRED',
          message: 'Thời hạn bản quyền đã hết!',
        }),
      };
    }

    // 5. Gia hạn Session thêm 10 phút và cập nhật thời điểm ping
    const newSessionExpiry = new Date(now.getTime() + 10 * 60 * 1000);
    await prisma.$transaction([
      prisma.clientSession.update({
        where: { id: session.id },
        data: {
          lastPingAt: now,
          expiresAt: newSessionExpiry,
          ipAddress,
        },
      }),
      prisma.licenseKey.update({
        where: { id: key.id },
        data: {
          lastHeartbeatAt: now,
          lastIp: ipAddress,
        },
      }),
    ]);

    const remainingSec = key.expiresAt
      ? Math.max(0, Math.floor((key.expiresAt.getTime() - now.getTime()) / 1000))
      : 315360000;

    return {
      status: 200,
      body: HmacSecurityService.createSignedResponse({
        success: true,
        session_valid: true,
        remaining_seconds: remainingSec,
        server_time: Math.floor(now.getTime() / 1000),
      }),
    };
  }

  /**
   * 3. KIỂM TRA BẢN CẬP NHẬT (CLIENT UPDATE)
   */
  public static async checkUpdate(currentVersion: string, channel: 'STABLE' | 'BETA' = 'STABLE') {
    const latestRelease = await prisma.softwareRelease.findFirst({
      where: { channel },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestRelease) {
      return {
        status: 200,
        body: HmacSecurityService.createSignedResponse({
          success: true,
          has_update: false,
          message: 'Bạn đang dùng phiên bản mới nhất.',
        }),
      };
    }

    // Kiểm tra chế độ bảo trì máy chủ
    if (latestRelease.isServerMaintenance) {
      return {
        status: 200,
        body: HmacSecurityService.createSignedResponse({
          success: true,
          maintenance: true,
          message:
            latestRelease.maintenanceMessage ||
            'Hệ thống máy chủ Auto Tiên Nghịch đang bảo trì định kỳ. Vui lòng quay lại sau ít phút!',
        }),
      };
    }

    const hasUpdate = latestRelease.version !== currentVersion;

    return {
      status: 200,
      body: HmacSecurityService.createSignedResponse({
        success: true,
        has_update: hasUpdate,
        current_version: currentVersion,
        latest_version: latestRelease.version,
        download_url: latestRelease.downloadUrl,
        file_size_bytes: Number(latestRelease.fileSizeBytes),
        sha256_checksum: latestRelease.sha256Checksum,
        is_force_update: latestRelease.isForceUpdate,
        changelog: latestRelease.changelog,
      }),
    };
  }
}
