import { Link, useLocation } from 'react-router';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.css';

interface HeaderProps {
  /** The pinned skill, if any. Shown here because the rail can scroll out of view. */
  filterSkill?: string | null;
  matchingRoles?: number;
  totalRoles?: number;
  onClearFilter?: () => void;
}

/**
 * Slim, sticky chrome bar. Site controls live here rather than in the rail so
 * they stay reachable from the bottom of a long page, and so they can be
 * hidden wholesale from print — language switching is chrome, not CV content.
 */
export function Header({ filterSkill = null, matchingRoles = 0, totalRoles = 0, onClearFilter }: HeaderProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  /*
   * A plain <div>, not <header>: the rail is already the page banner (it holds
   * identity and the <h1>), and a second <header> here would announce a
   * duplicate banner landmark.
   */
  return (
    <div className={styles.headerBar}>
      <div className={styles.header}>
        {/*
          * Always rendered so assistive tech observes the region from first
          * paint — a live region inserted at the moment it gains text is
          * frequently missed. It is also the standing reason the page is
          * dimmed: a reader must never see dimmed entries with no explanation,
          * and the filter chips themselves scroll away with the rail.
          */}
        <p role="status" className={styles.filterStatus}>
          {filterSkill && (
            <>
              <span className={styles.filterText}>
                {t(TRANSLATION_KEYS.skills.filterStatus, {
                  count: totalRoles,
                  skill: filterSkill,
                  matches: matchingRoles,
                  total: totalRoles,
                })}
              </span>
              <button className={styles.clear} type="button" onClick={onClearFilter}>
                {t(TRANSLATION_KEYS.skills.clearFilter)}
              </button>
            </>
          )}
        </p>

        <div className={styles.controls}>
          <nav className={styles.nav} aria-label={t(TRANSLATION_KEYS.common.nav.site)}>
            <Link
              className={styles.link}
              aria-current={pathname === '/cv' ? 'page' : undefined}
              to="/cv"
            >
              {t(TRANSLATION_KEYS.common.nav.cv)}
            </Link>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
