'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Wallet,
  CreditCard,
  Flame,
  CheckCircle,
  Copy,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  RefreshCw,
  Crown,
  ChevronRight,
  Clock,
  Layers,
  PanelLeftClose,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SERVER_PACKAGES_LIST, AutoPackage, CreateOrderResponse } from '@/lib/server-api';

export default function RightSidebar() {
  const {
    user,
    license,
    isRightSidebarOpen,
    rightSidebarTab,
    initialDepositAmount,
    closeRightSidebar,
    openRightSidebar,
    refreshBalance,
    openAuthModal,
    updateUserEmail,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'packages'>('overview');
  const [depositMethod, setDepositMethod] = useState<'bank' | 'card'>('bank');

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<number>(50000);
  const [customAmountInput, setCustomAmountInput] = useState<string>('50.000');
  const [isCreatingDeposit, setIsCreatingDeposit] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [activeDepositOrder, setActiveDepositOrder] = useState<CreateOrderResponse | null>(null);
  const [depositSuccess, setDepositSuccess] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Buy Package State
  const [buyingPlanId, setBuyingPlanId] = useState<string | null>(null);
  const [purchaseMsg, setPurchaseMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Email Update State
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailSaveMsg, setEmailSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const hasRealEmail = Boolean(user?.email && !user.email.includes('@tiennghichauto.vn') && user.email.trim() !== '');

  const handleSaveEmail = async () => {
    if (!user) return;
    const cleanEmail = newEmailInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setEmailSaveMsg({ type: 'error', text: 'Vui lòng nhập đúng định dạng Gmail (ví dụ: name@gmail.com)!' });
      return;
    }
    setEmailSaving(true);
    setEmailSaveMsg(null);
    try {
      const res = await fetch('/api/account/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.auto_account,
          email: cleanEmail,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        updateUserEmail(cleanEmail);
        setIsEditingEmail(false);
        setNewEmailInput('');
        setEmailSaveMsg({ type: 'success', text: 'Cập nhật Gmail thành công!' });
        setTimeout(() => setEmailSaveMsg(null), 3000);
      } else {
        setEmailSaveMsg({ type: 'error', text: data.error || 'Cập nhật Gmail thất bại.' });
      }
    } catch {
      setEmailSaveMsg({ type: 'error', text: 'Lỗi kết nối máy chủ.' });
    } finally {
      setEmailSaving(false);
    }
  };

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize tab and initial amount from context
  useEffect(() => {
    if (isRightSidebarOpen) {
      setActiveTab(rightSidebarTab);
      if (initialDepositAmount) {
        setDepositAmount(initialDepositAmount);
        setCustomAmountInput(initialDepositAmount.toLocaleString('vi-VN'));
      }
      setPurchaseMsg(null);
    } else {
      // Clear poll interval when closed
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }
  }, [isRightSidebarOpen, rightSidebarTab, initialDepositAmount]);

  // Clean up poll on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAmountSelect = (amount: number) => {
    setDepositAmount(amount);
    setCustomAmountInput(amount.toLocaleString('vi-VN'));
    setDepositError(null);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const num = parseInt(rawVal, 10) || 0;
    setDepositAmount(num);
    setCustomAmountInput(num > 0 ? num.toLocaleString('vi-VN') : '');
    if (num > 0 && num < 10000) {
      setDepositError('Số tiền nạp tối thiểu là 10.000 VNĐ');
    } else {
      setDepositError(null);
    }
  };

  // Create VietQR Deposit Order
  const handleCreateDeposit = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (depositAmount < 10000) {
      setDepositError('Số tiền nạp tối thiểu là 10.000 VNĐ');
      return;
    }

    setIsCreatingDeposit(true);
    setDepositError(null);
    setDepositSuccess(false);

    try {
      const res = await fetch('/api/deposit/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.auto_account,
          amount: depositAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.order_id) {
        setDepositError(data.error || 'Không thể tạo mã VietQR lúc này. Vui lòng thử lại.');
        setIsCreatingDeposit(false);
        return;
      }

      setActiveDepositOrder(data);
      setIsCreatingDeposit(false);

      // Start polling deposit status every 2.5s
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/deposit/status?order_id=${encodeURIComponent(data.order_id)}`);
          const statusData = await statusRes.json();
          if (statusData && statusData.status === 'PAID') {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            setDepositSuccess(true);
            setActiveDepositOrder(null);
            await refreshBalance();
          }
        } catch {
          // ignore transient poll errors
        }
      }, 2500);
    } catch {
      setDepositError('Lỗi kết nối máy chủ nạp tiền. Vui lòng kiểm tra lại mạng.');
      setIsCreatingDeposit(false);
    }
  };

  // Buy Package with Account Balance
  const handleBuyPackage = async (pkg: AutoPackage) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    const currentBal = user.balance || 0;
    if (currentBal < pkg.price) {
      const needed = pkg.price - currentBal;
      setPurchaseMsg({
        type: 'error',
        text: `Số dư không đủ! Bạn có ${currentBal.toLocaleString('vi-VN')} đ, còn thiếu ${needed.toLocaleString('vi-VN')} đ để mua ${pkg.name}.`,
      });
      return;
    }

    setBuyingPlanId(pkg.id);
    setPurchaseMsg(null);

    try {
      const res = await fetch('/api/account/buy-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.auto_account,
          plan_id: pkg.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPurchaseMsg({
          type: 'success',
          text: `🎉 Kích hoạt thành công ${data.plan_name || pkg.name}! Đã cộng thời gian vào tài khoản.`,
        });
        await refreshBalance();
      } else {
        setPurchaseMsg({
          type: 'error',
          text: data.error || 'Không thể thanh toán gói bằng số dư.',
        });
      }
    } catch {
      setPurchaseMsg({
        type: 'error',
        text: 'Lỗi kết nối máy chủ mua gói.',
      });
    } finally {
      setBuyingPlanId(null);
    }
  };

  if (!isRightSidebarOpen) return null;

  const currentBal = user?.balance || 0;
  const currentTotalDep = user?.total_deposited || 0;
  const userRank = user
    ? currentTotalDep >= 500000
      ? 'Tu Sĩ VIP 👑'
      : currentTotalDep >= 100000
      ? 'Đạo Hữu Thân Thiết ⭐'
      : 'Thành Viên Mới 🌟'
    : 'Chưa Đăng Nhập 👤';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeRightSidebar}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-over panel on the LEFT */}
      <aside className="absolute inset-y-0 left-0 flex max-w-full pr-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md">
            {/* Nút thu gọn thanh trái để riêng góc trái */}
            <button
              onClick={closeRightSidebar}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blood-500/30 bg-blood-50/80 dark:bg-blood-950/40 text-blood-700 dark:text-blood-300 hover:bg-blood-100 dark:hover:bg-blood-900/60 shadow-xs transition-all active:scale-95"
              title="Thu gọn thanh bên trái"
            >
              <PanelLeftClose className="h-4 w-4 text-blood-600 dark:text-blood-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-black">Thu Gọn</span>
            </button>

            {/* Account Title in Center */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blood-600 to-amber-600 text-white shadow-xs">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Bảng Điều Khiển
                </h2>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[120px]">
                  {user ? user.auto_account : 'Khách vãng lai'}
                </p>
              </div>
            </div>

            {/* Quick close button on far right */}
            <button
              onClick={closeRightSidebar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Đóng bảng"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50 p-1 m-3 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 text-xs font-black rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-slate-900 text-blood-600 dark:text-blood-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📊 Tổng Quan
            </button>
            <button
              onClick={() => setActiveTab('deposit')}
              className={`py-2 px-1 text-xs font-black rounded-lg transition-all ${
                activeTab === 'deposit'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              💳 Nạp Tiền
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`py-2 px-1 text-xs font-black rounded-lg transition-all ${
                activeTab === 'packages'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              💎 Mua Gói Giờ
            </button>
          </div>

          {/* Body Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
            {/* 4 Metric Cards (Sub1sVN Dashboard Style) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Card 1: Số Dư */}
              <div className="rounded-xl p-3 border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent">
                <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Số Dư Hiện Tại</span>
                  <Wallet className="h-3.5 w-3.5" />
                </div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {currentBal.toLocaleString('vi-VN')} đ
                </div>
                <div className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Dùng để mua mọi gói cước
                </div>
              </div>

              {/* Card 2: Tổng Nạp */}
              <div className="rounded-xl p-3 border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent">
                <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Tổng Đã Nạp</span>
                  <Crown className="h-3.5 w-3.5" />
                </div>
                <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-1">
                  {currentTotalDep.toLocaleString('vi-VN')} đ
                </div>
                <div className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Tích lũy tăng hạng VIP
                </div>
              </div>

              {/* Card 3: Cấp Bậc */}
              <div className="rounded-xl p-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Cấp Bậc</span>
                  <Sparkles className="h-3.5 w-3.5 text-blood-500" />
                </div>
                <div className="text-xs font-black text-slate-900 dark:text-white mt-1 truncate">
                  {userRank}
                </div>
                <div className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {user ? 'Hệ thống Tiên Nghịch' : 'Chưa đăng nhập'}
                </div>
              </div>

              {/* Card 4: Quỹ Giờ Auto */}
              <div className="rounded-xl p-3 border border-blood-500/30 bg-gradient-to-br from-blood-500/10 via-blood-500/5 to-transparent">
                <div className="text-[10px] font-bold text-blood-700 dark:text-blood-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Quỹ Giờ Auto</span>
                  <Clock className="h-3.5 w-3.5 text-blood-600" />
                </div>
                <div className="text-xs font-black text-blood-600 dark:text-blood-400 mt-1 truncate">
                  {license?.remainingHoursStr || '0 giờ'}
                </div>
                <div className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Chỉ trừ khi chạy game
                </div>
              </div>
            </div>

            {/* Quick Action: If not logged in */}
            {!user && (
              <div className="rounded-xl border border-amber-300 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-amber-900 dark:text-amber-200">
                    Chưa đăng nhập tài khoản!
                  </div>
                  <div className="text-[10.5px] text-amber-700 dark:text-amber-400">
                    Đăng nhập để giữ số dư và mua gói tức thì.
                  </div>
                </div>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-sm"
                >
                  Đăng Nhập
                </button>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 1: TỔNG QUAN TÀI KHOẢN */}
            {/* ============================================================ */}
            {activeTab === 'overview' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Warning Banner if No Gmail configured yet */}
                {user && !hasRealEmail && (
                  <div className="rounded-xl border border-amber-400 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-3 space-y-1.5 dark:border-amber-500/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                        Chưa cập nhật Gmail bảo mật!
                      </span>
                      <button
                        onClick={() => {
                          setIsEditingEmail(true);
                          setNewEmailInput('');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black transition"
                      >
                        Thêm Ngay
                      </button>
                    </div>
                    <p className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-snug">
                      Tài khoản của bạn chưa có Gmail. Vui lòng thêm Gmail để nhận mã OTP lấy lại mật khẩu và có thể đăng nhập bằng Gmail bất cứ lúc nào!
                    </p>
                  </div>
                )}

                {/* Account Details Box */}
                {user ? (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Tên tài khoản Auto:</span>
                      <span className="text-xs font-black text-blood-600 dark:text-blood-400">
                        🔑 {user.auto_account}
                      </span>
                    </div>

                    {/* Email Row with Edit / Add Button */}
                    <div className="border-b border-slate-100 dark:border-slate-700/60 pb-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Gmail bảo mật:</span>
                        <div className="flex items-center gap-1.5">
                          {hasRealEmail ? (
                            <>
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                📧 {user.email}
                              </span>
                              <button
                                onClick={() => {
                                  setIsEditingEmail(!isEditingEmail);
                                  setNewEmailInput(user.email || '');
                                }}
                                className="text-[10px] font-bold text-blood-600 dark:text-blood-400 underline hover:opacity-80 ml-1"
                              >
                                {isEditingEmail ? 'Hủy' : 'Đổi'}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setIsEditingEmail(true);
                                setNewEmailInput('');
                              }}
                              className="px-2 py-0.5 rounded bg-amber-500 text-white font-bold text-[10.5px] hover:bg-amber-600 transition"
                            >
                              + Thêm Gmail
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inline Input when editing or adding email */}
                      {isEditingEmail && (
                        <div className="mt-2.5 space-y-1.5 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
                            Nhập địa chỉ Gmail để nhận mã OTP khôi phục mật khẩu & đăng nhập:
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="email"
                              value={newEmailInput}
                              onChange={(e) => setNewEmailInput(e.target.value)}
                              placeholder="ví dụ: daohuutoan@gmail.com"
                              className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blood-500"
                            />
                            <button
                              onClick={handleSaveEmail}
                              disabled={emailSaving}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black disabled:opacity-50 transition"
                            >
                              {emailSaving ? 'Đang lưu...' : 'Lưu'}
                            </button>
                          </div>
                        </div>
                      )}
                      {emailSaveMsg && (
                        <div
                          className={`text-[10.5px] font-bold mt-1.5 ${
                            emailSaveMsg.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                          }`}
                        >
                          {emailSaveMsg.text}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Số dư khả dụng:</span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        💰 {currentBal.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Trạng thái Auto:</span>
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded ${
                          license?.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}
                      >
                        {license?.isActive ? 'ĐANG KÍCH HOẠT' : 'HẾT GIỜ / CHƯA NẠP'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    Vui lòng đăng nhập để xem thông tin chi tiết tài khoản của bạn.
                  </div>
                )}

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTab('deposit')}
                    className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md transition"
                  >
                    <CreditCard className="h-4 w-4" /> Nạp Thêm Tiền
                  </button>
                  <button
                    onClick={() => setActiveTab('packages')}
                    className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r from-blood-600 to-amber-600 hover:from-blood-700 hover:to-amber-700 text-white font-black text-xs shadow-md transition"
                  >
                    <Flame className="h-4 w-4 text-amber-200" /> Mua Gói Cước
                  </button>
                </div>

                {/* Notice Box */}
                <div className="rounded-xl p-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">💡 Lưu ý quan trọng:</div>
                  <div>• Hệ thống nạp tiền và cộng số dư hoàn toàn tự động 24/7 qua VietQR PayOS.</div>
                  <div>• Số dư không bao giờ hết hạn, có thể mua bất kỳ gói cước nào tùy ý.</div>
                  <div>• Giờ auto chỉ bị trừ khi bạn bật nút khởi động auto trong game.</div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 2: NẠP TIỀN VÀO TÀI KHOẢN (NGÂN HÀNG & THẺ CÀO) */}
            {/* ============================================================ */}
            {activeTab === 'deposit' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Deposit Method Selector */}
                <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 p-1 bg-slate-100 dark:bg-slate-800/60">
                  <button
                    onClick={() => setDepositMethod('bank')}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${
                      depositMethod === 'bank'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    🏦 Nạp Ngân Hàng (Tự Động 24/7)
                  </button>
                  <button
                    onClick={() => setDepositMethod('card')}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
                      depositMethod === 'card'
                        ? 'bg-slate-700 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    💳 Thẻ Cào
                    <span className="text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1 py-0.2 rounded font-black">
                      Sắp có
                    </span>
                  </button>
                </div>

                {/* METHOD 1: BANK TRANSFER (VIETQR PAYOS) */}
                {depositMethod === 'bank' && (
                  <div className="space-y-4">
                    {/* Success Notice if just paid */}
                    {depositSuccess && (
                      <div className="rounded-xl border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 p-4 text-center space-y-2 animate-in zoom-in-95">
                        <div className="text-3xl">🎉</div>
                        <div className="text-sm font-black text-emerald-800 dark:text-emerald-300">
                          NẠP TIỀN THÀNH CÔNG!
                        </div>
                        <div className="text-xs text-emerald-700 dark:text-emerald-400">
                          Hệ thống đã tự động cộng tiền vào số dư tài khoản của bạn.
                        </div>
                        <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                          Số dư mới: {currentBal.toLocaleString('vi-VN')} đ
                        </div>
                        <button
                          onClick={() => {
                            setDepositSuccess(false);
                            setActiveTab('packages');
                          }}
                          className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs mt-2"
                        >
                          👉 Đi Đến Mục Mua Gói Cước
                        </button>
                      </div>
                    )}

                    {/* Active Order with QR */}
                    {activeDepositOrder && !depositSuccess && (
                      <div className="rounded-xl border border-emerald-500/40 bg-white dark:bg-slate-800 p-4 shadow-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                            ĐANG CHỜ THANH TOÁN
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {activeDepositOrder.order_id}
                          </span>
                        </div>

                        {/* VietQR Image */}
                        <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                          <img
                            src={activeDepositOrder.qr_url}
                            alt="VietQR nạp tiền"
                            className="w-48 h-48 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 bg-white p-1.5"
                          />
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 text-center">
                            Mở App Ngân Hàng bất kỳ & quét mã QR để thanh toán tự động
                          </p>
                        </div>

                        {/* Bank Transfer Details */}
                        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3 space-y-2 text-xs border border-slate-200/80 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Ngân hàng:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {activeDepositOrder.bank_info?.bank_name || 'MB Bank'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Số tài khoản:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-black text-slate-900 dark:text-white">
                                {activeDepositOrder.bank_info?.account_no}
                              </span>
                              <button
                                onClick={() => handleCopy(activeDepositOrder.bank_info.account_no, 'stk')}
                                className="text-blood-600 p-0.5 hover:opacity-80"
                                title="Sao chép STK"
                              >
                                {copiedKey === 'stk' ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Chủ tài khoản:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {activeDepositOrder.bank_info?.account_name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Số tiền:</span>
                            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                              {activeDepositOrder.amount?.toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-1.5">
                            <span className="text-slate-500 font-bold">Nội dung CK:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-black text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded">
                                {activeDepositOrder.transfer_content}
                              </span>
                              <button
                                onClick={() => handleCopy(activeDepositOrder.transfer_content, 'content')}
                                className="text-blood-600 p-0.5 hover:opacity-80"
                                title="Sao chép nội dung"
                              >
                                {copiedKey === 'content' ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                              setActiveDepositOrder(null);
                            }}
                            className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            Đổi Số Tiền Khác
                          </button>
                          <button
                            onClick={refreshBalance}
                            className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1"
                          >
                            <RefreshCw className="h-3.5 w-3.5" /> Kiểm Tra Ngay
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Deposit Form (Amount selection & custom input) */}
                    {!activeDepositOrder && !depositSuccess && (
                      <div className="space-y-4">
                        {/* Quick Amount Chips */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Chọn nhanh số tiền nạp:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[10000, 20000, 50000, 100000, 200000, 500000].map((amt) => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => handleAmountSelect(amt)}
                                className={`py-2 px-1 text-xs font-black rounded-xl border transition-all text-center ${
                                  depositAmount === amt
                                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 shadow-xs'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                                }`}
                              >
                                {amt >= 1000 ? `${amt / 1000}k` : amt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Custom Amount Input */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Hoặc nhập số tiền tùy ý (Tối thiểu 10.000 VNĐ):
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={customAmountInput}
                              onChange={handleCustomAmountChange}
                              placeholder="Ví dụ: 50.000"
                              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-black text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                              VNĐ
                            </span>
                          </div>
                          {depositError && (
                            <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> {depositError}
                            </p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <button
                          onClick={handleCreateDeposit}
                          disabled={isCreatingDeposit || depositAmount < 10000}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
                        >
                          {isCreatingDeposit ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" /> Đang tạo mã VietQR...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4" /> Tạo Mã VietQR Nạp {depositAmount.toLocaleString('vi-VN')} đ
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* METHOD 2: THẺ CÀO (ĐANG PHÁT TRIỂN) */}
                {depositMethod === 'card' && (
                  <div className="rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 p-5 text-center space-y-3">
                    <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <CreditCard className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-amber-900 dark:text-amber-200">
                        CỔNG NẠP THẺ CÀO ĐANG PHÁT TRIỂN ⏳
                      </h4>
                      <p className="text-xs text-amber-800 dark:text-amber-400 mt-1.5 leading-relaxed">
                        Hệ thống gạch thẻ cào tự động (Viettel, Vinaphone, Mobifone, Zing, Garena) đang được kết nối và kiểm thử bảo mật.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 text-left text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Khuyên dùng nạp qua Ngân hàng:
                      </div>
                      <div>• Chiết khấu 0% (Nạp 10k nhận đủ 10k vào số dư).</div>
                      <div>• Quét mã VietQR tự động cộng tiền trong 2 giây.</div>
                    </div>

                    <button
                      onClick={() => setDepositMethod('bank')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition"
                    >
                      👉 Chuyển Sang Nạp Ngân Hàng (Tự Động)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 3: MUA GÓI CƯỚC BẰNG SỐ DƯ */}
            {/* ============================================================ */}
            {activeTab === 'packages' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Chọn gói cần mua để thanh toán trực tiếp bằng số dư tài khoản:
                </div>

                {/* Purchase Alert Message */}
                {purchaseMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                      purchaseMsg.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-500'
                        : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-500'
                    }`}
                  >
                    {purchaseMsg.type === 'success' ? (
                      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                    )}
                    <span>{purchaseMsg.text}</span>
                  </div>
                )}

                {/* List 5 Packages */}
                <div className="space-y-2.5">
                  {SERVER_PACKAGES_LIST.map((pkg) => {
                    const isEnough = currentBal >= pkg.price;
                    const missing = pkg.price - currentBal;

                    return (
                      <div
                        key={pkg.id}
                        className={`rounded-xl p-3 border transition-all ${
                          pkg.isPopular
                            ? 'border-blood-500 bg-blood-50/20 dark:bg-blood-950/10 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-900 dark:text-white">
                                {pkg.name}
                              </span>
                              {pkg.badge && (
                                <span className="text-[9.5px] font-black bg-blood-600/10 text-blood-600 border border-blood-600/20 px-1.5 py-0.2 rounded">
                                  {pkg.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {pkg.description}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-black text-blood-600 dark:text-blood-400">
                              {pkg.price.toLocaleString('vi-VN')} đ
                            </div>
                            {pkg.originalPrice > pkg.price && (
                              <div className="text-[10px] text-slate-400 line-through">
                                {pkg.originalPrice.toLocaleString('vi-VN')} đ
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {pkg.active_hours}h Auto • {pkg.validity_days} ngày
                          </span>

                          {isEnough ? (
                            <button
                              onClick={() => handleBuyPackage(pkg)}
                              disabled={buyingPlanId === pkg.id}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs shadow-sm transition flex items-center gap-1"
                            >
                              {buyingPlanId === pkg.id ? (
                                <>
                                  <RefreshCw className="h-3 w-3 animate-spin" /> Đang mua...
                                </>
                              ) : (
                                <>
                                  <Zap className="h-3 w-3" /> Mua Bằng Số Dư
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => openRightSidebar('deposit', missing)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-amber-500 hover:text-white text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1"
                              title={`Thiếu ${missing.toLocaleString('vi-VN')} đ`}
                            >
                              <span>Thiếu {missing.toLocaleString('vi-VN')} đ</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
