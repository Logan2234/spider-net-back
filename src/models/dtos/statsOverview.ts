export class StatsOverview {
    constructor(
        totalDomains: number,
        totalInQueue: number,
        totalLinks: number,
        totalVisited: number,
        totalErrors: number
    ) {
        this.totalDomains = totalDomains;
        this.totalInQueue = totalInQueue;
        this.totalLinks = totalLinks;
        this.totalVisited = totalVisited;
        this.totalErrors = totalErrors;
    }
}
