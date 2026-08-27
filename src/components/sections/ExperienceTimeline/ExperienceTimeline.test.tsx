import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExperienceTimeline } from './ExperienceTimeline';

describe('ExperienceTimeline', () => {
  it('renders the section heading and seeded experience entry', () => {
    render(<ExperienceTimeline />);
    expect(screen.getByRole('heading', { level: 2, name: /experience/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CERN' })).toHaveAttribute('href', 'https://home.cern');
  });

  it('applies the highlighted class to an entry whose id is in highlightedEntryIds', () => {
    render(<ExperienceTimeline highlightedEntryIds={new Set(['cern'])} />);
    const cernItem = screen.getByRole('link', { name: 'CERN' }).closest('li');
    expect(cernItem?.className).toMatch(/highlighted/);
  });

  it('does not highlight anything when highlightedEntryIds is omitted', () => {
    render(<ExperienceTimeline />);
    const cernItem = screen.getByRole('link', { name: 'CERN' }).closest('li');
    expect(cernItem?.className).not.toMatch(/highlighted/);
  });
});
