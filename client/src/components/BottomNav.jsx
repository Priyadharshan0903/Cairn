import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const TABS = [
  { to: '/', label: 'Goals', end: true, icon: GoalsIcon },
  { to: '/trails', label: 'Trails', icon: TrailsIcon },
  { to: '/history', label: 'History', icon: HistoryIcon },
];

/** Fixed bottom tab bar (mobile) / side rail is handled by AppShell on desktop. */
export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ to, label, end, icon: Icon }) => (
        <NavLink key={to} to={to} end={end} className="nav-tab">
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function GoalsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}
function TrailsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 20c0-4 3-4 3-8s-3-4-3-8" />
      <circle cx="6" cy="4" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="6" cy="20" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 4v4h4" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}
