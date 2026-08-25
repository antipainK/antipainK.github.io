import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders the primary navigation landmark with section links', () => {
    render(<Navbar />);

    const nav = screen.getByRole('navigation', { name: /primary/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /experience/i })).toHaveAttribute('href', '#experience');
    expect(screen.getByRole('link', { name: /education/i })).toHaveAttribute('href', '#education');
  });
});
