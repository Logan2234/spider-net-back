import { parse } from 'parse5';
import { URL } from 'url';

/**
 * Recursively extracts all valid page links from HTML.
 * @param node - The current HTML node being processed.
 * @param baseUrl - The base URL for resolving relative links.
 * @param links - A Set to store unique extracted links.
 */
const extractLinks = (node: any, baseUrl: URL, links: Set<URL>): void => {
    if (!node || typeof node !== 'object') return;

    if (node.nodeName === 'a' && node.attrs) {
        const hrefAttr = node.attrs.find((attr: any) => attr.name === 'href')?.value.trim() as string;
        try {
            if (
                !hrefAttr ||
                hrefAttr.startsWith('#') ||
                hrefAttr.startsWith('mailto:') ||
                hrefAttr.startsWith('tel:') ||
                hrefAttr.startsWith('javascript:') ||
                hrefAttr.startsWith('data:')
            )
                return;
            let url = new URL(hrefAttr, baseUrl);

            if (url.href === baseUrl.href) return;
            links.add(url);
        } catch (err) {
            console.error(`Invalid URL: ${err}`);
        }
    }

    if (node.childNodes) {
        for (const child of node.childNodes) {
            extractLinks(child, baseUrl, links);
        }
    }
};

/**
 * Parses HTML and extracts all valid links.
 * @param html - The raw HTML string.
 * @param baseUrl - The base URL for resolving relative links.
 * @returns Set of extracted links.
 */
const getLinksFromHtml2 = (html: string, baseUrl: URL): Set<URL> => {
    const document = parse(html);
    const links = new Set<URL>();
    extractLinks(document, baseUrl, links);
    return links;
};

// const getLinksFromHtml = (htmlCode: string, currentUrl: URL) => {
//     // Regex to extract all links from the HTML code except for the ones starting with #, mailto:, or tel:
//     const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["'](?!#|mailto:|tel:)(.*?)["']/gi;
//     const links: Set<URL> = new Set();
//     let match: RegExpExecArray | null;

//     while ((match = linkRegex.exec(htmlCode)) !== null) {
//         const newUrl = match[1];

//         if (!newUrl || newUrl === '#' || newUrl === currentUrl) {
//             continue;
//         }

//         if (!newUrl.startsWith('https://') && !newUrl.startsWith('http://')) {
//             links.add(
//                 new URL(currentUrl.origin + (newUrl.startsWith('/') ? newUrl : '/' + newUrl))
//             );
//         } else {
//             links.add(new URL(newUrl));
//         }
//     }

//     return links;
// };

export { getLinksFromHtml2 };
