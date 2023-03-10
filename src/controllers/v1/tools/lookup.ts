import { Request, Response } from 'express';
import { logger } from '@utils/logger';
import { IQuery } from '@interfaces/query';
import { createOrUpdateQuery, getByDomain } from '@repositories/query';
import { extractDomainHost, lookupDomainHost } from '@services/domainServices';
import { BadRequestError } from '@errors/badRequestError';
import { InternalError } from '@errors/internalServerError';
import { NotFoundError } from '@errors/notFoundError';

export const lookupControllerHandler = async (req: Request, res: Response) => {
  logger.info('Look up controller handler started');
  const { domain = '' } = req.query;
  var clientIp: string = (req.headers['x-forwarded-for'] as string) || (req.socket.remoteAddress as string);
  try {
    const host = extractDomainHost(domain.toString());
    let query: IQuery = await getByDomain(host);
    logger.info('query in DB', domain, query);
    if (!query) {
      query = { domain: host, addresses: [], createdAt: new Date().toISOString(), clientIp };
    }
    query = await lookupDomainHost(query);
    await createOrUpdateQuery(query);
    logger.info('query created in DB', query);

    !req.timedout &&
      res.status(200).send({
        domain: query.domain,
        addresses: query.addresses.map(({ ip }) => ({ ip })),
        createdAt: new Date(query.createdAt).getTime(),
        clientIp: query.clientIp,
      });
  } catch (error) {
    logger.error('Error happened in lookupControllerHandler', error);
    if (error instanceof (BadRequestError || InternalError || NotFoundError)) {
      const status = (error as (BadRequestError | InternalError | NotFoundError)).status; 
      const message = (error as (BadRequestError | InternalError | NotFoundError)).message; 
      !req.timedout && res.status(status).send({ message });
    }else{
      !req.timedout && res.status(500).send({ message: (error as Error).message });
    }
    
  }
};
