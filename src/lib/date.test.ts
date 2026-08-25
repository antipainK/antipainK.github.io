import { describe, expect, it } from 'vitest';
import { formatPeriod } from './date';

describe('formatPeriod', () => {
  it('formats a closed period', () => {
    expect(formatPeriod({ start: '2021-07-01', end: '2021-09-30' }, 'en-US', 'Present'))
      .toBe('Jul 2021 – Sep 2021');
  });

  it('uses the present label when the period is ongoing', () => {
    const result = formatPeriod({ start: '2023-01-01', end: null }, 'en-US', 'Present');
    expect(result).toContain('Present');
    expect(result).toContain('Jan 2023');
  });
});
