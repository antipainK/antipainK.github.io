import { render, screen } from '@testing-library/react';
import { education, experience, headlineFigures, MAIN_LANGUAGES } from '@data/portfolio';
import { computeLanguageDuration } from '@lib/skills';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  it('leads with the statement, not the name — the rail carries the name', () => {
    render(<Hero />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/I build backend and frontend/i);
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('pulls three figures out of the prose at display size', () => {
    render(<Hero />);
    const values = screen.getAllByRole('term').map((term) => term.textContent);

    expect(values).toHaveLength(3);
    expect(values).toContain(`~${headlineFigures.automatedUpdateRepos}`);
    expect(values).toContain(String(headlineFigures.ciTemplateEngineers));
  });

  it('computes the language figure from the data rather than hardcoding it', () => {
    render(<Hero />);
    const values = screen.getAllByRole('term').map((term) => term.textContent ?? '');

    // Recomputed from the same source, so swapping the component for a literal fails here.
    const { totalMonths } = computeLanguageDuration([...experience, ...education], MAIN_LANGUAGES);
    expect(values).toContain(`${Math.floor((totalMonths ?? 0) / 12)}+`);
  });
});
