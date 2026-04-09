import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">منصة انطلاق مهنية متكاملة</span>
          <h1>أنشئ حسابك، ارفع سيرتك الذاتية، واحصل على تحليل يساعدك على التقديم بثقة.</h1>
          <p>
            SaudiCV الآن تستخدم تنقلًا حقيقيًا بين الصفحات: صفحة رئيسية، صفحة مصادقة مستقلة، ولوحة تحكم
            داخلية لكل قسم من أقسام الحساب.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/auth">
              إنشاء حساب جديد
            </Link>
            <Link className="text-link" to="/dashboard">
              اذهب إلى لوحة التحكم
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>/</strong>
              <span>مسارات منفصلة وواضحة</span>
            </div>
            <div>
              <strong>Auth</strong>
              <span>صفحة دخول مستقلة</span>
            </div>
            <div>
              <strong>Dash</strong>
              <span>أقسام داخلية بروابط حقيقية</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-card">
            <p className="panel-label">المسارات الحالية</p>
            <ul className="mini-list">
              <li>`/` الصفحة الرئيسية</li>
              <li>`/auth` تسجيل وإنشاء الحساب</li>
              <li>`/dashboard` نظرة عامة</li>
              <li>`/dashboard/profile` الملف الشخصي</li>
              <li>`/dashboard/resume` رفع السيرة</li>
              <li>`/dashboard/analysis` نتائج التحليل</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-grid">
        <div className="section-heading">
          <span className="eyebrow">ما الذي تغيّر</span>
          <h2>بدل التمرير داخل صفحة واحدة، أصبح لكل جزء من المنتج عنوان صفحة واضح ويمكن الوصول إليه مباشرة.</h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>صفحة رئيسية</h3>
            <p>تشرح قيمة المنصة وتوجه الزائر إلى التسجيل أو لوحة التحكم.</p>
          </article>
          <article className="feature-card">
            <h3>صفحة Auth</h3>
            <p>تضم تسجيل الدخول وإنشاء الحساب بدل مزجهما داخل الصفحة الرئيسية.</p>
          </article>
          <article className="feature-card">
            <h3>صفحات Dashboard</h3>
            <p>لكل قسم رابط خاص به، وهذا يجعل التجربة أوضح وأسهل في التوسع لاحقًا.</p>
          </article>
          <article className="feature-card">
            <h3>جاهز للتطوير</h3>
            <p>يسهّل هذا الأساس إضافة الحماية، المشاركة، وعناوين URL حقيقية في الإنتاج.</p>
          </article>
        </div>
      </section>
    </>
  );
}

