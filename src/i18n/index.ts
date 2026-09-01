import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './config';
import { defaultNS, resources } from './resources';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: [...SUPPORTED_LOCALES],
    // Accept regional variants of a supported language, e.g. `pl-PL` → `pl`.
    nonExplicitSupportedLngs: true,
    defaultNS,
    ns: [defaultNS],
    interpolation: { escapeValue: false },
    detection: {
      // ?lang=<supported-locale> overrides for that visit and becomes sticky
      // (cached to localStorage, same as any other detected language);
      // an unsupported value is skipped by i18next's own supportedLngs
      // matching, falling through to localStorage then navigator.
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
    },
    react: { useSuspense: false },
  })
  .then(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? DEFAULT_LOCALE;
  });

// Keep the document language in sync for SEO and accessibility.
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
