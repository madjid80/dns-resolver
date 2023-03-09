import { IDomain } from '@interfaces/domain.interface';
import { logger } from '@utils/logger';
import extractDomain from 'extract-domain';
import * as dnsPromises from 'node:dns/promises';
import { LookupAddress } from 'node:dns';

function extractDomainHost(requestedDomain: string): string {
  const regexForDomain = /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;
  const isValidate = regexForDomain.test(requestedDomain);
  if (!isValidate) {
    logger.error(`${requestedDomain} is not a correct format and regex result is ${isValidate}`);
    throw new Error('Please send correct domain format.');
  }
  const parsedDomain = extractDomain(requestedDomain, { tld: true });
  logger.info('extracted domain part is: ', parsedDomain);
  return parsedDomain;
}

async function lookupDomainHost(host: IDomain): Promise<IDomain> {
  let address: LookupAddress;
  try {
    address = await dnsPromises.lookup(host.domain, 4);
    logger.info('Address for extracted domain is: ', address);
    if(host.addresses.findIndex(item => item.ip === address.address) === -1){
      host.addresses.push({ip: address.address})
    }
    return host;
  } catch (error) {
    throw error;
  }
}

export { extractDomainHost, lookupDomainHost };
