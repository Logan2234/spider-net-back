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
        await site.update({ priority: site.priority + 1 }, { transaction });
    }
};

const countSitesInQueue = async (): Promise<number> => Queue.count();

/**
 * Retrieve a batch of sites from the queue to be crawled in parallel.
 *
 * @param n The number of sites to retrieve. Defaults to 50.
 * @returns An array of `Queue` objects.
 *
 * This method retrieves a batch of sites from the queue, marks them as being crawled,
 * and returns them in an array. The sites are ordered by priority, depth, and creation
 * time, and are limited to the specified number. If no sites are available, an empty
 * array is returned.
 */
const getSiteFromQueueParallel = async (n: number = 50): Promise<Queue[]> => {
    const sites: Queue[] = await sequelize.query(
        `
        SELECT * FROM queue
        WHERE state = :state
        ORDER BY "priority" DESC, "depth" ASC, "createdAt" ASC
        LIMIT :limit
        FOR UPDATE SKIP LOCKED
        `,
        {
            replacements: { state: SiteState.UNPROCESSED, limit: n },
            model: Queue,
            mapToModel: true
        }
    );

    if (sites.length === 0) return [];

    await Queue.update({ state: SiteState.CRAWLING }, { where: { url: sites.map((site) => site.url) } });

    return sites;
};

export { addInQueue, countSitesInQueue, getSiteFromQueueParallel };
