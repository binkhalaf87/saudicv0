import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

function IconSparkles() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>
    </svg>
  );
}

function IconFileCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="m9 15 2 2 4-4"/>
    </svg>
  );
}

function IconMic() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3"/>
      <path d="M5 10a7 7 0 0 0 14 0"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="8" y1="22" x2="16" y2="22"/>
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
      <line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function IconUpload() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

function IconLayout() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: <IconSparkles />,
    title: 'تحليل السيرة بالذكاء الاصطناعي',
    description: 'تقييم شامل لسيرتك الذاتية مع نتيجة ATS واضحة ومقارنة فورية بمعايير الصناعة.',
    iconColor: '#0f6d73',
    iconBg: '#dff4f2',
    badge: 'AI',
  },
  {
    icon: <IconFileCheck />,
    title: 'تحسين الملف الشخصي',
    description: 'توصيات مخصصة ومباشرة لتعزيز نقاط قوتك ومعالجة الثغرات قبل التقديم.',
    iconColor: '#7c3aed',
    iconBg: '#ede9fe',
    badge: 'CV',
  },
  {
    icon: <IconMic />,
    title: 'محاكاة مقابلة العمل',
    description: 'تدرّب مع مساعد ذكاء اصطناعي يحاكي أسئلة المحاولين ويقدم تغذية راجعة فورية.',
    iconColor: '#b45309',
    iconBg: '#fef3c7',
    badge: 'قريباً',
  },
  {
    icon: <IconBriefcase />,
    title: 'مطابقة الوظائف الذكية',
    description: 'اكتشف الوظائف الأكثر تناسباً مع خبراتك ومهاراتك بدقة تحليلية متقدمة.',
    iconColor: '#0369a1',
    iconBg: '#e0f2fe',
    badge: 'قريباً',
  },
];

const steps = [
  {
    number: '01',
    icon: <IconUpload />,
    title: 'ارفع سيرتك الذاتية',
    description: 'ادعم تحميل ملفات PDF وDOCX مع دعم OCR للملفات الممسوحة. احتفظ بنسخ متعددة داخل حسابك.',
  },
  {
    number: '02',
    icon: <IconSparkles />,
    title: 'احصل على تحليل فوري',
    description: 'يحلل الذكاء الاصطناعي سيرتك خلال ثوانٍ ويقدم نتيجة ATS مع توصيات مفصلة وقابلة للتطبيق.',
  },
  {
    number: '03',
    icon: <IconChart />,
    title: 'حسّن وتقدم بثقة',
    description: 'طبّق التوصيات، راقب تحسّن نتيجتك، وقدّم طلبك وأنت واثق من جاهزية ملفك.',
  },
];

const trustStats = [
  { value: '+10,000', label: 'باحث عن عمل يثقون بنا' },
  { value: '87%', label: 'متوسط تحسن نتيجة ATS' },
  { value: '< 30 ث', label: 'وقت التحليل الكامل' },
  { value: 'مجاني', label: 'للبدء بدون بطاقة ائتمان' },
];

const pricingPlans = [
  {
    name: 'Starter',
    nameAr: 'المبتدئ',
    price: 'مجاني',
    priceNote: 'للأبد',
    description: 'مثالي للبدء وتجربة قوة التحليل الذكي لسيرتك.',
    features: [
      'رفع السيرة الذاتية (PDF / DOCX)',
      'تحليل ATS أساسي',
      'لوحة تحكم شخصية',
      'حفظ نتائج التحليل',
    ],
    cta: 'ابدأ مجاناً',
    ctaLink: '/auth',
    popular: false,
  },
  {
    name: 'Pro',
    nameAr: 'المحترف',
    price: 'قريباً',
    priceNote: '',
    description: 'لمن يريد أدوات متقدمة وتحليلات شاملة للتميز في سوق العمل.',
    features: [
      'كل ما في الخطة المجانية',
      'نسخ سيرة ذاتية متعددة',
      'محاكاة مقابلة العمل بالذكاء الاصطناعي',
      'مطابقة الوظائف الذكية',
      'تقارير تطوير مهني متقدمة',
    ],
    cta: 'سجّل اهتمامك',
    ctaLink: '/auth',
    popular: true,
  },
];

// ─── Mock CV Analysis Card (Hero Visual) ─────────────────────────────────────

