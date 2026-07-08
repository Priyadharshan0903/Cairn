import mongoose from 'mongoose';

const completionSchema = new mongoose.Schema(
  {
    finishedEarlyDays: { type: Number, default: 0 },
    daysHitPct: { type: Number, default: 0 },
    reflection: { type: String, default: '' },
    dailyTrack: { type: [Boolean], default: [] },
    completedAt: { type: Date },
  },
  { _id: false }
);

const goalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'habit' }, // fitness | reading | project | habit ...
    type: { type: String, enum: ['habit', 'count', 'project'], default: 'habit' },
    status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active', index: true },
    priority: { type: Number, default: 0 }, // sort order (drag-to-reorder)
    startDate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    rhythm: { type: Number, enum: [5, 7], default: 7 }, // days per week
    target: { type: Number, required: true, min: 1 }, // 30 days | 12 books | 40-day project
    unitLabel: { type: String, default: 'days' }, // "days" | "books" | "day"
    progressValue: { type: Number, default: 0 }, // actual count achieved
    completion: { type: completionSchema, default: undefined },
  },
  { timestamps: true }
);

goalSchema.methods.toJSON = function () {
  const o = this.toObject();
  o.id = o._id;
  delete o._id;
  delete o.__v;
  return o;
};

export const Goal = mongoose.model('Goal', goalSchema);
