import { useId } from 'react';
import { useSearchParams } from 'react-router';
import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@i18n/config';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import styles from './LanguageSwitcher.module.css';

/**
 * A native <select>, deliberately: it scales to any number of locales without
 * becoming a layout decision, and gets keyboard and screen-reader behaviour
 * for free. Options are labelled with endonyms — "Polski", not "Polish" — and
 * carry no flags, since a flag denotes a country and English has none.
 */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectId = useId();
  const current = (i18n.resolvedLanguage ?? 'en') as Locale;

  const onChange = (locale: Locale) => {
    void i18n.changeLanguage(locale);
    /*
     * i18next's detector only reads ?lang= at init, so the URL is updated here
     * as well — that keeps the address bar shareable, which is the whole point
     * of the param. `replace` avoids stacking a history entry per switch.
     */
    const next = new URLSearchParams(searchParams);
    next.set('lang', locale);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className={styles.switcher}>
      <label className={styles.label} htmlFor={selectId}>
        {t(TRANSLATION_KEYS.common.language.label)}
      </label>
      <select
        id={selectId}
        className={styles.select}
        value={current}
        onChange={(event) => onChange(event.target.value as Locale)}
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale} value={locale}>{LOCALE_LABELS[locale]}</option>
        ))}
      </select>
    </div>
  );
}
