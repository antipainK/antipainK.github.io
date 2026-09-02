/** Union of the leaf values of a nested object (e.g. the key strings of a key tree). */
export type LeafValues<T> = T extends string
  ? T
  : { [K in keyof T]: LeafValues<T[K]> }[keyof T];

/**
 * Marks a key whose value is a list. Type-only — the runtime key is still just
 * the dotted string. Without it `t()` and `tList()` would both accept every
 * key: `t(listKey)` renders i18next's "returned an object instead of string"
 * warning into the page, and `tList(stringKey)` silently renders nothing.
 */
export interface ListKey { readonly __list: true }

/**
 * Same shape as `T`, but each leaf is replaced by its dotted key path. A
 * `readonly string[]` (an entry's bullet list) counts as a leaf: it is one
 * addressable key that `tList` resolves to the whole list, not a branch.
 */
export type TranslationKeysTree<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends readonly string[]
      ? `${Prefix}${K}` & ListKey
      : TranslationKeysTree<T[K], `${Prefix}${K}.`>;
};

/** Cardinal categories i18next appends to a key with `_`, per Intl.PluralRules. */
type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

/**
 * A possibly-incomplete set of translations: every level optional, leaves widened.
 *
 * The second half admits plural variants of any string leaf. A locale may need
 * more cardinal forms than English has: Polish distinguishes `one` (1 rok),
 * `few` (2 lata) and `many` (5 lat) where English needs a single invariant
 * "yr". So `en` declares the key once and `pl` supplies `_one` / `_few` /
 * `_many`; i18next picks the form from `count` and falls back to the
 * unsuffixed key for locales that defined no variants.
 */
export type PartialTranslations<T> = {
  [K in keyof T]?: T[K] extends string
    ? string
    : T[K] extends readonly string[]
      ? readonly string[]
      : PartialTranslations<T[K]>;
} & {
  [K in keyof T & string as T[K] extends string ? `${K}_${PluralCategory}` : never]?: string;
};
