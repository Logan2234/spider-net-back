import retrieveDomainStats from '@/services/retrieveDomainStats';
import { NextFunction, Request, Response } from 'express';

const getStats = async ({ query }: Request, res: Response, next: NextFunction) => {
    try {
        const domainName = query.domain;

        if (!domainName) {
            throw new Error('Domain is required');
        }

        const domainStats = await retrieveDomainStats(domainName);

        return res.json(domainStats);
    } catch (err) {
        next(err);
    }
};

export default getStats;
