import { getLinksFromHtml2 } from '@/utils/htmlHelper';
import verifyUrlCanBeCrawled from '@/utils/verifyRobotsTxt';
import process from 'process';
import { ValidationError } from 'sequelize';
import { URL } from 'url';
import { parentPort } from 'worker_threads';
import {
    getSiteFromQueueParallel,
    updatePendingSitesAsUnprocessed,
    updateSiteAsFailed,
    updateSiteAsVisited
} from '../queue.service';

let continueScraping = true;
let urls: string[] = [];

parentPort?.on('message', async (message) => {
    if (message.action === 'stop') {
        continueScraping = false;
        await updatePendingSitesAsUnprocessed(urls);
        process.exit(0);
    }
});

const crawlAndScrap = async (): Promise<void> => {
    try {
        let numberOfRetries = 0;
        while (continueScraping) {
            urls = await getSiteFromQueueParallel(50);

            if (urls.length === 0) {
                numberOfRetries++;

                if (numberOfRetries === 3) {
                    continueScraping = false;
                }

                await new Promise((resolve) => setTimeout(resolve, 5000));
                continue;
            }

            await scrapBatch(urls);
        }

        process.exit(0);
    } catch (err: any) {
        parentPort?.postMessage('Error while crawling: ' + err);
    }
};

const scrapBatch = async (urls: string[]): Promise<void> => {
    let newUrls: Set<URL> = new Set();
    const promises = urls.map(async (url) => {
        try {
            if (!(await verifyUrlCanBeCrawled(url))) {
                throw new Error('Crawling is blocked by robots.txt');
            }

            newUrls = await getLinksOnPage(url);
            await updateSiteAsVisited(url, [...newUrls]);
        } catch (err: any) {
            const errorMessage =
                err instanceof ValidationError
                    ? err.errors.map((error) => error.message).join(', ')
                    : err.message;

            await updateSiteAsFailed(url, errorMessage);

            if (process.env.VERBOSE === 'true') {
                parentPort?.postMessage(`Error while crawling ${url}: ${errorMessage}`);
            }
        }
    });

    await Promise.all(promises);
};

const getLinksOnPage = async (pageUrl: URL | string): Promise<Set<URL>> => {
    const response = await fetch(pageUrl, { method: 'GET' });

    if (!response.ok) {
        throw new Error(`Error while fetching: ${response.statusText}`);
    }

    const html = await response.text();
    return getLinksFromHtml2(html, new URL(pageUrl));
};

export default crawlAndScrap;
