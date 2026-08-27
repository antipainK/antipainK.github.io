import type { Period } from '@data/portfolio';

interface Interval {
  start: Date;
  end: Date;
}

/** Inclusive month span, e.g. Jul–Oct is 4 months, not 3. Always at least 1. */
function monthsBetweenInclusive(start: Date, end: Date): number {
  const diff = (end.getUTCFullYear() - start.getUTCFullYear()) * 12
    + (end.getUTCMonth() - start.getUTCMonth()) + 1;
  return Math.max(1, diff);
}

/** Sorts by start and merges overlapping/adjacent intervals so time isn't double-counted. */
function mergeIntervals(intervals: readonly Interval[]): Interval[] {
  const sorted = [...intervals].sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged: Interval[] = [];

  for (const interval of sorted) {
    const last = merged.at(-1);
    if (last && interval.start.getTime() <= last.end.getTime()) {
      if (interval.end.getTime() > last.end.getTime()) {
        last.end = interval.end;
      }
    } else {
      merged.push({ ...interval });
    }
  }

  return merged;
}

/**
 * Total time-in-use, in whole months, across the union of `periods` —
 * overlapping periods are merged, not summed, so concurrent periods using
 * the same skill aren't double-counted. `end: null` resolves to `now`.
 * Returns `null` when `periods` is empty.
 */
export function computeDurationMonths(periods: readonly Period[], now: Date = new Date()): number | null {
  if (periods.length === 0) {
    return null;
  }

  const intervals = periods.map((period): Interval => ({
    start: new Date(period.start),
    end: period.end ? new Date(period.end) : now,
  }));

  return mergeIntervals(intervals)
    .reduce((total, interval) => total + monthsBetweenInclusive(interval.start, interval.end), 0);
}
