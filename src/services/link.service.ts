import Link from '@/models/link.model';
import { URL } from 'url';

const addLinks = async (from: string | URL | null, to: URL[]): Promise<void> => {
    if (!from || !to) {
        return;
    }

    const fromDomain = new URL(from).hostname;
    const toDomains = [...new Set<string>(to.map((url) => url.hostname))].filter(
        (domain) => domain !== fromDomain
    );

    await Link.bulkCreate(
        toDomains.map((toDomain) => ({
            to: toDomain,
            from: fromDomain
        })),
        { ignoreDuplicates: true }
    );

    return;
};

const countLinks = async (): Promise<number> => Link.count();

export { addLinks, countLinks };
