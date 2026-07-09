import { Link } from 'react-router-dom';
import { usePrefs } from '../hooks/usePrefs.jsx';
import { TONES, quoteFor } from '../data/quotes.js';
import './Motivation.css';

export function Motivation() {
  const { prefs, set } = usePrefs();
  const preview = quoteFor(prefs.tone);

  return (
    <div className="motivation">
      <Link to="/profile" className="back-link">‹ Profile</Link>
      <div className="eyebrow screen-eyebrow">Keep the pace</div>
      <h1 className="screen-title" style={{ marginBottom: 6 }}>Motivation</h1>
      <p className="screen-sub">A gentle nudge on your dashboard, in a voice that suits you.</p>

      <div className="card mot-toggle-card">
        <div>
          <div className="mot-toggle-title">Daily motivation</div>
          <div className="mot-toggle-sub">Show a quote on your dashboard each day</div>
        </div>
        <button
          className={`switch ${prefs.showQuotes ? 'switch-on' : ''}`}
          onClick={() => set({ showQuotes: !prefs.showQuotes })}
          role="switch"
          aria-checked={prefs.showQuotes}
          aria-label="Toggle daily motivation"
        >
          <span className="switch-knob" />
        </button>
      </div>

      {prefs.showQuotes && (
        <>
          <div className="eyebrow settings-label" style={{ marginTop: 26 }}>Tone</div>
          <div className="tone-list">
            {TONES.map((t) => (
              <button
                key={t.key}
                className={`card tone-opt ${prefs.tone === t.key ? 'tone-on' : ''}`}
                onClick={() => set({ tone: t.key })}
              >
                <span className="tone-text">
                  <span className="tone-name">{t.label}</span>
                  <span className="tone-hint">{t.hint}</span>
                </span>
                <span className="tone-check">{prefs.tone === t.key ? '✓' : ''}</span>
              </button>
            ))}
          </div>

          <div className="eyebrow settings-label" style={{ marginTop: 26 }}>Preview</div>
          <div className="card mot-preview">
            <span className="quote-mark">”</span>
            <blockquote className="quote-text">{preview.text}</blockquote>
            <span className="quote-by">{preview.by ? `— ${preview.by}` : 'Cairn'}</span>
          </div>
        </>
      )}
    </div>
  );
}
