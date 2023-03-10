import express from 'express';
import { Server } from 'http';
import dbBootstrap from './bootstrap/db';
import { logger } from '@utils/logger';
import controllers from './controllers';
import { accessLogMiddleware } from './middlewares/logger';
import timeout from 'connect-timeout';
import { haltOnTimeout } from './middlewares/timeout';
import { errorHandlerMiddleware } from './middlewares/errorHandler';
import { prometheusMiddleware } from './middlewares/prometheus';

const app = express();
const port = process.env.PORT || 3000;

const db = dbBootstrap.mongoConnect().catch((error) => {
  logger.error('Mongo has an error', error);
  logger.info('Going to shutdown the server.');
  process.exit(0);
});

app.use(express.json()) 
app.use(prometheusMiddleware)
app.use(accessLogMiddleware);
app.use(timeout('2s'));
app.use(controllers.router);
app.use(haltOnTimeout);
app.use(errorHandlerMiddleware);


const server: Server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

const shutdown = (signal: NodeJS.Signals) => {
  logger.info('Application Crashed.');
  logger.info('Going to shutdown the server.');
  server.close(() => {
    logger.info('Http server closed.');
    process.exit(0);
  });
};
process.on('SIGTERM', shutdown).on('SIGINT', shutdown).on('uncaughtException', shutdown);
