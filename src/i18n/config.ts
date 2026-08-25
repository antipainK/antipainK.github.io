export const SUPPORTED_LOCALES = ['en', 'pl', 'zh-CN'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Human-readable labels for the language switcher (endonyms). */
export const LOCALE_LABELS: Record<Locale, string> = {
  'en': 'English',
  'pl': 'Polski',
  'zh-CN': '简体中文',
};
