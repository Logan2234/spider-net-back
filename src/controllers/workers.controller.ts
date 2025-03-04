import { hasWorkers } from '@/services/crawl/workers';
import { NextFunction, Request, Response } from 'express';

const getWorkersInfo = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const numberOfWorkers = await hasWorkers();
        res.json({ numberOfWorkers });
    } catch (err) {
        next(err);
    }
};

export { getWorkersInfo };
