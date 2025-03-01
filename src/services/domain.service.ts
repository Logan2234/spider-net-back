import Domain from '@/models/domain.model';
import { getDomain } from '@/utils/linkHelper';

const addDomain = async (link: URL | null): Promise<void> => {
    const linkStr = getDomain(link);

    if (!linkStr) {
        return;
    }

    await Domain.findOrCreate({
        where: { name: linkStr },
        defaults: { name: linkStr, lastVisited: null }
    });
};

const addDomains = async (links: URL[]): Promise<void> => {
    const domains = [...new Set<string>(links.map((link) => link.hostname))];

    await Domain.bulkCreate(
        domains.map((domain) => ({
            name: domain,
            lastVisited: null
        })),
        { ignoreDuplicates: true }
    );
};

const updateDomainVisitDate = async (domain: string): Promise<void> => {
    await Domain.update({ lastVisited: new Date() }, { where: { name: domain } });
};

const countDomains = async (): Promise<number> => Domain.count();

export { addDomain, addDomains, countDomains, updateDomainVisitDate };
