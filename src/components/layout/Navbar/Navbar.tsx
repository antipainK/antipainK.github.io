import { profile } from '@data/portfolio';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Navbar.module.css';

export function Navbar() {
  const { t } = useTranslation();

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#hero">{profile.name}</a>
        <nav aria-label={t(TRANSLATION_KEYS.common.nav.primary)} className={styles.nav}>
          <a href="#experience">{t(TRANSLATION_KEYS.common.nav.experience)}</a>
          <a href="#skills">{t(TRANSLATION_KEYS.common.nav.skills)}</a>
          <a href="#education">{t(TRANSLATION_KEYS.common.nav.education)}</a>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
