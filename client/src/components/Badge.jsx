import './Badge.css';

/** Small pill: status ("active"/"paused") or pace ("behind"/"ahead"/"ontrack"). */
export function Badge({ children, tone = 'neutral', solid = false }) {
  return <span className={`badge badge-${tone} ${solid ? 'badge-solid' : ''}`}>{children}</span>;
}

/** Uppercase status chip like ACTIVE / PAUSED. */
export function StatusChip({ status }) {
  const tone = status === 'paused' ? 'sand' : status === 'completed' ? 'sage' : 'neutral';
  return (
    <span className={`chip chip-${tone}`}>{status}</span>
  );
}

/** Pace phrase colored by whether you're ahead/behind/on-track. */
export function PaceTag({ pace }) {
  const tone = pace.status === 'behind' ? 'terracotta' : pace.status === 'ahead' ? 'sage' : 'muted';
  return <span className={`pace pace-${tone}`}>{pace.label}</span>;
}
