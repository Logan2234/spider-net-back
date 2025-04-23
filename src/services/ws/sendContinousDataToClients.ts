import { StatsOverview } from '@/models/dtos/statsOverview';
import WebSocket from 'ws';
import { countDomains } from '../domain.service';
import { countLinks } from '../link.service';
import { countSitesInQueue } from '../queue.service';
import { countVisitedSites } from '../visitedSite.service';

const launchContinuousDataLoop = async (ws: WebSocket) => {
    await sendStatsOverview(ws);

    setInterval(async () => {
        await sendStatsOverview(ws);
    }, 2000);
};

const sendStatsOverview = async (ws: WebSocket): Promise<void> => {
    const [numberOfDomains, numberOfVisitedSites, numberInQueue, numberOfLinks] = await Promise.all([
        countDomains(),
        countVisitedSites(),
        countSitesInQueue(),
        countLinks(),
    ]);

    const data = new StatsOverview(
        numberOfDomains,
        numberInQueue,
        numberOfLinks,
        numberOfVisitedSites
    );

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ ...data, memoryUsage: process.memoryUsage() }));
    }
};

export default launchContinuousDataLoop;
