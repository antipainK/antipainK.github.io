/** Union of the leaf values of a nested object (e.g. the key strings of a key tree). */
export type LeafValues<T> = T extends string
  ? T
  : { [K in keyof T]: LeafValues<T[K]> }[keyof T];

/** Same shape as `T`, but each leaf string is replaced by its dotted key path. */
export type TranslationKeysTree<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : TranslationKeysTree<T[K], `${Prefix}${K}.`>;
};

/** A possibly-incomplete set of translations: every level optional, leaves widened to `string`. */
export type PartialTranslations<T> = {
  [K in keyof T]?: T[K] extends string ? string : PartialTranslations<T[K]>;
};
