import { useAppContext } from '../../../context/AppContext';

export function JobSeekerOverviewPage() {
  const { analyses, latestAnalysis, latestResume, profile, profileCompletion, resumes, uiLocale } = useAppContext();

  const applicationsSent = Math.max(8, resumes.length * 3 + analyses.length);
  const insightsCount = (latestAnalysis?.insights.length ?? 0) + 2;

  const t =
    uiLocale === 'en'
      ? {
          title: `Welcome back, ${profile?.full_name?.split(' ')[0] || 'there'}`,
          subtitle: 'Your career operating system is organized around measurable progress, readiness, and recruiter visibility.',
          cards: [
            { label: 'CV score', value: latestAnalysis ? `${latestAnalysis.score}/100` : 'Pending', meta: 'Latest ATS health' },
            { label: 'Applications sent', value: `${applicationsSent}`, meta: 'Tracked this month' },
            { label: 'AI insights', value: `${insightsCount}`, meta: 'Priority suggestions available' },
            { label: 'Profile completion', value: `${profileCompletion}%`, meta: 'Ready for outreach' },
          ],
          pipeline: 'Focus pipeline',
          activity: 'Recent momentum',
          next: 'Next best actions',
        }
      : {
          title: `أهلا ${profile?.full_name?.split(' ')[0] || 'بك'}`,
          subtitle: 'مساحة عمل منظمة حول التقدم القابل للقياس، جاهزية السيرة، ووضوح الظهور أمام جهات التوظيف.',
          cards: [
            { label: 'درجة السيرة', value: latestAnalysis ? `${latestAnalysis.score}/100` : 'قيد الانتظار', meta: 'آخر نتيجة ATS' },
            { label: 'الطلبات المرسلة', value: `${applicationsSent}`, meta: 'المتابعة هذا الشهر' },
            { label: 'الرؤى الذكية', value: `${insightsCount}`, meta: 'اقتراحات ذات أولوية' },
            { label: 'اكتمال الملف', value: `${profileCompletion}%`, meta: 'جاهز للتواصل' },
          ],
          pipeline: 'مسار التركيز',
          activity: 'الحركة الأخيرة',
          next: 'أفضل خطوات تالية',
        };

  const focusItems =
    uiLocale === 'en'
      ? [
          'Improve your summary to highlight sector expertise and quantified outcomes.',
          'Refresh skills tags to match current role targets and ATS keywords.',
          'Generate a recruiter-ready version for public sector hiring teams.',
        ]
      : [
          'حسن الملخص المهني ليبرز خبرتك القطاعية والنتائج القابلة للقياس.',
          'حدث وسوم المهارات لتتوافق مع الوظائف المستهدفة وكلمات ATS المفتاحية.',
          'أنشئ نسخة جاهزة للمسؤولين عن التوظيف في الجهات الحكومية.',
        ];

  const activity =
    uiLocale === 'en'
      ? [
          latestResume?.file_name ? `Uploaded ${latestResume.file_name}` : 'No resume uploaded yet',
          latestAnalysis ? `Latest analysis scored ${latestAnalysis.score}/100` : 'No analysis generated yet',
          profile?.target_role ? `Targeting ${profile.target_role}` : 'Set a target role to sharpen recommendations',
        ]
      : [
          latestResume?.file_name ? `تم رفع ${latestResume.file_name}` : 'لم يتم رفع سيرة بعد',
          latestAnalysis ? `آخر تحليل حصل على ${latestAnalysis.score}/100` : 'لم يتم إنشاء تحليل بعد',
          profile?.target_role ? `الوظيفة المستهدفة: ${profile.target_role}` : 'حدد وظيفة مستهدفة لتحسين التوصيات',
        ];

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">{uiLocale === 'en' ? 'Dashboard overview' : 'نظرة عامة'}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="hero-kpi">
          <strong>{latestAnalysis?.score ?? 72}</strong>
          <span>{uiLocale === 'en' ? 'Career readiness index' : 'مؤشر الجاهزية المهنية'}</span>
        </div>
      </section>

      <section className="stats-grid">
        {t.cards.map((card) => (
          <article className="surface-card stat-card" key={card.label}>
            <span className="card-label">{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.meta}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="surface-card">
          <div className="section-intro">
            <h2>{t.pipeline}</h2>
            <p>{uiLocale === 'en' ? 'A compact view of what should move next.' : 'عرض مختصر لما يجب تحريكه بعد ذلك.'}</p>
          </div>
          <div className="check-list">
            {focusItems.map((item) => (
              <div className="check-row" key={item}>
                <span className="check-bullet" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card">
          <div className="section-intro">
            <h2>{t.activity}</h2>
            <p>{uiLocale === 'en' ? 'Signals collected from your latest workspace activity.' : 'إشارات مستخرجة من آخر نشاط في المساحة.'}</p>
          </div>
          <div className="timeline-list">
            {activity.map((item, index) => (
              <div className="timeline-row" key={item}>
                <span className="timeline-index">0{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="surface-card">
        <div className="section-intro">
          <h2>{t.next}</h2>
          <p>
            {uiLocale === 'en'
              ? 'Use this layout as the foundation for a scalable applicant-facing SaaS product: clean hierarchy, tokenized spacing, and module-ready content blocks.'
              : 'استخدم هذا التخطيط كأساس لمنتج SaaS قابل للتوسع: هرمية واضحة، مسافات موحدة، ووحدات محتوى جاهزة للنمو.'}
          </p>
        </div>
        <div className="action-grid">
          <div className="action-tile">
            <span className="eyebrow">{uiLocale === 'en' ? 'Resume analysis' : 'تحليل السيرة'}</span>
            <strong>{uiLocale === 'en' ? 'Upload, score, and prioritize edits' : 'ارفع السيرة وقيمها وحدد الأولويات'}</strong>
          </div>
          <div className="action-tile">
            <span className="eyebrow">{uiLocale === 'en' ? 'Resume builder' : 'بناء السيرة'}</span>
            <strong>{uiLocale === 'en' ? 'Edit structured content with live preview' : 'عدل المحتوى بشكل منظم مع معاينة مباشرة'}</strong>
          </div>
          <div className="action-tile">
            <span className="eyebrow">{uiLocale === 'en' ? 'Recruiter mode' : 'وضع التوظيف'}</span>
            <strong>{uiLocale === 'en' ? 'Review candidate fit in a structured hiring view' : 'راجع ملاءمة المرشحين ضمن واجهة توظيف منظمة'}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
