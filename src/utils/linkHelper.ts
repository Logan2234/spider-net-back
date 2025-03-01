import { URL } from 'url';

/**
 * @deprecated
 * TODO Only use URLs, therefore this method will be deleted
 */
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

export { getDomain };
