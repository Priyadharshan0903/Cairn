import { Link } from 'react-router-dom';
import { useActivity } from '../hooks/useGoals.js';
import { EMOTES, longDate, todayStr } from '../lib/format.js';
import './ActivityLog.css';

function dayHeading(dateStr) {
  const today = todayStr();
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (dateStr === today) return 'Today';
  if (dateStr === todayStr(y)) return 'Yesterday';
  return longDate(dateStr + 'T00:00:00');
}

export function ActivityLog() {
  const { data: days, isLoading } = useActivity();

  return (
    <div>
      <Link to="/history" className="back-link">‹ History</Link>
      <div className="eyebrow screen-eyebrow">Day by day</div>
      <h1 className="screen-title">Activity log</h1>
      <p className="screen-sub">Every check-off, and how it felt.</p>

      {isLoading ? (
        <div className="detail-loading"><div className="spin" /></div>
      ) : days.length === 0 ? (
        <div className="card" style={{ padding: 30, textAlign: 'center', color: 'var(--muted)' }}>
          Nothing logged yet. Check off a task to start your streak.
        </div>
      ) : (
        days.map((day) => (
          <section key={day.date} className="log-day">
            <div className="log-day-head">
              <span className="eyebrow">{dayHeading(day.date)}</span>
              <span className="log-count">{day.tasks.length} done</span>
            </div>
            <div className="card log-list">
              {day.tasks.map((t) => (
                <div key={t.id} className="log-item">
                  <span className="log-check">✓</span>
                  <div className="log-body">
                    <div className="log-title">{t.title}</div>
                    {t.goal && <div className="log-goal">{t.goal.title}</div>}
                  </div>
                  {t.emote && <span className="log-emote">{EMOTES[t.emote]}</span>}
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
