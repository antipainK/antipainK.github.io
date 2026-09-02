import { useEffect, useState } from 'react';
import { skillsCatalog, type Skill, type SkillCategory } from '@data/portfolio';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { entryIdsForSkill, orderLanguages } from '@lib/skillFilter';
import { formatSkillDuration } from '@lib/skills';
import styles from './SkillsSection.module.css';

/** A category missing from this list renders nowhere — add new ones here. */
const CATEGORY_ORDER: readonly SkillCategory[] = ['language', 'webDevelopment', 'database', 'infrastructure', 'aiAssisted'];

/*
 * Ordered once, not per render. Re-deriving this on each render re-sampled the
 * clock and let tied languages swap places on every click; see `orderLanguages`.
 * Bars scale against the longest-running language rather than a fixed ceiling,
 * so the chart stays honest as the data grows.
 */
const { measured: MEASURED_LANGUAGES, unmeasured: UNMEASURED_LANGUAGES } = orderLanguages();
const LONGEST_MONTHS = Math.max(...MEASURED_LANGUAGES.map((row) => row.totalMonths ?? 0), 1);

export interface SkillSelection {
  /** Entries backing the hovered-or-pinned skill — drives the transient match marker. */
  entryIds: ReadonlySet<string>;
  /**
   * The pinned skill, if any. Only a pinned skill filters: dimming the page on
   * hover would flicker as the pointer crosses the chips.
   */
  filterSkill: string | null;
}

interface SkillsSectionProps {
  onSelectionChange: (selection: SkillSelection) => void;
  /** Lets the header's Clear button unpin from outside this component. */
  pinnedSkill?: string | null;
  onPinnedSkillChange?: (skill: string | null) => void;
}

export function SkillsSection({
  onSelectionChange,
  pinnedSkill: controlledPin,
  onPinnedSkillChange,
}: SkillsSectionProps) {
  const { t } = useTranslation();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [ownPin, setOwnPin] = useState<string | null>(null);

  // Controlled when a parent supplies the pin (so the header can clear it),
  // uncontrolled otherwise, which keeps the component usable on its own.
  const pinnedSkill = controlledPin !== undefined ? controlledPin : ownPin;
  const setPinnedSkill = (next: string | null) => {
    setOwnPin(next);
    onPinnedSkillChange?.(next);
  };

  const activeSkill = hoveredSkill ?? pinnedSkill;

  useEffect(() => {
    onSelectionChange({
      entryIds: new Set(activeSkill ? entryIdsForSkill(activeSkill) : []),
      filterSkill: pinnedSkill,
    });
  }, [activeSkill, pinnedSkill, onSelectionChange]);

  /** Every control here behaves the same: hover/focus previews, click pins. */
  const interactionProps = (name: string) => ({
    'aria-pressed': pinnedSkill === name,
    'onMouseEnter': () => setHoveredSkill(name),
    'onMouseLeave': () => setHoveredSkill(null),
    'onFocus': () => setHoveredSkill(name),
    'onBlur': () => setHoveredSkill(null),
    'onClick': () => setPinnedSkill(pinnedSkill === name ? null : name),
  });

  return (
    <section aria-labelledby="skills-heading" className={styles.section} id="skills">
      <div className={styles.sectionHead}>
        <h2 id="skills-heading">{t(TRANSLATION_KEYS.common.sections.skills)}</h2>
        <span className={styles.aside}>{t(TRANSLATION_KEYS.skills.aside)}</span>
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>{t(TRANSLATION_KEYS.skills.categories.language)}</h3>
        {MEASURED_LANGUAGES.map((language) => {
          const figure = formatSkillDuration(language.totalMonths ?? 0, t);

          return (
            <button
              key={language.name}
              type="button"
              className={styles.measure}
              /*
               * Spelled out rather than left to name computation: the visible
               * text sits in sibling spans with a decorative bar between them,
               * which would otherwise run together as "Java2 yr 5 mo".
               */
              aria-label={`${language.name} ${figure}`}
              {...interactionProps(language.name)}
            >
              <span className={styles.measureName}>{language.name}</span>
              <span aria-hidden="true" className={styles.track}>
                <span
                  className={styles.fill}
                  style={{ width: `${Math.round(((language.totalMonths ?? 0) / LONGEST_MONTHS) * 100)}%` }}
                />
              </span>
              <span className={styles.figure}>{figure}</span>
            </button>
          );
        })}

        {/* Languages with no dated entry to measure. Labelled, or they read as bars that failed. */}
        {UNMEASURED_LANGUAGES.length > 0 && (
          <div className={styles.alsoRow}>
            <span className={styles.alsoLabel}>{t(TRANSLATION_KEYS.skills.also)}</span>
            <ul className={styles.chips}>
              {UNMEASURED_LANGUAGES.map((language) => (
                <li key={language.name}>
                  <button className={styles.chip} type="button" {...interactionProps(language.name)}>
                    {language.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {CATEGORY_ORDER.filter((category) => category !== 'language').map((category) => {
        const items: readonly Skill[] = skillsCatalog.filter((skill) => skill.category === category);
        if (items.length === 0) {
          return null;
        }

        return (
          <div key={category} className={styles.group}>
            <h3 className={styles.groupTitle}>{t(TRANSLATION_KEYS.skills.categories[category])}</h3>
            <ul className={styles.chips}>
              {items.map((skill) => (
                <li key={skill.name}>
                  <button className={styles.chip} type="button" {...interactionProps(skill.name)}>
                    {skill.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
