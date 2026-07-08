import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const KEY = 'cairn.theme';
const DEFAULTS = { appearance: 'light', accent: 'terracotta', style: 'quiet' };

const ThemeContext = createContext(null);

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}

/** Resolve 'auto' appearance against the OS setting. */
function resolveAppearance(appearance) {
  if (appearance === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return appearance;
}

function apply(theme) {
  const root = document.documentElement;
  root.dataset.theme = resolveAppearance(theme.appearance);
  root.dataset.accent = theme.accent;
  root.dataset.style = theme.style;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(load);

  useEffect(() => {
    apply(theme);
    localStorage.setItem(KEY, JSON.stringify(theme));
  }, [theme]);

  // React to OS theme changes while in 'auto'.
  useEffect(() => {
    if (theme.appearance !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply(theme);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const set = useCallback((patch) => setTheme((t) => ({ ...t, ...patch })), []);

  return <ThemeContext.Provider value={{ theme, set }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

/** Apply the persisted theme before React mounts (avoids a flash). */
export function bootstrapTheme() {
  apply(load());
}
