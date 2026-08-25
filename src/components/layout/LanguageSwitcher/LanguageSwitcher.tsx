import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@i18n/config';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const current = (i18n.resolvedLanguage ?? 'en') as Locale;

  return (
    <label className={styles.switcher}>
      <span className={styles.label}>{t(TRANSLATION_KEYS.common.language.label)}</span>
      <select
        value={current}
        onChange={(event) => {
          void i18n.changeLanguage(event.target.value);
        }}
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale} value={locale}>{LOCALE_LABELS[locale]}</option>
        ))}
      </select>
    </label>
  );
}
