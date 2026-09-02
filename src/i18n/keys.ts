import { en } from '@locales/en';
import type { LeafValues, ListKey, TranslationKeysTree } from './types';

/**
 * Walks the translation object, replacing each leaf with its dotted path.
 * Arrays are leaves, not branches — a bullet list is addressed as one key.
 */
function buildKeyTree(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;
    out[key] = typeof value === 'string' || Array.isArray(value)
      ? path
      : buildKeyTree(value as Record<string, unknown>, path);
  }
  return out;
}

/**
 * Structured, IDE-navigable key registry derived from `en` (the canonical shape).
 * e.g. `TRANSLATION_KEYS.common.nav.experience` === `'common.nav.experience'`.
 */
export const TRANSLATION_KEYS = buildKeyTree(en) as TranslationKeysTree<typeof en>;

type AnyKey = LeafValues<typeof TRANSLATION_KEYS>;

/** Keys whose value is a single string, e.g. 'common.nav.experience'. Only these are valid for `t()`. */
export type TranslationKey = Exclude<AnyKey, ListKey>;

/** Keys whose value is a list, e.g. 'experience.qualtrics.highlights'. Only these are valid for `tList()`. */
export type TranslationListKey = Extract<AnyKey, ListKey>;
