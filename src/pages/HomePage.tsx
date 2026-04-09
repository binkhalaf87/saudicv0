import { Link } from 'react-router-dom';

const features = [
  {
    title: 'تحليل ذكي للسيرة الذاتية',
    description: 'احصل على قراءة سريعة وواضحة لنقاط القوة والفرص التحسينية داخل السيرة الذاتية.',
  },
  {
    title: 'إدارة نسخ متعددة',
    description: 'ارفع أكثر من نسخة واحتفظ بكل تحليل داخل حسابك لتجربة صيغ مختلفة لكل وظيفة.',
  },
  {
    title: 'لوحة تحكم واضحة',
    description: 'تابع سيرك الذاتية، حالتها، وتحليلاتها السابقة من مساحة عمل واحدة مرتبة.',
  },
  {
    title: 'تجربة جاهزة للتوسع',
    description: 'الأساس الحالي مناسب لإضافة مطابقة الوظائف، التوصيات، والاشتراكات مستقبلاً.',
  },
];

const steps = [
  {
    title: 'أنشئ حسابك',
    description: 'ابدأ بحساب بسيط وملف شخصي يوضح المسمى المستهدف، المدينة، والخبرة.',
  },
  {
    title: 'ارفع سيرتك الذاتية',
    description: 'ادعم ملفات PDF و DOCX ثم ابدأ إدارة النسخ المختلفة من مكان واحد.',
  },
  {
    title: 'راجع التحليل',
    description: 'شاهد الدرجة، الملخص، نقاط القوة، وفرص التحسين بشكل منظم وسهل القراءة.',
  },
];

const plans = [
  {
    name: 'Starter',
    price: 'مجاني',
    description: 'للتجربة الأولى وإدارة السيرة الذاتية الأساسية.',
    items: ['رفع سيرة ذاتية', 'تحليل أساسي', 'لوحة تحكم شخصية'],
  },
  {
    name: 'Pro',
    price: 'قريبًا',
    description: 'للباحثين عن عمل الذين يريدون تحسينات أعمق وتجارب أكثر.',
    items: ['تحليلات متعددة', 'مقارنة بين النسخ', 'توصيات مخصصة'],
  },
];

export function HomePage() {
  return (
    <div className="card-stack">
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-badge-row">
            <span className="hero-badge">Navbar</span>
            <span className="hero-badge">Hero</span>
            <span className="hero-badge">Pricing</span>
          </div>
          <span className="eyebrow">منصة SaaS بسيطة للباحثين عن عمل</span>
          <h1>حلل سيرتك الذاتية، نظّم نسخك، وادخل مقابلاتك القادمة بثقة أكبر.</h1>
          <p>
            SaudiCV تساعد الباحث عن عمل على رفع السيرة الذاتية، تحليلها، والرجوع إلى النتائج من لوحة تحكم
            نظيفة وواضحة بدون تعقيد.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/auth">
              ابدأ الآن
            </Link>
            <Link className="text-link" to="/job-seeker/dashboard">
              الدخول إلى المنصة
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>Navbar</strong>
              <span>تنقل واضح وسريع بين أقسام المنتج</span>
            </div>
            <div>
              <strong>AI</strong>
              <span>تحليل مبني على محتوى السيرة نفسها</span>
            </div>
            <div>
              <strong>SaaS</strong>
              <span>واجهة مرتبة، خفيفة، وسهلة الاستخدام</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="saas-window">
            <div className="saas-window-top">
              <div className="window-dots">
                <span />
                <span />
                <span />
              </div>
              <p>SaudiCV Platform</p>
            </div>
            <div className="saas-window-body">
              <div className="saas-window-sidebar">
                <strong>Menu</strong>
                <span>Overview</span>
                <span>Resumes</span>
                <span>Analysis</span>
                <span>Profile</span>
              </div>
              <div className="saas-window-content">
                <div className="saas-window-summary">
                  <div>
                    <small>آخر تحليل</small>
                    <strong>84 / 100</strong>
                  </div>
                  <div>
                    <small>السير المرفوعة</small>
                    <strong>4</strong>
                  </div>
                </div>
                <div className="saas-window-grid">
                  <article>
                    <small>ملخص سريع</small>
                    <p>السيرة جيدة، لكنها تحتاج إبراز إنجازات أوضح وأكثر قابلية للقياس.</p>
                  </article>
                  <article>
                    <small>إدارة الملفات</small>
                    <p>تابع النسخ المختلفة من السيرة الذاتية وتحليلاتها في مكان واحد.</p>
                  </article>
                  <article className="accent">
                    <small>إجراء مقترح</small>
                    <p>أضف نتائج رقمية في الخبرات الأخيرة لرفع جودة السيرة بشكل فوري.</p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-grid">
        <div className="section-heading">
          <span className="eyebrow">Features</span>
          <h2>كل ما يحتاجه الباحث عن عمل داخل واجهة واحدة بسيطة.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="journey">
        <div className="section-heading">
          <span className="eyebrow">How It Works</span>
          <h2>رحلة مختصرة من التسجيل حتى قراءة التحليل النهائي.</h2>
        </div>
        <div className="journey-steps">
          {steps.map((step, index) => (
            <div className="step-card" key={step.title}>
              <span>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-grid">
        <div className="section-heading">
          <span className="eyebrow">Pricing</span>
          <h2>خطة بداية واضحة الآن، ومسار توسع جاهز لاحقًا.</h2>
        </div>
        <div className="feature-grid">
          {plans.map((plan) => (
            <article className="feature-card" key={plan.name}>
              <h3>{plan.name}</h3>
              <p>
                <strong>{plan.price}</strong>
              </p>
              <p>{plan.description}</p>
              <ul className="mini-list">
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="journey">
        <div className="section-heading">
          <span className="eyebrow">Footer</span>
          <h2>ابدأ رحلتك المهنية بواجهة هادئة، واضحة، ومصممة كمنصة SaaS حديثة.</h2>
          <p>
            SaudiCV تجمع التسجيل، رفع السيرة الذاتية، وإدارة التحليلات في تجربة موحدة وسهلة على الجوال
            وسطح المكتب.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="primary-button" to="/auth">
            إنشاء حساب
          </Link>
          <Link className="text-link" to="/job-seeker/dashboard">
            فتح لوحة التحكم
          </Link>
        </div>
      </section>
    </div>
  );
}
