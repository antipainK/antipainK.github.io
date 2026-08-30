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

    expect(screen.getByRole('heading', { level: 2, name: /experience/i })).toBeInTheDocument();
  });

  it('renders the CV placeholder at /cv', () => {
    renderAt('/cv');

    expect(screen.getByText('cv placeholder')).toBeInTheDocument();
  });

  it('renders a not-found project page at /projects/:slug', () => {
    renderAt('/projects/does-not-exist');

    expect(screen.getByText('Project not found.')).toBeInTheDocument();
  });
});
