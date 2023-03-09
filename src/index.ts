import express from 'express';
import { Server } from 'http';
import dbBootstrap from './bootstrap/db';
import { logger } from '@utils/logger';
import controllers from './controllers';
import { accessLogMiddleware } from './middlewares/logger';

const app = express();
const port = process.env.PORT || 3000;

const db = dbBootstrap.mongoConnect().catch((error) => {
    logger.error('Mongo has an error', error)
    logger.info('Going to shutdown the server.');
    process.exit(0)
  });

app.use(accessLogMiddleware)
app.use(controllers.router)

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
