import { Request, Response } from 'express';
import extractDomain from 'extract-domain';
import * as dnsLookup from 'node:dns';
import { logger } from '@utils/logger';

export const lookupControllerHandler = (req: Request, res: Response) => {
  logger.info('Look up controller handler started'); 
  const { domain = "" } = req.query;
  const regexForDomain = /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/
  if(!regexForDomain.test(domain.toString())){
    logger.error(`${domain} is not a correct format and regex result is ${regexForDomain.test(domain.toString())}`)
    res.status(400).send('Please send correct domain format.')
    return
  }
  const parsedDomain = extractDomain(domain.toString(),{ tld: true })
  logger.info('extracted domain part is: ', parsedDomain)
  
  res.status(200).send('Ok');
};
