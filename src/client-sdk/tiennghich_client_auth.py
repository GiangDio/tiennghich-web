# -*- coding: utf-8 -*-
"""
Tiên Nghịch Auto - Python Client Security SDK
Hỗ trợ ký số HMAC-SHA256, Nonce, Timestamp chống Replay & Man-in-the-Middle Attack
"""

import hmac
import hashlib
import json
import time
import uuid
import urllib.request
import urllib.error

class TienNghichClientAuth:
    def __init__(self, server_url: str, hmac_secret: str):
        self.server_url = server_url.rstrip('/')
        self.hmac_secret = hmac_secret.encode('utf-8')
        self.session_token = None
        self.expires_at = None
        self.is_authenticated = False

    def compute_signature(self, payload: dict) -> str:
        # Sắp xếp key từ A-Z theo chuẩn Canonical JSON
        canonical_json = json.dumps(payload, sort_keys=True, separators=(',', ':'))
        return hmac.new(self.hmac_secret, canonical_json.encode('utf-8'), hashlib.sha256).hexdigest()

    def verify_license(self, license_key: str, hwid: str, version: str = "3.1.0") -> tuple[bool, str]:
        timestamp = int(time.time())
        nonce = uuid.uuid4().hex

        payload = {
            "client_version": version,
            "hwid": hwid,
            "license_key": license_key,
            "nonce": nonce,
            "timestamp": timestamp
        }

        signature = self.compute_signature(payload)
        payload["signature"] = signature

        try:
            req = urllib.request.Request(
                f"{self.server_url}/api/v1/client/verify",
                data=json.dumps(payload).encode('utf-8'),
                headers={"Content-Type": "application/json", "User-Agent": f"TienNghichTool/{version}"}
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if data.get("success"):
                    self.session_token = data.get("session_token")
                    self.expires_at = data.get("expires_at")
                    self.is_authenticated = True
                    return True, data.get("message", "Xác thực thành công!")
                return False, data.get("message", "Xác thực thất bại!")
        except urllib.error.HTTPError as e:
            try:
                err_data = json.loads(e.read().decode('utf-8'))
                return False, err_data.get("message", f"HTTP Error {e.code}")
            except Exception:
                return False, f"Lỗi HTTP {e.code}"
        except Exception as ex:
            return False, f"Lỗi kết nối máy chủ: {ex}"

    def heartbeat(self, hwid: str) -> bool:
        if not self.session_token:
            return False

        timestamp = int(time.time())
        nonce = uuid.uuid4().hex

        payload = {
            "hwid": hwid,
            "nonce": nonce,
            "session_token": self.session_token,
            "timestamp": timestamp
        }

        signature = self.compute_signature(payload)
        payload["signature"] = signature

        try:
            req = urllib.request.Request(
                f"{self.server_url}/api/v1/client/heartbeat",
                data=json.dumps(payload).encode('utf-8'),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                return bool(data.get("success"))
        except Exception:
            return False
