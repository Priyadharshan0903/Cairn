import mongoose from 'mongoose';
import fs from 'node:fs';
import { env, EMBEDDED_DB_PATH } from './env.js';

// The database name Cairn always uses. Passed explicitly to mongoose so we
// connect to `cairn` regardless of whether MONGO_URI includes a db in its path.
const DB_NAME = 'cairn';

let memoryServer = null;

/**
 * Connect to MongoDB. If MONGO_URI is set (Docker/Atlas) we use it directly.
 * Otherwise we boot an embedded MongoDB persisted to ./.mongo-data so the app
 * runs with zero external setup while still keeping data across restarts.
 */
export async function connectDB() {
  let uri = env.MONGO_URI;

  if (!uri && env.NODE_ENV === 'production') {
    throw new Error(
      'MONGO_URI is required in production. Set it to your MongoDB connection string ' +
        '(e.g. a MongoDB Atlas URI or a Railway MongoDB service variable).'
    );
  }

  if (!uri) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    fs.mkdirSync(EMBEDDED_DB_PATH, { recursive: true });
    memoryServer = await MongoMemoryServer.create({
      instance: { dbPath: EMBEDDED_DB_PATH, storageEngine: 'wiredTiger', dbName: DB_NAME },
    });
    uri = memoryServer.getUri(DB_NAME);
    console.log('→ Using embedded MongoDB (persisted to .mongo-data)');
  } else {
    console.log('→ Using MongoDB at', uri.replace(/\/\/[^@]*@/, '//***@'));
  }

  mongoose.set('strictQuery', true);
  // Force the db name so a MONGO_URI without one (or with a different one) still
  // lands in `cairn` rather than falling back to `test`.
  await mongoose.connect(uri, { dbName: DB_NAME });
  return uri;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}
