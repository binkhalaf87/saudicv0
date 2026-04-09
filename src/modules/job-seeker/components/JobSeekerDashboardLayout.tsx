import { NavLink, Outlet } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';

const menu = [
  { to: '/job-seeker/dashboard', label: 'نظرة عامة', end: true },
  { to: '/job-seeker/dashboard/profile', label: 'ملفي الشخصي' },
  { to: '/job-seeker/dashboard/resume', label: 'السيرة الذاتية' },
  { to: '/job-seeker/dashboard/analysis', label: 'التحليلات' },
];

export function JobSeekerDashboardLayout() {
  const { profile, currentUserEmail } = useAppContext();

  return (
    <div className="workspace">
      <aside className="sidebar">
        <div className="sidebar-profile">
          <div className="sidebar-avatar">{(profile?.full_name || currentUserEmail || 'S').slice(0, 1).toUpperCase()}</div>
          <div>
            <p className="sidebar-label">Job Seeker Workspace</p>
            <h3>{profile?.full_name || currentUserEmail}</h3>
            <p>{profile?.target_role || 'أكمل ملفك المهني'}</p>
          </div>
        </div>
        <div className="status-chip">
          <span className="status-dot online" />
          مساحة الباحث عن عمل نشطة
        </div>
        <div className="sidebar-menu">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </aside>

      <section className="dashboard-stage">
        <Outlet />
      </section>
    </div>
  );
}

