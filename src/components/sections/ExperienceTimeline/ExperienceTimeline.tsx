import { experience, type Company } from '@data/portfolio';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { formatPeriod } from '@lib/date';
import { computeDurationMonths } from '@lib/duration';
import { computeLanguageDuration, formatSkillDuration } from '@lib/skills';
import styles from './ExperienceTimeline.module.css';

interface ExperienceTimelineProps {
  /** Entry ids to visually mark, e.g. from hovering a skill in `SkillsSection`. */
  highlightedEntryIds?: ReadonlySet<string>;
  /** True while a skill is pinned — non-matching entries recede so matches read as matches. */
  isFiltered?: boolean;
}

export function ExperienceTimeline({ highlightedEntryIds, isFiltered = false }: ExperienceTimelineProps) {
  const { t, tList, i18n } = useTranslation();

  return (
    <section aria-labelledby="experience-heading" className={styles.section} id="experience">
      <div className={styles.sectionHead}>
        <h2 id="experience-heading">{t(TRANSLATION_KEYS.common.sections.experience)}</h2>
      </div>

      <ol className={styles.records}>
        {experience.map((entry) => {
          const isHighlighted = highlightedEntryIds?.has(entry.id) ?? false;
          const company: Company = entry.company;
          const copy = TRANSLATION_KEYS.experience[entry.id];
          const totalMonths = computeDurationMonths([entry.period]);
          const technologies = [
            ...new Set(entry.technologyPeriods.flatMap((technologyPeriod) => technologyPeriod.technologies)),
          ];
          const languages = [...new Set(entry.languagePeriods.flatMap((languagePeriod) => languagePeriod.languages))]
            .map((name) => ({ name, totalMonths: computeLanguageDuration([entry], name).totalMonths }));
          // Entries land incomplete — an empty list must render nothing at all,
          // not an empty <ul> contributing its margin to the layout.
          const highlights = tList(copy.highlights);

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
                {/* The role is named once, here. The meta line below carries context, not a repeat. */}
                <h3 className={styles.title}>
                  {t(copy.title)}
                  {', '}
                  {company.website
                    ? <a className={styles.org} href={company.website} rel="noreferrer" target="_blank">{company.name}</a>
                    : <span className={styles.org}>{company.name}</span>}
                </h3>
                <span className={styles.when}>
                  {formatPeriod(entry.period, i18n.language, t(TRANSLATION_KEYS.common.time.present))}
                  {totalMonths !== null && `, ${formatSkillDuration(totalMonths, t)}`}
                </span>
              </div>

              <p className={styles.meta}>{t(copy.meta)}</p>

              {highlights.length > 0 && (
                <ul className={styles.points}>
                  {highlights.map((point) => <li key={point}>{point}</li>)}
                </ul>
              )}

              {languages.length > 0 && (
                <ul className={styles.tags}>
                  {languages.map(({ name, totalMonths: months }) => (
                    <li key={name} className={styles.tag}>
                      {name}
                      {months !== null && `, ${formatSkillDuration(months, t)}`}
                    </li>
                  ))}
                </ul>
              )}
              {technologies.length > 0 && (
                <ul className={styles.tags}>
                  {technologies.map((tech) => <li key={tech} className={styles.tag}>{tech}</li>)}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
