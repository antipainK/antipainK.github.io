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
 */
export function computeLanguageDuration(
  entries: readonly LanguageBearingEntry[],
  languageName: string,
  additionalPeriods: readonly Period[] = [],
  now: Date = new Date(),
): LanguageDuration {
  const matches = entries.flatMap((entry) =>
    entry.languagePeriods
      .filter((languagePeriod) => languagePeriod.languages.includes(languageName))
      .map((languagePeriod) => ({ entryId: entry.id, period: languagePeriod.period ?? entry.period })),
  );

  const totalMonths = computeDurationMonths(
    [...matches.map((match) => match.period), ...additionalPeriods],
    now,
  );
  const entryIds = [...new Set(matches.map((match) => match.entryId))];

  return { totalMonths, entryIds };
}

/** Renders a whole-months duration as e.g. "1 yr 6 mo", "2 yr", or "4 mo", via the `skills.duration.*` translation keys. */
export function formatSkillDuration(totalMonths: number, t: (key: TranslationKey, options?: TOptions) => string): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) {
    return t(TRANSLATION_KEYS.skills.duration.yearsAndMonths, { years, months });
  }
  if (years > 0) {
    return t(TRANSLATION_KEYS.skills.duration.years, { years });
  }
  return t(TRANSLATION_KEYS.skills.duration.months, { months });
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
