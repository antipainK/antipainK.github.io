import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import type { LayoutOutletContext } from '@components/layout/Layout/Layout';
import { HomePage } from './HomePage';

const NO_SELECTION: LayoutOutletContext = {
  selection: { entryIds: new Set(), filterSkill: null },
};

/** The page reads its filter from the outlet, so a providing route is required. */
function renderPage(context: LayoutOutletContext = NO_SELECTION) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<Outlet context={context} />}>
          <Route element={<HomePage />} index />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('renders the experience and education sections', () => {
    renderPage();

    // Anchored: the hero statement also contains the word "experience".
    expect(screen.getByRole('heading', { level: 2, name: /^experience$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /^education$/i })).toBeInTheDocument();
  });

  it('leaves skills to the rail, so nothing is duplicated in the main column', () => {
    renderPage();

    expect(screen.queryByRole('heading', { level: 2, name: /^skills$/i })).not.toBeInTheDocument();
  });

  it('dims nothing while no skill is pinned', () => {
    renderPage();

    expect(document.querySelectorAll('[class*="dimmed"]')).toHaveLength(0);
  });

  it('dims the entries a pinned skill does not back', () => {
    renderPage({ selection: { entryIds: new Set(['qualtrics']), filterSkill: 'React' } });

    // Three roles and two degrees; only Qualtrics matches, so four recede.
    expect(document.querySelectorAll('[class*="dimmed"]')).toHaveLength(4);
  });
});
