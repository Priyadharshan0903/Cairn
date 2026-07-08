import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGoal, useUpdateGoal, useDeleteGoal } from '../hooks/useGoals.js';
import { useCreateTask, useUpdateTask } from '../hooks/useTasks.js';
import { ProgressTrack } from '../components/ProgressTrack.jsx';
import { TaskItem } from '../components/TaskItem.jsx';
import { PaceTag } from '../components/Badge.jsx';
import { CompletionCard } from './GoalComplete.jsx';
import { shortDate, todayStr, CATEGORY_LABEL } from '../lib/format.js';
import './GoalDetail.css';

export function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGoal(id);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask(id);
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const [menuOpen, setMenuOpen] = useState(false);

  if (isLoading) {
    return <div className="detail-loading"><div className="spin" /></div>;
  }
  if (!data) return <div className="screen-sub">Goal not found.</div>;

  const { goal, tasks } = data;
  const { pace } = goal;
  const today = todayStr();
  const todayTasks = tasks.filter((t) => t.date === today).sort((a, b) => a.position - b.position);
  const doneCount = todayTasks.filter((t) => t.done).length;

  if (goal.status === 'completed') {
    return <CompletionCard goal={goal} onBack={() => navigate('/history')} />;
  }


  return (
    <div>
      <Link to="/" className="back-link">‹ All goals</Link>

      <header className="detail-head">
        <div className="eyebrow">
          Priority {Math.max(1, goal.priority)} · {CATEGORY_LABEL[goal.category] || goal.category}
        </div>
        <div className="detail-title-row">
          <h1 className="screen-title">{goal.title}</h1>
          <button className="dots" onClick={() => setMenuOpen((o) => !o)} aria-label="Goal options">⋯</button>
        </div>
        <p className="detail-range">
          {shortDate(goal.startDate)} → {shortDate(goal.deadline)} · {pace.totalDays} days · day {pace.dayIndex}
        </p>

        {menuOpen && (
          <div className="goal-menu card">
            {goal.status === 'active' ? (
              <button onClick={() => { updateGoal.mutate({ id, status: 'paused' }); setMenuOpen(false); }}>
                Pause goal
              </button>
            ) : (
              <button onClick={() => { updateGoal.mutate({ id, status: 'active' }); setMenuOpen(false); }}>
                Resume goal
              </button>
            )}
            <button onClick={() => { const r = prompt('What did you learn? (optional reflection)') || ''; updateGoal.mutate({ id, status: 'completed', reflection: r }); setMenuOpen(false); }}>
              Mark complete
            </button>
            <button
              className="danger"
              onClick={() => { if (confirm('Delete this goal and its tasks?')) { deleteGoal.mutate(id); navigate('/'); } }}
            >
              Delete goal
            </button>
          </div>
        )}
      </header>

      <section className="pace-card card">
        <div className="pace-figures">
          <div>
            <div className="pace-big pace-actual">{pace.actualPercent}<span>%</span></div>
            <div className="pace-cap">actual</div>
          </div>
          <div className="pace-right">
            <div className="pace-big">{pace.targetPercent}<span>%</span></div>
            <div className="pace-cap">you should be here</div>
          </div>
        </div>
        <ProgressTrack pace={pace} showMarkerLabel height={10} />
        <div className="pace-badge-row">
          <span className={`pace-flag pace-flag-${pace.status}`}>
            {pace.status === 'behind' ? '↓' : pace.status === 'ahead' ? '↑' : '•'} <PaceTag pace={pace} />
          </span>
        </div>
      </section>

      <div className="section-label">
        <span className="eyebrow">Today · {shortDate(today)}</span>
        <span className="eyebrow">{doneCount}/{todayTasks.length} done</span>
      </div>

      <section className="card task-card">
        {todayTasks.length === 0 && <p className="no-tasks">No tasks yet for today. Add the first one below.</p>}
        {todayTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={(done) => updateTask.mutate({ id: task.id, done })}
            onEmote={(emote) => updateTask.mutate({ id: task.id, emote })}
          />
        ))}

        <AddTask onAdd={(title) => createTask.mutate({ goalId: id, title, date: today })} />
      </section>
    </div>
  );
}

/** "+ Add a task" — a full-width button that expands into a focused input. */
function AddTask({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function submit(e) {
    e.preventDefault();
    const title = value.trim();
    if (!title) return close();
    onAdd(title);
    setValue('');
    inputRef.current?.focus();
  }
  function close() {
    setValue('');
    setOpen(false);
  }

  if (!open) {
    return (
      <button type="button" className="btn btn-ghost add-task-trigger" onClick={() => setOpen(true)}>
        + Add a task for today
      </button>
    );
  }

  return (
    <form className="add-task" onSubmit={submit}>
      <input
        ref={inputRef}
        className="add-task-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => !value.trim() && close()}
        onKeyDown={(e) => e.key === 'Escape' && close()}
        placeholder="What needs doing today?"
      />
      <button type="submit" className="add-task-go" disabled={!value.trim()}>
        Add
      </button>
    </form>
  );
}
