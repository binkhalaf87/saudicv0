import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export function SiteHeader() {
  const { isAuthenticated, handleSignOut, profile } = useAppContext();
  const firstName = profile?.full_name?.split(' ')[0] ?? '';

  return (
    <>
      <style>{`
        .snav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .snav-links a {
          font-size: 0.92rem;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          transition: color 0.18s;
        }
        .snav-links a:hover { color: #0f172a; }

        .snav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .snav-ghost {
          font-size: 0.9rem;
          font-weight: 500;
          color: #334155;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 0.18s;
        }
        .snav-ghost:hover { background: rgba(15,109,115,0.08); color: #0f6d73; }

        .snav-cta {
          font-size: 0.9rem;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #0f6d73 0%, #1f8fa5 100%);
          text-decoration: none;
          padding: 9px 18px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: opacity 0.18s, transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 4px 14px rgba(15,109,115,0.28);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .snav-cta:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(15,109,115,0.36); }

        .snav-user-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(15,109,115,0.08);
          border-radius: 999px;
          padding: 5px 12px 5px 5px;
        }
        .snav-user-avatar {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #0f6d73, #1f8fa5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 800;
        }
        .snav-user-name {
          font-size: 0.86rem;
          font-weight: 600;
          color: #0f6d73;
        }

        .brand-wordmark {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .brand-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: inherit;
        }

        @media (max-width: 720px) {
          .snav-links { display: none; }
          .snav-ghost { display: none; }
        }
        @media (max-width: 480px) {
          .snav-user-name { display: none; }
        }
      `}</style>

      <div className="topbar-shell">
        <header className="topbar">
          <Link to="/" className="brand-link">
            <span className="brand-mark">SCV</span>
            <span className="brand-wordmark">SaudiCV</span>
          </Link>

          <nav className="snav-links" aria-label="Main navigation">
            <a href="/#features">المزايا</a>
            <a href="/#how-it-works">كيف تعمل</a>
            <a href="/#pricing">الأسعار</a>
          </nav>

          <div className="snav-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/auth" className="snav-ghost">تسجيل الدخول</Link>
                <Link to="/auth" className="snav-cta">ابدأ مجاناً</Link>
              </>
            ) : (
              <>
                {firstName && (
                  <div className="snav-user-chip">
                    <span className="snav-user-avatar">{firstName[0]}</span>
                    <span className="snav-user-name">أهلاً، {firstName}</span>
                  </div>
                )}
                <Link to="/job-seeker/dashboard" className="snav-ghost">لوحة التحكم</Link>
                <button className="snav-cta" onClick={() => void handleSignOut()} type="button">
                  تسجيل الخروج
                </button>
              </>
            )}
          </div>
        </header>
      </div>
    </>
  );
}
