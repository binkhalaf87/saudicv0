import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SiteHeader } from './components/SiteHeader';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { AnalysisPage } from './pages/dashboard/AnalysisPage';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { ResumePage } from './pages/dashboard/ResumePage';

function AppRoutes() {
  const { message, clearMessage } = useAppContext();

  return (
    <div className="app-shell">
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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="analysis" element={<AnalysisPage />} />
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
