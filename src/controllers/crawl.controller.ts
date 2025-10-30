import {
  enqueueCrawlJob,
  purgeCrawlJobs
} from '@/services/crawl/crawl.service';
import { initWorkers, stopWorkers } from '@/services/crawl/old/workers';
import { NextFunction, Request, Response } from 'express';

const start = async (
  _req: Request,
  res: Response,
  _: NextFunction
): Promise<void> => {
  await initWorkers();
  res.end();
};

const stop = async (_req: Request, res: Response, _: NextFunction) => {
  await stopWorkers();
  res.end();
};

const startV2 = async (
  _req: Request,
  res: Response,
  _: NextFunction
): Promise<void> => {
  await enqueueCrawlJob();
  res.end();
};

const stopV2 = async (_req: Request, res: Response, _: NextFunction) => {
  await purgeCrawlJobs();
  res.end();
};

export { start, startV2, stop, stopV2 };
