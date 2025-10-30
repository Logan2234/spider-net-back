import { getSiteFromQueueParallel } from '../queue.service';
import { crawlQueue } from './crawlQueue';

const enqueueCrawlJob = async () => {
  if ((await crawlQueue.getWaitingCount()) === 0) {
    const urls = await getSiteFromQueueParallel(500);

    await crawlQueue.addBulk(
      urls.map((url) => ({
        name: 'crawl-site',
        data: { url }
      }))
    );
  }

  await crawlQueue.resume();
};

const purgeCrawlJobs = async () => {
  await crawlQueue.pause();
};

export { enqueueCrawlJob, purgeCrawlJobs };
