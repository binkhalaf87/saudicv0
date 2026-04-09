import { useAppContext } from '../../../context/AppContext';

export function JobSeekerProfilePage() {
  const { currentUserEmail, profileDraft, saveLoading, setProfileDraft, handleSaveProfile } = useAppContext();

  return (
    <div className="card-stack">
      <form className="form-card" onSubmit={(event) => void handleSaveProfile(event)}>
        <h3>الملف الشخصي</h3>
        <div className="profile-grid">
          <label>
            <span>الاسم</span>
            <input
              value={profileDraft.full_name}
              onChange={(event) => setProfileDraft((current) => ({ ...current, full_name: event.target.value }))}
            />
          </label>
          <label>
            <span>المدينة</span>
            <input
              value={profileDraft.city}
              onChange={(event) => setProfileDraft((current) => ({ ...current, city: event.target.value }))}
            />
          </label>
          <label>
            <span>سنوات الخبرة</span>
            <input
              type="number"
              min="0"
              value={profileDraft.years_experience}
              onChange={(event) =>
                setProfileDraft((current) => ({ ...current, years_experience: event.target.value }))
              }
            />
          </label>
          <label>
            <span>البريد الإلكتروني</span>
            <input value={currentUserEmail} readOnly />
          </label>
          <label className="profile-grid-wide">
            <span>الوظيفة المستهدفة</span>
            <input
              value={profileDraft.target_role}
              onChange={(event) => setProfileDraft((current) => ({ ...current, target_role: event.target.value }))}
            />
          </label>
          <label className="profile-grid-wide">
            <span>المهارات</span>
            <textarea
              value={profileDraft.skills}
              onChange={(event) => setProfileDraft((current) => ({ ...current, skills: event.target.value }))}
            />
          </label>
        </div>
        <button className="primary-button" type="submit" disabled={saveLoading}>
          {saveLoading ? 'جارٍ الحفظ...' : 'حفظ الملف الشخصي'}
        </button>
      </form>
    </div>
  );
}

