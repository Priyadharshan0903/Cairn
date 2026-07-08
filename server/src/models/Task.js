import mongoose from 'mongoose';

export const EMOTES = ['grin', 'fire', 'sprout', 'exhausted', 'sleep'];

const taskSchema = new mongoose.Schema(
  {
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD (the day the task belongs to)
    title: { type: String, required: true, trim: true },
    note: { type: String, default: '' },
    done: { type: Boolean, default: false },
    doneAt: { type: Date },
    emote: { type: String, enum: [...EMOTES, null], default: null },
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

taskSchema.methods.toJSON = function () {
  const o = this.toObject();
  o.id = o._id;
  delete o._id;
  delete o.__v;
  return o;
};

export const Task = mongoose.model('Task', taskSchema);
