import { createLogger, LogLevelString } from 'bunyan';

const logger = createLogger({
  name: process.env.APP_NAME || 'dns-lookup',
  level: (process.env.LOG_LEVEL || 'debug') as LogLevelString,
  stream: process.stdout,
});

export { logger };
