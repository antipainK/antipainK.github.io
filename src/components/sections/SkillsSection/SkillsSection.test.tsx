import { render, screen } from '@testing-library/react';
import { skillsCatalog } from '@data/portfolio';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SkillsSection } from './SkillsSection';

describe('SkillsSection', () => {
  it('renders every catalog skill, so no category can be silently left out of CATEGORY_ORDER', () => {
    render(<SkillsSection onHighlightChange={vi.fn()} />);
    // A language button reads "Java 2 yr 5 mo", so match the name or its prefix.
    const rendered = screen.getAllByRole('button').map((button) => button.textContent ?? '');

    const missing = skillsCatalog
      .map((skill) => skill.name)
      .filter((name) => !rendered.some((label) => label === name || label.startsWith(`${name} `)));

    expect(missing).toEqual([]);
  });

  it('renders the section heading, category groups, and skill names', () => {
    render(<SkillsSection onHighlightChange={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 2, name: /skills/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /programming languages/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^java(?:\s|$)/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /cloud & devops/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^aws/i })).toBeInTheDocument();
  });

  it('reports the contributing entries for a language on hover, and clears them on unhover', async () => {
    const onHighlightChange = vi.fn();
    const user = userEvent.setup();
    render(<SkillsSection onHighlightChange={onHighlightChange} />);

    const javaButton = screen.getByRole('button', { name: /^java(?:\s|$)/i });
    await user.hover(javaButton);
    expect(onHighlightChange).toHaveBeenLastCalledWith(new Set(['qualtrics']));

    await user.unhover(javaButton);
    expect(onHighlightChange).toHaveBeenLastCalledWith(new Set());
  });

  it('reports every entry using a given technology, not just languages', async () => {
    const onHighlightChange = vi.fn();
    const user = userEvent.setup();
    render(<SkillsSection onHighlightChange={onHighlightChange} />);

    await user.hover(screen.getByRole('button', { name: /^aws/i }));
    expect(onHighlightChange).toHaveBeenLastCalledWith(new Set(['qualtrics', 'genie']));
  });

  it('pins a skill on click until clicked again', async () => {
    const onHighlightChange = vi.fn();
    const user = userEvent.setup();
    render(<SkillsSection onHighlightChange={onHighlightChange} />);
    const javaButton = screen.getByRole('button', { name: /^java(?:\s|$)/i });

    await user.click(javaButton);
    expect(javaButton).toHaveAttribute('aria-pressed', 'true');

    await user.click(javaButton);
    expect(javaButton).toHaveAttribute('aria-pressed', 'false');

    // The button is still hovered after the click sequence; moving away confirms
    // nothing stayed pinned.
    await user.unhover(javaButton);
    expect(onHighlightChange).toHaveBeenLastCalledWith(new Set());
  });
});
