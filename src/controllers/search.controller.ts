import searchDomains from '@/services/searchDomains';
import { NextFunction, Request, Response } from 'express';

const searchWebsites = async (req: Request, res: Response, _: NextFunction) => {
  const { searchTerm = '' } = req.query;
  const result = await searchDomains(searchTerm.toString());
  res.status(200).json(result);
};

export default searchWebsites;
