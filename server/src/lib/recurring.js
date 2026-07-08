import { Task } from '../models/Task.js';

/**
 * Materialize daily instances of recurring tasks (e.g. "brush teeth") for a
 * given day. A task title is "recurring" if its most recent instance has
 * recurring=true — so turning the toggle off on the latest instance stops it
 * from carrying forward. Each day gets its own checkable copy, which keeps
 * streaks, history, and progress working naturally.
 *
 * @returns {number} how many instances were created
 */
export async function ensureRecurringForDay(goalId, userId, date) {
  const all = await Task.find({ goalId, userId }).sort({ date: -1, createdAt: -1 });

  // Most recent instance per title determines whether it still recurs.
  const latestByTitle = new Map();
  for (const t of all) {
    if (!latestByTitle.has(t.title)) latestByTitle.set(t.title, t);
  }

  const existingToday = new Set(all.filter((t) => t.date === date).map((t) => t.title));
  let position = existingToday.size;
  const toCreate = [];
  for (const [title, latest] of latestByTitle) {
    if (latest.recurring && !existingToday.has(title)) {
      toCreate.push({ goalId, userId, title, date, recurring: true, position: position++ });
    }
  }

  if (toCreate.length) await Task.insertMany(toCreate);
  return toCreate.length;
}
