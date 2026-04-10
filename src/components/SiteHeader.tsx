import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const copy = {
  en: {
    nav: [
      { href: '/#features', label: 'Features' },
      { href: '/#platform', label: 'Platform' },
      { href: '/#system', label: 'Design System' },
    ],
    signIn: 'Sign in',
    start: 'Start free',
    dashboard: 'Dashboard',
    recruiter: 'Recruiter',
    signOut: 'Sign out',
    role: 'Career Intelligence Platform',
    language: { en: 'EN', ar: 'AR' },
  },
  ar: {
    nav: [
      { href: '/#features', label: 'المزايا' },
      { href: '/#platform', label: 'المنصة' },
      { href: '/#system', label: 'النظام التصميمي' },
    ],
    signIn: 'تسجيل الدخول',
    start: 'ابدأ مجانا',
    dashboard: 'لوحة التحكم',
    recruiter: 'لوحة التوظيف',
    signOut: 'تسجيل الخروج',
    role: 'منصة ذكاء مهني',
    language: { en: 'EN', ar: 'AR' },
  },
} as const;

export function SiteHeader() {
  const { handleSignOut, isAuthenticated, profile, setUiLocale, uiLocale } = useAppContext();
  const t = copy[uiLocale];
  const firstName = profile?.full_name?.split(' ')[0] ?? 'User';

  return (
    <div className="site-header-shell">
      <header className="site-header">
        <Link to="/" className="brand-lockup">
          <span className="brand-mark">SCV</span>
          <span>
            <strong>SaudiCV</strong>
            <small>{t.role}</small>
          </span>
        </Link>

        <nav className="header-nav" aria-label="Primary">
          {t.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          {isAuthenticated ? <NavLink to="/job-seeker/dashboard">{t.dashboard}</NavLink> : null}
          {isAuthenticated ? <NavLink to="/job-seeker/dashboard/recruiter">{t.recruiter}</NavLink> : null}
        </nav>

        <div className="header-actions">
          <div className="locale-switch" role="group" aria-label="Language switch">
            <button
              className={uiLocale === 'en' ? 'locale-option active' : 'locale-option'}
              onClick={() => setUiLocale('en')}
              type="button"
            >
              {t.language.en}
            </button>
            <button
              className={uiLocale === 'ar' ? 'locale-option active' : 'locale-option'}
              onClick={() => setUiLocale('ar')}
              type="button"
            >
              {t.language.ar}
            </button>
          </div>

          {!isAuthenticated ? (
            <>
              <Link className="button button-ghost button-sm" to="/auth">
                {t.signIn}
              </Link>
              <Link className="button button-primary button-sm" to="/auth">
                {t.start}
              </Link>
            </>
          ) : (
            <>
              <div className="header-user">
                <span className="header-user-avatar">{firstName[0]?.toUpperCase() ?? 'S'}</span>
                <span>{firstName}</span>
              </div>
              <button className="button button-primary button-sm" onClick={() => void handleSignOut()} type="button">
                {t.signOut}
              </button>
            </>
          )}
        </div>
      </header>
    </div>
  );
}
