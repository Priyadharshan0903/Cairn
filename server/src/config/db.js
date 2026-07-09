import mongoose from 'mongoose';
import fs from 'node:fs';
import { env, EMBEDDED_DB_PATH } from './env.js';

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
      instance: { dbPath: EMBEDDED_DB_PATH, storageEngine: 'wiredTiger', dbName: 'cairn' },
    });
    uri = memoryServer.getUri('cairn');
    console.log('→ Using embedded MongoDB (persisted to .mongo-data)');
  } else {
    console.log('→ Using MongoDB at', uri.replace(/\/\/[^@]*@/, '//***@'));
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  return uri;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}
