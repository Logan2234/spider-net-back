import { URL } from 'url';

const getDomain = (url?: string | URL | null): string | null => {
    try {
        if (!url) {
            return null;
        }

        return new URL(url).hostname;
    } catch (error) {
        console.error('Invalid URL:', url);
        return null;
    }
};

const trimUrl = (url: string | URL): string => {
    url = url.toString();
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

export { getDomain, trimUrl };
