using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace TienNghichAuto.Client
{
    /// <summary>
    /// Client SDK bảo mật cao dành cho phần mềm Tiên Nghịch Auto (C# .NET)
    /// Tích hợp tính chữ ký HMAC-SHA256, Nonce, Timestamp chống Fiddler / Replay Attack / Crack API
    /// </summary>
    public class TienNghichClientAuth
    {
        private readonly string _serverBaseUrl;
        private readonly string _hmacSecret;
        private readonly HttpClient _httpClient;

        public string SessionToken { get; private set; }
        public bool IsAuthenticated { get; private set; }
        public DateTime? ExpiresAt { get; private set; }

        public TienNghichClientAuth(string serverBaseUrl, string hmacSecret)
        {
            _serverBaseUrl = serverBaseUrl.TrimEnd('/');
            _hmacSecret = hmacSecret;
            _httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(15) };
        }

        /// <summary>
        /// Tạo chữ ký số HMAC-SHA256 trên Canonical JSON
        /// </summary>
        public string ComputeHmacSignature(SortedDictionary<string, object> payload)
        {
            string jsonString = JsonSerializer.Serialize(payload);
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_hmacSecret));
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(jsonString));
            return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
        }

        /// <summary>
        /// Xác minh License Key và gán HWID
        /// </summary>
        public async Task<(bool success, string message)> VerifyLicenseAsync(string licenseKey, string hwid, string version)
        {
            try
            {
                long timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                string nonce = Guid.NewGuid().ToString("N");

                // Sắp xếp key từ A-Z đảm bảo đồng nhất chữ ký với Server
                var payload = new SortedDictionary<string, object>
                {
                    { "client_version", version },
                    { "hwid", hwid },
                    { "license_key", licenseKey },
                    { "nonce", nonce },
                    { "timestamp", timestamp }
                };

                string signature = ComputeHmacSignature(payload);

                var requestBody = new Dictionary<string, object>(payload)
                {
                    { "signature", signature }
                };

                string jsonContent = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{_serverBaseUrl}/api/v1/client/verify", content);
                string responseString = await response.Content.ReadAsStringAsync();

                using var doc = JsonDocument.Parse(responseString);
                var root = doc.RootElement;

                bool isSuccess = root.GetProperty("success").GetBoolean();
                if (isSuccess)
                {
                    SessionToken = root.GetProperty("session_token").GetString();
                    if (root.TryGetProperty("expires_at", out var expEl) && expEl.GetString() != null)
                    {
                        ExpiresAt = DateTime.Parse(expEl.GetString());
                    }
                    IsAuthenticated = true;
                    return (true, root.GetProperty("message").GetString());
                }

                string errorMsg = root.TryGetProperty("message", out var msgEl) ? msgEl.GetString() : "Xác thực thất bại";
                return (false, errorMsg);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi kết nối máy chủ bản quyền: {ex.Message}");
            }
        }

        /// <summary>
        /// Gửi Heartbeat định kỳ mỗi 5 phút để duy trì phiên làm việc
        /// </summary>
        public async Task<bool> SendHeartbeatAsync(string hwid)
        {
            if (string.IsNullOrEmpty(SessionToken)) return false;

            try
            {
                long timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                string nonce = Guid.NewGuid().ToString("N");

                var payload = new SortedDictionary<string, object>
                {
                    { "hwid", hwid },
                    { "nonce", nonce },
                    { "session_token", SessionToken },
                    { "timestamp", timestamp }
                };

                string signature = ComputeHmacSignature(payload);
                var requestBody = new Dictionary<string, object>(payload)
                {
                    { "signature", signature }
                };

                var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_serverBaseUrl}/api/v1/client/heartbeat", content);

                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }
    }
}
