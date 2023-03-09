import { IQuery } from '@interfaces/query';
import Query from '@models/query';

async function createOrUpdateQuery(query: IQuery) {
  return Query.updateOne(
    { domain: query.domain },
    { $set: { addresses: query.addresses, clientIp: query.clientIp } },
    { upsert: true }
  );
}

async function getByDomain(query: string) {
  return Query.findOne({ query });
}

export { createOrUpdateQuery, getByDomain };
