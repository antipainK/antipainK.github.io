import { describe, expect, it } from 'vitest';
import { en } from './en';
import { pl } from './pl';

type Node = Record<string, unknown>;

/**
 * Collects every list-valued key as `dotted.path -> length`.
 *
 * `PartialTranslations` widens list leaves to `readonly string[]`, so a locale
 * may legally supply a *shorter* bullet list than `en`. i18next falls back per
 * key, not per array item, so the extra bullets would not fall back to English
 * — they would just vanish from that locale with nothing to signal it.
 */
function listLengths(node: Node, prefix = ''): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      out[path] = value.length;
    } else if (value && typeof value === 'object') {
      Object.assign(out, listLengths(value as Node, path));
    }
  }
  return out;
}

describe('locale parity', () => {
  const enLists = listLengths(en);

  it('has lists to check, so the assertions below are not vacuous', () => {
    expect(Object.keys(enLists).length).toBeGreaterThan(0);
  });

  it('gives every translated list the same number of items as English', () => {
    const plLists = listLengths(pl as unknown as Node);

    const mismatched = Object.entries(plLists)
      .filter(([path, length]) => enLists[path] !== length)
      .map(([path, length]) => `${path}: pl has ${length}, en has ${enLists[path]}`);

    expect(mismatched).toEqual([]);
  });

  it('has no list in a translation that English does not define', () => {
    const unknown = Object.keys(listLengths(pl as unknown as Node)).filter((path) => !(path in enLists));

    expect(unknown).toEqual([]);
  });
});
