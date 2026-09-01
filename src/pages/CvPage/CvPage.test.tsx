import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CvPage } from './CvPage';

describe('CvPage', () => {
  it('renders a level-1 heading, the placeholder text and sets a real document title', () => {
    render(<CvPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'CV' })).toBeInTheDocument();
    expect(screen.getByText('cv placeholder')).toBeInTheDocument();
    expect(document.title).toContain('CV');
  });
});
