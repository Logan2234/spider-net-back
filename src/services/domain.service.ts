import Domain from '@/models/domain.model';
import { getDomain } from '@/utils/linkHelper';
import { Transaction } from 'sequelize';

const addDomain = async (link: URL | null, transaction: Transaction | null = null): Promise<void> => {
    const linkStr = getDomain(link);

    if (!linkStr) {
        return;
    }

    await Domain.findOrCreate({
        where: { name: linkStr },
        defaults: { name: linkStr, lastVisited: new Date() },
        transaction
    });
};

const countDomains = async (): Promise<number> => Domain.count();

export { addDomain, countDomains };
