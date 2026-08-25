import type { Period } from '../data/portfolio';

/** Formats a period as e.g. "Jul 2021 – Sep 2021", localized to `locale`. */
export function formatPeriod(period: Period, locale: string, presentLabel: string): string {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' });
  const start = formatter.format(new Date(period.start));
  const end = period.end ? formatter.format(new Date(period.end)) : presentLabel;
  return `${start} – ${end}`;
}
