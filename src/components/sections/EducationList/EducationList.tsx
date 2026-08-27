import { education } from '@data/portfolio';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { formatPeriod } from '@lib/date';
import { computeLanguageDuration, formatSkillDuration } from '@lib/skills';
import styles from './EducationList.module.css';

interface EducationListProps {
  /** Entry ids to visually highlight, e.g. from hovering a skill in `SkillsSection`. */
  highlightedEntryIds?: ReadonlySet<string>;
}

export function EducationList({ highlightedEntryIds }: EducationListProps) {
  const { t, i18n } = useTranslation();

  return (
    <section aria-labelledby="education-heading" className={styles.section} id="education">
      <h2 id="education-heading">{t(TRANSLATION_KEYS.common.sections.education)}</h2>
      <ul className={styles.list}>
        {education.map((entry) => {
          const isHighlighted = highlightedEntryIds?.has(entry.id) ?? false;
          const languages = [...new Set(entry.languagePeriods.flatMap((languagePeriod) => languagePeriod.languages))]
            .map((name) => ({ name, totalMonths: computeLanguageDuration([entry], name).totalMonths }));

          return (
            <li
              key={entry.id}
              className={[styles.item, isHighlighted && styles.highlighted].filter(Boolean).join(' ')}
            >
              <h3 className={styles.title}>{t(TRANSLATION_KEYS.education[entry.id].title)}</h3>
              <p className={styles.meta}>
                <span>{entry.company.fullName ?? entry.company.name}</span>
                <span aria-hidden="true"> · </span>
                <span>{formatPeriod(entry.period, i18n.language, t(TRANSLATION_KEYS.common.time.present))}</span>
              </p>
              <p>{t(TRANSLATION_KEYS.education[entry.id].shortDescription)}</p>
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
            </li>
          );
        })}
      </ul>
    </section>
  );
}
