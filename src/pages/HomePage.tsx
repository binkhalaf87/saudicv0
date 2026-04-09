import { Link } from 'react-router-dom';

const features = [
  {
    title: 'تحليل السيرة الذاتية',
    description: 'تقييم واضح لنقاط القوة، مدى الجاهزية، وفرص التحسين داخل السيرة الذاتية.',
    badge: 'AI',
  },
  {
    title: 'إدارة النسخ',
    description: 'احتفظ بعدة نسخ من السيرة وراجع تحليل كل نسخة داخل حساب واحد.',
    badge: 'CV',
  },
  {
    title: 'لوحة تحكم عملية',
    description: 'واجهة مرتبة تساعدك على الوصول السريع إلى الملفات والتحليلات السابقة.',
    badge: 'SaaS',
  },
];

const steps = [
  {
    title: 'أنشئ حسابك',
    detail: 'أنشئ ملفك الشخصي وحدد المسمى المستهدف لتصبح التجربة أكثر تخصيصًا.',
  },
  {
    title: 'ارفع سيرتك الذاتية',
    detail: 'ارفع ملف PDF أو DOCX واحتفظ بالنسخ المختلفة داخل لوحة التحكم.',
  },
  {
    title: 'شاهد التحليل',
    detail: 'استعرض النتيجة، الملخص، والملاحظات العملية لتحسين سيرتك بشكل أسرع.',
  },
];

const pricing = [
  {
    name: 'Starter',
    price: 'مجاني',
    description: 'مناسب لتجربة المنصة والبدء بتحليل السيرة الذاتية.',
    points: ['رفع السيرة الذاتية', 'تحليل أساسي', 'لوحة تحكم شخصية'],
    accent: false,
  },
  {
    name: 'Pro',
    price: 'قريبًا',
    description: 'مخصص لمن يريد استخدامًا أوسع وتحليلات أكثر تقدمًا.',
    points: ['نسخ متعددة', 'إدارة تحليلات أكثر', 'أدوات تطوير مهني إضافية'],
    accent: true,
  },
];

