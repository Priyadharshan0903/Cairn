import { useEffect, useRef, useState } from 'react';
import { todayStr } from '../lib/format.js';
import './DatePicker.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Parse a YYYY-MM-DD string into a local Date (no timezone drift). */
function parse(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function fmtDisplay(str) {
  if (!str) return 'Pick a date';
  const d = parse(str);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Build the 6-week grid of day cells for a given month view. */
function buildGrid(viewYear, viewMonth) {
  const first = new Date(viewYear, viewMonth, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/**
 * A calendar date picker styled to the Cairn design.
 * value/onChange use YYYY-MM-DD strings. `min` (YYYY-MM-DD) disables earlier days.
 */
export function DatePicker({ value, onChange, min, label, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const selected = value ? parse(value) : parse(todayStr());
  const [view, setView] = useState({ y: selected.getFullYear(), m: selected.getMonth() });
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    setView({ y: selected.getFullYear(), m: selected.getMonth() });
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const grid = buildGrid(view.y, view.m);
  const minDate = min ? parse(min) : null;

  function pick(day) {
    const picked = new Date(view.y, view.m, day);
    const str = todayStr(picked);
    onChange(str);
    setOpen(false);
  }

  function shiftMonth(delta) {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  const isSameDay = (day) =>
    value &&
    selected.getFullYear() === view.y &&
    selected.getMonth() === view.m &&
    selected.getDate() === day;

  const isDisabled = (day) => minDate && new Date(view.y, view.m, day) < stripTime(minDate);

  return (
    <div className="dp" ref={ref}>
      {label && <span className="dp-label">{label}</span>}
      <button type="button" className={`dp-trigger ${open ? 'dp-open' : ''}`} onClick={() => setOpen((o) => !o)}>
        <span className={value ? '' : 'dp-placeholder'}>{fmtDisplay(value)}</span>
        <CalendarIcon />
      </button>

      {open && (
        <div className={`dp-pop card ${align === 'right' ? 'dp-pop-right' : ''}`}>
          <div className="dp-head">
            <button type="button" className="dp-nav" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
            <span className="dp-title">{MONTHS[view.m]} {view.y}</span>
            <button type="button" className="dp-nav" onClick={() => shiftMonth(1)} aria-label="Next month">›</button>
          </div>
          <div className="dp-weekdays">
            {WEEKDAYS.map((w, i) => <span key={i}>{w}</span>)}
          </div>
          <div className="dp-grid">
            {grid.map((day, i) =>
              day === null ? (
                <span key={i} className="dp-cell dp-empty" />
              ) : (
                <button
                  key={i}
                  type="button"
                  className={`dp-cell ${isSameDay(day) ? 'dp-sel' : ''}`}
                  disabled={isDisabled(day)}
                  onClick={() => pick(day)}
                >
                  {day}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function stripTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function CalendarIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9h17M8 3v3M16 3v3" />
    </svg>
  );
}
