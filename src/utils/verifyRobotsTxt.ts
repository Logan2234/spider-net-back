import robotsParser from 'robots-parser';

const verifyUrlCanBeCrawled = async (url: URL | string): Promise<boolean> => {
    if (!url || !URL.canParse(url)) {
        return false;
    }

    const response = await fetch(new URL(url).origin + '/robots.txt', { method: 'GET' });

    if (response.status === 404) {
        return true;
    }

    if (!response.ok) {
        throw new Error(
            `Error while fetching robots.txt: ${response.statusText}. Aborting crawl for this site.`
        );
    }

    url = url.toString();
    const robotsTxt = await response.text();
    const robotParser = robotsParser(url, robotsTxt);
    return !!robotParser.isAllowed(url);
};

export default verifyUrlCanBeCrawled;
