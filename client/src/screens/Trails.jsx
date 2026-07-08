import { Link } from 'react-router-dom';
import { useGoals } from '../hooks/useGoals.js';
import './Trails.css';

/**
 * Journey view — each goal is a trail. Dots are days; the filled dot is where
 * you are, the flag is where you "should be". Ahead = past the flag.
 */
export function Trails() {
  const { data: goals, isLoading } = useGoals();
  const active = (goals || []).filter((g) => g.status !== 'completed');

  return (
    <div>
      <div className="eyebrow screen-eyebrow" style={{ color: 'var(--terracotta)' }}>In progress</div>
      <h1 className="screen-title">{active.length} trail{active.length === 1 ? '' : 's'} open</h1>
      <p className="screen-sub">Each dot is a day. The flag is where you should be.</p>

      {isLoading ? (
        <div className="detail-loading"><div className="spin" /></div>
      ) : active.length === 0 ? (
        <div className="card" style={{ padding: 30, textAlign: 'center', color: 'var(--muted)' }}>
          No open trails. Blaze a new one below.
        </div>
      ) : (
        <div className="trail-list">
          {active.map((g, i) => (
            <Trail key={g.id} goal={g} index={i} />
          ))}
        </div>
      )}

      <Link to="/goals/new" className="btn btn-accent btn-block" style={{ marginTop: 20, textAlign: 'center', textDecoration: 'none' }}>
        Blaze a new trail
      </Link>
    </div>
  );
}

function Trail({ goal, index }) {
  const { pace } = goal;
  const actualLeft = Math.round(pace.actualPct * 100);
  const flagLeft = Math.round(pace.targetPct * 100);
  const behind = pace.status === 'behind';

  return (
    <Link to={`/goals/${goal.id}`} className="card trail">
      <div className="trail-head">
        <span className="trail-num">{String(index + 1).padStart(2, '0')}</span>
        <span className="trail-title">{goal.title}</span>
      </div>

      <div className="trail-path">
        <div className="trail-line" />
        <div className="trail-line-done" style={{ width: `${actualLeft}%`, background: behind ? 'var(--terracotta)' : 'var(--sage)' }} />
        <div className="trail-flag" style={{ left: `${flagLeft}%` }}>⚑</div>
        <div className="trail-pos" style={{ left: `${actualLeft}%`, background: behind ? 'var(--terracotta)' : 'var(--sage)' }} />
      </div>

      <div className="trail-foot">
        <span>day {pace.dayIndex} / {pace.totalDays}</span>
        <span className={behind ? 'behind' : 'ahead'}>
          {pace.status === 'ontrack' ? 'on the flag' : `${Math.abs(pace.paceDays)} ${behind ? 'behind' : 'ahead of'} flag`}
        </span>
      </div>
    </Link>
  );
}
