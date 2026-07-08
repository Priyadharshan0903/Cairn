import { Heatmap } from '../components/Heatmap.jsx';
import './GoalComplete.css';

/** The completion / reflection screen for a finished goal. */
export function CompletionCard({ goal, onBack }) {
  const c = goal.completion || {};
  return (
    <div className="complete">
      {onBack && (
        <button className="back-link" onClick={onBack} style={{ background: 'none', border: 'none' }}>
          ‹ History
        </button>
      )}

      <div className="complete-hero">
        <div className="complete-check">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--sage-deep)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5L9.5 18L20 6.5" />
          </svg>
        </div>
        <div className="eyebrow" style={{ color: '#e9ecdc' }}>Goal completed</div>
        <h1 className="complete-title">{goal.title}</h1>
        {c.finishedEarlyDays > 0 && (
          <span className="complete-early">
            Finished {c.finishedEarlyDays} {c.finishedEarlyDays === 1 ? 'day' : 'days'} early ⚡
          </span>
        )}
      </div>

      <div className="complete-panel card">
        <div className="complete-stats">
          <div>
            <div className="cs-value">{goal.progressValue}<span>{goal.unitLabel === 'books' ? '' : 'd'}</span></div>
            <div className="cs-label">actual</div>
          </div>
          <div>
            <div className="cs-value">{goal.target}<span>{goal.unitLabel === 'books' ? '' : 'd'}</span></div>
            <div className="cs-label">planned</div>
          </div>
          <div>
            <div className="cs-value cs-accent">{c.daysHitPct ?? 0}<span>%</span></div>
            <div className="cs-label">days hit</div>
          </div>
        </div>

        {c.dailyTrack?.length > 0 && (
          <>
            <div className="eyebrow complete-sub">Daily track · what I did</div>
            <Heatmap days={c.dailyTrack} />
          </>
        )}

        {c.reflection && (
          <>
            <div className="eyebrow complete-sub">What I learned</div>
            <blockquote className="complete-quote">"{c.reflection}"</blockquote>
          </>
        )}
      </div>
    </div>
  );
}
