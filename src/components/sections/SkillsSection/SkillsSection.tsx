import { useEffect, useState } from 'react';
import { education, experience, skillsCatalog, type Skill, type SkillCategory } from '@data/portfolio';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { computeLanguageDuration, findEntryIdsUsingTechnology, formatSkillDuration } from '@lib/skills';
import styles from './SkillsSection.module.css';

const CATEGORY_ORDER: readonly SkillCategory[] = ['language', 'webDevelopment', 'database', 'cloudDevops', 'aiAssisted'];
const timelineEntries = [...experience, ...education];

interface SkillsSectionProps {
  /** Called whenever the hovered-or-pinned skill changes, with the ids of the entries that back it. */
  onHighlightChange: (entryIds: ReadonlySet<string>) => void;
}

function entryIdsForSkill(skillName: string): readonly string[] {
  const catalogEntry: Skill | undefined = skillsCatalog.find((skill) => skill.name === skillName);
  if (catalogEntry?.category === 'language') {
    return computeLanguageDuration(timelineEntries, skillName, catalogEntry.additionalPeriods).entryIds;
  }
  return findEntryIdsUsingTechnology(timelineEntries, skillName);
}

export function SkillsSection({ onHighlightChange }: SkillsSectionProps) {
  const { t } = useTranslation();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [pinnedSkill, setPinnedSkill] = useState<string | null>(null);
  const activeSkill = hoveredSkill ?? pinnedSkill;

  useEffect(() => {
    onHighlightChange(new Set(activeSkill ? entryIdsForSkill(activeSkill) : []));
  }, [activeSkill, onHighlightChange]);

  return (
    <section aria-labelledby="skills-heading" className={styles.section} id="skills">
      <h2 id="skills-heading">{t(TRANSLATION_KEYS.common.sections.skills)}</h2>
      {CATEGORY_ORDER.map((category) => {
        const items: readonly Skill[] = skillsCatalog.filter((skill) => skill.category === category);
        if (items.length === 0) {
          return null;
        }

        return (
          <div key={category} className={styles.group}>
            <h3 className={styles.groupTitle}>{t(TRANSLATION_KEYS.skills.categories[category])}</h3>
            <ul className={styles.tags}>
              {items.map((skill) => {
                const duration = category === 'language'
                  ? computeLanguageDuration(timelineEntries, skill.name, skill.additionalPeriods)
                  : null;

                return (
                  <li key={skill.name}>
                    <button
                      type="button"
                      className={styles.tag}
                      aria-pressed={pinnedSkill === skill.name}
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onFocus={() => setHoveredSkill(skill.name)}
                      onBlur={() => setHoveredSkill(null)}
                      onClick={() => setPinnedSkill((prev) => (prev === skill.name ? null : skill.name))}
                    >
                      <span>{skill.name}</span>
                      {duration && duration.totalMonths !== null && (
                        <>
                          {' '}
                          <span className={styles.duration}>{formatSkillDuration(duration.totalMonths, t)}</span>
                        </>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
