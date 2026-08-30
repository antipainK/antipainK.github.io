import { describe, expect, it } from 'vitest';
import { deriveRoutes } from './deriveRoutes.ts';

describe('deriveRoutes', () => {
  it('returns just the static routes when there are no projects', () => {
    expect(deriveRoutes([])).toEqual(['/', '/cv']);
  });

  it('adds one /projects/:slug route per project', () => {
    expect(deriveRoutes([{ slug: 'a' }, { slug: 'b' }])).toEqual(['/', '/cv', '/projects/a', '/projects/b']);
  });
});
