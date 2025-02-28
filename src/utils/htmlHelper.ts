import { URL } from 'url';
import { trimUrl } from './linkHelper';

const getLinksFromHtml = async (htmlCode: string, currentUrl: URL) => {
    // Regex to extract all links from the HTML code except for the ones starting with #, mailto:, or tel:
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["'](?!#|mailto:|tel:)(.*?)["']/gi;
    const links: Set<URL> = new Set();
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(htmlCode)) !== null) {
        const newUrl = trimUrl(match[1]);

        if (!newUrl || newUrl === '/' || newUrl === '#' || trimUrl(newUrl) === trimUrl(currentUrl)) {
            continue;
        }

        if (!newUrl.startsWith('https://') && !newUrl.startsWith('http://')) {
            links.add(new URL(currentUrl.origin + (newUrl.startsWith('/') ? newUrl : '/' + newUrl)));
        } else {
            links.add(new URL(newUrl));
        }
    }

    return links;
};

export { getLinksFromHtml };
