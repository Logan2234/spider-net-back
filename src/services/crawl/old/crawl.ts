import { getLinksFromHtml } from '@/utils/htmlHelper';
import verifyUrlCanBeCrawled from '@/utils/verifyRobotsTxt';
import process from 'process';
import { ValidationError } from 'sequelize';
import { parentPort } from 'worker_threads';
import {
  getSiteFromQueueParallel,
  updatePendingSitesAsUnprocessed,
  updateSiteAsFailed,
  updateSiteAsVisited
} from '../../queue.service';

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
      urls = await getSiteFromQueueParallel(10);

      if (urls.length === 0) {
        numberOfRetries++;

        if (numberOfRetries === 3) {
          continueScraping = false;
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
        continue;
      }

      await scrapBatch(urls);
      global.gc?.();
    }

    process.exit(0);
  } catch (err) {
    parentPort?.postMessage('Error while crawling: ' + err);
  }
};

const scrapBatch = async (urls: string[]): Promise<void> => {
  let newUrls: Set<string> = new Set();
  const promises = urls.map(async (url) => {
    try {
      if (!(await verifyUrlCanBeCrawled(url))) {
        throw new Error('Crawling is blocked by robots.txt');
      }

      newUrls = await getLinksOnPage(url);
      await updateSiteAsVisited(url, [...newUrls]);
    } catch (err) {
      const errorMessage =
        err instanceof ValidationError
          ? err.errors.map((error) => error.message).join(', ')
          : (err as Error).message;

      await updateSiteAsFailed(url, errorMessage);

      if (process.env.VERBOSE === 'true') {
        parentPort?.postMessage(`Error while crawling ${url}: ${errorMessage}`);
      }
    }
  });

  await Promise.all(promises);
};

const getLinksOnPage = async (pageUrl: string): Promise<Set<string>> => {
  const response = await fetch(pageUrl, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`Error while fetching: ${response.statusText}`);
  }

  const html = await response.text();
  return getLinksFromHtml(html, pageUrl);
};

export default crawlAndScrap;
