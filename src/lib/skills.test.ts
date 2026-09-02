import { describe, expect, it } from 'vitest';
import { computeLanguageDuration, computeLastUsed, findEntryIdsUsingTechnology } from './skills';

describe('computeLastUsed', () => {
  const now = new Date('2026-09-02');
  const entries = [
    {
      id: 'current',
      period: { start: '2024-04-01', end: null },
      languagePeriods: [{ languages: ['Java'] }],
    },
    {
      id: 'past',
      period: { start: '2021-07-01', end: '2021-10-31' },
      languagePeriods: [{ languages: ['Java', 'C++'] }],
    },
  ];

  it('returns null when no entry records the language', () => {
    expect(computeLastUsed(entries, 'Rust', now)).toBeNull();
  });

  it('resolves an open period to now, so ongoing use sorts newest', () => {
    expect(computeLastUsed(entries, 'Java', now)).toBe(now.getTime());
  });

  it('returns the end of the latest closed period', () => {
    expect(computeLastUsed(entries, 'C++', now)).toBe(new Date('2021-10-31').getTime());
  });

  it('takes the latest period, not the first match', () => {
    const reversed = [...entries].reverse();
    expect(computeLastUsed(reversed, 'Java', now)).toBe(now.getTime());
  });
});

describe('computeLanguageDuration', () => {
  it('returns null total and no entries when nothing matches', () => {
    const entries = [{
      id: 'a',
      period: { start: '2020-01-01', end: '2020-06-30' },
      languagePeriods: [{ period: { start: '2020-01-01', end: '2020-06-30' }, languages: ['Python'] }],
    }];
    expect(computeLanguageDuration(entries, 'Java')).toEqual({ totalMonths: null, entryIds: [] });
  });

  it('computes duration and entry ids for a single matching entry', () => {
    const entries = [{
      id: 'a',
      period: { start: '2021-07-01', end: '2021-10-31' },
      languagePeriods: [{ period: { start: '2021-07-01', end: '2021-10-31' }, languages: ['Python'] }],
    }];
    expect(computeLanguageDuration(entries, 'Python')).toEqual({ totalMonths: 4, entryIds: ['a'] });
  });

  it('merges periods across multiple matching entries', () => {
    const entries = [
      {
        id: 'a',
        period: { start: '2021-07-01', end: '2021-10-31' },
        languagePeriods: [{ period: { start: '2021-07-01', end: '2021-10-31' }, languages: ['Python'] }],
      },
      {
        id: 'b',
        period: { start: '2023-05-01', end: '2024-03-31' },
        languagePeriods: [{ period: { start: '2023-05-01', end: '2024-03-31' }, languages: ['Python'] }],
      },
    ];
    const result = computeLanguageDuration(entries, 'Python');
    expect(result.entryIds).toEqual(['a', 'b']);
    expect(result.totalMonths).toBe(4 + 11);
  });

  it('only matches the languagePeriod that actually contains the language', () => {
    const entries = [
      {
        id: 'a',
        period: { start: '2022-01-01', end: '2022-12-31' },
        languagePeriods: [
          { period: { start: '2022-01-01', end: '2022-06-30' }, languages: ['TypeScript'] },
          { period: { start: '2022-07-01', end: '2022-12-31' }, languages: ['Python'] },
        ],
      },
    ];
    const result = computeLanguageDuration(entries, 'Python');
    expect(result.entryIds).toEqual(['a']);
    expect(result.totalMonths).toBe(6);
  });

  it('defaults a languagePeriod with no period of its own to the entry\'s full period', () => {
    const entries = [{
      id: 'a',
      period: { start: '2024-04-01', end: null },
      languagePeriods: [{ languages: ['Java'] }],
    }];
    const result = computeLanguageDuration(entries, 'Java', [], new Date('2026-08-01T00:00:00Z'));
    expect(result.entryIds).toEqual(['a']);
    expect(result.totalMonths).toBe(29);
  });

  it('folds in additionalPeriods for untracked history', () => {
    const entries = [{
      id: 'a',
      period: { start: '2023-01-01', end: '2023-06-30' },
      languagePeriods: [{ period: { start: '2023-01-01', end: '2023-06-30' }, languages: ['Rust'] }],
    }];
    const result = computeLanguageDuration(entries, 'Rust', [{ start: '2020-01-01', end: '2020-12-31' }]);
    expect(result.entryIds).toEqual(['a']);
    expect(result.totalMonths).toBe(12 + 6);
  });
});

describe('findEntryIdsUsingTechnology', () => {
  it('returns ids of entries whose technologyPeriods include the given name', () => {
    const entries = [
      { id: 'a', technologyPeriods: [{ technologies: ['AWS', 'GitLab CI'] }] },
      { id: 'b', technologyPeriods: [{ technologies: ['PostgreSQL'] }] },
      { id: 'c', technologyPeriods: [{ technologies: ['AWS'] }] },
    ];
    expect(findEntryIdsUsingTechnology(entries, 'AWS')).toEqual(['a', 'c']);
  });

  it('matches across multiple technologyPeriods on the same entry', () => {
    const entries = [
      { id: 'a', technologyPeriods: [{ technologies: ['TypeScript'] }, { technologies: ['Python'] }] },
    ];
    expect(findEntryIdsUsingTechnology(entries, 'Python')).toEqual(['a']);
  });

  it('returns an empty array when nothing matches', () => {
    const entries = [{ id: 'a', technologyPeriods: [{ technologies: ['AWS'] }] }];
    expect(findEntryIdsUsingTechnology(entries, 'Grafana')).toEqual([]);
  });
});
