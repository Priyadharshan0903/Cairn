import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useTheme } from '../hooks/useTheme.jsx';
import { api } from '../lib/api.js';
import './Profile.css';

const STYLE_LABEL = { quiet: 'Quiet Ledger', soft: 'Soft Cards', trailhead: 'Trailhead' };
const APPEARANCE_LABEL = { light: 'Light', dark: 'Dark', auto: 'Auto' };

export function Profile() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const initials = (user?.name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
    : '';

  // A friendly 14-day trial countdown from signup (decorative — no billing).
  const trialDaysLeft = user?.createdAt
    ? Math.max(0, 14 - Math.floor((Date.now() - new Date(user.createdAt)) / 86400000))
    : 0;
  const trialEnds = user?.createdAt
    ? new Date(new Date(user.createdAt).getTime() + 14 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';

  async function exportData() {
    try {
      const [{ goals }, { days }] = await Promise.all([api.listGoals(), api.activity()]);
      const blob = new Blob([JSON.stringify({ user, goals, activity: days }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cairn-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Could not export right now — please try again.');
    }
  }

  return (
    <div className="profile">
      <Link to="/" className="back-link">‹ Goals</Link>

      <header className="profile-head">
        <h1 className="screen-title">Profile</h1>
      </header>

      <div className="profile-id">
        <div className="avatar-lg">{initials}</div>
        <div>
          <div className="profile-name">{user?.name}</div>
          <div className="profile-email">{user?.email}</div>
          {memberSince && <div className="eyebrow profile-since">Member since {memberSince}</div>}
        </div>
      </div>

      {trialDaysLeft > 0 && (
        <div className="card trial-card">
          <div className="trial-top">
            <span className="chip chip-sand">Free trial</span>
            <span className="trial-note">Pro features unlocked</span>
          </div>
          <div className="trial-days">{trialDaysLeft} days left</div>
          <p className="trial-sub">Trial ends {trialEnds}, then your account turns read-only.</p>
          <div className="trial-bar">
            <div className="trial-bar-fill" style={{ width: `${(trialDaysLeft / 14) * 100}%` }} />
          </div>
          <Link to="/upgrade" className="btn btn-primary btn-block trial-btn">Upgrade to Pro</Link>
        </div>
      )}

      <section className="settings-group">
        <div className="eyebrow settings-label">Preferences</div>
        <div className="card settings-list">
          <Row to="/theme" label="Theme" value={STYLE_LABEL[theme.style]} />
          <Row to="/theme" label="Appearance" value={APPEARANCE_LABEL[theme.appearance]} />
          <Row label="Reminders" value="8:00 AM" onClick={() => alert('Reminders are coming soon.')} />
        </div>
      </section>

      <section className="settings-group">
        <div className="eyebrow settings-label">Account</div>
        <div className="card settings-list">
          <Row label="Change password" onClick={() => alert('Password change is coming soon.')} />
          <Row label="Export my data" onClick={exportData} />
          <Row label="Help & feedback" onClick={() => (window.location.href = 'mailto:hello@cairn.app')} />
        </div>
      </section>

      <button
        className="btn btn-ghost btn-block signout-btn"
        onClick={() => {
          logout();
          navigate('/welcome');
        }}
      >
        Sign out
      </button>
    </div>
  );
}

function Row({ to, label, value, onClick }) {
  const inner = (
    <>
      <span className="row-label">{label}</span>
      <span className="row-right">
        {value && <span className="row-value">{value}</span>}
        <span className="row-chevron">›</span>
      </span>
    </>
  );
  if (to) {
    return (
      <Link to={to} className="settings-row">
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className="settings-row" onClick={onClick}>
      {inner}
    </button>
  );
}
