import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const KEY = 'cairn.prefs';
const DEFAULTS = {
  showQuotes: true, // show a daily motivation quote on the dashboard
  tone: 'calm', // calm | stoic | grit | playful
};

const PrefsContext = createContext(null);

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}

export function PrefsProvider({ children }) {
  const [prefs, setPrefs] = useState(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  }, [prefs]);

  const set = useCallback((patch) => setPrefs((p) => ({ ...p, ...patch })), []);

  return <PrefsContext.Provider value={{ prefs, set }}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider');
  return ctx;
}
