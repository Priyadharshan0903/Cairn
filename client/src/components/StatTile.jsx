import './StatTile.css';

/** A single stat in the dashboard header row. */
export function StatTile({ value, label, tone = 'ink' }) {
  return (
    <div className="stat-tile">
      <div className={`stat-value stat-${tone}`}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export function StatRow({ children }) {
  return <div className="stat-row card">{children}</div>;
}
