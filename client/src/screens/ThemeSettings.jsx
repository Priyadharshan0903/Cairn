import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.jsx';
import './ThemeSettings.css';

const APPEARANCES = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
  { key: 'auto', label: 'Auto' },
];

const STYLES = [
  { key: 'quiet', name: 'Quiet Ledger', desc: 'Editorial serif · one accent', glyph: 'Aa' },
  { key: 'soft', name: 'Soft Cards', desc: 'Warm cards · progress rings', glyph: '◗' },
  { key: 'trailhead', name: 'Trailhead', desc: 'Journey · nodes & mono', glyph: '⋯' },
];

const ACCENTS = [
  { key: 'terracotta', color: '#b4573e' },
  { key: 'sage', color: '#6f8159' },
  { key: 'sand', color: '#b98a3d' },
  { key: 'blue', color: '#3e6f8b' },
];

export function ThemeSettings() {
  const { theme, set } = useTheme();

  return (
    <div className="theme-screen">
      <Link to="/profile" className="back-link">‹ Profile</Link>
      <div className="eyebrow screen-eyebrow">Make it yours</div>
      <h1 className="screen-title" style={{ marginBottom: 24 }}>Theme</h1>

      <div className="eyebrow settings-label">Appearance</div>
      <div className="segmented">
        {APPEARANCES.map((a) => (
          <button
            key={a.key}
            className={`seg ${theme.appearance === a.key ? 'seg-on' : ''}`}
            onClick={() => set({ appearance: a.key })}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="eyebrow settings-label" style={{ marginTop: 26 }}>Style</div>
      <div className="style-list">
        {STYLES.map((s) => (
          <button
            key={s.key}
            className={`card style-opt ${theme.style === s.key ? 'style-on' : ''}`}
            onClick={() => set({ style: s.key })}
          >
            <span className={`style-glyph glyph-${s.key}`}>{s.glyph}</span>
            <span className="style-text">
              <span className="style-name">{s.name}</span>
              <span className="style-desc">{s.desc}</span>
            </span>
            <span className="style-check">{theme.style === s.key ? '✓' : ''}</span>
          </button>
        ))}
      </div>

      <div className="eyebrow settings-label" style={{ marginTop: 26 }}>Accent</div>
      <div className="accent-row">
        {ACCENTS.map((a) => (
          <button
            key={a.key}
            className={`accent-dot ${theme.accent === a.key ? 'accent-on' : ''}`}
            style={{ '--dot': a.color }}
            onClick={() => set({ accent: a.key })}
            aria-label={a.key}
          />
        ))}
      </div>
    </div>
  );
}
