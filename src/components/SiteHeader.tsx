import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export function SiteHeader() {
  const { isAuthenticated, handleSignOut } = useAppContext();

  return (
    <div className="topbar-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">SCV</span>
          <div>
            <strong>SaudiCV</strong>
            <p>منصة ذكية لتحليل السيرة الذاتية للباحثين عن عمل</p>
          </div>
        </div>
        <nav className="topbar-links">
          <NavLink to="/">الرئيسية</NavLink>
          <NavLink to="/auth">الدخول</NavLink>
          <NavLink to="/job-seeker/dashboard">لوحة التحكم</NavLink>
          {!isAuthenticated ? (
            <Link className="ghost-button" to="/auth">
              ابدأ الآن
            </Link>
          ) : (
            <button className="ghost-button" onClick={() => void handleSignOut()} type="button">
              تسجيل الخروج
            </button>
          )}
        </nav>
      </header>
    </div>
  );
}
