import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { profile } from '@data/portfolio';
import { Rail } from './Rail';

function renderAt(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><Rail /></MemoryRouter>);
}

describe('Rail', () => {
  it('is the page banner, not complementary content', () => {
    renderAt('/');

    // It carries site identity, the primary nav and the homepage <h1>.
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('is the level-1 heading on the homepage', () => {
    renderAt('/');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(profile.name);
  });

  it('demotes the name off <h1> on other routes, so the page keeps its own', () => {
    renderAt('/cv');

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    // Still present and still a link home, just not a heading.
    expect(screen.getByRole('link', { name: profile.name })).toHaveAttribute('href', '/');
  });

  it('renders every contact as a real link', () => {
    renderAt('/');

    for (const contact of profile.contacts) {
      expect(screen.getByRole('link', { name: contact.label })).toHaveAttribute('href', contact.href);
    }
  });

  /* Section anchors were dropped and the CV route moved to the header, so the
     rail carries identity and contact only — no navigation landmark. */
  it('carries no navigation of its own', () => {
    renderAt('/');

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('gives the portrait a non-empty alt text', () => {
    renderAt('/');

    expect(screen.getByRole('img')).toHaveAccessibleName(profile.name);
  });
});
