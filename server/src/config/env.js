import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load .env from the server root regardless of cwd. `override` lets the file
// win over ambient shell vars (e.g. a stray PORT) so the dev setup is deterministic.
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

export const env = {
  MONGO_URI: process.env.MONGO_URI || '',
  PORT: Number(process.env.PORT || 4000),
  JWT_SECRET: process.env.JWT_SECRET || 'cairn-dev-secret-change-me',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Absolute path where the embedded Mongo persists data when MONGO_URI is unset.
export const EMBEDDED_DB_PATH = path.resolve(__dirname, '../../../.mongo-data');
