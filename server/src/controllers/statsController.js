import { Goal } from '../models/Goal.js';
import { Task } from '../models/Task.js';
import { computePace, averageProgress } from '../lib/pace.js';
import { asyncHandler } from '../middleware/error.js';
import { todayStr } from '../lib/dates.js';

export const dashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const goals = await Goal.find({ userId });
  const active = goals.filter((g) => g.status === 'active');

  const today = todayStr();
  const todayTasks = await Task.find({ userId, date: today });
  const todayDone = todayTasks.filter((t) => t.done).length;

  const slipping = active.filter((g) => computePace(g).status === 'behind').length;

  res.json({
    todayDone,
    todayTotal: todayTasks.length,
    dayStreak: await computeStreak(userId),
    avgProgress: averageProgress(goals),
    activeCount: active.length,
    slippingCount: slipping,
  });
});

export const history = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ userId: req.user._id, status: 'completed' }).sort({
    'completion.completedAt': -1,
  });

  const completed = [];
  const fellShort = [];
  for (const g of goals) {
    const pace = computePace(g);
    const rec = {
      id: g._id,
      title: g.title,
      category: g.category,
      daysHitPct: g.completion?.daysHitPct ?? pace.actualPercent,
      finishedEarlyDays: g.completion?.finishedEarlyDays ?? 0,
      reflection: g.completion?.reflection ?? '',
      dailyTrack: g.completion?.dailyTrack ?? [],
      completedAt: g.completion?.completedAt,
    };
    if ((rec.daysHitPct ?? 0) >= 60) completed.push(rec);
    else fellShort.push(rec);
  }

  const allCompleted = await Goal.countDocuments({ userId: req.user._id, status: 'completed' });
  const totalTasksDone = await Task.countDocuments({ userId: req.user._id, done: true });

  res.json({
    summary: {
      completed: completed.length,
      tasksDone: totalTasksDone,
      onTimePct: completed.length
        ? Math.round((completed.filter((c) => c.finishedEarlyDays >= 0).length / (completed.length + fellShort.length || 1)) * 100)
        : 0,
    },
    completed,
    fellShort,
  });
});

export const activity = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ userId: req.user._id, done: true })
    .sort({ doneAt: -1, date: -1 })
    .limit(200)
    .populate('goalId', 'title category');

  const byDay = {};
  for (const t of tasks) {
    (byDay[t.date] ||= []).push({
      id: t._id,
      title: t.title,
      emote: t.emote,
      note: t.note,
      goal: t.goalId ? { id: t.goalId._id, title: t.goalId.title } : null,
    });
  }

  const days = Object.keys(byDay)
    .sort((a, b) => b.localeCompare(a))
    .map((date) => ({ date, tasks: byDay[date] }));

  res.json({ days });
});

/** Consecutive days (ending today or yesterday) with at least one completed task. */
async function computeStreak(userId) {
  const doneTasks = await Task.find({ userId, done: true }).select('date');
  const daysWithWork = new Set(doneTasks.map((t) => t.date));
  if (daysWithWork.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  // allow the streak to count from today or yesterday
  if (!daysWithWork.has(todayStr(cursor))) cursor.setDate(cursor.getDate() - 1);

  while (daysWithWork.has(todayStr(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
