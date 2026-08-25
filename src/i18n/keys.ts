import { en } from '@locales/en';
import type { LeafValues, TranslationKeysTree } from './types';

/** Walks the translation object, replacing each leaf string with its dotted path. */
function buildKeyTree(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;
    out[key] = typeof value === 'string'
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

/** Every valid translation key, e.g. 'common.nav.experience' | 'home.hero.name'. */
export type TranslationKey = LeafValues<typeof TRANSLATION_KEYS>;
