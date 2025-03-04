import { initWorkers, stopWorkers } from '@/services/crawl/workers';
import { NextFunction, Request, Response } from 'express';

const start = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const initializationSuccessful = await initWorkers();
        res.json({ success: initializationSuccessful });
    } catch (err) {
        next(err);
    }
};

const stop = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        await stopWorkers();
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

export { start, stop };
