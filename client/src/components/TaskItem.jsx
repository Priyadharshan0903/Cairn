import { motion } from 'framer-motion';
import { EmotePicker } from './EmotePicker.jsx';
import './TaskItem.css';

/**
 * A single task row: checkbox with satisfying check-off, optional note, and
 * (once done) an emote reaction row.
 */
export function TaskItem({ task, onToggle, onEmote }) {
  const { done } = task;
  return (
    <div className={`task ${done ? 'task-done' : ''}`}>
      <motion.button
        type="button"
        className={`check ${done ? 'check-on' : ''}`}
        onClick={() => onToggle(!done)}
        whileTap={{ scale: 0.85 }}
        aria-pressed={done}
        aria-label={done ? 'Mark not done' : 'Mark done'}
      >
        {done && (
          <motion.svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          >
            <path d="M2.5 7.5L6 11L11.5 3.5" stroke="#f6efe4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        )}
      </motion.button>

      <div className="task-body">
        <div className="task-title">{task.title}</div>
        {task.note && <div className="task-note">{task.note}</div>}
        {done && <EmotePicker value={task.emote} onChange={(e) => onEmote(e)} />}
      </div>
    </div>
  );
}
