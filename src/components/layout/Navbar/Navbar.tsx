import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Navbar.module.css';

export function Navbar() {
  const { t } = useTranslation();

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#hero">Wojciech Kosztyła</a>
        <nav aria-label="Primary" className={styles.nav}>
          <a href="#experience">{t(TRANSLATION_KEYS.common.nav.experience)}</a>
          <a href="#education">{t(TRANSLATION_KEYS.common.nav.education)}</a>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
