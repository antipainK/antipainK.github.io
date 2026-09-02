import { render, screen } from '@testing-library/react';
import { skillsCatalog } from '@data/portfolio';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SkillsSection } from './SkillsSection';

describe('SkillsSection', () => {
  it('renders every catalog skill, so no category can be silently left out of CATEGORY_ORDER', () => {
    render(<SkillsSection onSelectionChange={vi.fn()} />);

    // A measured language is named "Java 2 yr 5 mo"; a chip is just "Java".
    const missing = skillsCatalog
      .map((skill) => skill.name)
      .filter((name) => screen.queryAllByRole('button', {
        name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`, 'i'),
      }).length === 0);

    expect(missing).toEqual([]);
  });

  it('renders the section heading, category groups, and skill names', () => {
    render(<SkillsSection onSelectionChange={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 2, name: /skills/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /^languages$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^java(?:\s|$)/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /infrastructure & protocols/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^aws/i })).toBeInTheDocument();
  });

  it('gives languages a measured bar and everything else a bare chip with no duration', () => {
    render(<SkillsSection onSelectionChange={vi.fn()} />);

    // VXI-11 moved here when the one-item "Hardware & Protocols" group was folded in.
    expect(screen.getByRole('button', { name: 'VXI-11' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'AWS' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^java \d/i })).toBeInTheDocument();
  });

  it('reports the contributing entries for a language on hover, and clears them on unhover', async () => {
    const onSelectionChange = vi.fn();
    const user = userEvent.setup();
    render(<SkillsSection onSelectionChange={onSelectionChange} />);

    const javaButton = screen.getByRole('button', { name: /^java(?:\s|$)/i });
    await user.hover(javaButton);
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ entryIds: new Set(['qualtrics']) }),
    );

    await user.unhover(javaButton);
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ entryIds: new Set() }),
    );
  });

  it('reports every entry using a given technology, not just languages', async () => {
    const onSelectionChange = vi.fn();
    const user = userEvent.setup();
    render(<SkillsSection onSelectionChange={onSelectionChange} />);

    await user.hover(screen.getByRole('button', { name: /^aws/i }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ entryIds: new Set(['qualtrics', 'genie']) }),
    );
  });

  it('pins a skill on click until clicked again', async () => {
    const onSelectionChange = vi.fn();
    const user = userEvent.setup();
    render(<SkillsSection onSelectionChange={onSelectionChange} />);
    const javaButton = screen.getByRole('button', { name: /^java(?:\s|$)/i });

    await user.click(javaButton);
    expect(javaButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(javaButton);
    expect(javaButton).toHaveAttribute('aria-pressed', 'false');

    // The button is still hovered after the click sequence; moving away confirms
    // nothing stayed pinned.
    await user.unhover(javaButton);
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ entryIds: new Set() }),
    );
  });

  it('filters only on a pinned skill, never on hover', async () => {
    const onSelectionChange = vi.fn();
    const user = userEvent.setup();
    render(<SkillsSection onSelectionChange={onSelectionChange} />);
    const aws = screen.getByRole('button', { name: 'AWS' });

    // Hovering marks matches but must not dim the page.
    await user.hover(aws);
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ filterSkill: null }),
    );

    await user.click(aws);
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ filterSkill: 'AWS' }),
    );
  });

  it('lets a parent own the pin, so the header can clear it from outside', async () => {
    const onPinnedSkillChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <SkillsSection
        onSelectionChange={vi.fn()}
        pinnedSkill="AWS"
        onPinnedSkillChange={onPinnedSkillChange}
      />,
    );

    expect(screen.getByRole('button', { name: 'AWS' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'AWS' }));
    expect(onPinnedSkillChange).toHaveBeenCalledWith(null);

    rerender(
      <SkillsSection
        onSelectionChange={vi.fn()}
        pinnedSkill={null}
        onPinnedSkillChange={onPinnedSkillChange}
      />,
    );
    expect(screen.getByRole('button', { name: 'AWS' })).toHaveAttribute('aria-pressed', 'false');
  });
});
