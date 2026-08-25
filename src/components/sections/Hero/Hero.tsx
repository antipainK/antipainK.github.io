import { profile } from '@data/portfolio';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import styles from './Hero.module.css';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className={styles.hero} id="hero">
      <p className={styles.greeting}>{t(TRANSLATION_KEYS.home.hero.greeting)}</p>
      <h1 className={styles.name}>{t(TRANSLATION_KEYS.home.hero.name, { name: profile.name })}</h1>
      <p className={styles.role}>{t(TRANSLATION_KEYS.home.hero.role)}</p>
      <p className={styles.tagline}>{t(TRANSLATION_KEYS.home.hero.tagline)}</p>
    </section>
  );
}
