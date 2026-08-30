import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders the primary navigation landmark with section links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const nav = screen.getByRole('navigation', { name: /primary/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /experience/i })).toHaveAttribute('href', '/#experience');
    expect(screen.getByRole('link', { name: /skills/i })).toHaveAttribute('href', '/#skills');
    expect(screen.getByRole('link', { name: /education/i })).toHaveAttribute('href', '/#education');
    expect(screen.getByRole('link', { name: /cv/i })).toHaveAttribute('href', '/cv');
  });
});
