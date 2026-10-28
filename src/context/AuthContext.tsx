'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ServerPackage } from '@/lib/server-api';
import AuthModal from '@/components/auth/AuthModal';

export interface UserSession {
  id?: string;
  auto_account: string;
  email?: string;
  balance?: number;
  total_deposited?: number;
  role?: string;
}

export interface LicenseSession {
  remainingHoursStr?: string;
  isActive?: boolean;
  totalActiveSeconds?: number;
  expiresAt?: number;
}

export type RightSidebarTab = 'overview' | 'deposit' | 'packages';

interface AuthContextType {
  user: UserSession | null;
  license: LicenseSession | null;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot';
  pendingPlan: ServerPackage | null;
  isRightSidebarOpen: boolean;
  rightSidebarTab: RightSidebarTab;
  initialDepositAmount: number;
  openAuthModal: (tab?: 'login' | 'register' | 'forgot', pendingPlan?: ServerPackage) => void;
  closeAuthModal: () => void;
  logout: () => void;
  requireAuth: (onAuthorized: (user: UserSession) => void, pendingPlan?: ServerPackage) => void;
  refreshUser: () => void;
  refreshBalance: () => Promise<number>;
  onLoginSuccess: (user: UserSession, license?: LicenseSession) => void;
  openRightSidebar: (tab?: RightSidebarTab, initialAmount?: number) => void;
  closeRightSidebar: () => void;
  toggleRightSidebar: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [license, setLicense] = useState<LicenseSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [pendingPlan, setPendingPlan] = useState<ServerPackage | null>(null);
  const [authorizedCallback, setAuthorizedCallback] = useState<((u: UserSession) => void) | null>(null);

  // Right Sidebar State
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [rightSidebarTab, setRightSidebarTab] = useState<RightSidebarTab>('overview');
  const [initialDepositAmount, setInitialDepositAmount] = useState<number>(50000);

  const refreshUser = useCallback(() => {
    try {
      const savedUser = localStorage.getItem('tn_user');
      const savedLicense = localStorage.getItem('tn_license');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
      if (savedLicense) {
        setLicense(JSON.parse(savedLicense));
      } else {
        setLicense(null);
      }
    } catch {
      setUser(null);
      setLicense(null);
    }
  }, []);

  const refreshBalance = useCallback(async (): Promise<number> => {
    try {
      const savedUserStr = localStorage.getItem('tn_user');
      if (!savedUserStr) return 0;
      const currentUser = JSON.parse(savedUserStr);
      if (!currentUser?.auto_account) return 0;

      const res = await fetch(`/api/account/balance?username=${encodeURIComponent(currentUser.auto_account)}`);
      const data = await res.json();
      if (data && data.success) {
        const newBal = Number(data.balance || 0);
        const newTot = Number(data.total_deposited || 0);
        const updatedUser: UserSession = {
          ...currentUser,
          balance: newBal,
          total_deposited: newTot,
        };
        setUser(updatedUser);
        localStorage.setItem('tn_user', JSON.stringify(updatedUser));
        if (data.remainingHoursStr) {
          setLicense((prev) => ({
            ...prev,
            remainingHoursStr: data.remainingHoursStr,
            isActive: data.isActive,
          }));
        }
        return newBal;
      }
      return currentUser.balance || 0;
    } catch {
      return 0;
    }
  }, []);

  useEffect(() => {
    refreshUser();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tn_user' || e.key === 'tn_license') {
        refreshUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshUser]);

  const openAuthModal = useCallback((tab: 'login' | 'register' | 'forgot' = 'login', plan?: ServerPackage) => {
    setAuthModalTab(tab);
    if (plan) setPendingPlan(plan);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tn_user');
    localStorage.removeItem('tn_license');
    setUser(null);
    setLicense(null);
    setPendingPlan(null);
    setAuthorizedCallback(null);
  }, []);

  const requireAuth = useCallback(
    (onAuthorized: (u: UserSession) => void, plan?: ServerPackage) => {
      const savedUser = localStorage.getItem('tn_user');
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          if (u && u.auto_account) {
            setUser(u);
            onAuthorized(u);
            return;
          }
        } catch {}
      }

      setAuthorizedCallback(() => onAuthorized);
      openAuthModal('login', plan);
    },
    [openAuthModal]
  );

  const onLoginSuccess = useCallback(
    (loggedInUser: UserSession, loggedInLicense?: LicenseSession) => {
      setUser(loggedInUser);
      if (loggedInLicense) setLicense(loggedInLicense);
      localStorage.setItem('tn_user', JSON.stringify(loggedInUser));
      if (loggedInLicense) {
        localStorage.setItem('tn_license', JSON.stringify(loggedInLicense));
      }

      if (authorizedCallback) {
        authorizedCallback(loggedInUser);
        setAuthorizedCallback(null);
      }
    },
    [authorizedCallback]
  );

  const openRightSidebar = useCallback((tab: RightSidebarTab = 'overview', initialAmount: number = 50000) => {
    setRightSidebarTab(tab);
    setInitialDepositAmount(initialAmount);
    setIsRightSidebarOpen(true);
  }, []);

  const closeRightSidebar = useCallback(() => {
    setIsRightSidebarOpen(false);
  }, []);

  const toggleRightSidebar = useCallback(() => {
    setIsRightSidebarOpen((prev) => !prev);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        license,
        isAuthModalOpen,
        authModalTab,
        pendingPlan,
        isRightSidebarOpen,
        rightSidebarTab,
        initialDepositAmount,
        openAuthModal,
        closeAuthModal,
        logout,
        requireAuth,
        refreshUser,
        refreshBalance,
        onLoginSuccess,
        openRightSidebar,
        closeRightSidebar,
        toggleRightSidebar,
      }}
    >
      {children}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialTab={authModalTab}
        pendingPlan={pendingPlan}
        onAuthSuccess={(u, lic) => {
          onLoginSuccess(u, lic);
        }}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
