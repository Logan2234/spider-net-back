import VisitedSite from '@/models/visitedSite.model';
import { getDomain, trimUrl } from '@/utils/linkHelper';
import { Transaction } from 'sequelize';
import { URL } from 'url';

const isSiteVisited = async (site: string, transaction: Transaction | null = null): Promise<boolean> => {
    return (await VisitedSite.findOne({ where: { url: site }, transaction })) !== null;
};

const countVisitedSites = async (): Promise<number> => {
    return VisitedSite.count();
};

const addToVisitedSites = async (url: URL | string, transaction: Transaction | null = null): Promise<void> => {
    const domain = getDomain(url);

    if (!domain) {
        return;
    }

    await VisitedSite.create({ url: trimUrl(url), domain }, { transaction });
};

export { addToVisitedSites, countVisitedSites, isSiteVisited };
