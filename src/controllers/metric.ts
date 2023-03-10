import { InternalError } from '@errors/internalServerError';
import { logger } from '@utils/logger';
import { Request, Response } from 'express';
import prometheus from 'prom-client';

export const metricControllerHandler = async (req: Request, res: Response) => {
  logger.info('Metric controller handler started');
  try {
    res.set('Content-Type', prometheus.register.contentType);
    res.status(200).send(await prometheus.register.metrics());
  } catch (error) {
    logger.error('An error thrown at History controller.', error);
    const internalError: InternalError = new InternalError((error as Error).message);
    !req.timedout && res.status(internalError.status).send({ message: internalError.message });
  }
};
