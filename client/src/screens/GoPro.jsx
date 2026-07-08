import { useState } from 'react';
import { Link } from 'react-router-dom';
import './GoPro.css';

const PRO_FEATURES = [
  'Unlimited goals',
  'Projected vs actual pace',
  'Daily notes, emotes & reflections',
  'Full history & activity log',
  'All themes & data export',
];

export function GoPro() {
  const [cycle, setCycle] = useState('yearly'); // 'monthly' | 'yearly'
  const monthly = cycle === 'yearly' ? 4 : 6;
  const priceLine = cycle === 'yearly' ? 'billed $48 / year · save 33%' : 'billed monthly';
  const cta = cycle === 'yearly' ? 'Start Pro · $48 / yr' : 'Start Pro · $6 / mo';

  return (
    <div className="gopro">
      <Link to="/profile" className="back-link">‹ Profile</Link>
      <div className="eyebrow screen-eyebrow" style={{ color: 'var(--terracotta)' }}>Upgrade</div>
      <h1 className="screen-title">Go Pro</h1>
      <p className="screen-sub">Unlimited goals, projected-pace tracking, reflections, history and every theme.</p>

      <div className="segmented gopro-toggle">
        <button className={`seg ${cycle === 'monthly' ? 'seg-on' : ''}`} onClick={() => setCycle('monthly')}>
          Monthly
        </button>
        <button className={`seg ${cycle === 'yearly' ? 'seg-on' : ''}`} onClick={() => setCycle('yearly')}>
          Yearly
        </button>
      </div>

      <div className="card plan-card">
        <div className="plan-head">
          <span className="plan-name">Free</span>
          <span className="chip">Current</span>
        </div>
        <div className="plan-price">$0 <span>/ forever</span></div>
        <ul className="plan-list plain">
          <li>Up to 3 active goals</li>
          <li>Task check-offs & emotes</li>
          <li>7 days of history</li>
        </ul>
      </div>

      <div className="card plan-card plan-pro">
        <span className="chip chip-recommended">Recommended</span>
        <div className="plan-head">
          <span className="plan-name">Pro</span>
        </div>
        <div className="plan-price accent">${monthly} <span>/ month</span></div>
        <div className="plan-billed">{priceLine}</div>
        <ul className="plan-list">
          {PRO_FEATURES.map((f) => (
            <li key={f}><span className="tick">✓</span> {f}</li>
          ))}
        </ul>
        <button className="btn btn-primary btn-block" onClick={() => alert('Payments aren’t wired up in this demo — but the flow is all here!')}>
          {cta}
        </button>
      </div>

      <p className="gopro-fine">Secure checkout · cancel anytime · restore purchase</p>
    </div>
  );
}
