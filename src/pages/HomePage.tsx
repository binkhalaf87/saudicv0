import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">منصة SaaS للباحثين عن عمل</span>
          <div className="hero-badge-row">
            <span className="hero-badge">تحليل ذكي</span>
            <span className="hero-badge">لوحة تحكم حديثة</span>
            <span className="hero-badge">إدارة نسخ السيرة</span>
          </div>
          <h1>حوّل سيرتك الذاتية إلى أصل مهني قابل للقياس والتحسين.</h1>
          <p>
            SaudiCV تمنح الباحث عن عمل تجربة منتج حديثة: رفع السيرة، استخراج النص، تحليل ذكي، وإدارة
            جميع النسخ والتحليلات من مساحة عمل واحدة واضحة وأنيقة.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/auth">
              إنشاء حساب جديد
            </Link>
            <Link className="text-link" to="/job-seeker/dashboard">
              استكشف لوحة التحكم
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>3x</strong>
              <span>وضوح أكبر في دورة تحسين السيرة</span>
            </div>
            <div>
              <strong>AI</strong>
              <span>تحليل يعتمد على محتوى السيرة</span>
            </div>
            <div>
              <strong>Live</strong>
              <span>رفع وتحليل وإدارة من نفس الحساب</span>
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
              <p>Dashboard Preview</p>
            </div>
            <div className="saas-window-body">
              <div className="saas-window-sidebar">
                <strong>SaudiCV</strong>
                <span>Overview</span>
                <span>Resumes</span>
                <span>Analysis</span>
              </div>
              <div className="saas-window-content">
                <div className="saas-window-summary">
                  <div>
                    <small>آخر تحليل</small>
                    <strong>84/100</strong>
                  </div>
                  <div>
                    <small>نسخ محفوظة</small>
                    <strong>4</strong>
                  </div>
                </div>
                <div className="saas-window-grid">
                  <article>
                    <small>ملخص</small>
                    <p>السيرة قوية لكنها تحتاج إنجازات رقمية أوضح.</p>
                  </article>
                  <article>
                    <small>أفضلية</small>
                    <p>إدارة كل نسخة مع تحليلها من مكان واحد.</p>
                  </article>
                  <article className="accent">
                    <small>إجراء مقترح</small>
                    <p>أضف نتائج قابلة للقياس في الخبرات الأخيرة.</p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-grid">
        <div className="section-heading">
          <span className="eyebrow">مصمم كمنتج حقيقي</span>
          <h2>الواجهة لم تعد مجرد صفحات وظيفية، بل مساحة عمل SaaS حديثة تشبه أدوات الإنتاجية الاحترافية.</h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>رحلة واضحة</h3>
            <p>الصفحة الرئيسية تقود المستخدم بسرعة من القيمة إلى التسجيل ثم إلى مساحة العمل الداخلية.</p>
          </article>
          <article className="feature-card">
            <h3>لوحة تحكم مركزة</h3>
            <p>واجهة داخلية أنيقة تعطي شعور أداة SaaS حديثة بدل صفحات متفرقة أو ثقيلة بصريًا.</p>
          </article>
          <article className="feature-card">
            <h3>تحليل يمكن إدارته</h3>
            <p>كل سيرة لها تحليلها، مع عرض وحذف ومعاينة، وهذا يدعم تعدد النسخ والسيناريوهات المهنية.</p>
          </article>
          <article className="feature-card">
            <h3>قابل للتوسع</h3>
            <p>الأساس الحالي مناسب لإضافة مطابقة الوظائف، التوصيات الذكية، وخطط الاشتراك لاحقًا.</p>
          </article>
        </div>
      </section>

      <section className="journey">
        <div className="section-heading">
          <span className="eyebrow">لماذا هذا التصميم</span>
          <h2>المشهد البصري الحالي يركز على الثقة والسرعة والوضوح، وهي أهم سمات أي منصة SaaS ناجحة.</h2>
        </div>
        <div className="journey-steps">
          <div className="step-card">
            <span>1</span>
            <h3>واجهة نظيفة</h3>
            <p>مسافات مدروسة، بطاقات خفيفة، وتدرجات هادئة ترفع جودة الانطباع الأول.</p>
          </div>
          <div className="step-card">
            <span>2</span>
            <h3>تسلسل واضح</h3>
            <p>من الصفحة الرئيسية إلى المصادقة ثم لوحة التحكم بدون تشويش أو ازدحام بصري.</p>
          </div>
          <div className="step-card">
            <span>3</span>
            <h3>إحساس منتج</h3>
            <p>المظهر العام الآن أقرب لتطبيق SaaS حديث وليس مجرد واجهة تجريبية بسيطة.</p>
          </div>
        </div>
      </section>
    </>
  );
}
