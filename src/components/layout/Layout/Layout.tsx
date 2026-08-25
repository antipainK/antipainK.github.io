import type { ReactNode } from 'react';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { Footer } from '../Footer/Footer';
import { Navbar } from '../Navbar/Navbar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.layout}>
      <a className={styles.skipLink} href="#main">{t(TRANSLATION_KEYS.common.skipToContent)}</a>
      <Navbar />
      <main className={styles.main} id="main" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
}
