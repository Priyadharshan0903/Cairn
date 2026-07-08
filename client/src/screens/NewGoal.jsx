import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateGoal } from '../hooks/useGoals.js';
import { todayStr } from '../lib/format.js';
import './NewGoal.css';

const TYPES = [
  { value: 'habit', label: 'Daily habit', hint: 'Show up on a rhythm', unit: 'days', target: 100 },
  { value: 'count', label: 'Count to a number', hint: 'e.g. read 12 books', unit: 'books', target: 12 },
  { value: 'project', label: 'A project', hint: 'Ship by a deadline', unit: 'day', target: 40 },
];

function plusDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return todayStr(d);
}

export function NewGoal() {
  const navigate = useNavigate();
  const createGoal = useCreateGoal();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('habit');
  const [start, setStart] = useState(todayStr());
  const [deadline, setDeadline] = useState(plusDays(30));
  const [rhythm, setRhythm] = useState(5);
  const [target, setTarget] = useState(100);
  const [tasks, setTasks] = useState(['', '']);
  const [error, setError] = useState('');

  const typeMeta = TYPES.find((t) => t.value === type);

  function pickType(t) {
    setType(t.value);
    setTarget(t.target);
  }

  function setTaskAt(i, v) {
    setTasks((arr) => arr.map((t, idx) => (idx === i ? v : t)));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!title.trim()) return setError('Give your goal a name.');
    if (new Date(deadline) <= new Date(start)) return setError('Deadline must be after the start date.');

    try {
      const goal = await createGoal.mutateAsync({
        title: title.trim(),
        type,
        category: type === 'count' ? 'reading' : type === 'project' ? 'project' : 'fitness',
        startDate: start,
        deadline,
        rhythm,
        target: Number(target),
        unitLabel: typeMeta.unit,
        progressValue: 0,
        firstTasks: tasks.map((t) => t.trim()).filter(Boolean),
      });
      navigate(`/goals/${goal.goal.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <Link to="/" className="back-link">✕ Cancel</Link>
      <h1 className="screen-title" style={{ marginBottom: 22 }}>New goal</h1>

      <form onSubmit={submit} className="new-goal-form">
        <div className="field">
          <label className="eyebrow">Goal</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Run my first half marathon" autoFocus />
        </div>

        <div className="field">
          <label className="eyebrow">Type</label>
          <div className="type-grid">
            {TYPES.map((t) => (
              <button
                type="button"
                key={t.value}
                className={`type-opt ${type === t.value ? 'type-opt-on' : ''}`}
                onClick={() => pickType(t)}
              >
                <span className="type-label">{t.label}</span>
                <span className="type-hint">{t.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="eyebrow">Timeframe</label>
          <div className="time-grid">
            <div>
              <span className="mini-label">Start</span>
              <input className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div>
              <span className="mini-label">Deadline</span>
              <input className="input" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>
        </div>

        {type === 'count' && (
          <div className="field">
            <label className="eyebrow">Target ({typeMeta.unit})</label>
            <input className="input" type="number" min="1" value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
        )}

        {type === 'habit' && (
          <div className="field">
            <label className="eyebrow">Rhythm</label>
            <div className="rhythm-grid">
              <button type="button" className={`rhythm-opt ${rhythm === 5 ? 'rhythm-on' : ''}`} onClick={() => setRhythm(5)}>
                5 days / week
              </button>
              <button type="button" className={`rhythm-opt ${rhythm === 7 ? 'rhythm-on' : ''}`} onClick={() => setRhythm(7)}>
                7 days / week
              </button>
            </div>
          </div>
        )}

        <div className="field">
          <label className="eyebrow">First tasks · add a task per day</label>
          {tasks.map((t, i) => (
            <input
              key={i}
              className="input first-task"
              value={t}
              onChange={(e) => setTaskAt(i, e.target.value)}
              placeholder={i === 0 ? 'Easy 5K recovery run' : 'Foam roll + stretch'}
            />
          ))}
          <button type="button" className="link" onClick={() => setTasks((a) => [...a, ''])}>
            + Add task
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button className="btn btn-primary btn-block" disabled={createGoal.isPending}>
          {createGoal.isPending ? 'Setting up…' : 'Start tracking →'}
        </button>
      </form>
    </div>
  );
}
