import { education } from '@data/portfolio';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { formatPeriod } from '@lib/date';
import { computeLanguageDuration, formatSkillDuration } from '@lib/skills';
import styles from './EducationList.module.css';

interface EducationListProps {
  /** Entry ids to visually mark, e.g. from hovering a skill in `SkillsSection`. */
  highlightedEntryIds?: ReadonlySet<string>;
  /** True while a skill is pinned — non-matching entries recede so matches read as matches. */
  isFiltered?: boolean;
}

export function EducationList({ highlightedEntryIds, isFiltered = false }: EducationListProps) {
  const { t, i18n } = useTranslation();

  return (
    <section aria-labelledby="education-heading" className={styles.section} id="education">
      <div className={styles.sectionHead}>
        <h2 id="education-heading">{t(TRANSLATION_KEYS.common.sections.education)}</h2>
      </div>

      <ul className={styles.records}>
        {education.map((entry) => {
          const isHighlighted = highlightedEntryIds?.has(entry.id) ?? false;
          const copy = TRANSLATION_KEYS.education[entry.id];
          const languages = [...new Set(entry.languagePeriods.flatMap((languagePeriod) => languagePeriod.languages))]
            .map((name) => ({ name, totalMonths: computeLanguageDuration([entry], name).totalMonths }));

          return (
            <li
              key={entry.id}
              className={[
                styles.entry,
                isHighlighted && styles.highlighted,
                isFiltered && !isHighlighted && styles.dimmed,
              ].filter(Boolean).join(' ')}
            >
              <div className={styles.entryHead}>
                <h3 className={styles.title}>{t(copy.title)}</h3>
                <span className={styles.when}>
                  {formatPeriod(entry.period, i18n.language, t(TRANSLATION_KEYS.common.time.present))}
                </span>
              </div>

              <p className={styles.meta}>{t(copy.meta)}</p>
              <p className={styles.note}>{t(copy.note)}</p>

              {languages.length > 0 && (
                <ul className={styles.tags}>
                  {languages.map(({ name, totalMonths }) => (
                    <li key={name} className={styles.tag}>
                      {name}
                      {totalMonths !== null && `, ${formatSkillDuration(totalMonths, t)}`}
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
