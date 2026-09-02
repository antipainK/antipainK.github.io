import { education, experience, skillsCatalog, type Skill } from '@data/portfolio';
import { computeLanguageDuration, computeLastUsed, findEntryIdsUsingTechnology } from './skills';

/**
 * The skill filter bound to the real dataset.
 *
 * Separate from `@lib/skills`, which stays data-agnostic and takes entries as
 * arguments, and separate from the component so both the rail's chips and the
 * header's status line can read it without importing each other.
 */
const timelineEntries = [...experience, ...education];

/** Ids of every entry backing a skill, whether it is a language or a technology. */
export function entryIdsForSkill(skillName: string): readonly string[] {
  const catalogEntry: Skill | undefined = skillsCatalog.find((skill) => skill.name === skillName);
  if (catalogEntry?.category === 'language') {
    return computeLanguageDuration(timelineEntries, skillName, catalogEntry.additionalPeriods).entryIds;
  }
  return findEntryIdsUsingTechnology(timelineEntries, skillName);
}

/**
 * Roles matching a skill — the numerator in "2 of 3 roles".
 *
 * Only employment counts: that phrasing is a claim about roles, and education
 * entries backing the same skill would quietly inflate the denominator.
 */
export function countMatchingRoles(skillName: string | null): number {
  if (!skillName) {
    return 0;
  }
  const ids = entryIdsForSkill(skillName);
  return experience.filter((entry) => ids.includes(entry.id)).length;
}

/** Denominator for the same phrase. */
export const TOTAL_ROLES = experience.length;

export interface LanguageRow {
  name: string;
  /** `null` when no entry dates it — those render as bare chips, not bars. */
  totalMonths: number | null;
  /** Epoch ms of last use; an open period resolves to `now`. */
  lastUsed: number;
}

/**
 * Language bars, longest first, ties broken by most recent use.
 *
 * **`now` is sampled once and threaded through every call on purpose.**
 * `computeLanguageDuration` and `computeLastUsed` each default it to
 * `new Date()`, so calling them per language samples a different instant for
 * each. Two languages still in use today then differ by a millisecond or two
 * and the recency tiebreak orders them differently on each evaluation — Java
 * and TypeScript visibly swapping places on every click. One instant makes
 * equal things compare equal, and `Array#sort` is stable, so a genuine tie
 * falls back to catalog order instead of a coin flip.
 */
export function orderLanguages(now: Date = new Date()): {
  measured: readonly LanguageRow[];
  unmeasured: readonly LanguageRow[];
} {
  // Widened to `Skill` so `additionalPeriods` is visible: no catalog entry
  // declares one yet, so the literal type of `skillsCatalog` omits the field.
  const languageSkills: readonly Skill[] = skillsCatalog.filter((skill) => skill.category === 'language');

  const rows: readonly LanguageRow[] = languageSkills.map((skill) => ({
    name: skill.name,
    totalMonths: computeLanguageDuration(timelineEntries, skill.name, skill.additionalPeriods, now).totalMonths,
    lastUsed: computeLastUsed(timelineEntries, skill.name, now) ?? -Infinity,
  }));

  return {
    measured: rows
      .filter((row) => row.totalMonths !== null)
      .sort((a, b) => (b.totalMonths ?? 0) - (a.totalMonths ?? 0) || b.lastUsed - a.lastUsed),
    unmeasured: rows.filter((row) => row.totalMonths === null),
  };
}
