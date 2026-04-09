import { Navigate } from 'react-router-dom';
import { hasSupabaseCredentials } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export function AuthPage() {
  const {
    authForm,
    authLoading,
    authMode,
    isAuthenticated,
    loading,
    message,
    setAuthForm,
    setAuthMode,
    handleAuthSubmit,
  } = useAppContext();

  if (!hasSupabaseCredentials) {
    return (
      <div className="cta-strip">
        <div>
          <strong>مفاتيح Supabase غير مضافة بعد</strong>
          <p>أضف `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` داخل `.env.local` لتفعيل المصادقة.</p>
        </div>
      </div>
    );
  }

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-layout auth-page">
      <div className="auth-card">
        {message ? <div className="notice-card compact-notice">{message}</div> : null}
        <div className="auth-tabs">
          <button
            className={authMode === 'signup' ? 'menu-item active' : 'menu-item'}
            onClick={() => setAuthMode('signup')}
            type="button"
          >
            إنشاء حساب
          </button>
          <button
            className={authMode === 'signin' ? 'menu-item active' : 'menu-item'}
            onClick={() => setAuthMode('signin')}
            type="button"
          >
            تسجيل الدخول
          </button>
        </div>
        <form className="auth-form" onSubmit={(event) => void handleAuthSubmit(event)}>
          {authMode === 'signup' ? (
            <label>
              <span>الاسم الكامل</span>
              <input
                required
                value={authForm.full_name}
                onChange={(event) => setAuthForm((current) => ({ ...current, full_name: event.target.value }))}
              />
            </label>
          ) : null}
          <label>
            <span>البريد الإلكتروني</span>
            <input
              type="email"
              required
              value={authForm.email}
              onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
            />
          </label>
          <label>
            <span>كلمة المرور</span>
            <input
              type="password"
              required
              minLength={6}
              value={authForm.password}
              onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
            />
          </label>
          {authMode === 'signup' ? (
            <>
              <label>
                <span>الوظيفة المستهدفة</span>
                <input
                  value={authForm.target_role}
                  onChange={(event) => setAuthForm((current) => ({ ...current, target_role: event.target.value }))}
                />
              </label>
              <label>
                <span>المدينة</span>
                <input
                  value={authForm.city}
                  onChange={(event) => setAuthForm((current) => ({ ...current, city: event.target.value }))}
                />
              </label>
            </>
          ) : null}
          <button className="primary-button" type="submit" disabled={authLoading}>
            {authLoading ? 'جارٍ التنفيذ...' : authMode === 'signup' ? 'إنشاء الحساب' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}

