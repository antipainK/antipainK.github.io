import { render, screen } from '@testing-library/react';
import i18n from '@i18n';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { ProjectPage } from './ProjectPage';

vi.mock('@data/projects', () => ({
  projects: [{ slug: 'demo', name: 'Demo Project' }],
}));

i18n.addResourceBundle('en', 'translation', {
  projects: { demo: { shortDescription: 'A demo project summary.' } },
}, true, true);

function renderAtSlug(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/projects/${slug}`]}>
      <Routes>
        <Route element={<ProjectPage />} path="/projects/:slug" />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProjectPage', () => {
  it('renders a not-found message for an unknown slug', () => {
    renderAtSlug('does-not-exist');

    expect(screen.getByText('Project not found.')).toBeInTheDocument();
  });

  it('renders the project name and summary for a known slug', () => {
    renderAtSlug('demo');

    expect(screen.getByRole('heading', { name: 'Demo Project' })).toBeInTheDocument();
    expect(screen.getByText('A demo project summary.')).toBeInTheDocument();
    expect(document.title).toBe('Demo Project');
  });
});
