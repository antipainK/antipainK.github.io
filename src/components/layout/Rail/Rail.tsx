import { Link, useLocation } from 'react-router';
import { profile, type ContactId } from '@data/portfolio';
import { TRANSLATION_KEYS } from '@i18n/keys';
import { useTranslation } from '@i18n/useTranslation';
import { GitHubIcon, LinkedInIcon, LocationIcon, MailIcon } from './icons';
import styles from './Rail.module.css';

const CONTACT_LABEL_KEYS = TRANSLATION_KEYS.common.contact;

const CONTACT_ICONS: Record<ContactId, (props: { className?: string }) => React.ReactElement> = {
  email: MailIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
};

export function Rail() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  /*
   * The name is the page's level-1 heading only on the homepage. Every other
   * route has a real <h1> of its own, and shadowing it here would leave /cv
   * announcing "Wojciech Kosztyła" as its title.
   */
  const NameTag = isHome ? 'h1' : 'p';

  /*
   * <header>, not <aside>: this carries site identity, the primary navigation
   * and (on the homepage) the page's only <h1>. `complementary` is defined as
   * content meaningful when separated from the main content, which this is
   * not. Its ancestors are a plain div and body, so this is the page banner.
   */
  return (
    <header className={styles.rail}>
      <NameTag className={styles.name}>
        {isHome ? profile.name : <Link className={styles.nameLink} to="/">{profile.name}</Link>}
      </NameTag>
      <p className={styles.role}>{t(TRANSLATION_KEYS.home.hero.role)}</p>
      <p className={styles.location}>
        <LocationIcon className={styles.icon} />
        {t(TRANSLATION_KEYS.common.rail.location)}
      </p>

      <img
        className={styles.portrait}
        src={profile.portrait}
        alt={t(TRANSLATION_KEYS.common.rail.portraitAlt, { name: profile.name })}
        width={96}
        height={96}
      />

      <ul className={styles.contacts} aria-label={t(CONTACT_LABEL_KEYS.heading)}>
        {profile.contacts.map((contact) => {
          const Icon = CONTACT_ICONS[contact.id];
          return (
            <li key={contact.id}>
              <a className={styles.contactLink} href={contact.href}>
                <Icon className={styles.icon} />
                {contact.label}
              </a>
            </li>
          );
        })}
      </ul>

    </header>
  );
}