function HeroVisualCard() {
  return (
    <div className="lp-mock-card">
      <div className="lp-mock-header">
        <div className="lp-mock-file">
          <div className="lp-mock-file-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <span>Software_Engineer_CV.pdf</span>
        </div>
        <span className="lp-mock-status-badge">محلَّل</span>
      </div>

      <div className="lp-mock-score-section">
        <div className="lp-mock-score-label">نتيجة ATS</div>
        <div className="lp-mock-score-row">
          <span className="lp-mock-score-value">87</span>
          <span className="lp-mock-score-max">/100</span>
          <span className="lp-mock-score-grade">قوي</span>
        </div>
        <div className="lp-mock-progress-bar">
          <div className="lp-mock-progress-fill" style={{ width: '87%' }} />
        </div>
      </div>

      <div className="lp-mock-checks">
        <div className="lp-mock-check-row positive">
          <span className="lp-mock-check-icon">✓</span>
          <span className="lp-mock-check-label">الكلمات المفتاحية</span>
          <span className="lp-mock-check-result">ممتاز</span>
        </div>
        <div className="lp-mock-check-row positive">
          <span className="lp-mock-check-icon">✓</span>
          <span className="lp-mock-check-label">تنسيق الملف</span>
          <span className="lp-mock-check-result">جيد</span>
        </div>
        <div className="lp-mock-check-row warn">
          <span className="lp-mock-check-icon">⚠</span>
          <span className="lp-mock-check-label">قسم المهارات</span>
          <span className="lp-mock-check-result warn-text">يحتاج تحسين</span>
        </div>
        <div className="lp-mock-check-row warn">
          <span className="lp-mock-check-icon">⚠</span>
          <span className="lp-mock-check-label">الملخص الشخصي</span>
          <span className="lp-mock-check-result warn-text">غير مكتمل</span>
        </div>
      </div>

      <div className="lp-mock-footer">
        <div className="lp-mock-improvement">
          <span className="lp-mock-dot" />
          <span>3 توصيات تحسين متاحة</span>
        </div>
        <Link to="/auth" className="lp-mock-cta-link">عرض التحليل ←</Link>
      </div>
    </div>
  );
}

// ─── Dashboard Preview Mock ───────────────────────────────────────────────────

