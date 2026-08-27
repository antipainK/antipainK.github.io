import { education, experience, skillsCatalog, type LanguagePeriod, type Period, type TechnologyPeriod } from '@data/portfolio';
import { describe, expect, it } from 'vitest';

const timelineEntries = [...experience, ...education];

describe('skillsCatalog', () => {
  it('has unique skill names', () => {
    const names = skillsCatalog.map((skill) => skill.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

/** An omitted `period` means "the whole parent period" -- trivially valid. */
function expectWithinParentPeriod(period: Period | undefined, parent: Period): void {
  if (!period) {
    return;
  }

  const parentStart = new Date(parent.start).getTime();
  const parentEnd = parent.end ? new Date(parent.end).getTime() : Infinity;
  const start = new Date(period.start).getTime();
  const end = period.end ? new Date(period.end).getTime() : Infinity;

  expect(start).toBeGreaterThanOrEqual(parentStart);
  expect(end).toBeLessThanOrEqual(parentEnd);
}

describe('languagePeriods and technologyPeriods', () => {
  it('fall within their parent entry\'s own period when a sub-period is specified', () => {
    for (const entry of timelineEntries) {
      for (const languagePeriod of entry.languagePeriods as readonly LanguagePeriod[]) {
        expectWithinParentPeriod(languagePeriod.period, entry.period);
      }
      for (const technologyPeriod of entry.technologyPeriods as readonly TechnologyPeriod[]) {
        expectWithinParentPeriod(technologyPeriod.period, entry.period);
      }
    }
  });
});
