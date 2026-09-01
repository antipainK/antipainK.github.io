import { education, experience, skillsCatalog, type LanguagePeriod, type Period, type Skill, type TechnologyPeriod } from '@data/portfolio';
import { describe, expect, it } from 'vitest';

const timelineEntries = [...experience, ...education];

const catalogNames = new Set<string>(skillsCatalog.map((skill) => skill.name));

/** Every technology named by any entry, deduplicated. */
function usedTechnologies(): readonly string[] {
  const used = timelineEntries.flatMap((entry) =>
    (entry.technologyPeriods as readonly TechnologyPeriod[])
      .flatMap((technologyPeriod) => technologyPeriod.technologies as readonly string[]),
  );
  return [...new Set(used)];
}

/** Does any entry (or an explicit `additionalPeriods` window) record this skill being used? */
function isProven(skill: Skill): boolean {
  if (skill.additionalPeriods?.length) {
    return true;
  }

  return timelineEntries.some((entry) =>
    (entry.languagePeriods as readonly LanguagePeriod[])
      .some((languagePeriod) => (languagePeriod.languages as readonly string[]).includes(skill.name))
      || (entry.technologyPeriods as readonly TechnologyPeriod[])
        .some((technologyPeriod) => (technologyPeriod.technologies as readonly string[]).includes(skill.name)),
  );
}

/**
 * Catalog skills that no entry backs yet — real usage the timeline simply
 * doesn't record: Lua/G-mod modding predates any tracked role, and several
 * university courses have empty placeholder `languagePeriods`.
 *
 * This is debt, and the assertion below is exact set equality, so the list can
 * only shrink: adding an unproven skill fails, and so does leaving a name here
 * after the entry that proves it lands.
 */
const KNOWN_UNPROVEN: readonly string[] = [
  'Claude Code',
  'Cursor',
  'Dart',
  'Gemini',
  'Google Cloud Platform',
  'HTML + CSS',
  'Lua',
  'MongoDB',
  'NoSQL',
  'Node.js',
  'Windsurf',
];

describe('skillsCatalog', () => {
  it('has unique skill names', () => {
    const names = skillsCatalog.map((skill) => skill.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('contains every technology named by an entry', () => {
    const missing = usedTechnologies().filter((technology) => !catalogNames.has(technology));

    expect(missing).toEqual([]);
  });

  it('backs every skill with an entry, apart from the known-unproven list', () => {
    const unproven = skillsCatalog
      .filter((skill) => !isProven(skill))
      .map((skill) => skill.name)
      .sort();

    expect(unproven).toEqual([...KNOWN_UNPROVEN].sort());
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
