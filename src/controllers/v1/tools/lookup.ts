import { Request, Response } from 'express';
import { logger } from '@utils/logger';
import { IDomain } from '@interfaces/domain.interface';
import { createOrUpdateDomain, getByDomain } from '@repositories/domain';
import { extractDomainHost, lookupDomainHost } from '@services/domainServices';

export const lookupControllerHandler = async (req: Request, res: Response) => {
  logger.info('Look up controller handler started');
  const { domain = '' } = req.query;
  const host = extractDomainHost(domain.toString());
  let domainAddress: IDomain | null = null;
  try {
    domainAddress = await getByDomain(host);
  } catch (error) {
    logger.error('Error happened in lookupControllerHandler', error);
  }
  if (!domainAddress) {
    domainAddress = { domain: host, addresses: [], createdAt: new Date() };
  } else {
    logger.info('domain found in DB', domain, domainAddress);
  }

  try {
    domainAddress = await lookupDomainHost(domainAddress);
  } catch (error) {
    logger.error('Error happened in lookupControllerHandler', error);
    if (!req.timedout) {
      res.status(400).send({ message: (error as Error).message });
      return;
    }
    return;
  }
  try {
    await createOrUpdateDomain(domainAddress);
    logger.info('domain created in DB', domain, { isTimeout: req.timedout });
    if (!req.timedout) {
      //TODO move it to presenter
      res.status(200).send({
        domain: domainAddress.domain,
        addresses: domainAddress.addresses.map(({ ip }) => ({ ip })),
        createdAt: new Date(domainAddress.createdAt).getTime(),
      });
    }
  } catch (error) {
    logger.error('Error happened in lookupControllerHandler', error);
    if (!req.timedout) {
      res.status(500).send({ message: (error as Error).message });
      return;
    }
  }
};
