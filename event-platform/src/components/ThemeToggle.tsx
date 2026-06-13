'use client';

import { useEffect, useState } from 'react';

const THEME_PRESETS = [
  { name: 'Mist Cyan', base: '#e8f4f8', accent: '#0891b2' },
  { name: 'Lavender', base: '#f3e8ff', accent: '#a855f7' },
  { name: 'Rose', base: '#ffe4e6', accent: '#ec4899' },
  { name: 'Amber', base: '#fef3c7', accent: '#d97706' },
  { name: 'Slate', base: '#f1f5f9', accent: '#64748b' },
];

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleDarkMode = () => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark');
      setIsDark(!isDark);
    }
  };

  const setTheme = (base: string, accent: string) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--color-base', base);
      document.documentElement.style.setProperty('--color-accent', accent);
      setShowPresets(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md border border-accent/30 hover:bg-accent/10 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="p-2 rounded-md border border-accent/30 hover:bg-accent/10 transition-colors"
          aria-label="Theme presets"
        >
          🎨
        </button>
      </div>

      {showPresets && (
        <div className="absolute right-0 mt-2 p-3 rounded-lg bg-white dark:bg-slate-800 border border-accent/20 shadow-lg z-50">
          <div className="text-xs font-semibold mb-3 opacity-60">Themes</div>
          <div className="space-y-2">
            {THEME_PRESETS.map((theme) => (
              <button
                key={theme.name}
                onClick={() => setTheme(theme.base, theme.accent)}
                className="block w-full text-left text-sm px-2 py-1 rounded hover:bg-accent/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-accent"
                    style={{ backgroundColor: theme.accent }}
                  />
                  {theme.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
