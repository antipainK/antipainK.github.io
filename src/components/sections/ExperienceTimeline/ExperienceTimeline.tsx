import { experience } from '@data/portfolio';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { formatPeriod } from '@lib/date';
import styles from './ExperienceTimeline.module.css';

export function ExperienceTimeline() {
  const { t, i18n } = useTranslation();

  return (
    <section aria-labelledby="experience-heading" className={styles.section} id="experience">
      <h2 id="experience-heading">{t(TRANSLATION_KEYS.common.sections.experience)}</h2>
      <ol className={styles.timeline}>
        {experience.map((entry) => (
          <li key={entry.id} className={styles.item}>
            <div className={styles.head}>
              <h3 className={styles.title}>{t(TRANSLATION_KEYS.experience[entry.id].title)}</h3>
              {entry.company.website
                ? (
                    <a
                      className={styles.company}
                      href={entry.company.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {entry.company.name}
                    </a>
                  )
                : <span className={styles.company}>{entry.company.name}</span>}
            </div>
            <p className={styles.meta}>
              <span>{t(TRANSLATION_KEYS.experience[entry.id].jobTitle)}</span>
              <span aria-hidden="true"> · </span>
              <span>{formatPeriod(entry.period, i18n.language, t(TRANSLATION_KEYS.common.time.present))}</span>
            </p>
            <p>{t(TRANSLATION_KEYS.experience[entry.id].shortDescription)}</p>
            {entry.technologies.length > 0 && (
              <ul className={styles.tags}>
                {entry.technologies.map((tech) => (
                  <li key={tech} className={styles.tag}>{tech}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
