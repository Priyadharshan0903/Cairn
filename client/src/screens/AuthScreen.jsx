import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { CairnMark } from '../components/Logo.jsx';
import './AuthScreen.css';

export function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isSignup = mode === 'signup';
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isSignup) await register(form);
      else await login({ email: form.email, password: form.password });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function fillDemo() {
    setMode('signin');
    setForm({ name: '', email: 'demo@cairn.app', password: 'climbon' });
  }

  return (
    <div className="auth">
      <div className={`auth-hero ${isSignup ? 'auth-hero-sage' : ''}`}>
        <CairnMark size={40} />
        <h1 className="auth-wordmark">{isSignup ? 'Start your first climb' : 'Cairn'}</h1>
        <p className="auth-tagline">
          {isSignup
            ? 'One account. Every goal, every day, in one place.'
            : 'Set the goal. Keep the pace. Notice how each day feels.'}
        </p>
      </div>

      <form className="auth-card" onSubmit={submit}>
        <div className="auth-tabs">
          <button type="button" className={!isSignup ? 'auth-tab-on' : ''} onClick={() => setMode('signin')}>
            Sign in
          </button>
          <button type="button" className={isSignup ? 'auth-tab-on' : ''} onClick={() => setMode('signup')}>
            Create account
          </button>
        </div>

        {isSignup && (
          <div className="field">
            <label className="eyebrow">Name</label>
            <input className="input" value={form.name} onChange={set('name')} placeholder="Arjun Rao" autoComplete="name" />
          </div>
        )}

        <div className="field">
          <label className="eyebrow">Email</label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="field">
          <label className="eyebrow">Password</label>
          <div className="input-wrap">
            <input
              className="input"
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              placeholder="Your password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              required
            />
            <button type="button" className="show-btn" onClick={() => setShowPw((s) => !s)}>
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'One moment…' : isSignup ? 'Create account' : 'Continue'}
        </button>

        <div className="auth-foot">
          {isSignup ? (
            <span>
              Already climbing? <button type="button" className="link" onClick={() => setMode('signin')}>Sign in</button>
            </span>
          ) : (
            <span>
              New to Cairn? <button type="button" className="link" onClick={() => setMode('signup')}>Create account</button>
            </span>
          )}
        </div>

        <button type="button" className="auth-demo" onClick={fillDemo}>
          Try the demo account →
        </button>
      </form>
    </div>
  );
}
