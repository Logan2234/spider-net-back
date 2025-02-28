import { countDomains } from '@/services/domain.service';
import { NextFunction, Request, Response } from 'express';

const getCountDomains = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const numberOfKnownDomains = await countDomains();
        res.json(numberOfKnownDomains);
    } catch (err) {
        next(err);
    }
};

export { getCountDomains };
