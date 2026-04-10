import { useAppContext } from '../../../context/AppContext';

export function JobSeekerProfilePage() {
  const { currentUserEmail, handleSaveProfile, profileDraft, saveLoading, setProfileDraft, uiLocale } = useAppContext();

  return (
    <div className="page-stack">
      <section className="surface-card">
        <span className="eyebrow">{uiLocale === 'en' ? 'Profile settings' : 'إعدادات الملف'}</span>
        <h1>{uiLocale === 'en' ? 'Maintain a trusted candidate profile.' : 'حافظ على ملف مرشح موثوق.'}</h1>
        <p>
          {uiLocale === 'en'
            ? 'Structured fields keep the product scalable across resume generation, analysis, and recruiter matching.'
            : 'الحقول المنظمة تجعل المنتج قابلا للتوسع عبر إنشاء السيرة والتحليل ومطابقة جهات التوظيف.'}
        </p>
      </section>

      <form className="surface-card form-stack" onSubmit={(event) => void handleSaveProfile(event)}>
        <div className="field-grid">
          <label>
            <span>{uiLocale === 'en' ? 'Full name' : 'الاسم الكامل'}</span>
            <input value={profileDraft.full_name} onChange={(event) => setProfileDraft((current) => ({ ...current, full_name: event.target.value }))} />
          </label>
          <label>
            <span>{uiLocale === 'en' ? 'City' : 'المدينة'}</span>
            <input value={profileDraft.city} onChange={(event) => setProfileDraft((current) => ({ ...current, city: event.target.value }))} />
          </label>
          <label>
            <span>{uiLocale === 'en' ? 'Years of experience' : 'سنوات الخبرة'}</span>
            <input
              min="0"
              type="number"
              value={profileDraft.years_experience}
              onChange={(event) => setProfileDraft((current) => ({ ...current, years_experience: event.target.value }))}
            />
          </label>
          <label>
            <span>{uiLocale === 'en' ? 'Email' : 'البريد الإلكتروني'}</span>
            <input readOnly value={currentUserEmail} />
          </label>
        </div>

        <label>
          <span>{uiLocale === 'en' ? 'Target role' : 'الوظيفة المستهدفة'}</span>
          <input value={profileDraft.target_role} onChange={(event) => setProfileDraft((current) => ({ ...current, target_role: event.target.value }))} />
        </label>

        <label>
          <span>{uiLocale === 'en' ? 'Skills' : 'المهارات'}</span>
          <textarea value={profileDraft.skills} onChange={(event) => setProfileDraft((current) => ({ ...current, skills: event.target.value }))} />
        </label>

        <div className="button-row">
          <button className="button button-primary" disabled={saveLoading} type="submit">
            {saveLoading
              ? uiLocale === 'en'
                ? 'Saving...'
                : 'جار الحفظ...'
              : uiLocale === 'en'
                ? 'Save profile'
                : 'حفظ الملف'}
          </button>
        </div>
      </form>
    </div>
  );
}
