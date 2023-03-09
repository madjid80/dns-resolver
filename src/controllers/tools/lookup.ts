import { Request, Response } from 'express';
import extractDomain from 'extract-domain';
import * as dnsPromises from 'node:dns/promises';
import { logger } from '@utils/logger';
import { LookupAddress } from 'node:dns';

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
  try {
    const address: LookupAddress = await dnsPromises.lookup(parsedDomain, 4);
    if (!req.timedout) {
      res.status(200).send(address);
    }
  } catch (error) {
    if (!req.timedout) {
      res.status(400).send((error as Error).message);
    }
  }
};
