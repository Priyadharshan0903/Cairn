import { useState } from 'react';
import { usePrefs } from '../hooks/usePrefs.jsx';
import { quoteFor } from '../data/quotes.js';
import './QuoteCard.css';

/** A gentle daily motivation quote, shown on the dashboard when enabled. */
export function QuoteCard() {
  const { prefs } = usePrefs();
  const [offset, setOffset] = useState(0);

  if (!prefs.showQuotes) return null;

  const quote = quoteFor(prefs.tone, offset);

  return (
    <div className="card quote-card">
      <span className="quote-mark">”</span>
      <blockquote className="quote-text">{quote.text}</blockquote>
      <div className="quote-foot">
        <span className="quote-by">{quote.by ? `— ${quote.by}` : 'Cairn'}</span>
        <button className="quote-refresh" onClick={() => setOffset((o) => o + 1)} title="Another one" aria-label="Show another quote">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
