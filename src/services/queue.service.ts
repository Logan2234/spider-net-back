import sequelize from '@/configs/db.config';
import { SiteState } from '@/enums/siteState';
import { getDomain, trimUrl } from '@/utils/linkHelper';
import { Transaction } from 'sequelize';
import { URL } from 'url';
import Queue from '../models/queue.model';
import { addDomain } from './domain.service';
import { addLink } from './link.service';
import { isSiteVisited } from './visitedSite.service';

const addInQueue = async (
    url: URL,
    priority: number = 0,
    depth: number = 0,
    from: URL | string | null = null,
    transaction: Transaction | null = null
): Promise<void> => {
    const domain = getDomain(url);

    if (!domain) {
        return;
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return;
    }

    const urlString = trimUrl(url);
    await addDomain(url, transaction);

    if (from) {
        await addLink(from, url, transaction);
    }

    const siteAlreadyVisited = await isSiteVisited(urlString, transaction);

    if (siteAlreadyVisited) {
        return;
    }

    const [site, created] = await Queue.findOrCreate({
        where: { url: urlString },
        defaults: {
            url: urlString,
            domain,
            priority,
            depth,
            state: SiteState.UNPROCESSED
        },
        transaction
    });

    if (!created) {
        // If the site was already in the queue, update its priority
        await site.update({ priority: site.priority + 1 }, { transaction });
    }
};

const countSitesInQueue = async (): Promise<number> => {
    return Queue.count();
};

const getSiteFromQueueParallel = async (n: number = 50): Promise<Queue[]> => {
    return await sequelize.transaction(async (transaction) => {
        const sites = await Queue.findAll({
            where: { state: SiteState.UNPROCESSED },
            order: [
                ['priority', 'DESC'],
                ['depth', 'ASC'],
                ['createdAt', 'ASC']
            ],
            limit: n,
            lock: true,
            skipLocked: true,
            transaction
        });

        if (sites.length === 0) return [];

        await Queue.update(
            { state: SiteState.CRAWLING },
            { where: { url: sites.map((site) => site.url) }, transaction }
        );

        return sites;
    });
};

export { addInQueue, countSitesInQueue, getSiteFromQueueParallel };
