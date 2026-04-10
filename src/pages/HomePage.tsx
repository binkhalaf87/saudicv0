import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const copy = {
  en: {
    heroEyebrow: 'AI-powered career platform',
    heroTitle: 'Career growth with trusted intelligence, elegant structure, and recruiter clarity.',
    heroBody:
      'SaudiCV is designed as a modern SaaS platform for resume analysis, AI-assisted building, and candidate routing across job-seeker and recruiter workflows.',
    primary: 'Start free',
    secondary: 'Upload CV',
    metrics: [
      { value: '92%', label: 'Average ATS readiness' },
      { value: '3 min', label: 'From upload to insight' },
      { value: 'RTL + EN', label: 'Native bilingual UX' },
    ],
    featuresTitle: 'Platform modules',
    featuresBody: 'A modular system with clean hierarchy, strong information density, and room to scale.',
    features: [
      { title: 'ATS Analysis', text: 'Large score visuals, strengths, weaknesses, and actionable guidance in one dashboard-first surface.' },
      { title: 'AI Interview', text: 'Prepared for guided interview coaching with structured prompts and confidence-building insights.' },
      { title: 'Smart Send', text: 'Designed to support job application routing, recruiter handoff, and application tracking.' },
      { title: 'Recruiter View', text: 'Structured candidate review table with filters, tags, actions, and match percentages.' },
    ],
    systemTitle: 'Implementation-ready design system',
    systemBody: 'Built on reusable cards, buttons, tags, tables, progress bars, and modular sections.',
    footer: 'Built for high-trust digital hiring experiences.',
  },
  ar: {
    heroEyebrow: 'منصة مهنية مدعومة بالذكاء الاصطناعي',
    heroTitle: 'تطور مهني يجمع الثقة والوضوح والهيكلية الأنيقة.',
    heroBody:
      'SaudiCV مصممة كمنصة SaaS حديثة لتحليل السيرة، وبنائها بالذكاء الاصطناعي، وإدارة انتقال المرشح بين الباحث عن عمل وجهة التوظيف.',
    primary: 'ابدأ مجانا',
    secondary: 'ارفع السيرة',
    metrics: [
      { value: '92%', label: 'متوسط جاهزية ATS' },
      { value: '3 دقائق', label: 'من الرفع إلى النتيجة' },
      { value: 'EN + RTL', label: 'تجربة ثنائية اللغة' },
    ],
    featuresTitle: 'وحدات المنصة',
    featuresBody: 'نظام معياري بهرمية واضحة وكثافة معلومات متوازنة ومساحة للتوسع.',
    features: [
      { title: 'تحليل ATS', text: 'مرئيات درجة كبيرة مع نقاط القوة والضعف والتوصيات العملية ضمن واجهة واحدة.' },
      { title: 'المقابلة الذكية', text: 'جاهزة لتجارب تدريب مقابلات منظمة تبني الثقة وتقدم إرشادا موجها.' },
      { title: 'الإرسال الذكي', text: 'مصممة لدعم توجيه الطلبات وتمرير المرشح ومتابعة التقديمات.' },
      { title: 'لوحة التوظيف', text: 'جدول مراجعة مرشحين منظم مع مرشحات ووسوم وإجراءات ونسب تطابق.' },
    ],
    systemTitle: 'نظام تصميم جاهز للتنفيذ',
    systemBody: 'مبني على بطاقات وأزرار ووسوم وجداول وأشرطة تقدم وأقسام قابلة لإعادة الاستخدام.',
    footer: 'مبني لتجارب توظيف رقمية عالية الثقة.',
  },
} as const;

