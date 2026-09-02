import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { SkillsSection, type SkillSelection } from '@components/sections/SkillsSection/SkillsSection';
import { countMatchingRoles, TOTAL_ROLES } from '@lib/skillFilter';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { Rail } from '../Rail/Rail';
import styles from './Layout.module.css';

const NO_SELECTION: SkillSelection = { entryIds: new Set(), filterSkill: null };

/** What routed pages read via `useOutletContext`. */
export interface LayoutOutletContext {
  selection: SkillSelection;
}

/**
 * The skill filter lives here rather than in `HomePage` because its three
 * parties end up in different subtrees: the chips render in the rail, the
 * status and Clear button in the sticky header, and the dimming in the routed
 * page. `Outlet` context carries it down to the page.
 */
export function Layout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const [selection, setSelection] = useState<SkillSelection>(NO_SELECTION);
  const [pinnedSkill, setPinnedSkill] = useState<string | null>(null);

  // Filtering only means anything against the homepage's entry list. Leaving
  // it would strand a filter chip in the header over a page it cannot affect.
  useEffect(() => {
    if (!isHome) {
      setPinnedSkill(null);
      setSelection(NO_SELECTION);
    }
  }, [isHome]);

  const clearFilter = useCallback(() => setPinnedSkill(null), []);

  return (
    <div className={styles.layout}>
      <a className={styles.skipLink} href="#main">{t(TRANSLATION_KEYS.common.skipToContent)}</a>
      <Header
        filterSkill={selection.filterSkill}
        matchingRoles={countMatchingRoles(selection.filterSkill)}
        totalRoles={TOTAL_ROLES}
        onClearFilter={clearFilter}
      />
      <div className={styles.shell}>
        <Rail />
        {isHome && (
          <div className={styles.skills}>
            <SkillsSection
              onSelectionChange={setSelection}
              pinnedSkill={pinnedSkill}
              onPinnedSkillChange={setPinnedSkill}
            />
          </div>
        )}
        <main className={styles.main} id="main" tabIndex={-1}>
          <Outlet context={{ selection } satisfies LayoutOutletContext} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
