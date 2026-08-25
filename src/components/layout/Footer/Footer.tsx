import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import styles from './Footer.module.css';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>{t(TRANSLATION_KEYS.common.footer.rights, { year })}</p>
      <p>{t(TRANSLATION_KEYS.common.footer.builtWith)}</p>
    </footer>
  );
}
