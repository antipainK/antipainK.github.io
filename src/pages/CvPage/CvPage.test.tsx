import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CvPage } from './CvPage';

describe('CvPage', () => {
  it('renders the placeholder text and sets a real document title', () => {
    render(<CvPage />);

    expect(screen.getByText('cv placeholder')).toBeInTheDocument();
    expect(document.title).toContain('CV');
  });
});
