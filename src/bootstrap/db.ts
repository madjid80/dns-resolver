import mongoose from 'mongoose';
import { logger } from '@utils/logger';
async function mongoConnect(): Promise<typeof mongoose> {
  const dbUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/';
  const dbUsername = process.env.MONGO_USERNAME || 'dnsuser';
  const dbPassword = process.env.MONGO_PASSWORD || 'dnspass';
  const dbName = process.env.MONGO_DB || 'dns-lookup'
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
    user: dbUsername,
    pass: dbPassword,
  };

  try {
    const connection = await mongoose.connect(dbUrl + dbName, options);
    logger.info('Connected to MongoDB successfully');
    return connection;
  } catch (err) {
    throw err;
  }
}

export default { mongoConnect };
