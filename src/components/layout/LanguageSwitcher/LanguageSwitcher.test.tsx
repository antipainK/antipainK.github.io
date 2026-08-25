import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import i18n from '@i18n';
import { SUPPORTED_LOCALES } from '@i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('offers every supported locale and switches language on change', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    const select = screen.getByRole('combobox');
    expect(screen.getAllByRole('option')).toHaveLength(SUPPORTED_LOCALES.length);

    await user.selectOptions(select, 'pl');
    expect(i18n.resolvedLanguage).toBe('pl');
    expect(await screen.findByText('Język')).toBeInTheDocument();

    await user.selectOptions(select, 'en');
    expect(await screen.findByText('Language')).toBeInTheDocument();
  });
});
