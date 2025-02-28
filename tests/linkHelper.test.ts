import { expect, test } from '@jest/globals';
import { getDomain } from '../src/utils/linkHelper';

const validUrls = [
    'https://www.google.com',
    'http://www.google.com',
    'https://google.com',
    'http://google.com',
    'www.google.com',
    'google.com',
    'www.google.com/search?q=hello',
    'google.com/search?q=hello',
    'www.google.com/search?q=hello#world',
    'google.com/search?q=hello#world',
];

describe('linkHelper tests', () => {
    test.each(validUrls)('should return true for valid url %s', (url) => {
        expect(getDomain(url)).toBe('www.google.com');
    });
});
