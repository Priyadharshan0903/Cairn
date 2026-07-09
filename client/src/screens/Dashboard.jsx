import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useGoals, useDashboard } from '../hooks/useGoals.js';
import { StatRow, StatTile } from '../components/StatTile.jsx';
import { SortableGoalList } from '../components/SortableGoalList.jsx';
import { QuoteCard } from '../components/QuoteCard.jsx';
import { longDate, greeting } from '../lib/format.js';
import './Dashboard.css';

export function Dashboard() {
  const { user } = useAuth();
  const goals = useGoals();
  const stats = useDashboard();

  const firstName = user?.name?.split(' ')[0] || 'there';
  const list = (goals.data || []).filter((g) => g.status !== 'completed');

  return (
    <div>
      <header className="dash-head">
        <div>
          <div className="dash-date">{longDate()}</div>
          <h1 className="screen-title">
            {greeting()}, {firstName}.
          </h1>
          {stats.data && (
            <p className="screen-sub">
              {stats.data.activeCount} active goal{stats.data.activeCount === 1 ? '' : 's'}
              {stats.data.slippingCount > 0 && (
                <>
                  {' · '}
                  <span className="slipping">
                    {stats.data.slippingCount} slipping behind
                  </span>
                </>
              )}
            </p>
          )}
        </div>
        <div className="dash-actions">
          <Link to="/goals/new" className="add-goal-btn" title="New goal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Link>
          <Link to="/profile" className="avatar" title="Profile & settings">
            {firstName[0]?.toUpperCase()}
          </Link>
        </div>
      </header>

      <QuoteCard />

      {stats.data && (
        <StatRow>
          <StatTile value={`${stats.data.todayDone}/${stats.data.todayTotal}`} label="today done" />
          <StatTile value={stats.data.dayStreak} label="day streak" />
          <StatTile value={`${stats.data.avgProgress}%`} label="avg progress" tone="sage" />
        </StatRow>
      )}

      <div className="section-label">
        <span className="eyebrow">Goals · by priority</span>
        <span className="eyebrow">{list.length > 1 ? 'drag ⠿ to reorder' : ''}</span>
      </div>

      {goals.isLoading ? (
        <div className="card" style={{ padding: 40, display: 'grid', placeItems: 'center' }}>
          <div className="spin" />
        </div>
      ) : list.length === 0 ? (
        <EmptyState />
      ) : (
        <SortableGoalList goals={list} />
      )}

      <Link to="/goals/new" className="btn btn-ghost btn-block new-goal-btn">
        + New goal
      </Link>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card empty-state">
      <h3>Set your first goal</h3>
      <p>A journey of a thousand miles begins with one stone on the pile. Pick something you've been putting off.</p>
      <Link to="/goals/new" className="btn btn-accent">
        Set my first goal →
      </Link>
    </div>
  );
}
