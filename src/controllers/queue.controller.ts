import { ApiError } from '@/utils/apiError';
import { NextFunction, Request, Response } from 'express';
import { addInQueue, countSitesInQueue } from '../services/queue.service';

const getCountSitesInQueue = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const numberInQueue = await countSitesInQueue();
        res.json(numberInQueue);
    } catch (err) {
        next(err);
    }
};

const postAddSiteInQueue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body?.url) {
            throw new Error('URL is required');
        }

        const urlString = req.body.url;
        const priority = req.body?.priority || 0;

        try {
            const url = new URL(urlString);

            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                throw new ApiError('Invalid URL, must start with http:// or https://', 400);
            }

            await addInQueue(url, priority);
        } catch (err) {
            if (err instanceof TypeError) {
                throw new ApiError('Invalid URL', 400);
            }

            throw err;
        }

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

export { getCountSitesInQueue, postAddSiteInQueue };
