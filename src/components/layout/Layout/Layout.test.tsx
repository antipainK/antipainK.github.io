import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Layout } from './Layout';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<p>content</p>} index />
          <Route element={<p>cv content</p>} path="cv" />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('Layout', () => {
  it('renders the rail, footer, and routed content inside the main landmark', () => {
    renderAt('/');

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('main')).toContainElement(screen.getByText('content'));
  });

  it('keeps contact links reachable from the rail, not just the bottom of the page', () => {
    renderAt('/');

    expect(screen.getByRole('link', { name: /kosztylawojciech@gmail\.com/ })).toHaveAttribute(
      'href',
      'mailto:kosztylawojciech@gmail.com',
    );
    expect(screen.getByRole('link', { name: /github\.com\/antipainK/ })).toBeInTheDocument();
  });

  it('makes the rail name the level-1 heading on the homepage only', () => {
    const { unmount } = renderAt('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Wojciech Kosztyła');
    unmount();

    // /cv sets its own <h1>; the rail must not shadow it.
    renderAt('/cv');
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });
});
