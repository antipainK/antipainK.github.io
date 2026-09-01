import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SUPPORTED_LOCALES } from './config';

describe('i18n querystring language override', () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
    window.history.pushState(null, '', '/');
  });

  it('falls through to the existing detection for an unsupported ?lang value, instead of blanking the UI', async () => {
    window.history.pushState(null, '', '/?lang=de');

    const { default: freshI18n } = await import('./index');
    await new Promise<void>((resolve) => {
      if (freshI18n.isInitialized) {
        resolve();
      } else {
        freshI18n.on('initialized', () => resolve());
      }
    });

    expect(freshI18n.resolvedLanguage).not.toBe('de');
    expect(SUPPORTED_LOCALES).toContain(freshI18n.resolvedLanguage);
  });
});
