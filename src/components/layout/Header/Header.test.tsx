import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

function renderAt(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><Header /></MemoryRouter>);
}

describe('Header', () => {
  it('carries the site chrome: the CV route and the language control', () => {
    renderAt('/');

    expect(screen.getByRole('link', { name: 'CV' })).toHaveAttribute('href', '/cv');
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('marks the CV link as current only while on /cv', () => {
    const { unmount } = renderAt('/');
    expect(screen.getByRole('link', { name: 'CV' })).not.toHaveAttribute('aria-current');
    unmount();

    renderAt('/cv');
    expect(screen.getByRole('link', { name: 'CV' })).toHaveAttribute('aria-current', 'page');
  });

  /*
   * The status lives here rather than beside the chips because the rail
   * scrolls away: a reader must never see a dimmed page with the explanation
   * off-screen. The region is present from first paint so assistive tech
   * observes it — one inserted as it gains text is frequently missed.
   */
  it('keeps an empty live region when nothing is filtered', () => {
    renderAt('/');

    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.queryByRole('button', { name: 'Clear filter' })).not.toBeInTheDocument();
  });

  it('states the active filter and its match count', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header filterSkill="AWS" matchingRoles={2} totalRoles={3} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Filter AWS — 2 of 3 roles');
  });

  it('offers a clear button that reports upward', async () => {
    const onClearFilter = vi.fn();
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header filterSkill="AWS" matchingRoles={2} totalRoles={3} onClearFilter={onClearFilter} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Clear filter' }));
    expect(onClearFilter).toHaveBeenCalledOnce();
  });
});
