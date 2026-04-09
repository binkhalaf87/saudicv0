import { useAppContext } from '../../../context/AppContext';

export function JobSeekerOverviewPage() {
  const { profile, latestAnalysis, latestResume, analyses, profileCompletion } = useAppContext();

  return (
    <div className="card-stack">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">مرحبًا {profile?.full_name || 'بك'}</p>
          <h3>لوحة تحكم الباحث عن عمل</h3>
          <p>هذه الصفحة تعرض ملخصًا سريعًا لحالة الحساب وآخر الملفات والتحليلات المحفوظة.</p>
        </div>
        <div className="metric-box">
          <strong>{latestAnalysis?.score ?? '--'}/100</strong>
          <span>آخر نتيجة تحليل</span>
        </div>
      </div>
      <div className="overview-grid">
        <article className="info-card">
          <h4>اكتمال الملف الشخصي</h4>
          <p>{profileCompletion}%</p>
        </article>
        <article className="info-card">
          <h4>آخر سيرة مرفوعة</h4>
          <p>{latestResume?.file_name ?? 'لا توجد ملفات بعد'}</p>
        </article>
        <article className="info-card">
          <h4>عدد التحليلات المحفوظة</h4>
          <p>{analyses.length}</p>
        </article>
      </div>
    </div>
  );
}

