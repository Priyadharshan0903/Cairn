import { motion } from 'framer-motion';
import { EMOTES, EMOTE_ORDER } from '../lib/format.js';
import './EmotePicker.css';

/** The "felt" reaction row — one emote selectable per task. */
export function EmotePicker({ value, onChange }) {
  return (
    <div className="emote-row">
      <span className="emote-lead">felt</span>
      {EMOTE_ORDER.map((key) => {
        const active = value === key;
        return (
          <motion.button
            key={key}
            type="button"
            className={`emote ${active ? 'emote-active' : ''}`}
            onClick={() => onChange(active ? null : key)}
            whileTap={{ scale: 0.8 }}
            animate={active ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            aria-pressed={active}
            aria-label={key}
          >
            {EMOTES[key]}
          </motion.button>
        );
      })}
    </div>
  );
}
