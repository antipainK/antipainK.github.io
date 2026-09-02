import { describe, expect, it } from 'vitest';
// `?raw` rather than node:fs — `src/` is typed as browser-only (tsconfig.app.json).
import mainSource from './main.tsx?raw';

/**
 * Config assertion, not a rendering test. Polish diacritics (ł ą ę ś ż ź ć ń)
 * live in the `latin-ext` subset, so a weight imported as `latin` only renders
 * them from a fallback face mid-word. `ó` is in basic latin, which is exactly
 * what makes the bug easy to miss — most of the page looks correct.
 *
 * Its job is to fail loudly if a future refactor drops a `latin-ext` import.
 */
const FONT_IMPORT = /@fontsource\/(?<face>[\w-]+)\/(?<subset>latin-ext|latin)-(?<weight>\d+)\.css/g;

interface FontImport { face: string; subset: string; weight: string }

function importedFonts(): readonly FontImport[] {
  return [...mainSource.matchAll(FONT_IMPORT)].map((match) => match.groups as unknown as FontImport);
}

describe('webfont imports', () => {
  it('imports at least one font', () => {
    expect(importedFonts().length).toBeGreaterThan(0);
  });

  it('pairs every latin weight with its latin-ext counterpart', () => {
    const fonts = importedFonts();
    const has = (face: string, subset: string, weight: string) =>
      fonts.some((font) => font.face === face && font.subset === subset && font.weight === weight);

    const missing = fonts
      .filter((font) => !has(font.face, font.subset === 'latin' ? 'latin-ext' : 'latin', font.weight))
      .map((font) => `${font.face} ${font.weight} is missing its ${font.subset === 'latin' ? 'latin-ext' : 'latin'} pair`);

    expect(missing).toEqual([]);
  });

  it('self-hosts rather than linking a third-party font CDN', () => {
    expect(mainSource).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/);
  });
});
