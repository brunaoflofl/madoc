import { removeDiacritics } from './string-util';

export function normalizeFileName(s: string) {
    return removeDiacritics(s)
        .replace(/ {2,}/g, '')
        .replace(/[^\.A-Za-z0-9\-_ ]/g, '_');
}
