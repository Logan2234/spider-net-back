import VisitedSite from '@/models/visitedSite.model';
import { getDomain } from '@/utils/linkHelper';
import { updateDomainVisitDate } from './domain.service';

const isSiteVisited = async (site: URL | string): Promise<boolean> =>
    (await VisitedSite.findOne({ where: { url: site.toString() } })) !== null;

const countVisitedSites = async (): Promise<number> => VisitedSite.count();

const addToVisitedSites = async (url: string): Promise<void> => {
    const domain = getDomain(url);

    if (!domain) {
        return;
    }

    await Promise.all([
        VisitedSite.findOrCreate({ where: { url }, defaults: { url, domain } }),
        updateDomainVisitDate(domain)
    ]);
};

export { addToVisitedSites, countVisitedSites, isSiteVisited };
