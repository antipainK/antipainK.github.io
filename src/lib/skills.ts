import type { Period } from '@data/portfolio';
import { TRANSLATION_KEYS, type TranslationKey } from '@i18n/keys';
import type { TOptions } from 'i18next';
import { computeDurationMonths } from './duration';

interface LanguageBearingEntry {
  id: string;
  period: Period;
  languagePeriods: readonly { period?: Period; languages: readonly string[] }[];
}

interface TechnologyBearingEntry {
  id: string;
  technologyPeriods: readonly { technologies: readonly string[] }[];
}

export interface LanguageDuration {
  /** Total merged time-in-use, in whole months, or `null` if nothing to compute from. */
  totalMonths: number | null;
  /** Ids of the entries that contributed to `totalMonths` — used to highlight matching cards. */
  entryIds: readonly string[];
}

/**
 * Computes a language's total duration across every `languagePeriod` (in any
 * of `entries`) that includes it, plus any `additionalPeriods` for untracked
 * history, and reports which entries contributed (for hover/click highlighting).
 * A `languagePeriod` with no `period` of its own covers its parent entry's
 * entire `period`.
 *
 * Passing several names measures the union of their periods — the calendar
 * time in which *any* of them was in use, not the sum. That is what the hero's
 * "years on Java and TypeScript" figure means.
 */
export function computeLanguageDuration(
  entries: readonly LanguageBearingEntry[],
  languageName: string | readonly string[],
  additionalPeriods: readonly Period[] = [],
  now: Date = new Date(),
): LanguageDuration {
  const wanted = typeof languageName === 'string' ? [languageName] : languageName;
  const matches = entries.flatMap((entry) =>
    entry.languagePeriods
      .filter((languagePeriod) => languagePeriod.languages.some((name) => wanted.includes(name)))
      .map((languagePeriod) => ({ entryId: entry.id, period: languagePeriod.period ?? entry.period })),
  );

  const totalMonths = computeDurationMonths(
    [...matches.map((match) => match.period), ...additionalPeriods],
    now,
  );
  const entryIds = [...new Set(matches.map((match) => match.entryId))];

  return { totalMonths, entryIds };
}

/**
 * Renders a whole-months duration as e.g. "1 yr 6 mo", "2 yr", or "4 mo", via
 * the `skills.duration.*` translation keys.
 *
 * `count` is what drives i18next's plural selection, so it must be passed even
 * though the strings interpolate `{{years}}`/`{{months}}` by name. Without it
 * Polish renders "2 lat" instead of "2 lata" for every value.
 */
export function formatSkillDuration(totalMonths: number, t: (key: TranslationKey, options?: TOptions) => string): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) {
    return t(TRANSLATION_KEYS.skills.duration.yearsAndMonths, { count: years, years, months });
  }
  if (years > 0) {
    return t(TRANSLATION_KEYS.skills.duration.years, { count: years, years });
  }
  return t(TRANSLATION_KEYS.skills.duration.months, { count: months, months });
}

/**
 * When a language was last in use, as epoch milliseconds — an open period
 * resolves to `now`. `null` when nothing records it.
 *
 * Exists to break ties between equal durations: Java and TypeScript both read
 * "2 yr 6 mo", so without this their order in a duration-sorted chart is
 * whatever order the catalog array happens to be in.
 */
export function computeLastUsed(
  entries: readonly LanguageBearingEntry[],
  languageName: string,
  now: Date = new Date(),
): number | null {
  const ends = entries.flatMap((entry) =>
    entry.languagePeriods
      .filter((languagePeriod) => languagePeriod.languages.includes(languageName))
      .map((languagePeriod) => {
        const period = languagePeriod.period ?? entry.period;
        return period.end === null ? now.getTime() : new Date(period.end).getTime();
      }),
  );

  return ends.length > 0 ? Math.max(...ends) : null;
}

/** Ids of the entries whose `technologyPeriods` include `technologyName` at any point (no duration, membership only). */
export function findEntryIdsUsingTechnology(
  entries: readonly TechnologyBearingEntry[],
  technologyName: string,
): readonly string[] {
  return entries
    .filter((entry) => entry.technologyPeriods.some((technologyPeriod) => technologyPeriod.technologies.includes(technologyName)))
    .map((entry) => entry.id);
}
