import { Request, Response } from 'express';
import extractDomain from 'extract-domain';
import * as dnsPromises from 'node:dns/promises';
import { logger } from '@utils/logger';
import { LookupAddress } from 'node:dns';
import { IDomain } from '@interfaces/domain.interface';
import { createDomain } from '@repositories/domain';

export const lookupControllerHandler = async (req: Request, res: Response) => {
  logger.info('Look up controller handler started');
  const { domain = '' } = req.query;
  const regexForDomain = /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;
  if (!regexForDomain.test(domain.toString())) {
    logger.error(`${domain} is not a correct format and regex result is ${regexForDomain.test(domain.toString())}`);
    res.status(400).send('Please send correct domain format.');
    return;
  }
  const parsedDomain = extractDomain(domain.toString(), { tld: true });
  logger.info('extracted domain part is: ', parsedDomain);
  let address: LookupAddress;
  try {
    address = await dnsPromises.lookup(parsedDomain, 4);
    logger.info('Address for extracted domain is: ', address);
  } catch (error) {
    if (!req.timedout) {
      res.status(400).send((error as Error).message);
      return;
    }
  }

  try {
    const domain: IDomain = { ip: address!.address, domain: parsedDomain };
    await createDomain(domain);
    logger.info('domain created in DB', domain, { isTimeout: req.timedout });
    if (!req.timedout) {
      res.status(200).send(address!.address);
    }
  } catch (error) {
    logger.error('Error happened in lookupControllerHandler', error);
    if (!req.timedout) {
      res.status(500).send((error as Error).message);
      return;
    }
  }
};
