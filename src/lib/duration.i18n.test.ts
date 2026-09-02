import type { TOptions } from 'i18next';
import { afterAll, describe, expect, it } from 'vitest';
import i18n from '@i18n';
import type { TranslationKey } from '@i18n/keys';
import { formatSkillDuration } from './skills';

/**
 * Polish has three cardinal forms for "rok" where English has one invariant
 * "yr". Roughly half this site's traffic is Polish, and the wrong form is
 * conspicuous to a native reader ("2 lat" reads like a typo), so the selection
 * is asserted per category rather than assumed to work.
 */
function translator(locale: string) {
  const fixed = i18n.getFixedT(locale);
  return (key: TranslationKey, options?: TOptions): string => fixed(key, options) as unknown as string;
}

const pl = translator('pl');
const en = translator('en');

describe('formatSkillDuration — Polish plural agreement', () => {
  afterAll(async () => {
    await i18n.changeLanguage('en');
  });

  it.each([
    { months: 12, expected: '1 rok', category: 'one' },
    { months: 24, expected: '2 lata', category: 'few' },
    { months: 36, expected: '3 lata', category: 'few' },
    { months: 48, expected: '4 lata', category: 'few' },
    { months: 60, expected: '5 lat', category: 'many' },
    { months: 132, expected: '11 lat', category: 'many' },
    { months: 264, expected: '22 lata', category: 'few' },
  ])('renders $months months as "$expected" ($category)', ({ months, expected }) => {
    expect(formatSkillDuration(months, pl)).toBe(expected);
  });

  it.each([
    { months: 29, expected: '2 lata 5 mies.' },
    { months: 13, expected: '1 rok 1 mies.' },
    { months: 65, expected: '5 lat 5 mies.' },
  ])('renders the combined form $months as "$expected"', ({ months, expected }) => {
    expect(formatSkillDuration(months, pl)).toBe(expected);
  });

  it('leaves the invariant month abbreviation alone', () => {
    expect(formatSkillDuration(4, pl)).toBe('4 mies.');
    expect(formatSkillDuration(1, pl)).toBe('1 mies.');
  });

  it('keeps English on its single invariant form', () => {
    expect(formatSkillDuration(12, en)).toBe('1 yr');
    expect(formatSkillDuration(24, en)).toBe('2 yr');
    expect(formatSkillDuration(29, en)).toBe('2 yr 5 mo');
    expect(formatSkillDuration(4, en)).toBe('4 mo');
  });
});

describe('hero figure label — Polish plural agreement', () => {
  const key = 'home.hero.figures.languages' as TranslationKey;

  it.each([
    { count: 1, expected: 'rok z Javą i TypeScriptem' },
    { count: 2, expected: 'lata z Javą i TypeScriptem' },
    { count: 5, expected: 'lat z Javą i TypeScriptem' },
  ])('renders $count as "$expected"', ({ count, expected }) => {
    expect(pl(key, { count })).toBe(expected);
  });

  it('falls back to the single English form', () => {
    expect(en(key, { count: 5 })).toBe('years on Java and TypeScript');
  });
});
