import { logger } from '@utils/logger';
import { NextFunction, Response, Request } from 'express';
import prometheus from 'prom-client';

const requestsCounter = new prometheus.Counter({
  name: 'requests_total',
  help: 'Total number of requests',
});

const responseTimeGauge = new prometheus.Histogram({
  name: 'response_time',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
});

export const prometheusMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Prometheus middle ware started');
  const start = Date.now();
  requestsCounter.inc();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('duration of the request is: ', duration);
    responseTimeGauge.labels(req.url).observe(duration);
  });
  next();
};
