import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExperienceTimeline } from './ExperienceTimeline';

describe('ExperienceTimeline', () => {
  it('renders the section heading and seeded experience entry', () => {
    render(<ExperienceTimeline />);
    expect(screen.getByRole('heading', { level: 2, name: /experience/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CERN' })).toHaveAttribute('href', 'https://home.cern');
  });
});
