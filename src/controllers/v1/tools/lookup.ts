import { Request, Response } from 'express';
import { logger } from '@utils/logger';
import { IDomain } from '@interfaces/domain.interface';
import { createDomain, getByDomain } from '@repositories/domain';
import { extractDomainHost, lookupDomainHost } from '@services/domainServices';

export const lookupControllerHandler = async (req: Request, res: Response) => {
  logger.info('Look up controller handler started');
  const { domain = '' } = req.query;
  const host = extractDomainHost(domain.toString());
  let domainAddress: IDomain;
  try {
    domainAddress = await getByDomain(host);
    logger.info('domain found in DB', domain, domainAddress);
    if (!req.timedout) {
      res.status(200).send(domainAddress!.ip);
    }
    return
    
  } catch (error) {
    logger.error('Error happened in lookupControllerHandler', error);
  }
  try {
    domainAddress = await lookupDomainHost(host);
  } catch (error) {
    logger.error('Error happened in lookupControllerHandler', error);
    if (!req.timedout) {
      res.status(400).send((error as Error).message);
      return;
    }
    return 
  }
  try {
    await createDomain(domainAddress!);
    logger.info('domain created in DB', domain, { isTimeout: req.timedout });
    if (!req.timedout) {
      res.status(200).send(domainAddress!.ip);
    }
  } catch (error) {
    logger.error('Error happened in lookupControllerHandler', error);
    if (!req.timedout) {
      res.status(500).send((error as Error).message);
      return;
    }
  }
};
