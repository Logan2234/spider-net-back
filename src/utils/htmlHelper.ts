import { parse } from 'parse5';
import { Document, ParentNode } from 'parse5/dist/tree-adapters/default';
import { URL } from 'url';
import { normalizeUrl } from './linkHelper';

const FORBIDDEN_LINK_PREFIXES = [
  'emailto:',
  'mailto:',
  'tel:',
  'xmpp:',
  '#',
  'javascript:',
  'data:',
  'ftp:',
  'file:',
  'ws:',
  'wss:',
  'irc:',
  'sms:',
  'blob:',
  '#',
  'about:',
  'chrome:',
  'edge:',
  '//localhost' // avoid local links
];

const extractLinks = (rootNode: Document, baseUrl: string): Set<string> => {
  const baseUrlObj = new URL(baseUrl);
  const links = new Set<string>();

  const stack: ParentNode[] = [rootNode];

  while (stack.length > 0) {
    const node: ParentNode | undefined = stack.pop();

    if (!node || typeof node !== 'object') {
      continue;
    }

    if (node.nodeName === 'a' && node.attrs) {
      const hrefAttr: string =
        node.attrs.find((attr) => attr.name === 'href')?.value.trim() || '';

      if (
        hrefAttr &&
        !FORBIDDEN_LINK_PREFIXES.some((prefix) => hrefAttr.startsWith(prefix))
      ) {
        try {
          const url =
            hrefAttr.startsWith('http://') || hrefAttr.startsWith('https://')
              ? new URL(hrefAttr)
              : new URL(hrefAttr, baseUrlObj.origin);

          const urlStr = normalizeUrl(url);

          if (urlStr !== baseUrlObj.href) {
            links.add(urlStr);
          }
        } catch (err) {
          if (!(err instanceof TypeError) && err instanceof Error) {
            console.error(
              `${err.message} for ${hrefAttr}. Base URL: ${baseUrl}`
            );
          }
        }
      }
    }

    if (node.childNodes) {
      stack.push(...(node.childNodes as ParentNode[]));
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
const getLinksFromHtml = (html: string, baseUrl: string): Set<string> => {
  const document = parse(html);
  return extractLinks(document, baseUrl);
};

export { getLinksFromHtml };
