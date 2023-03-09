import { IQuery } from '@interfaces/query';
import Query from '@models/query';

async function createOrUpdateQuery(query: IQuery):Promise<IQuery> {
  return Query.updateOne(
    { domain: query.domain },
    { $set: { addresses: query.addresses, clientIp: query.clientIp } },
    { upsert: true }
  );
}

async function getByDomain(query: string):Promise<IQuery> {
  return Query.findOne({ query });
}

async function getAllQuery(): Promise<IQuery[]> {
  return Query.find().sort({ createdAt: -1 }).limit(20);
}

export { createOrUpdateQuery, getByDomain, getAllQuery };
