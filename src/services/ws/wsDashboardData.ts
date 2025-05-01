import { StatsOverview } from '@/models/dtos/statsOverview';
import WebSocket from 'ws';
import { numberOfActiveWorkers } from '../crawl/workers';
import { countDomains } from '../domain.service';
import { countLinks } from '../link.service';
import { countErroredSites, countPendingSites } from '../queue.service';
import { countVisitedSites } from '../visitedSite.service';

const wsDashboardData = async (ws: WebSocket) => {
  await sendStatsOverview(ws);

  setInterval(async () => {
    await sendStatsOverview(ws);
  }, 2000);
};

const sendStatsOverview = async (ws: WebSocket): Promise<void> => {
  const [numberOfDomains, numberOfVisitedSites, numberInQueue, numberOfLinks, numberErrorsInQueue] =
    await Promise.all([
      countDomains(),
      countVisitedSites(),
      countPendingSites(),
      countLinks(),
      countErroredSites()
    ]);

  const data = new StatsOverview(
    numberOfDomains,
    numberInQueue,
    numberOfLinks,
    numberOfVisitedSites,
    numberErrorsInQueue
  );

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        ...data,
        memoryUsage: process.memoryUsage(),
        crawlingOngoing: numberOfActiveWorkers() > 0
      })
    );
  }
};

export default wsDashboardData;
