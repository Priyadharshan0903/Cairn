/**
 * Cairn pace engine — the core logic shared by server and client.
 *
 * Every goal carries ONE progress track with a "should be here" marker so the
 * user reads projected pace vs. actual pace at a glance.
 *
 *   targetPct = elapsedDays / totalDays        → the "you should be here" marker
 *   actualPct = progressValue / target         → the filled portion of the bar
 *   paceDays  = round((actualPct-targetPct)*N)  → "N days ahead / behind"
 *
 * A day = 24h. All date math is done on calendar days (UTC-midnight normalized)
 * so it is stable regardless of the time of day the request arrives.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Normalize any date-ish value to a UTC-midnight timestamp (calendar day). */
function dayStart(value) {
  const d = new Date(value);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Compute pace for a goal.
 * @param {Object} goal - { type, startDate, deadline, target, progressValue, unitLabel, status }
 * @param {Date|string|number} [now] - reference date, defaults to today
 * @returns {Object} pace summary
 */
export function computePace(goal, now = new Date()) {
  const start = dayStart(goal.startDate);
  const end = dayStart(goal.deadline);
  const today = dayStart(now);

  const totalDays = Math.max(1, Math.round((end - start) / DAY_MS));
  const elapsedDays = clamp(Math.round((today - start) / DAY_MS), 0, totalDays);
  const dayIndex = elapsedDays + 1; // human "day N" (1-based, capped at totalDays)

  const target = Math.max(1, Number(goal.target) || 1);
  const progressValue = clamp(Number(goal.progressValue) || 0, 0, target);

  const targetPct = clamp(elapsedDays / totalDays, 0, 1);
  const actualPct = clamp(progressValue / target, 0, 1);

  // How many days ahead(+) / behind(-) the projected pace we are.
  const paceDays = Math.round((actualPct - targetPct) * totalDays);

  // Status uses a percentage tolerance (not raw days) so long goals like
  // "12 books in a year" read calmly ("on track") instead of hyper-sensitively.
  const ON_TRACK_BAND = 0.03; // within 3 points of where you should be
  const gap = actualPct - targetPct;
  let status; // 'ahead' | 'ontrack' | 'behind'
  if (gap > ON_TRACK_BAND) status = 'ahead';
  else if (gap < -ON_TRACK_BAND) status = 'behind';
  else status = 'ontrack';

  return {
    totalDays,
    elapsedDays,
    dayIndex: Math.min(dayIndex, totalDays),
    remainingDays: totalDays - elapsedDays,
    target,
    progressValue,
    targetPct,
    actualPct,
    targetPercent: Math.round(targetPct * 100),
    actualPercent: Math.round(actualPct * 100),
    paceDays,
    status,
    label: paceLabel(paceDays, status),
    detail: detailLabel(goal, { dayIndex: Math.min(dayIndex, totalDays), totalDays, target, progressValue }),
  };
}

/** Short pace phrase for badges: "3 days behind" / "2 days ahead" / "on track". */
export function paceLabel(paceDays, status) {
  if (status === 'ontrack') return 'on track';
  const n = Math.abs(paceDays);
  const unit = n === 1 ? 'day' : 'days';
  return status === 'ahead' ? `${n} ${unit} ahead` : `${n} ${unit} behind`;
}

/** Type-specific secondary line, matching the mockups. */
function detailLabel(goal, { dayIndex, totalDays, target, progressValue }) {
  switch (goal.type) {
    case 'count': {
      const unit = (goal.unitLabel || 'item').replace(/s$/, '');
      return `${unit} ${progressValue} of ${target}`;
    }
    case 'project':
      return `day ${dayIndex} of ${totalDays}`;
    case 'habit':
    default:
      return `day ${dayIndex} · ${Math.round((progressValue / target) * 100)}%`;
  }
}

/** Aggregate dashboard progress: mean of actual completion across active goals. */
export function averageProgress(goals, now = new Date()) {
  const active = goals.filter((g) => g.status !== 'completed');
  if (active.length === 0) return 0;
  const sum = active.reduce((acc, g) => acc + computePace(g, now).actualPct, 0);
  return Math.round((sum / active.length) * 100);
}
