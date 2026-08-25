import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EducationList } from './EducationList';

describe('EducationList', () => {
  it('renders the section heading and seeded education entry', () => {
    render(<EducationList />);
    expect(screen.getByRole('heading', { level: 2, name: /education/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /MSc & BSc, Computer Science/i })).toBeInTheDocument();
  });
});
