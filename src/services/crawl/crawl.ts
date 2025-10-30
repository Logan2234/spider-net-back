import { getLinksFromHtml } from '@/utils/htmlHelper';
import verifyUrlCanBeCrawled from '@/utils/verifyRobotsTxt';
import { ValidationError } from 'sequelize';
import { updateSiteAsFailed, updateSiteAsVisited } from '../queue.service';

const getLinksOnPage = async (pageUrl: string): Promise<Set<string>> => {
  const response = await fetch(pageUrl, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`Error while fetching: ${response.statusText}`);
  }

  const html = await response.text();
  return getLinksFromHtml(html, pageUrl);
};

export const scrap = async (url: string): Promise<void> => {
  let newUrls: Set<string> = new Set();

  try {
    if (!(await verifyUrlCanBeCrawled(url))) {
      throw new Error('Crawling is blocked by robots.txt');
    }

    newUrls = await getLinksOnPage(url);
    await updateSiteAsVisited(url, [...newUrls]);
  } catch (err) {
    const errorMessage =
      err instanceof ValidationError
        ? err.errors.map((error) => error.message).join(', ')
        : err instanceof Error
          ? err.message
          : String(err);

    await updateSiteAsFailed(url, errorMessage);
    throw err;
  }
};
