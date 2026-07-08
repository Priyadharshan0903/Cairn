import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import goalRoutes from './routes/goals.js';
import taskRoutes from './routes/tasks.js';
import statsRoutes from './routes/stats.js';
import { notFound, errorHandler } from './middleware/error.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ ok: true, service: 'cairn' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/goals', goalRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/stats', statsRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
