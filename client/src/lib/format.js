/** Small display helpers shared across screens. */

export const EMOTES = {
  grin: '😄',
  fire: '🔥',
  sprout: '🌱',
  exhausted: '😩',
  sleep: '💤',
};
export const EMOTE_ORDER = ['grin', 'fire', 'sprout', 'exhausted', 'sleep'];

/** Color role for a pace status. */
export function statusColor(status) {
  if (status === 'behind') return 'var(--terracotta)';
  if (status === 'ahead') return 'var(--sage-deep)';
  return 'var(--muted)';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Jun 1" from a Date or ISO string. */
export function shortDate(value) {
  const d = new Date(value);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** "MON · JUL 8" eyebrow for a date. */
export function eyebrowDate(value = new Date()) {
  const d = new Date(value);
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return `${days[d.getDay()]} · ${MONTHS[d.getMonth()].toUpperCase()} ${d.getDate()}`;
}

/** Friendly "Monday, Jul 8". */
export function longDate(value = new Date()) {
  const d = new Date(value);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `${days[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** Time-of-day greeting. */
export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function todayStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const CATEGORY_LABEL = {
  fitness: 'Fitness',
  reading: 'Reading',
  project: 'Project',
  habit: 'Habit',
};
