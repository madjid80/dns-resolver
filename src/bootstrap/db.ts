import mongoose from 'mongoose';
import { logger } from '@utils/logger';
async function mongoConnect(): Promise<typeof mongoose> {
  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dns';
  const dbCredentials = {
    user: process.env.MONGODB_USERNAME || '',
    pass: process.env.MONGODB_PASSWORD || '',
  };
  const connectionString = `${dbUri}?${new URLSearchParams(dbCredentials)}`;

  try {
    const connection = await mongoose.connect(connectionString);
    logger.info('Connected to MongoDB successfully');
    return connection;
  } catch (err) {
    throw err;
  }
}

export default{ mongoConnect };
