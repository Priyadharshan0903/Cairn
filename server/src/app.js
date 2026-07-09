import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import goalRoutes from './routes/goals.js';
import taskRoutes from './routes/tasks.js';
import statsRoutes from './routes/stats.js';
import { notFound, errorHandler } from './middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Built client lives at client/dist relative to the repo root.
const CLIENT_DIST = path.resolve(__dirname, '../../client/dist');

export function createApp() {
  const app = express();

  // The SPA is served same-origin in production and authenticates with bearer
  // tokens (no cookies), so reflecting the request origin is safe and avoids a
  // stale hard-coded localhost value in production responses. Set CLIENT_ORIGIN
  // to lock it down if you ever split the frontend onto another domain.
  app.use(cors({ origin: process.env.CLIENT_ORIGIN || true, credentials: true }));
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ ok: true, service: 'cairn' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/goals', goalRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/stats', statsRoutes);

  // In production the same service serves the built SPA. If the client hasn't
  // been built (e.g. pure API dev), this block is simply skipped.
  if (fs.existsSync(CLIENT_DIST)) {
    app.use(express.static(CLIENT_DIST));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next(); // let API 404s fall through
      res.sendFile(path.join(CLIENT_DIST, 'index.html'));
    });
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
