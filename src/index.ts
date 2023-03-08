import 'module-alias/register';
import express from 'express';
import { Server } from 'http';
import dbBootstrap from './bootstrap/db';
import { logger } from '@utils/logger';

const app = express();
const port = 3000;

const db = dbBootstrap.mongoConnect().catch((error) => {
    logger.error('Mongo has an error', error)
    logger.info('Going to shutdown the server.');
    process.exit(0)
  });

const server: Server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

process.on('SIGTERM', () => {
  logger.info('Application Crashed.');
  logger.info('Going to shutdown the server.');
  server.close(() => {
    logger.info('Http server closed.');
    process.exit(0);
  });
});
