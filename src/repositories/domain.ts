import { IDomain } from '@interfaces/domain.interface';
import Domain from '@models/domain';

async function createOrUpdateDomain(domain: IDomain) {
  return Domain.updateOne({ domain: domain.domain }, { $set: { addresses: domain.addresses } }, { upsert: true });
}

async function getByDomain(domain: string) {
  return Domain.findOne({ domain });
}

export { createOrUpdateDomain, getByDomain };
