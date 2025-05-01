import sequelize from '@/configs/db.config';
import { SiteState } from '@/enums/siteState';
import { QueueBelongsToDomain } from '@/models/domain.model';
import { Op, Sequelize } from 'sequelize';
import { URL } from 'url';
import Queue from '../models/queue.model';
import { addDomains } from './domain.service';
import { addLinks } from './link.service';
import { addToVisitedSites, isSiteVisited } from './visitedSite.service';

const updateSiteAsVisited = async (originUrl: string, newUrls: URL[]): Promise<void> => {
    const site = await getSiteInQueueByUrl(originUrl);

    if (!site) {
        return;
    }

    await addInQueue(newUrls, 0, site.depth + 1, site.url);
    await addToVisitedSites(originUrl);
    await site.destroy();
};

const addInQueue = async (
    urls: URL[],
    priority: number = 0,
    depth: number = 0,
    from: URL | string | null = null
): Promise<void> => {
    await addDomains(urls);
    await addLinks(from, urls);

    for (const { href, hostname } of urls) {
        const siteAlreadyVisited = await isSiteVisited(href);

        if (siteAlreadyVisited) {
            return;
        }

        const [site, created] = await Queue.findOrCreate({
            where: { url: href },
            defaults: {
                url: href,
                domain: hostname,
                priority,
                depth,
                state: SiteState.UNPROCESSED
            }
        });

        if (!created) {
            await site.update({ priority: site.priority + 1 });
        }
    }
};

const countPendingSites = async (): Promise<number> =>
    Queue.count({ where: { state: [SiteState.UNPROCESSED, SiteState.CRAWLING] } });

const countErroredSites = async (): Promise<number> =>
    Queue.count({ where: { state: SiteState.ERROR } });

const getSiteInQueueByUrl = async (url: string): Promise<Queue | null> =>
    Queue.findOne({ where: { url } });

const updateSiteAsFailed = async (url: string, errorMessage: string): Promise<void> => {
    await Queue.update({ state: SiteState.ERROR, errorMessage }, { where: { url } });
};
const updatePendingSitesAsUnprocessed = async (urls: string[]): Promise<void> => {
    await Queue.update(
        { state: SiteState.UNPROCESSED },
        { where: { url: urls, state: SiteState.CRAWLING } }
    );
};

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
const getSiteFromQueueParallel = async (n: number = 50): Promise<string[]> => {
    let urls: string[] = [];
    await sequelize.transaction(async (t) => {
        const sites = await Queue.findAll({
            include: {
                association: QueueBelongsToDomain,
                required: true,
                where: {
                    [Op.or]: [
                        {
                            lastVisited: {
                                [Op.lt]: Sequelize.literal("NOW() - INTERVAL '1 minute'")
                            }
                        },
                        { lastVisited: null }
                    ]
                }
            },
            where: { state: SiteState.UNPROCESSED },
            order: [
                ['priority', 'DESC'],
                ['depth', 'ASC'],
                ['createdAt', 'ASC']
            ],
            limit: n,
            lock: true,
            skipLocked: true,
            transaction: t,
            attributes: ['url']
        });

        if (sites.length === 0) {
            return [];
        }

        urls = sites.map((site) => site.url);

        await Queue.update({ state: SiteState.CRAWLING }, { where: { url: urls }, transaction: t });
    });

    return urls;
};

export {
    addInQueue,
    countErroredSites,
    countPendingSites,
    getSiteFromQueueParallel,
    getSiteInQueueByUrl,
    updatePendingSitesAsUnprocessed,
    updateSiteAsFailed,
    updateSiteAsVisited
};
