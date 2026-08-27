import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EducationList } from './EducationList';

describe('EducationList', () => {
  it('renders the section heading and seeded education entries', () => {
    render(<EducationList />);
    expect(screen.getByRole('heading', { level: 2, name: /education/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /MSc, Computer Science/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /BSc, Computer Science/i })).toBeInTheDocument();
  });

  it('applies the highlighted class to an entry whose id is in highlightedEntryIds', () => {
    render(<EducationList highlightedEntryIds={new Set(['aghMsc'])} />);
    const mscItem = screen.getByRole('heading', { level: 3, name: /MSc, Computer Science/i }).closest('li');
    expect(mscItem?.className).toMatch(/highlighted/);
  });

  it('does not highlight anything when highlightedEntryIds is omitted', () => {
    render(<EducationList />);
    const mscItem = screen.getByRole('heading', { level: 3, name: /MSc, Computer Science/i }).closest('li');
    expect(mscItem?.className).not.toMatch(/highlighted/);
  });
});
