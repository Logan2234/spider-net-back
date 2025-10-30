export class StatsOverview {
  totalDomains: number;
  totalInQueue: number;
  totalLinks: number;
  totalVisited: number;
  totalErrors: number;

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
