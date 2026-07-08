import { z } from 'zod';
import { Goal } from '../models/Goal.js';
import { Task } from '../models/Task.js';
import { computePace } from '../lib/pace.js';
import { asyncHandler } from '../middleware/error.js';
import { todayStr } from '../lib/dates.js';

const isoDate = z.coerce.date();

export const createGoalSchema = z.object({
  title: z.string().trim().min(1, 'Give your goal a name'),
  category: z.string().trim().default('habit'),
  type: z.enum(['habit', 'count', 'project']).default('habit'),
  startDate: isoDate,
  deadline: isoDate,
  rhythm: z.union([z.literal(5), z.literal(7)]).default(7),
  target: z.number().int().min(1, 'Target must be at least 1'),
  unitLabel: z.string().trim().default('days'),
  progressValue: z.number().min(0).default(0),
  firstTasks: z.array(z.string().trim().min(1)).max(10).default([]),
});

export const updateGoalSchema = z.object({
  title: z.string().trim().min(1).optional(),
  category: z.string().trim().optional(),
  status: z.enum(['active', 'paused', 'completed']).optional(),
  startDate: isoDate.optional(),
  deadline: isoDate.optional(),
  rhythm: z.union([z.literal(5), z.literal(7)]).optional(),
  target: z.number().int().min(1).optional(),
  unitLabel: z.string().trim().optional(),
  progressValue: z.number().min(0).optional(),
  reflection: z.string().optional(), // used when completing
});

export const reorderSchema = z.object({
  order: z.array(z.object({ id: z.string(), priority: z.number().int() })).min(1),
});

/** Attach computed pace to a goal document for API responses. */
export function serializeGoal(goal) {
  return { ...goal.toJSON(), pace: computePace(goal) };
}

export const listGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ userId: req.user._id }).sort({ priority: 1, createdAt: 1 });
  res.json({ goals: goals.map(serializeGoal) });
});

export const getGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
  if (!goal) return res.status(404).json({ error: 'Goal not found' });

  const tasks = await Task.find({ goalId: goal._id }).sort({ date: -1, position: 1 });
  res.json({ goal: serializeGoal(goal), tasks });
});

export const createGoal = asyncHandler(async (req, res) => {
  const { firstTasks, ...data } = req.body;

  // New goals go to the top of the priority list.
  const min = await Goal.findOne({ userId: req.user._id }).sort({ priority: 1 }).select('priority');
  const priority = (min?.priority ?? 0) - 1;

  const goal = await Goal.create({ ...data, userId: req.user._id, priority });

  if (firstTasks?.length) {
    const date = todayStr();
    await Task.insertMany(
      firstTasks.map((title, i) => ({
        goalId: goal._id,
        userId: req.user._id,
        date,
        title,
        position: i,
      }))
    );
  }

  res.status(201).json({ goal: serializeGoal(goal) });
});

export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
  if (!goal) return res.status(404).json({ error: 'Goal not found' });

  const { reflection, status, ...rest } = req.body;
  Object.assign(goal, rest);

  if (status) {
    goal.status = status;
    if (status === 'completed') {
      goal.completion = await buildCompletion(goal, reflection);
    }
  }

  await goal.save();
  res.json({ goal: serializeGoal(goal) });
});

export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  await Task.deleteMany({ goalId: goal._id });
  res.json({ ok: true });
});

export const reorderGoals = asyncHandler(async (req, res) => {
  const { order } = req.body;
  await Promise.all(
    order.map(({ id, priority }) =>
      Goal.updateOne({ _id: id, userId: req.user._id }, { $set: { priority } })
    )
  );
  const goals = await Goal.find({ userId: req.user._id }).sort({ priority: 1, createdAt: 1 });
  res.json({ goals: goals.map(serializeGoal) });
});

/** Build the completion recap (days-hit heatmap + stats) from a goal's tasks. */
async function buildCompletion(goal, reflection) {
  const pace = computePace(goal);
  const tasks = await Task.find({ goalId: goal._id });
  const byDay = new Map();
  for (const t of tasks) {
    byDay.set(t.date, (byDay.get(t.date) || false) || t.done);
  }
  const dailyTrack = [...byDay.keys()].sort().map((d) => byDay.get(d));
  const hit = dailyTrack.filter(Boolean).length;
  const daysHitPct = dailyTrack.length ? Math.round((hit / dailyTrack.length) * 100) : pace.actualPercent;
  const finishedEarlyDays = Math.max(0, pace.remainingDays);

  return {
    finishedEarlyDays,
    daysHitPct,
    reflection: reflection || '',
    dailyTrack,
    completedAt: new Date(),
  };
}
