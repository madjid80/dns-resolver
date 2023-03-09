import { Request, Response } from 'express';
import { logger } from '@utils/logger';
import { IDomain } from '@interfaces/domain.interface';
import { createOrUpdateDomain, getByDomain } from '@repositories/domain';
import { extractDomainHost, lookupDomainHost } from '@services/domainServices';

export const lookupControllerHandler = async (req: Request, res: Response) => {
  logger.info('Look up controller handler started');
  const { domain = '' } = req.query;
  const host = extractDomainHost(domain.toString());

  try {
    let domainAddress: IDomain = await getByDomain(host);
    logger.info('domain in DB', domain, domainAddress);
    if (!domainAddress) {
      domainAddress = { domain: host, addresses: [], createdAt: new Date().toISOString() };
    }
    domainAddress = await lookupDomainHost(domainAddress);
    await createOrUpdateDomain(domainAddress);
    logger.info('domain created in DB', domainAddress);

    !req.timedout &&
      res.status(200).send({
        domain: domainAddress.domain,
        addresses: domainAddress.addresses.map(({ ip }) => ({ ip })),
        createdAt: new Date(domainAddress.createdAt).getTime(),
      });
  } catch (error) {
    logger.error('Error happened in lookupControllerHandler', error);
    const { status = 500, message } = error as { status: number; message: string };
    !req.timedout && res.status(status).send({ message });
  }
};
