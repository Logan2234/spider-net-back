import retrieveDomainStats from '@/services/retrieveDomainStats';
import { NextFunction, Request, Response } from 'express';

const getStats = async (req: Request, res: Response, _: NextFunction) => {
  const domainName = req.query.domain;

  if (!domainName) {
    throw new Error('Domain is required');
  }

  const domainStats = await retrieveDomainStats(domainName.toString());

  res.json(domainStats);
};

export default getStats;
