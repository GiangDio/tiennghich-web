'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('tn_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Default to light frosted theme
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('tn_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-slate-200 bg-white/80" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Chuyển đổi giao diện sáng tối"
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300/80 bg-white/90 text-slate-700 shadow-xs transition-all hover:bg-slate-100 hover:text-blood-600 dark:border-slate-700 dark:bg-slate-800/90 dark:text-amber-400 dark:hover:bg-slate-700"
      title={theme === 'light' ? 'Chuyển sang Giao Diện Tối (Ma Đạo)' : 'Chuyển sang Giao Diện Sáng Đục (Tiên Khí)'}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-slate-700 transition-transform hover:-rotate-12" />
      ) : (
        <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
      )}
    </button>
  );
}
