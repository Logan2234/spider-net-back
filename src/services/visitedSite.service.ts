import VisitedSite from '@/models/visitedSite.model';
import { updateDomainVisitDate } from './domain.service';

const isSiteVisited = async (site: string): Promise<boolean> =>
  (await VisitedSite.findOne({ where: { url: site.toString() } })) !== null;

const countVisitedSites = async (): Promise<number> => VisitedSite.count();

const addToVisitedSites = async (url: string): Promise<void> => {
  const domain = new URL(url).hostname;

  if (!domain) {
    return;
  }

  await Promise.all([
    VisitedSite.findOrCreate({ where: { url }, defaults: { url, domain } }),
    updateDomainVisitDate(domain)
  ]);
};

export { addToVisitedSites, countVisitedSites, isSiteVisited };
