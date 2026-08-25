import { education } from '@data/portfolio';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { formatPeriod } from '@lib/date';
import styles from './EducationList.module.css';

export function EducationList() {
  const { t, i18n } = useTranslation();

  return (
    <section aria-labelledby="education-heading" className={styles.section} id="education">
      <h2 id="education-heading">{t(TRANSLATION_KEYS.common.sections.education)}</h2>
      <ul className={styles.list}>
        {education.map((entry) => (
          <li key={entry.id} className={styles.item}>
            <h3 className={styles.title}>{t(TRANSLATION_KEYS.education[entry.id].title)}</h3>
            <p className={styles.meta}>
              <span>{entry.company.fullName ?? entry.company.name}</span>
              <span aria-hidden="true"> · </span>
              <span>{formatPeriod(entry.period, i18n.language, t(TRANSLATION_KEYS.common.time.present))}</span>
            </p>
            <p>{t(TRANSLATION_KEYS.education[entry.id].shortDescription)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