export function HomePage() {
  return (
    <>
      <style>{`
        .home-shell {
          --home-bg: #f5f7fb;
          --home-surface: #ffffff;
          --home-border: #d9e2f1;
          --home-text: #11203b;
          --home-muted: #6c7a96;
          --home-primary: #0f6d73;
          --home-primary-soft: #dff4f2;
          --home-secondary: #f4a63a;
          --home-shadow: 0 24px 80px rgba(16, 38, 74, 0.08);
          background:
            radial-gradient(circle at top left, rgba(15, 109, 115, 0.1), transparent 28%),
            radial-gradient(circle at top right, rgba(244, 166, 58, 0.12), transparent 24%),
            var(--home-bg);
          border: 1px solid rgba(217, 226, 241, 0.7);
          border-radius: 32px;
          box-shadow: var(--home-shadow);
          color: var(--home-text);
          margin-top: 28px;
          overflow: hidden;
        }

        .home-topbar {
          align-items: center;
          border-bottom: 1px solid rgba(217, 226, 241, 0.7);
          display: flex;
          gap: 20px;
          justify-content: space-between;
          padding: 20px 28px;
        }

        .home-brand {
          align-items: center;
          display: flex;
          gap: 14px;
        }

        .home-brand-mark {
          align-items: center;
          background: linear-gradient(135deg, var(--home-primary), #1f8fa5);
          border-radius: 18px;
          color: #fff;
          display: inline-flex;
          font-size: 1rem;
          font-weight: 800;
          height: 48px;
          justify-content: center;
          width: 48px;
        }

        .home-brand-copy strong {
          display: block;
          font-size: 1.5rem;
          line-height: 1.1;
        }

        .home-brand-copy span {
          color: var(--home-muted);
          font-size: 0.95rem;
        }

        .home-nav {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .home-nav a {
          color: var(--home-text);
          font-size: 0.98rem;
          font-weight: 600;
          text-decoration: none;
        }

        .home-nav a:hover {
          color: var(--home-primary);
        }

        .home-nav-cta {
          background: #eff5fb;
          border: 1px solid var(--home-border);
          border-radius: 999px;
          padding: 10px 18px;
        }

        .home-content {
          display: grid;
          gap: 22px;
          grid-template-columns: minmax(0, 1.4fr) minmax(280px, 360px);
          padding: 28px;
        }

        .home-main {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .hero-panel-alt {
          background:
            radial-gradient(circle at top center, rgba(15, 109, 115, 0.12), transparent 32%),
            var(--home-surface);
          border: 1px solid var(--home-border);
          border-radius: 28px;
          display: grid;
          gap: 24px;
          grid-template-columns: minmax(0, 1.15fr) minmax(240px, 320px);
          padding: 28px;
        }

        .hero-copy-alt .eyebrow {
          color: var(--home-primary);
          font-size: 0.85rem;
          margin-bottom: 12px;
        }

        .hero-copy-alt h1 {
          font-size: clamp(2.3rem, 4vw, 4.2rem);
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0 0 16px;
        }

        .hero-copy-alt p {
          color: var(--home-muted);
          font-size: 1.05rem;
          line-height: 1.9;
          margin: 0;
          max-width: 62ch;
        }

        .hero-actions-alt {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 22px;
        }

        .hero-primary {
          align-items: center;
          background: linear-gradient(135deg, var(--home-primary), #1f8fa5);
          border-radius: 18px;
          color: #fff;
          display: inline-flex;
          font-weight: 700;
          justify-content: center;
          min-height: 52px;
          padding: 0 22px;
          text-decoration: none;
        }

        .hero-secondary {
          align-items: center;
          background: #fff7ea;
          border: 1px solid #f5d296;
          border-radius: 18px;
          color: #9c6510;
          display: inline-flex;
          font-weight: 700;
          justify-content: center;
          min-height: 52px;
          padding: 0 22px;
          text-decoration: none;
        }

        .hero-microstats {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 24px;
        }

        .hero-microstats article {
          background: #fbfdff;
          border: 1px solid var(--home-border);
          border-radius: 20px;
          padding: 16px;
        }

        .hero-microstats strong {
          display: block;
          font-size: 1.3rem;
          margin-bottom: 6px;
        }

        .hero-microstats span {
          color: var(--home-muted);
          font-size: 0.92rem;
          line-height: 1.6;
        }

        .home-side {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .side-card,
        .section-card {
          background: var(--home-surface);
          border: 1px solid var(--home-border);
          border-radius: 26px;
          box-shadow: 0 18px 50px rgba(16, 38, 74, 0.06);
          padding: 22px;
        }

        .journey-card {
          background: linear-gradient(135deg, #eef8f8, #ffffff);
        }

        .journey-card h3,
        .side-card h3,
        .section-card h3 {
          font-size: 1.2rem;
          margin: 0 0 10px;
        }

        .journey-card p,
        .side-card p,
        .section-card p {
          color: var(--home-muted);
          line-height: 1.8;
          margin: 0;
        }

        .journey-progress {
          align-items: center;
          display: flex;
          gap: 14px;
          justify-content: space-between;
          margin-top: 18px;
        }

        .journey-pill {
          background: #ffffff;
          border: 1px solid var(--home-border);
          border-radius: 999px;
          color: var(--home-primary);
          font-size: 0.86rem;
          font-weight: 700;
          padding: 8px 14px;
        }

        .journey-ring {
          align-items: center;
          background: conic-gradient(var(--home-primary) 0 68%, #e8eef7 68% 100%);
          border-radius: 999px;
          display: inline-flex;
          height: 68px;
          justify-content: center;
          width: 68px;
        }

        .journey-ring::after {
          align-items: center;
          background: #fff;
          border-radius: 999px;
          color: var(--home-primary);
          content: '68%';
          display: inline-flex;
          font-size: 0.8rem;
          font-weight: 800;
          height: 48px;
          justify-content: center;
          width: 48px;
        }

        .stack-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 18px;
        }

        .stack-item {
          align-items: center;
          background: #fcfdff;
          border: 1px solid var(--home-border);
          border-radius: 20px;
          display: flex;
          gap: 14px;
          justify-content: space-between;
          padding: 16px 18px;
        }

        .stack-item strong {
          display: block;
          font-size: 1rem;
          margin-bottom: 4px;
        }

        .stack-item span {
          color: var(--home-muted);
          font-size: 0.9rem;
        }

        .stack-badge {
          align-items: center;
          background: var(--home-primary-soft);
          border-radius: 14px;
          color: var(--home-primary);
          display: inline-flex;
          font-size: 0.8rem;
          font-weight: 800;
          justify-content: center;
          min-width: 52px;
          padding: 8px 10px;
        }

        .sections-grid {
          display: grid;
          gap: 22px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .section-head {
          align-items: center;
          display: flex;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
        }

        .section-head span {
          color: var(--home-primary);
          font-size: 0.84rem;
          font-weight: 700;
        }

        .feature-stack,
        .steps-stack,
        .pricing-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .feature-row,
        .step-row,
        .price-row {
          background: #fcfdff;
          border: 1px solid var(--home-border);
          border-radius: 22px;
          padding: 16px 18px;
        }

        .feature-row-top,
        .price-row-top {
          align-items: center;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }

        .feature-row h4,
        .step-row h4,
        .price-row h4 {
          font-size: 1.03rem;
          margin: 0;
        }

        .feature-row p,
        .step-row p,
        .price-row p {
          color: var(--home-muted);
          line-height: 1.75;
          margin: 0;
        }

        .feature-token {
          background: #fff4df;
          border-radius: 999px;
          color: #a9650d;
          font-size: 0.76rem;
          font-weight: 800;
          padding: 7px 12px;
        }

        .step-number {
          align-items: center;
          background: linear-gradient(135deg, var(--home-primary), #1f8fa5);
          border-radius: 14px;
          color: #fff;
          display: inline-flex;
          font-size: 0.9rem;
          font-weight: 800;
          height: 34px;
          justify-content: center;
          margin-bottom: 10px;
          width: 34px;
        }

        .price-row.accent {
          background: linear-gradient(135deg, #fff8eb, #ffffff);
          border-color: #f4d8ab;
        }

        .price-list {
          color: var(--home-muted);
          display: flex;
          flex-direction: column;
          gap: 8px;
          list-style: none;
          margin: 12px 0 0;
          padding: 0;
        }

        .price-list li::before {
          color: var(--home-primary);
          content: '•';
          margin-left: 8px;
        }

        .footer-panel {
          align-items: center;
          display: flex;
          gap: 16px;
          justify-content: space-between;
        }

        .footer-panel p {
          color: var(--home-muted);
          margin: 0;
          max-width: 54ch;
        }

        .footer-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        @media (max-width: 1100px) {
          .home-content,
          .hero-panel-alt,
          .sections-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .home-topbar,
          .footer-panel {
            align-items: flex-start;
            flex-direction: column;
          }

          .hero-microstats {
            grid-template-columns: 1fr;
          }

          .home-content {
            padding: 18px;
          }

          .hero-panel-alt,
          .side-card,
          .section-card {
            padding: 18px;
          }

          .home-nav {
            gap: 10px;
          }
        }
      `}</style>

      <div className="home-shell">
        <section className="home-topbar">
          <div className="home-brand">
            <span className="home-brand-mark">SCV</span>
            <div className="home-brand-copy">
              <strong>SaudiCV</strong>
              <span>منصة ذكية لتحليل السيرة الذاتية وتطويرها</span>
            </div>
          </div>

          <nav className="home-nav" aria-label="Home Sections">
            <a href="#features">المزايا</a>
            <a href="#how-it-works">كيف تعمل</a>
            <a href="#pricing">الأسعار</a>
            <Link className="home-nav-cta" to="/auth">
              ابدأ الآن
            </Link>
          </nav>
        </section>

        <div className="home-content">
          <div className="home-main">
            <section className="hero-panel-alt">
              <div className="hero-copy-alt">
                <span className="eyebrow">واجهة SaaS هادئة وحديثة</span>
                <h1>ابنِ سيرة أقوى، خطوة بخطوة، داخل منصة تبدو كمنتج حقيقي.</h1>
                <p>
                  صممنا الصفحة الرئيسية بروح قريبة من لوحات المنتجات الحديثة: بطاقات واضحة، مساحة مريحة، وتدفق
                  يركز على ما يحتاجه الباحث عن عمل فعلًا.
                </p>

                <div className="hero-actions-alt">
                  <Link className="hero-primary" to="/auth">
                    أنشئ حسابك
                  </Link>
                  <Link className="hero-secondary" to="/job-seeker/dashboard">
                    مشاهدة المنصة
                  </Link>
                </div>

                <div className="hero-microstats">
                  <article>
                    <strong>تحليل أوضح</strong>
                    <span>نتيجة منظمة ومباشرة تساعد المستخدم على معرفة مستوى سيرته بسرعة.</span>
                  </article>
                  <article>
                    <strong>نسخ متعددة</strong>
                    <span>إدارة أكثر من ملف سيرة ذاتية داخل حساب واحد مع تتبع التحليلات.</span>
                  </article>
                  <article>
                    <strong>واجهة مرنة</strong>
                    <span>مناسبة للتوسع لاحقًا نحو خدمات مهنية إضافية بدون إعادة بناء كاملة.</span>
                  </article>
                </div>
              </div>

              <aside className="home-side">
                <div className="side-card journey-card">
                  <h3>ابدأ رحلتك المهنية</h3>
                  <p>واجهة نظيفة توصل الزائر بسرعة إلى التسجيل ثم إلى لوحة العمل الداخلية.</p>
                  <div className="journey-progress">
                    <span className="journey-pill">جاهز للبدء</span>
                    <span className="journey-ring" aria-hidden="true" />
                  </div>
                </div>

                <div className="side-card">
                  <h3>لمحة سريعة</h3>
                  <div className="stack-list">
                    <div className="stack-item">
                      <div>
                        <strong>رفع السيرة الذاتية</strong>
                        <span>PDF أو DOCX مع دعم أفضل للملفات القديمة والممسوحة.</span>
                      </div>
                      <span className="stack-badge">CV</span>
                    </div>
                    <div className="stack-item">
                      <div>
                        <strong>تحليل ذكي</strong>
                        <span>عرض النتيجة، الملخص، وفرص التحسين داخل تجربة واحدة.</span>
                      </div>
                      <span className="stack-badge">AI</span>
                    </div>
                    <div className="stack-item">
                      <div>
                        <strong>لوحة تحكم</strong>
                        <span>إدارة الملفات والتحليلات السابقة داخل مساحة موحدة.</span>
                      </div>
                      <span className="stack-badge">UI</span>
                    </div>
                  </div>
                </div>
              </aside>
            </section>

            <div className="sections-grid">
              <section className="section-card" id="features">
                <div className="section-head">
                  <h3>Features</h3>
                  <span>مزايا أساسية</span>
                </div>
                <div className="feature-stack">
                  {features.map((feature) => (
                    <article className="feature-row" key={feature.title}>
                      <div className="feature-row-top">
                        <h4>{feature.title}</h4>
                        <span className="feature-token">{feature.badge}</span>
                      </div>
                      <p>{feature.description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="section-card" id="how-it-works">
                <div className="section-head">
                  <h3>How It Works</h3>
                  <span>3 خطوات</span>
                </div>
                <div className="steps-stack">
                  {steps.map((step, index) => (
                    <article className="step-row" key={step.title}>
                      <span className="step-number">{index + 1}</span>
                      <h4>{step.title}</h4>
                      <p>{step.detail}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="section-card" id="pricing">
                <div className="section-head">
                  <h3>Pricing</h3>
                  <span>مرن للتوسع</span>
                </div>
                <div className="pricing-stack">
                  {pricing.map((plan) => (
                    <article className={`price-row ${plan.accent ? 'accent' : ''}`} key={plan.name}>
                      <div className="price-row-top">
                        <h4>{plan.name}</h4>
                        <span className="feature-token">{plan.price}</span>
                      </div>
                      <p>{plan.description}</p>
                      <ul className="price-list">
                        {plan.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>

              <section className="section-card">
                <div className="footer-panel">
                  <div>
                    <div className="section-head" style={{ marginBottom: 8 }}>
                      <h3>Footer</h3>
                      <span>جاهز للتسجيل</span>
                    </div>
                    <p>
                      SaudiCV تقدم بداية نظيفة واحترافية لمنتج موجه للباحثين عن عمل، مع تصميم أقرب للمنصات
                      الحديثة وبلغة بصرية أكثر هدوءًا ووضوحًا.
                    </p>
                  </div>

                  <div className="footer-actions">
                    <Link className="hero-primary" to="/auth">
                      ابدأ الآن
                    </Link>
                    <Link className="hero-secondary" to="/job-seeker/dashboard">
                      الدخول للمنصة
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
