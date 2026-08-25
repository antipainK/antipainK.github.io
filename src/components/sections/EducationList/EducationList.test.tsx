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
});
