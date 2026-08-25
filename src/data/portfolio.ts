/**
 * Language-invariant portfolio facts. Translatable copy (titles, descriptions)
 * lives in `src/locales/<lng>/{experience,education}.json`, keyed by `id`.
 */

export interface Company {
  name: string;
  fullName?: string;
  website?: string;
}

export interface Location {
  country: string;
  city: string;
}

/** ISO 8601 dates. `end: null` means ongoing. */
export interface Period {
  start: string;
  end: string | null;
}

interface TimelineEntryBase {
  /** Stable id, also the i18n key for this entry's translatable copy. */
  id: string;
  company: Company;
  location?: Location;
  period: Period;
  programmingLanguages: readonly string[];
  technologies: readonly string[];
  skills: readonly string[];
  githubLink?: string;
}

export type Experience = TimelineEntryBase;

export interface Education extends TimelineEntryBase {
  kind: 'degree' | 'course' | 'highSchool';
}

// NOTE: seed values — replace the facts below with your real details.
export const experience = [
  {
    id: 'cern',
    company: {
      name: 'CERN',
      fullName: 'European Organization for Nuclear Research',
      website: 'https://home.cern',
    },
    location: { country: 'Switzerland', city: 'Geneva' },
    period: { start: '2021-07-01', end: '2021-09-30' },
    programmingLanguages: ['Python'],
    technologies: ['NumPy', 'ROOT', 'Git'],
    skills: ['Data analysis', 'Scientific computing'],
  },
] as const satisfies readonly Experience[];

export const education = [
  {
    id: 'agh',
    kind: 'degree',
    company: {
      name: 'AGH UST',
      fullName: 'AGH University of Science and Technology',
    },
    location: { country: 'Poland', city: 'Kraków' },
    period: { start: '2018-10-01', end: '2023-09-30' },
    programmingLanguages: ['C++', 'Python', 'JavaScript'],
    technologies: [],
    skills: [],
  },
] as const satisfies readonly Education[];
