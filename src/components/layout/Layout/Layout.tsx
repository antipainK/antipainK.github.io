import { Outlet } from 'react-router';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { Footer } from '../Footer/Footer';
import { Navbar } from '../Navbar/Navbar';
import styles from './Layout.module.css';

export function Layout() {
  const { t } = useTranslation();

  return (
    <div className={styles.layout}>
      <a className={styles.skipLink} href="#main">{t(TRANSLATION_KEYS.common.skipToContent)}</a>
      <Navbar />
      <main className={styles.main} id="main" tabIndex={-1}><Outlet /></main>
      <Footer />
    </div>
  );
}
