import VisitedSite from '@/models/visitedSite.model';
import { getDomain, trimUrl } from '@/utils/linkHelper';
import { Transaction } from 'sequelize';
import { URL } from 'url';

const isSiteVisited = async (site: string, transaction: Transaction | null = null): Promise<boolean> =>
    (await VisitedSite.findOne({ where: { url: site }, transaction })) !== null;

const countVisitedSites = async (): Promise<number> => VisitedSite.count();

const addToVisitedSites = async (url: URL | string, transaction: Transaction | null = null): Promise<void> => {
    const domain = getDomain(url);

    if (!domain) {
        return;
    }

    url = trimUrl(url);

    await VisitedSite.findOrCreate({
        where: { url },
        defaults: { url, domain },
        transaction
    });
};

export { addToVisitedSites, countVisitedSites, isSiteVisited };
