import robotsParser from 'robots-parser';

const verifyUrlCanBeCrawled = async (url: string): Promise<boolean> => {
  if (!url || !URL.canParse(url)) {
    return false;
  }

  const response = await fetchRobotsTxt(url);

  if (response.status === 404) {
    return true;
  }

  if (!response.ok) {
    throw new Error(
      `Error while fetching robots.txt: ${response.status} ${response.statusText}.`
    );
  }

  url = url.toString();
  const robotsTxt = await response.text();
  const robotParser = robotsParser(url, robotsTxt);
  return !!robotParser.isAllowed(url);
};

const fetchRobotsTxt = async (url: string) => {
  const response = await fetch(
    new URL('/robots.txt', new URL(url).origin).toString(),
    {
      method: 'GET'
    }
  );
  return response;
};

export default verifyUrlCanBeCrawled;
