import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { hasSupabaseCredentials } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const { loading, isAuthenticated } = useAppContext();

  if (loading) {
    return (
      <div className="cta-strip">
        <div>
          <strong>جارٍ تحميل الجلسة والبيانات</strong>
          <p>يتم الآن فحص الجلسة الحالية وقراءة الملف الشخصي والسير الذاتية والتحليلات.</p>
        </div>
      </div>
    );
  }

  if (!hasSupabaseCredentials || !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
