/**
 * Language-invariant portfolio facts. Translatable copy (titles, descriptions)
 * lives in `src/locales/<lng>.ts`, keyed by `id`.
 */

export const profile = {
  name: 'Wojciech Kosztyła',
} as const;

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

export const experience = [
  {
    id: 'qualtrics',
    company: {
      name: 'Qualtrics',
      website: 'https://www.qualtrics.com',
    },
    location: { country: 'Poland', city: 'Kraków' },
    period: { start: '2024-04-01', end: null },
    programmingLanguages: [],
    technologies: [],
    skills: [],
  },
  {
    id: 'genie',
    company: {
      name: 'Genie AI',
      website: undefined,
    },
    period: { start: '2023-05-01', end: '2024-03-31' },
    programmingLanguages: ['Python'],
    technologies: ['FastAPI', 'GraphQL', 'PostgreSQL', 'AWS', 'Kubernetes'],
    skills: ['APIs'],
  },
  {
    id: 'cern',
    company: {
      name: 'CERN',
      fullName: 'European Organization for Nuclear Research',
      website: 'https://home.cern',
    },
    location: { country: 'Switzerland', city: 'Geneva' },
    period: { start: '2021-07-01', end: '2021-10-31' },
    programmingLanguages: ['Python', 'JavaScript', 'C++'],
    technologies: ['VXI-11', 'XML'],
    skills: ['Databases'],
  },
] as const satisfies readonly Experience[];

export const education = [
  {
    id: 'aghMsc',
    kind: 'degree',
    company: {
      name: 'AGH',
      fullName: 'AGH University of Krakow',
    },
    location: { country: 'Poland', city: 'Kraków' },
    period: { start: '2022-03-01', end: '2023-09-30' },
    programmingLanguages: [],
    technologies: [],
    skills: [],
  },
  {
    id: 'aghBsc',
    kind: 'degree',
    company: {
      name: 'AGH',
      fullName: 'AGH University of Krakow',
    },
    location: { country: 'Poland', city: 'Kraków' },
    period: { start: '2018-10-01', end: '2022-02-28' },
    programmingLanguages: [],
    technologies: [],
    skills: [],
  },
] as const satisfies readonly Education[];
