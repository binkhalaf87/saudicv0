import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SiteHeader } from './components/SiteHeader';
import { AppProvider, useAppContext } from './context/AppContext';
import { JobSeekerDashboardLayout } from './modules/job-seeker/components/JobSeekerDashboardLayout';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { JobSeekerAnalysisPage } from './pages/job-seeker/dashboard/AnalysisPage';
import { JobSeekerBuilderPage } from './pages/job-seeker/dashboard/BuilderPage';
import { JobSeekerOverviewPage } from './pages/job-seeker/dashboard/OverviewPage';
import { JobSeekerProfilePage } from './pages/job-seeker/dashboard/ProfilePage';
import { RecruiterDashboardPage } from './pages/job-seeker/dashboard/RecruiterDashboardPage';

function AppRoutes() {
  const { clearMessage, message, uiLocale } = useAppContext();

  useEffect(() => {
    document.documentElement.lang = uiLocale;
    document.documentElement.dir = uiLocale === 'ar' ? 'rtl' : 'ltr';
  }, [uiLocale]);

  return (
    <div className={`app-shell locale-${uiLocale}`}>
      <SiteHeader />
      <main>
        {message ? (
          <button className="notice-card dismissible-notice" onClick={clearMessage} type="button">
            {message}
          </button>
        ) : null}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Navigate to="/job-seeker/dashboard" replace />} />
          <Route path="/dashboard/profile" element={<Navigate to="/job-seeker/dashboard/profile" replace />} />
          <Route path="/dashboard/resume" element={<Navigate to="/job-seeker/dashboard/resume" replace />} />
          <Route path="/dashboard/analysis" element={<Navigate to="/job-seeker/dashboard/analysis" replace />} />
          <Route path="/dashboard/recruiter" element={<Navigate to="/job-seeker/dashboard/recruiter" replace />} />
          <Route
            path="/job-seeker/dashboard"
            element={
              <ProtectedRoute>
                <JobSeekerDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<JobSeekerOverviewPage />} />
            <Route path="profile" element={<JobSeekerProfilePage />} />
            <Route path="resume" element={<JobSeekerBuilderPage />} />
            <Route path="analysis" element={<JobSeekerAnalysisPage />} />
            <Route path="recruiter" element={<RecruiterDashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
