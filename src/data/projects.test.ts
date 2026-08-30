import { projects } from '@data/projects';
import { describe, expect, it } from 'vitest';

describe('projects', () => {
  it('has unique slugs', () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
