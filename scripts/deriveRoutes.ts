import type { Project } from '../src/data/projects.ts';

/**
 * Every real, prerenderable route: the static pages plus one per project.
 * Kept as a plain function (not importing `projects` itself) so it's easy to
 * unit-test, and so `prerender.mjs` and its test both derive the same list
 * from whatever `projects` data is passed in.
 */
export function deriveRoutes(projects: readonly Pick<Project, 'slug'>[]): readonly string[] {
  return ['/', '/cv', ...projects.map((project) => `/projects/${project.slug}`)];
}
