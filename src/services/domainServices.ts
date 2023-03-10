import { IQuery } from '@interfaces/query';
import { logger } from '@utils/logger';
import extractDomain from 'extract-domain';
import * as dnsPromises from 'node:dns/promises';
import { LookupAddress } from 'node:dns';
import { BadRequestError } from '@errors/badRequestError';
import { IAddress } from '@interfaces/address';

function extractDomainHost(requestedDomain: string): string {
  const regexForDomain = /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;
  const isValidate = regexForDomain.test(requestedDomain);
  if (!isValidate) {
    logger.error(`${requestedDomain} is not a correct format and regex result is ${isValidate}`);
    throw new BadRequestError('Please send correct domain format.');
  }
  const parsedDomain = extractDomain(requestedDomain, { tld: true });
  logger.info('extracted domain part is: ', parsedDomain);
  return parsedDomain;
}

async function lookupDomainHost(query: IQuery): Promise<IQuery> {
  let address: string[];
  try {
    address = await dnsPromises.resolve4(query.domain);
    logger.info('Address for extracted domain is: ', address);
    query.addresses = address.map((ip) => ({ ip } as IAddress));
    return query;
  } catch (error) {
    logger.error(error);
    throw new BadRequestError((error as Error).message);
  }
}

export { extractDomainHost, lookupDomainHost };
