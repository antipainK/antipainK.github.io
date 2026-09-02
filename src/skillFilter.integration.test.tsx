import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from './App';

/**
 * The filter spans three subtrees — chips in the rail, status in the sticky
 * header, dimming in the routed page — wired through `Layout` and outlet
 * context. Each part is unit-tested; this covers the seam between them.
 */
function renderAt(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>);
}

const dimmed = () => document.querySelectorAll('[class*="dimmed"]');

describe('skill filter, end to end', () => {
  it('dims non-matching entries and states why, from a chip in the rail', async () => {
    const user = userEvent.setup();
    renderAt('/');

    expect(dimmed()).toHaveLength(0);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();

    // AWS backs Qualtrics and Genie, but not CERN or either degree.
    await user.click(screen.getByRole('button', { name: 'AWS' }));

    expect(screen.getByRole('status')).toHaveTextContent('Filter AWS — 2 of 3 roles');
    expect(dimmed()).toHaveLength(3);
  });

  it('clears from the header, which is reachable when the rail has scrolled away', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('button', { name: 'AWS' }));
    await user.click(screen.getByRole('button', { name: 'Clear filter' }));

    expect(dimmed()).toHaveLength(0);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.getByRole('button', { name: 'AWS' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('does not offer the filter on routes it cannot affect', () => {
    renderAt('/cv');

    expect(screen.queryByRole('button', { name: 'AWS' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: /^skills$/i })).not.toBeInTheDocument();
  });
});
