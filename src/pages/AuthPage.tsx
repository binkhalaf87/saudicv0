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
    uiLocale,
  } = useAppContext();

  const t =
    uiLocale === 'en'
      ? {
          missing: 'Supabase keys are not configured yet.',
          missingSub: 'Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` to enable authentication.',
          signup: 'Create account',
          signin: 'Sign in',
          title: 'Access the SaudiCV platform',
          subtitle: 'A clean authentication entry designed to support both candidate and recruiter product flows.',
          fullName: 'Full name',
          email: 'Email',
          password: 'Password',
          targetRole: 'Target role',
          city: 'City',
          loading: 'Working...',
        }
      : {
          missing: 'مفاتيح Supabase غير مضافة بعد.',
          missingSub: 'أضف `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` داخل `.env.local` لتفعيل المصادقة.',
          signup: 'إنشاء حساب',
          signin: 'تسجيل الدخول',
          title: 'الدخول إلى منصة SaudiCV',
          subtitle: 'واجهة دخول نظيفة تدعم مسارات الباحث عن عمل وجهة التوظيف.',
          fullName: 'الاسم الكامل',
          email: 'البريد الإلكتروني',
          password: 'كلمة المرور',
          targetRole: 'الوظيفة المستهدفة',
          city: 'المدينة',
          loading: 'جار التنفيذ...',
        };

  if (!hasSupabaseCredentials) {
    return (
      <div className="auth-layout auth-page">
        <div className="surface-card auth-card">
          <h2>{t.missing}</h2>
          <p>{t.missingSub}</p>
        </div>
      </div>
    );
  }

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-layout auth-page">
      <div className="surface-card auth-card">
        {message ? <div className="notice-card compact-notice">{message}</div> : null}
        <span className="eyebrow">{authMode === 'signup' ? t.signup : t.signin}</span>
        <h1 style={{ fontSize: '2.2rem', marginTop: '14px' }}>{t.title}</h1>
        <p>{t.subtitle}</p>

        <div className="auth-tabs">
          <button className={authMode === 'signup' ? 'menu-item active' : 'menu-item'} onClick={() => setAuthMode('signup')} type="button">
            {t.signup}
          </button>
          <button className={authMode === 'signin' ? 'menu-item active' : 'menu-item'} onClick={() => setAuthMode('signin')} type="button">
            {t.signin}
          </button>
        </div>

        <form className="auth-form" onSubmit={(event) => void handleAuthSubmit(event)}>
          {authMode === 'signup' ? (
            <label>
              <span>{t.fullName}</span>
              <input required value={authForm.full_name} onChange={(event) => setAuthForm((current) => ({ ...current, full_name: event.target.value }))} />
            </label>
          ) : null}
          <label>
            <span>{t.email}</span>
            <input required type="email" value={authForm.email} onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))} />
          </label>
          <label>
            <span>{t.password}</span>
            <input required minLength={6} type="password" value={authForm.password} onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))} />
          </label>
          {authMode === 'signup' ? (
            <>
              <label>
                <span>{t.targetRole}</span>
                <input value={authForm.target_role} onChange={(event) => setAuthForm((current) => ({ ...current, target_role: event.target.value }))} />
              </label>
              <label>
                <span>{t.city}</span>
                <input value={authForm.city} onChange={(event) => setAuthForm((current) => ({ ...current, city: event.target.value }))} />
              </label>
            </>
          ) : null}
          <button className="button button-primary" disabled={authLoading} type="submit">
            {authLoading ? t.loading : authMode === 'signup' ? t.signup : t.signin}
          </button>
        </form>
      </div>
    </div>
  );
}
