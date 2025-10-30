import { connection } from '@/configs/redis';
import { Queue, Worker } from 'bullmq';
import { scrap } from './crawl';
import { enqueueCrawlJob } from './crawl.service';

const CRAWL_QUEUE_NAME = 'crawl';

const crawlQueue = new Queue(CRAWL_QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: false,
    removeOnFail: false
  }
});

crawlQueue.on('error', (error) => {
  console.error('Crawl queue error:', error);
});

crawlQueue.on('paused', () => {
  console.info('Crawl queue has been paused');
});

const crawlWorker = new Worker(
  CRAWL_QUEUE_NAME,
  async (job) => {
    const url = job.data.url;
    await scrap(url);
  },
  { connection, concurrency: 50, autorun: true }
);

crawlWorker.on('ready', async () => {
  const nbWorkers = await crawlQueue.getWorkersCount();
  console.info(
    '⛏️ ' +
      nbWorkers +
      (nbWorkers > 1 ? ' workers are' : ' worker is') +
      ' ready for ' +
      crawlQueue.name +
      ' queue'
  );
});

crawlWorker.on('completed', async () => {
  if ((await crawlQueue.getWaitingCount()) < 10) {
    enqueueCrawlJob();
  }
});

crawlWorker.on('failed', () => {
  //   console.error(`Job for URL ${job.data.url} has failed with error: ${err.message}`);
});

export { crawlQueue, crawlWorker };
