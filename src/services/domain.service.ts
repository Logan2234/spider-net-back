import Domain from '@/models/domain.model';
import sequelize, { Op, WhereOptions } from 'sequelize';

const addDomains = async (links: string[]): Promise<void> => {
  const domains = [
    ...new Set<string>(links.map((link) => new URL(link).hostname))
  ];

  await Domain.bulkCreate(
    domains.map((domain) => ({
      name: domain,
      lastVisited: null
    })),
    { ignoreDuplicates: true }
  );
};

const updateDomainVisitDate = async (domain: string): Promise<void> => {
  await Domain.update(
    { lastVisited: new Date(), nbVisits: sequelize.literal('"nbVisits" + 1') },
    { where: { name: domain } }
  );
};

const listDomains = async (
  params: {
    page: number;
    pageSize: number;
    sort?: { by: string; dir: 0 | 1 | -1 };
    search?: string;
  } = { page: 1, pageSize: 15 }
): Promise<Domain[]> => {
  const { page, pageSize, sort, search } = params;

  const where: WhereOptions<Domain> = {};

  if (search) {
    where.name = { [Op.iLike]: `%${search}%` };
  }

  const domains = await Domain.findAll({
    where,
    order:
      sort?.by && sort.dir !== 0
        ? [[sort.by, sort.dir === 1 ? 'ASC' : sort.dir === -1 ? 'DESC' : '']]
        : [['createdAt', 'DESC']],
    limit: pageSize,
    offset: (page - 1) * pageSize,
    raw: true
  });

  return domains;
};

const countDomains = async (): Promise<number> => Domain.count();

export { addDomains, countDomains, listDomains, updateDomainVisitDate };