export function HomePage() {
  const { isAuthenticated, uiLocale } = useAppContext();
  const t = copy[uiLocale];

  return (
    <div className="landing-shell">
      <section className="landing-hero">
        <div className="landing-copy">
          <span className="eyebrow">{t.heroEyebrow}</span>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroBody}</p>
          <div className="button-row">
            <Link className="button button-primary" to={isAuthenticated ? '/job-seeker/dashboard' : '/auth'}>
              {t.primary}
            </Link>
            <Link className="button button-secondary" to={isAuthenticated ? '/job-seeker/dashboard/analysis' : '/auth'}>
              {t.secondary}
            </Link>
          </div>
          <div className="hero-metrics">
            {t.metrics.map((metric) => (
              <div className="hero-metric" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-preview surface-card">
          <div className="preview-window">
            <div className="preview-window-top">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-layout">
              <aside>
                <div className="preview-nav-pill active" />
                <div className="preview-nav-pill" />
                <div className="preview-nav-pill" />
              </aside>
              <div className="preview-main">
                <div className="preview-kpis">
                  <article>
                    <small>CV Score</small>
                    <strong>88</strong>
                  </article>
                  <article>
                    <small>Applications</small>
                    <strong>24</strong>
                  </article>
                </div>
                <div className="preview-panel-card accent">
                  <small>AI Insight</small>
                  <p>{uiLocale === 'en' ? 'Add quantified outcomes to increase public-sector match quality.' : 'أضف نتائج قابلة للقياس لرفع جودة التطابق مع الجهات الحكومية.'}</p>
                </div>
                <div className="preview-table">
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="features">
        <div className="section-intro">
          <span className="eyebrow">{uiLocale === 'en' ? 'Pages' : 'الصفحات'}</span>
          <h2>{t.featuresTitle}</h2>
          <p>{t.featuresBody}</p>
        </div>
        <div className="feature-grid">
          {t.features.map((feature) => (
            <article className="surface-card feature-card" key={feature.title}>
              <span className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section" id="platform">
        <div className="platform-grid">
          <article className="surface-card platform-card">
            <span className="eyebrow">{uiLocale === 'en' ? 'Dashboard' : 'لوحة التحكم'}</span>
            <h3>{uiLocale === 'en' ? 'Dashboard-first information architecture' : 'معمارية معلومات تبدأ من لوحة التحكم'}</h3>
            <p>{uiLocale === 'en' ? 'Collapsible sidebar, clear top navigation, status cards, and modular content blocks.' : 'شريط جانبي قابل للطي وملاحة علوية واضحة وبطاقات حالة ووحدات محتوى قابلة للتوسع.'}</p>
          </article>
          <article className="surface-card platform-card">
            <span className="eyebrow">{uiLocale === 'en' ? 'Analysis' : 'التحليل'}</span>
            <h3>{uiLocale === 'en' ? 'Score-led diagnostics' : 'تشخيص يقوده التقييم'}</h3>
            <p>{uiLocale === 'en' ? 'Large ATS score, progress visualization, findings, and prioritized next steps.' : 'درجة ATS كبيرة مع مرئيات تقدم وملاحظات منظمة وخطوات تالية ذات أولوية.'}</p>
          </article>
          <article className="surface-card platform-card">
            <span className="eyebrow">{uiLocale === 'en' ? 'Recruiter' : 'المجند'}</span>
            <h3>{uiLocale === 'en' ? 'Structured hiring view' : 'واجهة توظيف منظمة'}</h3>
            <p>{uiLocale === 'en' ? 'Candidate table, filters, match tags, and card summaries for quick triage.' : 'جدول مرشحين ومرشحات ووسوم تطابق وملخصات بطاقات لفرز سريع.'}</p>
          </article>
        </div>
      </section>

      <section className="landing-section" id="system">
        <div className="cta-banner">
          <div>
            <span className="eyebrow">{uiLocale === 'en' ? 'System' : 'النظام'}</span>
            <h2>{t.systemTitle}</h2>
            <p>{t.systemBody}</p>
          </div>
          <div className="tag-row">
            <span className="tag">Cards</span>
            <span className="tag">Buttons</span>
            <span className="tag">Inputs</span>
            <span className="tag">Tables</span>
            <span className="tag">Tags</span>
            <span className="tag">Progress</span>
            <span className="tag">Modals</span>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <strong>SaudiCV</strong>
        <span>{t.footer}</span>
      </footer>
    </div>
  );
}
