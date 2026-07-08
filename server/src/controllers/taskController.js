import { z } from 'zod';
import { Task, EMOTES } from '../models/Task.js';
import { Goal } from '../models/Goal.js';
import { asyncHandler } from '../middleware/error.js';
import { todayStr } from '../lib/dates.js';

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date');

export const createTaskSchema = z.object({
  goalId: z.string(),
  title: z.string().trim().min(1, 'Task needs a title'),
  date: dateStr.default(todayStr()),
  note: z.string().default(''),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).optional(),
  note: z.string().optional(),
  done: z.boolean().optional(),
  emote: z.enum(EMOTES).nullable().optional(),
});

export const listTasks = asyncHandler(async (req, res) => {
  const { date, goalId } = req.query;
  const filter = { userId: req.user._id };
  if (date) filter.date = date;
  if (goalId) filter.goalId = goalId;
  const tasks = await Task.find(filter).sort({ date: -1, position: 1 });
  res.json({ tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  const { goalId, title, date, note } = req.body;
  const goal = await Goal.findOne({ _id: goalId, userId: req.user._id });
  if (!goal) return res.status(404).json({ error: 'Goal not found' });

  const count = await Task.countDocuments({ goalId, date });
  const task = await Task.create({
    goalId,
    userId: req.user._id,
    title,
    date,
    note,
    position: count,
  });
  res.status(201).json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const wasDone = task.done;
  Object.assign(task, req.body);

  if (req.body.done !== undefined && req.body.done !== wasDone) {
    task.doneAt = req.body.done ? new Date() : undefined;
    await syncGoalProgress(task.goalId, req.user._id, req.body.done ? 1 : -1);
  }

  await task.save();
  res.json({ task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (task.done) await syncGoalProgress(task.goalId, req.user._id, -1);
  res.json({ ok: true });
});

/**
 * Keep the goal's cached progressValue in step with completed tasks. For habit
 * goals this is a count of completed check-ins; for count/project goals the
 * value is edited directly on the goal, so we only nudge habit goals here.
 */
async function syncGoalProgress(goalId, userId, delta) {
  const goal = await Goal.findOne({ _id: goalId, userId });
  if (!goal || goal.type !== 'habit') return;
  goal.progressValue = Math.max(0, Math.min(goal.target, (goal.progressValue || 0) + delta));
  await goal.save();
}
