import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from '../hooks/useGoals.js';
import { StatRow, StatTile } from '../components/StatTile.jsx';
import { shortDate } from '../lib/format.js';
import './History.css';

export function History() {
  const { data, isLoading } = useHistory();
  const [tab, setTab] = useState('completed');

  if (isLoading) return <div className="detail-loading"><div className="spin" /></div>;

  const list = tab === 'completed' ? data.completed : data.fellShort;

  return (
    <div>
      <div className="eyebrow screen-eyebrow">Looking back</div>
      <h1 className="screen-title">History</h1>
      <p className="screen-sub">Everything you've finished — and what each one taught you.</p>

      <StatRow>
        <StatTile value={data.summary.completed} label="completed" />
        <StatTile value={data.summary.tasksDone} label="tasks done" />
        <StatTile value={`${data.summary.onTimePct}%`} label="on time" tone="sage" />
      </StatRow>

      <div className="hist-tabs">
        <button className={tab === 'completed' ? 'on' : ''} onClick={() => setTab('completed')}>
          Completed
        </button>
        <button className={tab === 'fellShort' ? 'on' : ''} onClick={() => setTab('fellShort')}>
          Fell short
        </button>
      </div>

      {list.length === 0 ? (
        <div className="card" style={{ padding: 30, textAlign: 'center', color: 'var(--muted)' }}>
          {tab === 'completed' ? 'No finished goals yet — keep climbing.' : 'Nothing here. Nice.'}
        </div>
      ) : (
        <div className="hist-list">
          {list.map((rec) => (
            <div key={rec.id} className="card hist-card">
              <div className="hist-card-head">
                <h3>{rec.title}</h3>
                <span className={`hist-badge ${tab === 'completed' ? 'honored' : 'short'}`}>
                  {tab === 'completed' ? 'Honored' : 'Fell short'}
                </span>
              </div>
              <div className="hist-meta">
                {rec.completedAt && <span>{shortDate(rec.completedAt)}</span>}
                {rec.finishedEarlyDays > 0 && <span>· {rec.finishedEarlyDays} days early</span>}
                <span>· {rec.daysHitPct}% days hit</span>
              </div>
              {rec.reflection && <blockquote className="hist-quote">"{rec.reflection}"</blockquote>}
            </div>
          ))}
        </div>
      )}

      <Link to="/activity" className="btn btn-ghost btn-block" style={{ marginTop: 18, textAlign: 'center', textDecoration: 'none', color: 'var(--muted)' }}>
        View day-by-day activity log →
      </Link>
    </div>
  );
}
