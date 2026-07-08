/**
 * Seeds a demo account matching the Cairn mockups.
 *   login:  demo@cairn.app  /  climbon
 * Run with: npm run seed
 */
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from './config/db.js';
import { User } from './models/User.js';
import { Goal } from './models/Goal.js';
import { Task } from './models/Task.js';
import { todayStr, addDays } from './lib/dates.js';

const DEMO_EMAIL = 'demo@cairn.app';
const DEMO_PASSWORD = 'climbon';

// Anchor everything relative to "today" so the pace numbers stay lifelike.
const TODAY = todayStr();

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteOne({ email: DEMO_EMAIL }).then(async () => {
      const existing = await User.findOne({ email: DEMO_EMAIL });
      if (existing) {
        await Goal.deleteMany({ userId: existing._id });
        await Task.deleteMany({ userId: existing._id });
      }
    }),
  ]);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await User.create({ name: 'Arjun', email: DEMO_EMAIL, passwordHash });
  const uid = user._id;

  // day 38 of 60 → started 37 days ago, ends in 22 days. actual 48%, target ~62%.
  const marathon = await Goal.create({
    userId: uid,
    title: 'Run my first half marathon',
    category: 'fitness',
    type: 'habit',
    status: 'active',
    priority: 1,
    // total 43 days, day 24 → "should be here" ≈ 55%, actual 48% → 3 days behind
    startDate: addDays(TODAY, -23),
    deadline: addDays(TODAY, 20),
    rhythm: 5,
    target: 100,
    unitLabel: 'days',
    progressValue: 48,
  });

  const books = await Goal.create({
    userId: uid,
    title: 'Read 12 books this year',
    category: 'reading',
    type: 'count',
    status: 'active',
    priority: 2,
    // 5 of 12 (~42%) at ~40% through the year → on track
    startDate: addDays(TODAY, -146),
    deadline: addDays(TODAY, 219),
    rhythm: 7,
    target: 12,
    unitLabel: 'books',
    progressValue: 5,
  });

  const portfolio = await Goal.create({
    userId: uid,
    title: 'Launch portfolio site',
    category: 'project',
    type: 'project',
    status: 'paused',
    priority: 3,
    startDate: addDays(TODAY, -11),
    deadline: addDays(TODAY, 29),
    rhythm: 7,
    target: 40,
    unitLabel: 'day',
    progressValue: 8,
  });

  const meditate = await Goal.create({
    userId: uid,
    title: 'Meditate every day · 30 days',
    category: 'habit',
    type: 'habit',
    status: 'active',
    priority: 4,
    startDate: addDays(TODAY, -17),
    deadline: addDays(TODAY, 13),
    rhythm: 7,
    target: 100,
    unitLabel: 'days',
    progressValue: 63,
  });

  // A finished goal, for the History / reflection screens.
  await Goal.create({
    userId: uid,
    title: 'Meditate 30 days',
    category: 'habit',
    type: 'habit',
    status: 'completed',
    priority: 5,
    startDate: addDays(TODAY, -60),
    deadline: addDays(TODAY, -26),
    rhythm: 7,
    target: 30,
    unitLabel: 'days',
    progressValue: 30,
    completion: {
      finishedEarlyDays: 4,
      daysHitPct: 87,
      reflection:
        'Mornings, before the phone — that’s the only slot that stuck. Ten minutes was plenty; the streak did more for me than the length.',
      dailyTrack: Array.from({ length: 26 }, (_, i) => i % 8 !== 5),
      completedAt: new Date(addDays(TODAY, -26) + 'T09:00:00'),
    },
  });

  // Today's tasks for the marathon goal (2 of 4 done, with notes + emotes).
  await Task.insertMany([
    {
      goalId: marathon._id, userId: uid, date: TODAY, position: 0,
      title: 'Easy 5K recovery run', note: 'Legs felt strong — held 6:10 pace the whole way.',
      done: true, doneAt: new Date(), emote: 'fire',
    },
    {
      goalId: marathon._id, userId: uid, date: TODAY, position: 1,
      title: 'Foam roll + calf stretch', note: '10 min. Left calf still tight.',
      done: true, doneAt: new Date(), emote: 'grin',
    },
    { goalId: marathon._id, userId: uid, date: TODAY, position: 2, title: 'Hydration — hit 3L', done: false },
    { goalId: marathon._id, userId: uid, date: TODAY, position: 3, title: 'Core & mobility drills', done: false },
  ]);

  // Today's tasks for the books goal (1 of 3 done).
  await Task.insertMany([
    {
      goalId: books._id, userId: uid, date: TODAY, position: 0,
      title: 'Read 20 pages', note: 'Ch. 4 on habit stacking — genuinely good.',
      done: true, doneAt: new Date(), emote: 'sprout',
    },
    { goalId: books._id, userId: uid, date: TODAY, position: 1, title: 'Write 3 takeaways', done: false },
    { goalId: books._id, userId: uid, date: TODAY, position: 2, title: 'Add 2 highlights to notes', done: false },
  ]);

  // Some prior-day completed tasks so streak + activity log have history.
  for (let i = 1; i <= 5; i++) {
    const d = addDays(TODAY, -i);
    await Task.insertMany([
      { goalId: marathon._id, userId: uid, date: d, position: 0, title: 'Training run', done: true, doneAt: new Date(d + 'T08:00:00'), emote: 'fire' },
      { goalId: meditate._id, userId: uid, date: d, position: 1, title: 'Evening meditation', done: true, doneAt: new Date(d + 'T21:00:00'), emote: 'sprout' },
    ]);
  }

  console.log('\n  Seeded demo account:');
  console.log(`    email:    ${DEMO_EMAIL}`);
  console.log(`    password: ${DEMO_PASSWORD}`);
  console.log('    goals:    4 active/paused + 1 completed, with tasks & history\n');

  await disconnectDB();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
