import { en } from '@locales/en';
import { pl } from '@locales/pl';

/** Single namespace — the whole tree lives under it; keys are dotted paths. */
export const defaultNS = 'translation' as const;

export const resources = {
  en: { translation: en },
  pl: { translation: pl },
};

/** Canonical translation shape (English is the source of truth). */
export type Translations = typeof en;
