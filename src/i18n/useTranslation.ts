import type { TOptions } from 'i18next';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import type { TranslationKey } from './keys';

/**
 * Typed wrapper around react-i18next: `t` only accepts known keys
 * (`TranslationKey`), giving autocomplete and compile errors on typos.
 */
export function useTranslation() {
  const { t, i18n } = useI18nextTranslation();
  const translate = (key: TranslationKey, options?: TOptions): string => t(key, options);
  return { t: translate, i18n };
}
