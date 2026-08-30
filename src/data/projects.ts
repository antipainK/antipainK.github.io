/**
 * Personal projects, shown on their own `/projects/:slug` pages. Kept
 * separate from `portfolio.ts` since a project isn't a dated timeline entry.
 * Translatable copy (`shortDescription`) lives in `src/locales/<lng>.ts`
 * under `projects.<slug>`, matching the facts/copy split used for
 * `experience`/`education`.
 */

export interface Project {
  /** URL-safe id, used as the `/projects/:slug` path segment and the i18n key. */
  slug: string;
  name: string;
}

export const projects: readonly Project[] = [];
