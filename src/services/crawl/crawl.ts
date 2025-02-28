import sequelize from '@/configs/db.config';
import { SiteState } from '@/enums/siteState';
import Queue from '@/models/queue.model';
import { getLinksFromHtml } from '@/utils/htmlHelper';
import { ValidationError } from 'sequelize';
import { URL } from 'url';
import { parentPort } from 'worker_threads';
import { addInQueue, getSiteFromQueueParallel } from '../queue.service';
import { addToVisitedSites } from '../visitedSite.service';

let continueScraping = true;
let sites: Queue[] = [];

parentPort?.on('message', async (message) => {
    if (message.action === 'stop') {
        continueScraping = false;
        for (const site of sites) {
            try {
                if (site.state === SiteState.ERROR) {
                    continue;
                }
                await site.update({ state: SiteState.UNPROCESSED });
            } catch (err: any) {
                parentPort?.postMessage(err);
            }
        }

        process.exit(0);
    }
});

const crawlAndScrap = async (): Promise<void> => {
    try {
        let numberOfRetries = 0;
        while (continueScraping) {
            sites = await getSiteFromQueueParallel(20);

            if (sites.length === 0) {
                numberOfRetries++;

                if (numberOfRetries === 3) {
                    continueScraping = false;
                }

                await new Promise((resolve) => setTimeout(resolve, 5000));
                continue;
            }

            await scrapBatch(sites);
        }
    } catch (err: any) {
        parentPort?.postMessage('Error while crawling: ' + err);
    }
};

const scrapBatch = async (sites: Queue[]): Promise<void[]> => {
    return Promise.all(
        sites.map(async (site) => {
            try {
                parentPort?.postMessage(`Crawling ${site.url}`);
                const newUrls = await getLinksOnPage(site.url);

                await sequelize.transaction(async (transaction) => {
                    for (let url of newUrls) {
                        // TODO Batch add
                        // TODO ne pas ajouter si c'est la même url
                        if (url.href === site.url) {
                            continue;
                        }

                        await addInQueue(url, 0, site.depth + 1, site.url, transaction);
                    }

                    await addToVisitedSites(site.url, transaction);
                    await site.destroy({ transaction });
                });
            } catch (err: any) {
                const errorMessage =
                    err instanceof ValidationError ? err.errors.map((error) => error.message).join(', ') : err.message;
                await site.update({ state: SiteState.ERROR, errorMessage });
                parentPort?.postMessage(`Error while crawling ${site.url}: ${errorMessage}`);
            }
        })
    );
};

const getLinksOnPage = async (pageUrl: URL | string): Promise<Set<URL>> => {
    if (typeof pageUrl === 'string') {
        pageUrl = new URL(pageUrl);
    }

    const response = await fetch(pageUrl, { method: 'GET' });

    if (!response.ok) {
        return new Set<URL>();
    }

    const html = await response.text();
    return getLinksFromHtml(html, pageUrl);
};

export default crawlAndScrap;
