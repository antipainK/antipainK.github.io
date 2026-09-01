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

/** Auto-computed "years of experience" duration (see `@lib/skills`) applies only to this category. */
export type SkillCategory = 'language' | 'webDevelopment' | 'database' | 'cloudDevops' | 'aiAssisted' | 'hardwareProtocols';

export interface Skill {
  /**
   * Exact display name. For `category: 'language'` it must match the names used in
   * `languagePeriods`; every other category is what `technologyPeriods` reference.
   */
  name: string;
  category: SkillCategory;
  /**
   * Entirely untracked usage windows with no matching `experience`/`education`
   * entry at all (e.g. personal projects predating any tracked role). Only
   * meaningful for `category: 'language'`; intentionally empty for every entry
   * right now — no dates are invented here, see project notes before filling in.
   */
  additionalPeriods?: readonly Period[];
}

export const skillsCatalog = [
  { name: 'Java', category: 'language' },
  { name: 'Python', category: 'language' },
  { name: 'TypeScript', category: 'language' },
  { name: 'JavaScript', category: 'language' },
  { name: 'C++', category: 'language' },
  { name: 'C', category: 'language' },
  { name: 'Lua', category: 'language' },
  { name: 'Dart', category: 'language' },
  { name: 'HTML + CSS', category: 'webDevelopment' },
  { name: 'React', category: 'webDevelopment' },
  { name: 'Vite', category: 'webDevelopment' },
  { name: 'Node.js', category: 'webDevelopment' },
  { name: 'Flask', category: 'webDevelopment' },
  { name: 'FastAPI', category: 'webDevelopment' },
  { name: 'Spring', category: 'webDevelopment' },
  { name: 'GraphQL', category: 'webDevelopment' },
  { name: 'XML', category: 'webDevelopment' },
  { name: 'PostgreSQL', category: 'database' },
  { name: 'MySQL', category: 'database' },
  { name: 'NoSQL', category: 'database' },
  { name: 'MongoDB', category: 'database' },
  { name: 'AWS', category: 'cloudDevops' },
  { name: 'Kubernetes', category: 'cloudDevops' },
  { name: 'GitLab CI', category: 'cloudDevops' },
  { name: 'RenovateBot', category: 'cloudDevops' },
  { name: 'Splunk', category: 'cloudDevops' },
  { name: 'Grafana', category: 'cloudDevops' },
  { name: 'Google Cloud Platform', category: 'cloudDevops' },
  { name: 'Claude Code', category: 'aiAssisted' },
  { name: 'Cursor', category: 'aiAssisted' },
  { name: 'Windsurf', category: 'aiAssisted' },
  { name: 'Gemini', category: 'aiAssisted' },
  { name: 'VXI-11', category: 'hardwareProtocols' },
] as const satisfies readonly Skill[];

/** Language names known to the catalog — keeps `languagePeriods` honest at compile time. */
type LanguageSkill = Extract<(typeof skillsCatalog)[number], { category: 'language' }>;
export type KnownProgrammingLanguage = LanguageSkill['name'];

/**
 * Everything in the catalog that isn't a programming language — the same
 * compile-time guarantee for `technologyPeriods`. The catalog is meant to be a
 * complete, entry-backed inventory, so a technology used in an entry belongs in
 * it by definition; trimming what's *shown* is a display concern, not a data one.
 */
type TechnologySkill = Exclude<(typeof skillsCatalog)[number], { category: 'language' }>;
export type KnownTechnology = TechnologySkill['name'];

/** A date range during which a specific set of languages was in use within one entry. */
export interface LanguagePeriod {
  /** Defaults to the parent entry's own `period` when omitted (i.e. used for the whole entry). */
  period?: Period;
  languages: readonly KnownProgrammingLanguage[];
}

/** A date range during which a specific set of technologies/frameworks was in use within one entry. */
export interface TechnologyPeriod {
  /** Defaults to the parent entry's own `period` when omitted (i.e. used for the whole entry). */
  period?: Period;
  technologies: readonly KnownTechnology[];
}

interface TimelineEntryBase {
  /** Stable id, also the i18n key for this entry's translatable copy. */
  id: string;
  company: Company;
  location?: Location;
  period: Period;
  /**
   * Sub-ranges of `period` with the language(s) used during each — omitting
   * `period` on an entry covers the common "one consistent stack throughout"
   * case; multiple entries express a stack change partway through (e.g. a
   * tech migration) or a language used only for part of a multi-year degree.
   */
  languagePeriods: readonly LanguagePeriod[];
  /** Same sub-range model as `languagePeriods`, for frameworks/tools/platforms instead of languages. */
  technologyPeriods: readonly TechnologyPeriod[];
  /** Broad categorical tags (e.g. 'DevOps', 'APIs') — distinct from the `Skill` catalog above; not name-matched against it. */
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
    languagePeriods: [
      { languages: ['Java', 'TypeScript'] },
      { period: { start: '2025-10-01', end: null }, languages: ['Python'] },
    ],
    technologyPeriods: [
      { technologies: ['Spring', 'React', 'Vite', 'AWS', 'GitLab CI', 'RenovateBot', 'Splunk', 'Grafana'] },
    ],
    skills: ['DevOps', 'AI-assisted development'],
  },
  {
    id: 'genie',
    company: {
      name: 'Genie AI',
      website: 'https://www.genieai.tech/',
    },
    period: { start: '2023-05-01', end: '2024-03-31' },
    languagePeriods: [
      { languages: ['Python'] },
    ],
    technologyPeriods: [
      { technologies: ['FastAPI', 'GraphQL', 'PostgreSQL', 'AWS', 'Kubernetes'] },
    ],
    skills: ['APIs', 'Databases'],
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
    languagePeriods: [
      { languages: ['Python', 'JavaScript', 'C++'] },
    ],
    technologyPeriods: [
      { technologies: ['VXI-11', 'XML', 'MySQL', 'Flask'] },
    ],
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
    // Semester placeholders (summer 21/22, winter 22/23, summer 22/23) -- fill in languages as remembered.
    languagePeriods: [
      { period: { start: '2022-03-01', end: '2022-09-30' }, languages: [] },
      { period: { start: '2022-10-01', end: '2023-02-28' }, languages: [] },
      { period: { start: '2023-03-01', end: '2023-09-30' }, languages: [] },
    ],
    technologyPeriods: [],
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
    // Remaining semester placeholders (winter 19/20 through winter 21/22) -- fill in languages as remembered.
    languagePeriods: [
      { period: { start: '2018-10-01', end: '2019-07-30' }, languages: ['C', 'C++'] },
      { period: { start: '2019-10-01', end: '2020-02-29' }, languages: [] },
      { period: { start: '2020-03-01', end: '2020-09-30' }, languages: [] },
      { period: { start: '2020-10-01', end: '2021-02-28' }, languages: [] },
      { period: { start: '2021-03-01', end: '2021-09-30' }, languages: [] },
      { period: { start: '2021-10-01', end: '2022-02-28' }, languages: [] },
    ],
    technologyPeriods: [],
    skills: [],
  },
] as const satisfies readonly Education[];
