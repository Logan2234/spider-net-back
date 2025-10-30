import { numberOfActiveWorkers } from '@/services/crawl/old/workers';
import { NextFunction, Request, Response } from 'express';

const getWorkersInfo = async (
  _req: Request,
  res: Response,
  _: NextFunction
) => {
  const numberOfWorkers = numberOfActiveWorkers();
  res.json({ numberOfWorkers });
};

export { getWorkersInfo };
