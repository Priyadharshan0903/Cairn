import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computePace, paceLabel } from './pace.js';

const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n) => new Date(Date.now() - n * DAY);
const daysAhead = (n) => new Date(Date.now() + n * DAY);

test('behind pace → negative paceDays and "behind" status', () => {
  // day 38 of 60, actual 48% but should be ~63%.
  const goal = {
    type: 'habit',
    startDate: daysAgo(37),
    deadline: daysAhead(22),
    target: 100,
    progressValue: 48,
  };
  const p = computePace(goal);
  assert.equal(p.totalDays, 59);
  assert.equal(p.actualPercent, 48);
  assert.ok(p.targetPercent > p.actualPercent, 'target should be ahead of actual');
  assert.equal(p.status, 'behind');
  assert.ok(p.paceDays < 0);
});

test('ahead pace → positive paceDays and "ahead" status', () => {
  // day 15 of 30 (should be at 50%) but already at 63% → clearly ahead.
  const goal = { type: 'habit', startDate: daysAgo(15), deadline: daysAhead(15), target: 100, progressValue: 63 };
  const p = computePace(goal);
  assert.equal(p.status, 'ahead');
  assert.ok(p.paceDays >= 3, `expected several days ahead, got ${p.paceDays}`);
});

test('count goal detail reads "book N of M"', () => {
  const goal = { type: 'count', startDate: daysAgo(180), deadline: daysAhead(185), target: 12, progressValue: 5, unitLabel: 'books' };
  const p = computePace(goal);
  assert.equal(p.detail, 'book 5 of 12');
});

test('paceLabel pluralization', () => {
  assert.equal(paceLabel(1, 'ahead'), '1 day ahead');
  assert.equal(paceLabel(-3, 'behind'), '3 days behind');
  assert.equal(paceLabel(0, 'ontrack'), 'on track');
});

test('progress and elapsed are clamped to [0, total]', () => {
  const goal = { type: 'habit', startDate: daysAgo(100), deadline: daysAgo(50), target: 10, progressValue: 999 };
  const p = computePace(goal);
  assert.equal(p.actualPct, 1);
  assert.equal(p.elapsedDays, p.totalDays);
});
