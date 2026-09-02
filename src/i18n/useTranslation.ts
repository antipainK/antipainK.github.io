import type { TOptions } from 'i18next';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import type { TranslationKey, TranslationListKey } from './keys';

/**
 * Typed wrapper around react-i18next: `t` only accepts known keys
 * (`TranslationKey`), giving autocomplete and compile errors on typos.
 */
export function useTranslation() {
  const { t, i18n } = useI18nextTranslation();
  const translate = (key: TranslationKey, options?: TOptions): string => t(key, options);

  /** Resolves a key whose value is a list (an entry's bullets) to its items. */
  const translateList = (key: TranslationListKey): readonly string[] => {
    const value: unknown = t(key, { returnObjects: true });
    return Array.isArray(value) ? (value as string[]) : [];
  };

  return { t: translate, tList: translateList, i18n };
}
