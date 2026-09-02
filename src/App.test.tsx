import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from './App';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('AppRoutes', () => {
  it('renders the homepage at /', () => {
    renderAt('/');

    // Anchored: the hero statement also contains the word "experience".
    expect(screen.getByRole('heading', { level: 2, name: /^experience$/i })).toBeInTheDocument();
  });

  it('renders the CV placeholder at /cv', () => {
    renderAt('/cv');

    expect(screen.getByText('cv placeholder')).toBeInTheDocument();
  });

  it('renders a not-found project page at /projects/:slug', () => {
    renderAt('/projects/does-not-exist');

    expect(screen.getByText('Project not found.')).toBeInTheDocument();
  });

  it('renders the not-found page inside the usual chrome for an unknown path', () => {
    renderAt('/no-such-page');

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
