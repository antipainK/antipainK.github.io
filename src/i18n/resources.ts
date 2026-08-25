import { en } from '../locales/en';
import { pl } from '../locales/pl';
import { zhCN } from '../locales/zh-CN';

/** Single namespace — the whole tree lives under it; keys are dotted paths. */
export const defaultNS = 'translation' as const;

export const resources = {
  'en': { translation: en },
  'pl': { translation: pl },
  'zh-CN': { translation: zhCN },
};

/** Canonical translation shape (English is the source of truth). */
export type Translations = typeof en;
