import Link from '@/models/link.model';

const addLinks = async (from: string | null, to: string[]): Promise<void> => {
  if (!from || !to) {
    return;
  }

  const fromDomain = new URL(from).hostname;
  const toDomains = [
    ...new Set<string>(to.map((url) => new URL(url).hostname))
  ].filter((domain) => domain !== fromDomain);

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
