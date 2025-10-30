import { countDomains, listDomains } from '@/services/domain.service';
import { NextFunction, Request, Response } from 'express';

const getCountDomains = async (
  _req: Request,
  res: Response,
  _: NextFunction
) => {
  const numberOfKnownDomains = await countDomains();
  res.json(numberOfKnownDomains);
};

const getListDomains = async (
  { query }: Request,
  res: Response,
  _: NextFunction
) => {
  const domains = await listDomains({
    page: query.page ? parseInt(query.page.toString()) : 1,
    pageSize: query.pageSize ? parseInt(query.pageSize.toString()) : 15,
    sort: query.sort
      ? JSON.parse(decodeURIComponent(query.sort.toString()))
      : undefined,
    search: query.search?.toString()
  });

  const count = await countDomains();

  res.json({ results: domains, count });
};

export { getCountDomains, getListDomains };
