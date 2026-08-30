import { experience, type Company } from '@data/portfolio';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { formatPeriod } from '@lib/date';
import { computeLanguageDuration, formatSkillDuration } from '@lib/skills';
import styles from './ExperienceTimeline.module.css';

interface ExperienceTimelineProps {
  /** Entry ids to visually highlight, e.g. from hovering a skill in `SkillsSection`. */
  highlightedEntryIds?: ReadonlySet<string>;
}

export function ExperienceTimeline({ highlightedEntryIds }: ExperienceTimelineProps) {
  const { t, i18n } = useTranslation();

  return (
    <section aria-labelledby="experience-heading" className={styles.section} id="experience">
      <h2 id="experience-heading">{t(TRANSLATION_KEYS.common.sections.experience)}</h2>
      <ol className={styles.timeline}>
        {experience.map((entry) => {
          const isHighlighted = highlightedEntryIds?.has(entry.id) ?? false;
          const company: Company = entry.company;
          const technologies = [
            ...new Set(entry.technologyPeriods.flatMap((technologyPeriod) => technologyPeriod.technologies)),
          ];
          const languages = [...new Set(entry.languagePeriods.flatMap((languagePeriod) => languagePeriod.languages))]
            .map((name) => ({ name, totalMonths: computeLanguageDuration([entry], name).totalMonths }));

          return (
            <li
              key={entry.id}
              className={[styles.item, isHighlighted && styles.highlighted].filter(Boolean).join(' ')}
            >
              <div className={styles.head}>
                <h3 className={styles.title}>{t(TRANSLATION_KEYS.experience[entry.id].title)}</h3>
                {company.website
                  ? (
                      <a
                        className={styles.company}
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {company.name}
                      </a>
                    )
                  : <span className={styles.company}>{company.name}</span>}
              </div>
              <p className={styles.meta}>
                <span>{t(TRANSLATION_KEYS.experience[entry.id].jobTitle)}</span>
                <span aria-hidden="true"> · </span>
                <span>{formatPeriod(entry.period, i18n.language, t(TRANSLATION_KEYS.common.time.present))}</span>
              </p>
              <p>{t(TRANSLATION_KEYS.experience[entry.id].shortDescription)}</p>
              {languages.length > 0 && (
                <ul className={styles.tags}>
                  {languages.map(({ name, totalMonths }) => (
                    <li key={name} className={styles.tag}>
                      {name}
                      {totalMonths !== null && ` ${formatSkillDuration(totalMonths, t)}`}
                    </li>
                  ))}
                </ul>
              )}
              {technologies.length > 0 && (
                <ul className={styles.tags}>
                  {technologies.map((tech) => (
                    <li key={tech} className={styles.tag}>{tech}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
