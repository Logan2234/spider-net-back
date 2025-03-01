import verifyUrlCanBeCrawled from '@/utils/verifyRobotsTxt';
import { beforeAll, describe, expect, test } from '@jest/globals';

let robotsTxt: string;

beforeAll(async () => {
    robotsTxt = await fetch('https://www.youtube.com/robots.txt', { method: 'GET' }).then((res) =>
        res.text()
    );
});

describe('verifyRobotsTxt', () => {
    test.each([
        'https://www.youtube.com',
        'https://www.youtube.com/api',
        'https://www.youtube.com/watch',
        'https://www.youtube.com/watch/?v=abc',
        'https://www.youtube.com/watch/?v=abc#comment',
        'https://www.youtube.com/feeds'
    ])('should return true for valid url %s', async (url) => {
        expect(await verifyUrlCanBeCrawled(url)).toBe(true);
    });

    test.each([
        '',
        '#test',
        '/test',
        'https://www.youtube.com/api/',
        'https://www.youtube.com/api/test',
        'https://www.youtube.com/feeds/videos.xml',
        'https://www.youtube.com/feeds/videos.xml/'
    ])('should return false for invalid url %s', async (url) => {
        expect(await verifyUrlCanBeCrawled(url)).toBe(false);
    });
});
