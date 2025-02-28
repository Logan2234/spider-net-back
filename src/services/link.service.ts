import Link from '@/models/link.model';
import { getDomain } from '@/utils/linkHelper';
import { Transaction } from 'sequelize';
import { URL } from 'url';
import { addDomain } from './domain.service';

const addLink = async (from: string | URL, to: string | URL, transaction: Transaction | null = null): Promise<void> => {
    const fromDomain = getDomain(from);
    const toDomain = getDomain(to);

    if (!fromDomain || !toDomain) {
        return;
    }

    if (fromDomain === toDomain) {
        return;
    }

    const fromUrl = new URL(from);
    const toUrl = new URL(to);
    await addDomain(fromUrl, transaction);
    await addDomain(toUrl, transaction);

    await Link.findOrCreate({
        where: { from: fromDomain, to: toDomain },
        defaults: { from: fromDomain, to: toDomain },
        transaction
    });

    return;
};

const countLinks = async (): Promise<number> => Link.count();

export { addLink, countLinks };
