import Domain from '@/models/domain.model';
import Link from '@/models/link.model';
import Queue from '@/models/queue.model';
import VisitedSite from '@/models/visitedSite.model';

const retrieveDomainStats = async (domainName: string) => {
    const domain = await Domain.findOne({ where: { name: domainName } });

    if (!domain) {
        throw new Error('Domain not found');
    }

    const visited = await VisitedSite.count({ where: { domain: domain.name } });
    const queue = await Queue.count({ where: { domain: domain.name } });
    const linksRaw = await Link.findAll({ where: { to: domain.name } });

    const fromList = linksRaw.map((link) => link.from);

    const numberOfLinks = await Promise.all(
        fromList.map((from) => VisitedSite.count({ where: { domain: from } }))
    );

    const links = fromList.map((from, index) => ({
        from,
        weight: numberOfLinks[index]
    }));

    const domainStats = {
        visited,
        queue,
        links
    };

    return domainStats;
};

export default retrieveDomainStats;
