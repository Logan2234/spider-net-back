import { initWorkers, stopWorkers } from '@/services/crawl/workers';
import { NextFunction, Request, Response } from 'express';

const start = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await initWorkers();
        res.end();
    } catch (err) {
        next(err);
    }
};

const stop = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        await stopWorkers();
        res.end();
    } catch (err) {
        next(err);
    }
};

export { start, stop };
