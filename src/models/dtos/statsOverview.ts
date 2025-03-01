export class StatsOverview {
    constructor(
        totalDomains: number,
        totalInQueue: number,
        totalLinks: number,
        totalVisited: number
    ) {
        this.totalDomains = totalDomains;
        this.totalInQueue = totalInQueue;
        this.totalLinks = totalLinks;
        this.totalVisited = totalVisited;
    }

    public totalDomains: number;
    public totalInQueue: number;
    public totalLinks: number;
    public totalVisited: number;
}
