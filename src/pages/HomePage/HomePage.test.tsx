import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('renders the experience, skills, and education sections', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { level: 2, name: /experience/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /skills/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /education/i })).toBeInTheDocument();
  });
});
