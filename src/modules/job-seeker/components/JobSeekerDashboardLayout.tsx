import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';

type NavItem = {
  to: string;
  label: string;
  end?: boolean;
};

const copy = {
  en: {
    workspace: 'Job seeker workspace',
    online: 'Workspace synced and active',
    search: 'Search candidates, jobs, or analysis',
    nav: [
      { to: '/job-seeker/dashboard', label: 'Overview', end: true },
      { to: '/job-seeker/dashboard/analysis', label: 'Resume Analysis' },
      { to: '/job-seeker/dashboard/resume', label: 'Resume Builder' },
      { to: '/job-seeker/dashboard/recruiter', label: 'Recruiter View' },
      { to: '/job-seeker/dashboard/profile', label: 'Profile' },
    ] as NavItem[],
    notifications: '3 updates',
    panel: 'AI Copilot',
  },
  ar: {
    workspace: 'مساحة الباحث عن عمل',
    online: 'المساحة متصلة ونشطة',
    search: 'ابحث في المرشحين أو الوظائف أو التحليلات',
    nav: [
      { to: '/job-seeker/dashboard', label: 'نظرة عامة', end: true },
      { to: '/job-seeker/dashboard/analysis', label: 'تحليل السيرة' },
      { to: '/job-seeker/dashboard/resume', label: 'بناء السيرة' },
      { to: '/job-seeker/dashboard/recruiter', label: 'لوحة التوظيف' },
      { to: '/job-seeker/dashboard/profile', label: 'الملف الشخصي' },
    ] as NavItem[],
    notifications: '3 تحديثات',
    panel: 'المساعد الذكي',
  },
} as const;

export function JobSeekerDashboardLayout() {
  const { currentUserEmail, profile, uiLocale } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);
  const t = copy[uiLocale];
  const name = profile?.full_name || currentUserEmail || 'SaudiCV User';

  return (
    <div className={collapsed ? 'dashboard-shell sidebar-collapsed' : 'dashboard-shell'}>
      <aside className="dashboard-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-avatar">{name.slice(0, 2).toUpperCase()}</div>
          <div className="sidebar-meta">
            <strong>{name}</strong>
            <small>{t.workspace}</small>
          </div>
          <button className="icon-button" onClick={() => setCollapsed((value) => !value)} type="button">
            {collapsed ? '+' : '-'}
          </button>
        </div>

        <div className="sidebar-status">
          <span className="status-dot" />
          <span>{t.online}</span>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard">
          {t.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-panel">
          <span className="eyebrow">{t.panel}</span>
          <strong>{uiLocale === 'en' ? 'Ready to improve your next submission.' : 'جاهز لتحسين تقديمك القادم.'}</strong>
          <p>
            {uiLocale === 'en'
              ? 'Track ATS fit, rewrite sections, and prep for recruiter outreach from one workspace.'
              : 'تابع ملاءمة ATS وأعد كتابة الأقسام واستعد للتواصل مع جهات التوظيف من مساحة واحدة.'}
          </p>
        </div>
      </aside>

      <section className="dashboard-content">
        <div className="dashboard-toolbar">
          <label className="toolbar-search">
            <input placeholder={t.search} />
          </label>
          <div className="toolbar-actions">
            <button className="pill-button" type="button">
              {t.notifications}
            </button>
            <div className="toolbar-user">
              <span className="toolbar-user-avatar">{name.slice(0, 1).toUpperCase()}</span>
              <div>
                <strong>{profile?.target_role || name}</strong>
                <small>{profile?.city || currentUserEmail}</small>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </section>
    </div>
  );
}
