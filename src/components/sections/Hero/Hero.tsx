import { education, experience, headlineFigures, MAIN_LANGUAGES } from '@data/portfolio';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { computeLanguageDuration } from '@lib/skills';
import styles from './Hero.module.css';

const FIGURE_KEYS = TRANSLATION_KEYS.home.hero.figures;
const timelineEntries = [...experience, ...education];

/** Whole years on the main languages, floored — "2+" is a claim the data backs. */
function mainLanguageYears(): number {
  const { totalMonths } = computeLanguageDuration(timelineEntries, MAIN_LANGUAGES);
  return Math.floor((totalMonths ?? 0) / 12);
}

export function Hero() {
  const { t } = useTranslation();

  const years = mainLanguageYears();

  const figures = [
    // `count` drives plural selection: "rok" / "lata" / "lat" in Polish.
    { id: 'languages', value: `${years}+`, label: t(FIGURE_KEYS.languages, { count: years }) },
    { id: 'repos', value: `~${headlineFigures.automatedUpdateRepos}`, label: t(FIGURE_KEYS.repos) },
    { id: 'engineers', value: `${headlineFigures.ciTemplateEngineers}`, label: t(FIGURE_KEYS.engineers) },
  ];

  return (
    <section className={styles.hero} id="hero">
      <h2 className={styles.statement}>{t(TRANSLATION_KEYS.home.hero.statement)}</h2>
      <p className={styles.bio}>{t(TRANSLATION_KEYS.home.hero.bio)}</p>

      <dl className={styles.figures}>
        {figures.map((figure) => (
          <div key={figure.id} className={styles.figure}>
            <dt className={styles.value}>{figure.value}</dt>
            <dd className={styles.label}>{figure.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
