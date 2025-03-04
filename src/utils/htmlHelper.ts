import { parse } from 'parse5';
import { URL } from 'url';

const extractLinks = (rootNode: any, baseUrl: URL): Set<URL> => {
    const links = new Set<URL>();
    const stack = [rootNode];

    while (stack.length > 0) {
        const node = stack.pop();

        if (!node || typeof node !== 'object') {
            continue;
        }

        if (node.nodeName === 'a' && node.attrs) {
            const hrefAttr = node.attrs.find((attr: any) => attr.name === 'href')?.value.trim();
            if (hrefAttr && !hrefAttr.startsWith('#') && !hrefAttr.startsWith('mailto:')) {
                try {
                    let url = new URL(hrefAttr, baseUrl);
                    if (url.href !== baseUrl.href) {
                        links.add(url);
                    }
                } catch (err) {
                    console.error(`Invalid URL ${hrefAttr}`);
                }
            }
        }

        if (node.childNodes) {
            stack.push(...node.childNodes);
        }
    }

    return links;
};

/**
 * Parses HTML and extracts all valid links.
 * @param html - The raw HTML string.
 * @param baseUrl - The base URL for resolving relative links.
 * @returns Set of extracted links.
 */
const getLinksFromHtml2 = (html: string, baseUrl: URL): Set<URL> => {
    let document = parse(html);
    return extractLinks(document, baseUrl);
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
