import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';

async function start() {
  await connectDB();
  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`\n  Cairn API listening on http://localhost:${env.PORT}`);
    console.log(`  Health: http://localhost:${env.PORT}/api/health\n`);
  });

  // Graceful shutdown: close the server and stop the (embedded) DB so it never
  // orphans a mongod holding the .mongo-data lock.
  let closing = false;
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, async () => {
      if (closing) return;
      closing = true;
      console.log(`\n  ${signal} received — shutting down…`);
      server.close();
      await disconnectDB().catch(() => {});
      process.exit(0);
    });
  }
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