function DashboardPreviewMock() {
  return (
    <div className="lp-dash-preview">
      <div className="lp-dash-topbar">
        <div className="lp-dash-topbar-left">
          <div className="lp-dash-avatar">م</div>
          <div>
            <div className="lp-dash-username">محمد العتيبي</div>
            <div className="lp-dash-role">مهندس برمجيات · الرياض</div>
          </div>
        </div>
        <div className="lp-dash-topbar-right">
          <div className="lp-dash-pill active">نشط</div>
        </div>
      </div>

      <div className="lp-dash-cards">
        <div className="lp-dash-metric-card accent">
          <div className="lp-dash-metric-label">نتيجة ATS</div>
          <div className="lp-dash-metric-value">87</div>
          <div className="lp-dash-metric-sub">
            <span className="lp-dash-badge-up">↑ +12</span> منذ آخر تحليل
          </div>
        </div>
        <div className="lp-dash-metric-card">
          <div className="lp-dash-metric-label">حالة الملف</div>
          <div className="lp-dash-metric-value small">جاهز</div>
          <div className="lp-dash-metric-sub">محدّث الأسبوع الماضي</div>
        </div>
        <div className="lp-dash-metric-card">
          <div className="lp-dash-metric-label">اقتراحات</div>
          <div className="lp-dash-metric-value small">3</div>
          <div className="lp-dash-metric-sub">بنود تحتاج اهتماماً</div>
        </div>
      </div>

      <div className="lp-dash-suggestions">
        <div className="lp-dash-suggest-title">أولويات التحسين</div>
        {[
          'أضف مهارات تقنية محددة (React, Node.js)',
          'حسّن ملخصك المهني ليكون أكثر تركيزاً',
          'أضف مشاريع مع نتائج قابلة للقياس',
        ].map((item, i) => (
          <div className="lp-dash-suggest-item" key={i}>
            <span className="lp-dash-suggest-num">{i + 1}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Auth-Aware Hero ──────────────────────────────────────────────────────────

function AuthenticatedHero({ firstName }: { firstName: string }) {
  return (
    <section className="lp-auth-hero">
      <div className="lp-container">
        <div className="lp-auth-hero-inner">
          <div className="lp-auth-welcome">
            <span className="lp-eyebrow">مرحباً بعودتك</span>
            <h1 className="lp-auth-headline">
              أهلاً{firstName ? `، ${firstName}` : ''} 👋
            </h1>
            <p className="lp-auth-sub">
              استمر في تطوير سيرتك الذاتية والوصول إلى لوحة تحكمك.
            </p>
          </div>
          <div className="lp-auth-actions-grid">
            <Link to="/job-seeker/dashboard/resume" className="lp-quick-action">
              <span className="lp-quick-action-icon" style={{ background: '#dff4f2', color: '#0f6d73' }}>
                <IconUpload />
              </span>
              <div>
                <div className="lp-quick-action-title">رفع سيرة</div>
                <div className="lp-quick-action-sub">أضف ملف جديد</div>
              </div>
            </Link>
            <Link to="/job-seeker/dashboard/analysis" className="lp-quick-action">
              <span className="lp-quick-action-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                <IconSparkles />
              </span>
              <div>
                <div className="lp-quick-action-title">تحليل السيرة</div>
                <div className="lp-quick-action-sub">اعرض التقارير</div>
              </div>
            </Link>
            <Link to="/job-seeker/dashboard" className="lp-quick-action">
              <span className="lp-quick-action-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                <IconLayout />
              </span>
              <div>
                <div className="lp-quick-action-title">لوحة التحكم</div>
                <div className="lp-quick-action-sub">نظرة شاملة</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function HomePage() {
  const { isAuthenticated, profile } = useAppContext();
  const firstName = profile?.full_name?.split(' ')[0] ?? '';

  return (
    <>
      <style>{`
        /* ── Shared Layout ── */
        .lp-container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Auth Hero ── */
        .lp-auth-hero {
          padding: 56px 0 48px;
        }
        .lp-auth-hero-inner {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .lp-eyebrow {
          display: inline-block;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #0f6d73;
          background: #dff4f2;
          padding: 5px 12px;
          border-radius: 999px;
          margin-bottom: 14px;
        }
        .lp-auth-headline {
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0 0 14px;
          color: #0f172a;
        }
        .lp-auth-sub {
          font-size: 1.05rem;
          color: #64748b;
          line-height: 1.75;
          margin: 0;
        }
        .lp-auth-actions-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .lp-quick-action {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 20px;
          padding: 18px;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          box-shadow: 0 4px 16px rgba(15,23,42,0.05);
        }
        .lp-quick-action:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(15,23,42,0.1);
          border-color: rgba(15,109,115,0.3);
        }
        .lp-quick-action-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .lp-quick-action-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 3px;
        }
        .lp-quick-action-sub {
          font-size: 0.82rem;
          color: #94a3b8;
        }

        /* ── Hero Section ── */
        .lp-hero {
          padding: 72px 0 80px;
          overflow: hidden;
        }
        .lp-hero-grid {
          display: grid;
          grid-template-columns: 1fr minmax(320px, 420px);
          gap: 56px;
          align-items: center;
        }
        .lp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(226,232,240,0.9);
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 24px;
          box-shadow: 0 2px 10px rgba(15,23,42,0.06);
        }
        .lp-hero-badge-dot {
          width: 7px;
          height: 7px;
          background: #0f6d73;
          border-radius: 50%;
          animation: lp-pulse 2s infinite;
        }
        @keyframes lp-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        .lp-hero-headline {
          font-size: clamp(2.6rem, 5.5vw, 4.2rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.08;
          margin: 0 0 22px;
          color: #0f172a;
        }
        .lp-hero-headline em {
          font-style: normal;
          background: linear-gradient(135deg, #0f6d73, #1f8fa5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lp-hero-sub {
          font-size: 1.1rem;
          color: #64748b;
          line-height: 1.8;
          margin: 0 0 36px;
          max-width: 52ch;
        }
        .lp-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 44px;
        }
        .lp-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0f6d73, #1f8fa5);
          color: #fff;
          font-size: 0.96rem;
          font-weight: 700;
          padding: 14px 26px;
          border-radius: 14px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 8px 24px rgba(15,109,115,0.32);
        }
        .lp-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(15,109,115,0.38);
        }
        .lp-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.85);
          color: #334155;
          font-size: 0.96rem;
          font-weight: 600;
          padding: 14px 24px;
          border-radius: 14px;
          text-decoration: none;
          border: 1px solid rgba(226,232,240,0.9);
          transition: background 0.18s, border-color 0.18s, transform 0.18s;
          box-shadow: 0 4px 14px rgba(15,23,42,0.06);
        }
        .lp-btn-secondary:hover {
          background: #fff;
          border-color: rgba(15,109,115,0.3);
          transform: translateY(-1px);
        }
        .lp-hero-social {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lp-hero-avatars {
          display: flex;
        }
        .lp-hero-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #fff;
          margin-inline-start: -8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #fff;
        }
        .lp-hero-avatar:first-child { margin-inline-start: 0; }
        .lp-hero-social-text {
          font-size: 0.88rem;
          color: #64748b;
        }
        .lp-hero-stars {
          display: flex;
          color: #f59e0b;
          gap: 1px;
        }

        /* ── Mock CV Card ── */
        .lp-mock-card {
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(226,232,240,0.85);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(15,23,42,0.12), 0 0 0 1px rgba(255,255,255,0.5);
        }
        .lp-mock-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          background: #fafbff;
        }
        .lp-mock-file {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.84rem;
          font-weight: 600;
          color: #334155;
        }
        .lp-mock-file-icon {
          width: 30px;
          height: 30px;
          background: #dff4f2;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f6d73;
        }
        .lp-mock-status-badge {
          font-size: 0.76rem;
          font-weight: 700;
          background: #dff4f2;
          color: #0f6d73;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .lp-mock-score-section {
          padding: 20px;
          border-bottom: 1px solid #f1f5f9;
        }
        .lp-mock-score-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }
        .lp-mock-score-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 12px;
        }
        .lp-mock-score-value {
          font-size: 2.8rem;
          font-weight: 800;
          color: #0f6d73;
          line-height: 1;
          letter-spacing: -0.05em;
        }
        .lp-mock-score-max {
          font-size: 1.1rem;
          color: #94a3b8;
          font-weight: 600;
        }
        .lp-mock-score-grade {
          margin-inline-start: auto;
          font-size: 0.8rem;
          font-weight: 700;
          background: #dff4f2;
          color: #0f6d73;
          padding: 5px 12px;
          border-radius: 999px;
        }
        .lp-mock-progress-bar {
          height: 7px;
          background: #f1f5f9;
          border-radius: 999px;
          overflow: hidden;
        }
        .lp-mock-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0f6d73, #1f8fa5);
          border-radius: 999px;
        }
        .lp-mock-checks {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-bottom: 1px solid #f1f5f9;
        }
        .lp-mock-check-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
        }
        .lp-mock-check-icon {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
        }
        .lp-mock-check-row.positive .lp-mock-check-icon { background: #dff4f2; color: #0f6d73; }
        .lp-mock-check-row.warn .lp-mock-check-icon { background: #fef3c7; color: #b45309; }
        .lp-mock-check-label { flex: 1; color: #334155; font-weight: 500; }
        .lp-mock-check-result { font-size: 0.8rem; font-weight: 600; color: #0f6d73; }
        .lp-mock-check-result.warn-text { color: #b45309; }
        .lp-mock-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: #fafbff;
        }
        .lp-mock-improvement {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #64748b;
        }
        .lp-mock-dot {
          width: 7px;
          height: 7px;
          background: #f59e0b;
          border-radius: 50%;
        }
        .lp-mock-cta-link {
          font-size: 0.84rem;
          font-weight: 700;
          color: #0f6d73;
          text-decoration: none;
          transition: gap 0.15s;
        }
        .lp-mock-cta-link:hover { text-decoration: underline; }

        /* ── Trust Strip ── */
        .lp-trust {
          padding: 32px 0;
          border-top: 1px solid rgba(226,232,240,0.6);
          border-bottom: 1px solid rgba(226,232,240,0.6);
          background: rgba(255,255,255,0.5);
        }
        .lp-trust-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
          text-align: center;
        }
        .lp-trust-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .lp-trust-stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .lp-trust-stat-label {
          font-size: 0.86rem;
          color: #64748b;
          line-height: 1.4;
        }
        .lp-trust-divider {
          width: 1px;
          background: #e2e8f0;
          margin: 0 auto;
        }

        /* ── Section Headers ── */
        .lp-section {
          padding: 88px 0;
        }
        .lp-section-alt {
          padding: 88px 0;
          background: rgba(255,255,255,0.55);
        }
        .lp-section-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .lp-section-title {
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin: 0 0 16px;
          line-height: 1.15;
        }
        .lp-section-sub {
          font-size: 1.05rem;
          color: #64748b;
          line-height: 1.7;
          max-width: 52ch;
          margin: 0 auto;
        }

        /* ── Features ── */
        .lp-features-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }
        .lp-feature-card {
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 22px;
          padding: 28px;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          box-shadow: 0 4px 16px rgba(15,23,42,0.04);
        }
        .lp-feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(15,23,42,0.1);
          border-color: rgba(15,109,115,0.2);
        }
        .lp-feature-icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          flex-shrink: 0;
        }
        .lp-feature-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 3px 9px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #64748b;
          margin-bottom: 12px;
        }
        .lp-feature-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 10px;
        }
        .lp-feature-desc {
          font-size: 0.93rem;
          color: #64748b;
          line-height: 1.7;
          margin: 0;
        }

        /* ── Steps ── */
        .lp-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
          position: relative;
        }
        .lp-steps-grid::before {
          content: '';
          position: absolute;
          top: 40px;
          right: 20%;
          left: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #cbd5e1, transparent);
        }
        .lp-step-card {
          text-align: center;
          padding: 32px 24px;
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 22px;
          position: relative;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(15,23,42,0.04);
        }
        .lp-step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(15,23,42,0.1);
        }
        .lp-step-number {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #94a3b8;
          margin-bottom: 14px;
        }
        .lp-step-icon-wrap {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #0f6d73, #1f8fa5);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          margin: 0 auto 20px;
          box-shadow: 0 8px 24px rgba(15,109,115,0.28);
        }
        .lp-step-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 10px;
        }
        .lp-step-desc {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.7;
          margin: 0;
        }

        /* ── Dashboard Preview ── */
        .lp-dash-preview {
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(226,232,240,0.85);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(15,23,42,0.1);
          max-width: 760px;
          margin: 0 auto;
        }
        .lp-dash-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid #f1f5f9;
          background: #fafbff;
        }
        .lp-dash-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lp-dash-avatar {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #0f6d73, #1f8fa5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 800;
        }
        .lp-dash-username {
          font-size: 0.92rem;
          font-weight: 700;
          color: #0f172a;
        }
        .lp-dash-role {
          font-size: 0.8rem;
          color: #94a3b8;
        }
        .lp-dash-pill { font-size: 0.76rem; font-weight: 700; padding: 4px 12px; border-radius: 999px; }
        .lp-dash-pill.active { background: #dff4f2; color: #0f6d73; }
        .lp-dash-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .lp-dash-metric-card {
          padding: 22px;
          border-inline-end: 1px solid #f1f5f9;
        }
        .lp-dash-metric-card:last-child { border-inline-end: none; }
        .lp-dash-metric-card.accent { background: linear-gradient(135deg, #f0fdfb, #fff); }
        .lp-dash-metric-label {
          font-size: 0.76rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
        }
        .lp-dash-metric-value {
          font-size: 2.4rem;
          font-weight: 800;
          color: #0f6d73;
          letter-spacing: -0.05em;
          line-height: 1;
          margin-bottom: 8px;
        }
        .lp-dash-metric-value.small { font-size: 1.5rem; color: #0f172a; }
        .lp-dash-metric-sub { font-size: 0.8rem; color: #94a3b8; }
        .lp-dash-badge-up {
          display: inline-block;
          background: #dff4f2;
          color: #0f6d73;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          margin-inline-end: 4px;
        }
        .lp-dash-suggestions { padding: 20px 24px; }
        .lp-dash-suggest-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 14px;
        }
        .lp-dash-suggest-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid #f8fafc;
          font-size: 0.9rem;
          color: #334155;
        }
        .lp-dash-suggest-item:last-child { border-bottom: none; }
        .lp-dash-suggest-num {
          width: 22px;
          height: 22px;
          background: #f1f5f9;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748b;
          flex-shrink: 0;
        }

        /* ── Pricing ── */
        .lp-pricing-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 460px));
          gap: 24px;
          justify-content: center;
        }
        .lp-price-card {
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(226,232,240,0.8);
          border-radius: 24px;
          padding: 36px;
          position: relative;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(15,23,42,0.05);
        }
        .lp-price-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 56px rgba(15,23,42,0.1);
        }
        .lp-price-card.popular {
          border-color: rgba(15,109,115,0.4);
          background: linear-gradient(145deg, #f0fdfb, #fff);
          box-shadow: 0 8px 32px rgba(15,109,115,0.14);
        }
        .lp-price-popular-badge {
          position: absolute;
          top: -13px;
          right: 50%;
          transform: translateX(50%);
          background: linear-gradient(135deg, #0f6d73, #1f8fa5);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 5px 16px;
          border-radius: 999px;
          letter-spacing: 0.04em;
        }
        .lp-price-name {
          font-size: 0.84rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 8px;
        }
        .lp-price-amount {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 6px;
        }
        .lp-price-value {
          font-size: 2.8rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .lp-price-note {
          font-size: 0.88rem;
          color: #94a3b8;
        }
        .lp-price-desc {
          font-size: 0.92rem;
          color: #64748b;
          line-height: 1.65;
          margin: 0 0 28px;
        }
        .lp-price-features {
          list-style: none;
          margin: 0 0 32px;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .lp-price-features li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.9rem;
          color: #334155;
        }
        .lp-price-check {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          background: #dff4f2;
          color: #0f6d73;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .lp-price-cta {
          display: block;
          text-align: center;
          padding: 14px;
          border-radius: 14px;
          font-size: 0.94rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.18s;
        }
        .lp-price-cta.primary {
          background: linear-gradient(135deg, #0f6d73, #1f8fa5);
          color: #fff;
          box-shadow: 0 8px 24px rgba(15,109,115,0.3);
        }
        .lp-price-cta.primary:hover { opacity: 0.92; transform: translateY(-1px); }
        .lp-price-cta.ghost {
          background: #f8fafc;
          color: #475569;
          border: 1px solid #e2e8f0;
        }
        .lp-price-cta.ghost:hover { background: #f1f5f9; border-color: #cbd5e1; }

        /* ── Final CTA Section ── */
        .lp-cta-section {
          padding: 88px 0;
          text-align: center;
        }
        .lp-cta-box {
          background: linear-gradient(145deg, #0f6d73, #1f8fa5);
          border-radius: 32px;
          padding: 72px 48px;
          position: relative;
          overflow: hidden;
        }
        .lp-cta-box::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -10%;
          width: 50%;
          height: 160%;
          background: radial-gradient(circle, rgba(255,255,255,0.12), transparent 60%);
          pointer-events: none;
        }
        .lp-cta-box::after {
          content: '';
          position: absolute;
          bottom: -40%;
          left: -10%;
          width: 50%;
          height: 160%;
          background: radial-gradient(circle, rgba(244,166,58,0.2), transparent 60%);
          pointer-events: none;
        }
        .lp-cta-eyebrow {
          display: inline-block;
          background: rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.9);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 999px;
          margin-bottom: 24px;
        }
        .lp-cta-headline {
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 800;
          letter-spacing: -0.035em;
          color: #fff;
          margin: 0 0 18px;
          line-height: 1.12;
          position: relative;
          z-index: 1;
        }
        .lp-cta-sub {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.78);
          line-height: 1.75;
          max-width: 48ch;
          margin: 0 auto 38px;
          position: relative;
          z-index: 1;
        }
        .lp-cta-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 14px;
          position: relative;
          z-index: 1;
        }
        .lp-btn-white {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          color: #0f6d73;
          font-size: 0.96rem;
          font-weight: 700;
          padding: 14px 26px;
          border-radius: 14px;
          text-decoration: none;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .lp-btn-white:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(0,0,0,0.16); }
        .lp-btn-white-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: rgba(255,255,255,0.9);
          font-size: 0.96rem;
          font-weight: 600;
          padding: 14px 24px;
          border-radius: 14px;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.35);
          transition: background 0.18s, border-color 0.18s;
        }
        .lp-btn-white-ghost:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.6); }

        /* ── Footer ── */
        .lp-footer {
          padding: 44px 0;
          border-top: 1px solid rgba(226,232,240,0.6);
        }
        .lp-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }
        .lp-footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lp-footer-brand-mark {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #0f6d73, #1f8fa5);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.68rem;
          font-weight: 800;
        }
        .lp-footer-brand-name {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
        }
        .lp-footer-copy {
          font-size: 0.82rem;
          color: #94a3b8;
          margin-top: 4px;
        }
        .lp-footer-links {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .lp-footer-links a {
          font-size: 0.86rem;
          color: #64748b;
          text-decoration: none;
          transition: color 0.15s;
        }
        .lp-footer-links a:hover { color: #0f172a; }
        .lp-footer-right {
          font-size: 0.84rem;
          color: #94a3b8;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .lp-hero-grid { grid-template-columns: 1fr; gap: 48px; }
          .lp-features-grid { grid-template-columns: 1fr; }
          .lp-steps-grid { grid-template-columns: 1fr; }
          .lp-steps-grid::before { display: none; }
          .lp-trust-grid { grid-template-columns: repeat(2, 1fr); }
          .lp-auth-actions-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .lp-section, .lp-section-alt { padding: 60px 0; }
          .lp-hero { padding: 48px 0 60px; }
          .lp-cta-box { padding: 48px 28px; }
          .lp-pricing-grid { grid-template-columns: 1fr; }
          .lp-dash-cards { grid-template-columns: 1fr; }
          .lp-dash-metric-card { border-inline-end: none; border-bottom: 1px solid #f1f5f9; }
          .lp-footer-inner { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 540px) {
          .lp-trust-grid { grid-template-columns: 1fr 1fr; }
          .lp-hero-actions { flex-direction: column; }
          .lp-btn-primary, .lp-btn-secondary { text-align: center; justify-content: center; }
          .lp-features-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Auth-Aware Entry ─────────────────────────────────────────────── */}
      {isAuthenticated ? (
        <AuthenticatedHero firstName={firstName} />
      ) : (
        <>
          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <section className="lp-hero">
            <div className="lp-container">
              <div className="lp-hero-grid">
                <div className="lp-hero-copy">
                  <div className="lp-hero-badge">
                    <span className="lp-hero-badge-dot" />
                    تحليل ذكي يعمل على مدار الساعة
                  </div>
                  <h1 className="lp-hero-headline">
                    سيرتك الذاتية<br />
                    <em>تستحق أن تُقرأ</em>
                  </h1>
                  <p className="lp-hero-sub">
                    حلّل سيرتك الذاتية في ثوانٍ، احصل على نتيجة ATS مع توصيات عملية تساعدك على التميز أمام أنظمة التوظيف وأصحاب العمل.
                  </p>
                  <div className="lp-hero-actions">
                    <Link to="/auth" className="lp-btn-primary">
                      ابدأ تحليل سيرتك — مجاناً
                    </Link>
                    <Link to="/job-seeker/dashboard" className="lp-btn-secondary">
                      <IconArrow />
                      شاهد المنصة
                    </Link>
                  </div>
                  <div className="lp-hero-social">
                    <div className="lp-hero-avatars">
                      {[
                        { bg: '#0f6d73', letter: 'أ' },
                        { bg: '#7c3aed', letter: 'م' },
                        { bg: '#0369a1', letter: 'ف' },
                        { bg: '#b45309', letter: 'ن' },
                      ].map(({ bg, letter }) => (
                        <span key={letter} className="lp-hero-avatar" style={{ background: bg }}>
                          {letter}
                        </span>
                      ))}
                    </div>
                    <div>
                      <div className="lp-hero-stars">
                        {[0, 1, 2, 3, 4].map((i) => <IconStar key={i} />)}
                      </div>
                      <div className="lp-hero-social-text">يثق بنا +10,000 باحث عن عمل</div>
                    </div>
                  </div>
                </div>

                <div>
                  <HeroVisualCard />
                </div>
              </div>
            </div>
          </section>

          {/* ── Trust Strip ───────────────────────────────────────────────── */}
          <div className="lp-trust">
            <div className="lp-container">
              <div className="lp-trust-grid">
                {trustStats.map((stat, i) => (
                  <div className="lp-trust-stat" key={i}>
                    <span className="lp-trust-stat-value">{stat.value}</span>
                    <span className="lp-trust-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="lp-section" id="features">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-eyebrow">المزايا</span>
            <h2 className="lp-section-title">كل ما تحتاجه لبناء سيرة ذاتية احترافية</h2>
            <p className="lp-section-sub">
              أدوات ذكية مصممة خصيصاً لمساعدتك على التميز في سوق العمل السعودي والخليجي.
            </p>
          </div>
          <div className="lp-features-grid">
            {features.map((f) => (
              <article className="lp-feature-card" key={f.title}>
                <div className="lp-feature-icon-wrap" style={{ background: f.iconBg, color: f.iconColor }}>
                  {f.icon}
                </div>
                <span className="lp-feature-badge">{f.badge}</span>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="lp-section-alt" id="how-it-works">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-eyebrow">كيف تعمل</span>
            <h2 className="lp-section-title">3 خطوات بسيطة إلى سيرة ذاتية أقوى</h2>
            <p className="lp-section-sub">
              من رفع الملف إلى الحصول على وظيفتك المثالية — عملية واضحة وموجهة بالكامل.
            </p>
          </div>
          <div className="lp-steps-grid">
            {steps.map((step) => (
              <article className="lp-step-card" key={step.number}>
                <div className="lp-step-number">STEP {step.number}</div>
                <div className="lp-step-icon-wrap">{step.icon}</div>
                <h3 className="lp-step-title">{step.title}</h3>
                <p className="lp-step-desc">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dashboard Preview ─────────────────────────────────────────────── */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-eyebrow">لوحة التحكم</span>
            <h2 className="lp-section-title">واجهة واضحة تُركّز على ما يهم</h2>
            <p className="lp-section-sub">
              لوحة تحكم مصممة لتمنحك صورة كاملة عن وضعك المهني ومسار تطورك.
            </p>
          </div>
          <DashboardPreviewMock />
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section className="lp-section-alt" id="pricing">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-eyebrow">الأسعار</span>
            <h2 className="lp-section-title">ابدأ مجاناً، طوّر بحسب احتياجك</h2>
            <p className="lp-section-sub">
              خطة مجانية كاملة الميزات للبدء، وخطة احترافية قيد الإعداد لمن يريد أكثر.
            </p>
          </div>
          <div className="lp-pricing-grid">
            {pricingPlans.map((plan) => (
              <article className={`lp-price-card ${plan.popular ? 'popular' : ''}`} key={plan.name}>
                {plan.popular && <div className="lp-price-popular-badge">الأكثر طلباً</div>}
                <div className="lp-price-name">{plan.name} · {plan.nameAr}</div>
                <div className="lp-price-amount">
                  <span className="lp-price-value">{plan.price}</span>
                  {plan.priceNote && <span className="lp-price-note">/ {plan.priceNote}</span>}
                </div>
                <p className="lp-price-desc">{plan.description}</p>
                <ul className="lp-price-features">
                  {plan.features.map((feat) => (
                    <li key={feat}>
                      <span className="lp-price-check"><IconCheck /></span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.ctaLink}
                  className={`lp-price-cta ${plan.popular ? 'primary' : 'ghost'}`}
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="lp-cta-section">
        <div className="lp-container">
          <div className="lp-cta-box">
            <span className="lp-cta-eyebrow">ابدأ اليوم</span>
            <h2 className="lp-cta-headline">
              رحلتك المهنية تبدأ<br />بسيرة ذاتية أقوى
            </h2>
            <p className="lp-cta-sub">
              انضم إلى آلاف الباحثين عن عمل الذين يستخدمون SaudiCV لتحسين سيرهم الذاتية والحصول على فرص أفضل.
            </p>
            <div className="lp-cta-actions">
              <Link to="/auth" className="lp-btn-white">
                ابدأ مجاناً الآن
              </Link>
              <Link to="/job-seeker/dashboard" className="lp-btn-white-ghost">
                استعرض المنصة
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-inner">
            <div className="lp-footer-brand">
              <span className="lp-footer-brand-mark">SCV</span>
              <div>
                <div className="lp-footer-brand-name">SaudiCV</div>
                <div className="lp-footer-copy">© {new Date().getFullYear()} جميع الحقوق محفوظة</div>
              </div>
            </div>

            <nav className="lp-footer-links" aria-label="Footer navigation">
              <a href="/#features">المزايا</a>
              <a href="/#how-it-works">كيف تعمل</a>
              <a href="/#pricing">الأسعار</a>
              <Link to="/auth">تسجيل الدخول</Link>
            </nav>

            <div className="lp-footer-right">
              منصة ذكية لتحليل السيرة الذاتية
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
