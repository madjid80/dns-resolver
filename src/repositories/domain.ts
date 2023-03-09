import { IDomain } from '@interfaces/domain.interface';
import Domain from '@models/domain';

async function createDomain(domain: IDomain) {
  return Domain.create(domain);
}

async function getByDomain(domain: string) {
  return Domain.findOne({domain});
}

export { createDomain,getByDomain  };
