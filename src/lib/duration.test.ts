import { describe, expect, it } from 'vitest';
import { computeDurationMonths } from './duration';

describe('computeDurationMonths', () => {
  it('returns null for an empty list of periods', () => {
    expect(computeDurationMonths([])).toBeNull();
  });

  it('counts a single closed period inclusively', () => {
    expect(computeDurationMonths([{ start: '2021-07-01', end: '2021-10-31' }])).toBe(4);
  });

  it('merges overlapping periods instead of summing them', () => {
    const months = computeDurationMonths([
      { start: '2023-01-01', end: '2023-06-30' },
      { start: '2023-04-01', end: '2023-09-30' },
    ]);
    // Union is Jan–Sep (9 months), not the naive sum of 6 + 6 = 12.
    expect(months).toBe(9);
  });

  it('does not count the gap between two non-overlapping periods', () => {
    const months = computeDurationMonths([
      { start: '2021-01-01', end: '2021-03-31' },
      { start: '2021-09-01', end: '2021-11-30' },
    ]);
    expect(months).toBe(6);
  });

  it('resolves an ongoing period against the provided `now`', () => {
    const months = computeDurationMonths(
      [{ start: '2024-04-01', end: null }],
      new Date('2026-08-01T00:00:00Z'),
    );
    expect(months).toBe(29);
  });
});
