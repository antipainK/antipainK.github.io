import { describe, expect, it } from 'vitest';
import { skillsCatalog } from '@data/portfolio';
import { countMatchingRoles, orderLanguages } from './skillFilter';

const NOW = new Date('2026-09-02T12:00:00Z');
const names = (rows: readonly { name: string }[]) => rows.map((row) => row.name);

describe('orderLanguages', () => {
  /*
   * The regression this guards. `computeLanguageDuration` and `computeLastUsed`
   * both default `now` to `new Date()`, so deriving each language separately
   * sampled a different instant. Java and TypeScript are both ongoing in the
   * same role, so their "last used" differed by whatever the clock did between
   * two calls — and the recency tiebreak reordered them on every render.
   */
  it('is a pure function of `now`, so repeated calls cannot reshuffle', () => {
    const first = orderLanguages(NOW);
    const second = orderLanguages(NOW);

    expect(names(second.measured)).toEqual(names(first.measured));
    expect(names(second.unmeasured)).toEqual(names(first.unmeasured));
  });

  it('gives languages still in use an identical lastUsed, so the tie is a real tie', () => {
    const byName = new Map(orderLanguages(NOW).measured.map((row) => [row.name, row]));

    // Both run to the open Qualtrics period; neither may be a millisecond newer.
    expect(byName.get('Java')?.lastUsed).toBe(byName.get('TypeScript')?.lastUsed);
    expect(byName.get('Java')?.totalMonths).toBe(byName.get('TypeScript')?.totalMonths);
  });

  it('breaks a genuine tie towards catalog order rather than a coin flip', () => {
    const order = names(orderLanguages(NOW).measured);

    // Array#sort is stable, so equal rows keep the order skillsCatalog declares.
    const catalog = skillsCatalog.filter((skill) => skill.category === 'language').map((skill) => skill.name);
    expect(order.indexOf('Java')).toBeLessThan(order.indexOf('TypeScript'));
    expect(catalog.indexOf('Java')).toBeLessThan(catalog.indexOf('TypeScript'));
  });

  it('sorts by duration, longest first', () => {
    const months = orderLanguages(NOW).measured.map((row) => row.totalMonths ?? 0);

    expect(months).toEqual([...months].sort((a, b) => b - a));
    expect(months.length).toBeGreaterThan(1);
  });

  it('separates languages no entry dates into the unmeasured list', () => {
    const { measured, unmeasured } = orderLanguages(NOW);

    expect(measured.every((row) => row.totalMonths !== null)).toBe(true);
    expect(unmeasured.every((row) => row.totalMonths === null)).toBe(true);
    expect(names(unmeasured)).toContain('Lua');
  });
});

describe('countMatchingRoles', () => {
  it('counts nothing when no skill is pinned', () => {
    expect(countMatchingRoles(null)).toBe(0);
  });

  it('counts only roles, not education entries', () => {
    // AWS backs Qualtrics and Genie; C++ backs CERN plus the BSc, but only the role counts.
    expect(countMatchingRoles('AWS')).toBe(2);
    expect(countMatchingRoles('C++')).toBe(1);
  });
});
