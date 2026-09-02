import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import i18n from '@i18n';
import { LOCALE_LABELS, SUPPORTED_LOCALES } from '@i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';

/** Surfaces the current query string so the ?lang= wiring can be asserted. */
function ShowSearch() {
  return <output>{useLocation().search}</output>;
}

function renderSwitcher() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <LanguageSwitcher />
      <ShowSearch />
    </MemoryRouter>,
  );
}

describe('LanguageSwitcher', () => {
  // i18n is a shared singleton across the suite.
  afterEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('is a native select, so it scales past two locales for free', () => {
    renderSwitcher();

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(SUPPORTED_LOCALES.length);
  });

  it('labels each option with its endonym, not the English name', () => {
    renderSwitcher();

    for (const locale of SUPPORTED_LOCALES) {
      expect(screen.getByRole('option', { name: LOCALE_LABELS[locale] })).toBeInTheDocument();
    }
    // "Polski", never "Polish".
    expect(screen.queryByRole('option', { name: 'Polish' })).not.toBeInTheDocument();
  });

  it('has a label associated with the control', () => {
    renderSwitcher();

    expect(screen.getByRole('combobox')).toHaveAccessibleName('Language');
  });

  it('switches language on change', async () => {
    const user = userEvent.setup();
    renderSwitcher();

    await user.selectOptions(screen.getByRole('combobox'), 'pl');
    expect(i18n.resolvedLanguage).toBe('pl');
  });

  it('writes ?lang= so the choice produces a shareable URL', async () => {
    const user = userEvent.setup();
    renderSwitcher();

    await user.selectOptions(screen.getByRole('combobox'), 'pl');
    expect(screen.getByRole('status')).toHaveTextContent('?lang=pl');
  });
});
