import Sequelize from '@/configs/db';
import { SiteState } from '@/enums/siteState';
import { QueryTypes } from 'sequelize';
import Queue from '../models/queue.model';
import { addDomains } from './domain.service';
import { addLinks } from './link.service';
import { addToVisitedSites, isSiteVisited } from './visitedSite.service';

const updateSiteAsVisited = async (
  originUrl: string,
  newUrls: string[]
): Promise<void> => {
  const site = await getSiteInQueueByUrl(originUrl);

  if (!site) {
    return;
  }

  await addInQueue(newUrls, 0, site.depth + 1, site.url);
  await addToVisitedSites(originUrl);
  await site.destroy();
};

const addInQueue = async (
  urls: string[],
  priority: number = 0,
  depth: number = 0,
  from: string | null = null
): Promise<void> => {
  await addDomains(urls);
  await addLinks(from, urls);

  for (const url of urls) {
    const siteAlreadyVisited = await isSiteVisited(url);

    if (siteAlreadyVisited) {
      return;
    }

    const [site, created] = await Queue.findOrCreate({
      where: { url },
      defaults: {
        url,
        domain: new URL(url).hostname,
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
  Queue.count({
    where: { state: [SiteState.UNPROCESSED, SiteState.CRAWLING] }
  });

const countErroredSites = async (): Promise<number> =>
  Queue.count({ where: { state: SiteState.ERROR } });

const getSiteInQueueByUrl = async (url: string): Promise<Queue | null> =>
  Queue.findOne({ where: { url } });

const updateSiteAsFailed = async (
  url: string,
  errorMessage: string
): Promise<void> => {
  await Queue.update(
    { state: SiteState.ERROR, errorMessage },
    { where: { url } }
  );
};

const updatePendingSitesAsUnprocessed = async (
  urls?: string[]
): Promise<void> => {
  await Queue.update(
    { state: SiteState.UNPROCESSED },
    { where: { state: SiteState.CRAWLING, ...(urls ? { url: urls } : {}) } }
  );
};

const removeUrlFromQueue = async (url: string): Promise<void> => {
  await Queue.destroy({ where: { url } });
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
  await Sequelize.transaction(async (t) => {
    const sites = await Sequelize.query<Queue>(
      `
        SELECT q.url
        FROM queue q
        JOIN domains d ON q.domain = d.name
        WHERE q.state = '${SiteState.UNPROCESSED}'
          AND (d."lastVisited" IS NULL OR d."lastVisited" < NOW() - INTERVAL '1 minute')
        ORDER BY q.priority DESC, q.depth ASC, q."createdAt" ASC
        LIMIT ${n}
        FOR UPDATE SKIP LOCKED
      `,
      {
        type: QueryTypes.SELECT,
        transaction: t
      }
    );

    if (sites.length === 0) {
      return [];
    }

    urls = sites.map((site) => site.url);

    await Queue.update(
      { state: SiteState.CRAWLING },
      { where: { url: urls }, transaction: t }
    );
  });

  return urls;
};

export {
  addInQueue,
  countErroredSites,
  countPendingSites,
  getSiteFromQueueParallel,
  getSiteInQueueByUrl,
  removeUrlFromQueue,
  updatePendingSitesAsUnprocessed,
  updateSiteAsFailed,
  updateSiteAsVisited
};
