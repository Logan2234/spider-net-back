import { countDomains } from '@/services/domain.service';
import { countLinks } from '@/services/link.service';
import { countSitesInQueue } from '@/services/queue.service';
import { countVisitedSites } from '@/services/visitedSite.service';
import { NextFunction, Request, Response } from 'express';

const getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const numberOfDomains = await countDomains();
        const numberOfVisitedSites = await countVisitedSites();
        const numberInQueue = await countSitesInQueue();
        const numberOfLinks = await countLinks();

        res.json({ numberInQueue, numberOfDomains, numberOfLinks, numberOfVisitedSites });
    } catch (err) {
        next(err);
    }
};

export { getStats };
