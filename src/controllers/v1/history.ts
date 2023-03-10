import { Request, Response } from 'express';
import { logger } from '@utils/logger';
import { IQuery } from '@interfaces/query';
import { getAllQuery } from '@repositories/query';
import { InternalError } from '@errors/internalServerError';
export const getHistoryHandler = async (req: Request, res: Response) => {
  logger.info('History controller handler started');
  try {
    const queries: IQuery[] = await getAllQuery();
    !req.timedout &&
      res.status(200).send(
        queries.map((query) => ({
          domain: query.domain,
          addresses: query.addresses.map(({ ip }) => ({ ip })),
          createdAt: new Date(query.createdAt).getTime(),
          clientIp: query.clientIp,
        }))
      );
  } catch (error) {
    logger.error('An error thrown at History controller.', error);
    const internalError: InternalError = new InternalError((error as Error).message)
    !req.timedout && res.status(internalError.status).send({ message: internalError.message });
  }
};
