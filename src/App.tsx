import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { generateResumeAnalysis } from './lib/analysis';
import { hasSupabaseCredentials, supabase } from './lib/supabase';
import { AnalysisRecord, Profile, ResumeRecord } from './types';

type DashboardTab = 'overview' | 'profile' | 'resume' | 'analysis';
type AuthMode = 'signin' | 'signup';

type ProfileDraft = {
  full_name: string;
  target_role: string;
  city: string;
  years_experience: string;
  skills: string;
};

const menu = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'profile', label: 'ملفي الشخصي' },
  { id: 'resume', label: 'السيرة الذاتية' },
  { id: 'analysis', label: 'نتائج التحليل' },
] satisfies { id: DashboardTab; label: string }[];

const emptyProfileDraft: ProfileDraft = {
  full_name: '',
  target_role: '',
  city: '',
  years_experience: '',
  skills: '',
};

function App() {
  const [started, setStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>(emptyProfileDraft);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [authForm, setAuthForm] = useState({
    full_name: '',
    email: '',
    password: '',
    target_role: '',
    city: '',
  });
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [message, setMessage] = useState('');

  const latestResume = resumes[0] ?? null;
  const latestAnalysis = analyses[0] ?? null;

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data, error }) => {
      if (!active) return;

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setSession(data.session);

      if (data.session?.user) {
        await bootstrapUser(data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (nextSession?.user) {
        void bootstrapUser(nextSession.user.id);
      } else {
        setProfile(null);
        setProfileDraft(emptyProfileDraft);
        setResumes([]);
        setAnalyses([]);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function bootstrapUser(userId: string) {
    if (!supabase) return;

    setLoading(true);
    setMessage('');

    const [profileResult, resumesResult, analysesResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('resumes').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('analyses').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);

    if (profileResult.error) {
      setMessage(profileResult.error.message);
    } else {
      const nextProfile = profileResult.data as Profile | null;
      setProfile(nextProfile);
      setProfileDraft(
        nextProfile
          ? {
              full_name: nextProfile.full_name,
              target_role: nextProfile.target_role,
              city: nextProfile.city,
              years_experience: nextProfile.years_experience?.toString() ?? '',
              skills: nextProfile.skills.join(', '),
            }
          : emptyProfileDraft,
      );
    }

    if (resumesResult.error) {
      setMessage(resumesResult.error.message);
    } else {
      setResumes((resumesResult.data as ResumeRecord[]) ?? []);
    }

    if (analysesResult.error) {
      setMessage(analysesResult.error.message);
    } else {
      setAnalyses(((analysesResult.data as AnalysisRecord[]) ?? []).map(normalizeAnalysis));
    }

    setLoading(false);
  }

  const profileCompletion = useMemo(() => {
    const values = [
      profile?.full_name,
      profile?.target_role,
      profile?.city,
      profile?.years_experience?.toString(),
      profile?.skills?.length ? 'skills' : '',
    ];

    return Math.round((values.filter(Boolean).length / values.length) * 100);
  }, [profile]);

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setAuthLoading(true);
    setMessage('');

    if (authMode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email: authForm.email,
        password: authForm.password,
        options: {
          data: {
            full_name: authForm.full_name,
            target_role: authForm.target_role,
            city: authForm.city,
            skills: [],
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('تم إنشاء الحساب. إذا كان تأكيد البريد مفعّلًا في Supabase فافتح بريدك أولًا ثم سجّل الدخول.');
        setAuthMode('signin');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setStarted(true);
        setMessage('تم تسجيل الدخول بنجاح.');
      }
    }

    setAuthLoading(false);
  }

  async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !session?.user) return;

    setSaveLoading(true);
    setMessage('');

    const payload = {
      id: session.user.id,
      email: session.user.email ?? profile?.email ?? '',
      full_name: profileDraft.full_name.trim(),
      target_role: profileDraft.target_role.trim(),
      city: profileDraft.city.trim(),
      years_experience: profileDraft.years_experience ? Number(profileDraft.years_experience) : null,
      skills: profileDraft.skills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const { data, error } = await supabase.from('profiles').upsert(payload).select().single();

    if (error) {
      setMessage(error.message);
    } else {
      const nextProfile = data as Profile;
      setProfile(nextProfile);
      setProfileDraft({
        full_name: nextProfile.full_name,
        target_role: nextProfile.target_role,
        city: nextProfile.city,
        years_experience: nextProfile.years_experience?.toString() ?? '',
        skills: nextProfile.skills.join(', '),
      });
      setMessage('تم حفظ الملف الشخصي.');
    }

    setSaveLoading(false);
  }

  async function handleResumeUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !supabase || !session?.user) {
      return;
    }

    setUploadLoading(true);
    setMessage('');

    const fileExt = file.name.split('.').pop() ?? 'pdf';
    const safeName = file.name.replace(/\s+/g, '-').toLowerCase();
    const normalizedName = safeName.endsWith(`.${fileExt}`) ? safeName : `${safeName}.${fileExt}`;
    const filePath = `${session.user.id}/${Date.now()}-${normalizedName}`;

    const uploadResult = await supabase.storage.from('resumes').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadResult.error) {
      setMessage(uploadResult.error.message);
      setUploadLoading(false);
      return;
    }

    const resumeInsert = await supabase
      .from('resumes')
      .insert({
        user_id: session.user.id,
        file_name: file.name,
        file_path: filePath,
        mime_type: file.type || null,
        file_size: file.size,
        upload_status: 'analyzed',
      })
      .select()
      .single();

    if (resumeInsert.error) {
      setMessage(resumeInsert.error.message);
      setUploadLoading(false);
      return;
    }

    const resumeRecord = resumeInsert.data as ResumeRecord;
    const generated = generateResumeAnalysis(file.name, file.size);

    const analysisInsert = await supabase
      .from('analyses')
      .insert({
        resume_id: resumeRecord.id,
        user_id: session.user.id,
        score: generated.score,
        summary: generated.summary,
        strengths: generated.strengths,
        improvements: generated.improvements,
        insights: generated.insights,
        analysis_source: 'metadata-rules',
      })
      .select()
      .single();

    if (analysisInsert.error) {
      setMessage(analysisInsert.error.message);
    } else {
      setResumes((current) => [resumeRecord, ...current]);
      setAnalyses((current) => [normalizeAnalysis(analysisInsert.data as AnalysisRecord), ...current]);
      setActiveTab('analysis');
      setMessage('تم رفع السيرة وحفظ نتيجة تحليل أولية في قاعدة البيانات.');
    }

    event.target.value = '';
    setUploadLoading(false);
  }

  async function handleSignOut() {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(error.message);
    } else {
      setStarted(false);
      setMessage('تم تسجيل الخروج.');
    }
  }

  const isAuthenticated = Boolean(session?.user);
  const shouldShowWorkspace = started || isAuthenticated;
  const currentUserEmail = session?.user.email ?? '';

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">SCV</span>
          <div>
            <strong>SaudiCV</strong>
            <p>منصة ذكية لتحليل السيرة الذاتية للباحثين عن عمل</p>
          </div>
        </div>
        <nav className="topbar-links">
          <a href="#features">المزايا</a>
          <a href="#journey">كيف تعمل</a>
          <a href="#dashboard">لوحة التحكم</a>
          {!isAuthenticated ? (
            <button className="ghost-button" onClick={() => setStarted(true)}>
              ابدأ الآن
            </button>
          ) : (
            <button className="ghost-button" onClick={handleSignOut}>
              تسجيل الخروج
            </button>
          )}
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">منصة انطلاق مهنية متكاملة</span>
            <h1>أنشئ حسابك، ارفع سيرتك الذاتية، واحصل على تحليل يساعدك على التقديم بثقة.</h1>
            <p>
              SaudiCV تجمع بين صفحة بداية تسويقية وتجربة داخلية حقيقية للباحث عن عمل: مصادقة، ملف شخصي،
              تخزين للسيرة الذاتية، وحفظ لنتائج التحليل داخل Supabase.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => setStarted(true)}>
                {isAuthenticated ? 'اذهب إلى لوحة التحكم' : 'إنشاء حساب جديد'}
              </button>
              <a className="text-link" href="#journey">
                شاهد رحلة الاستخدام
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <strong>Auth</strong>
                <span>تسجيل ودخول حقيقي عبر Supabase</span>
              </div>
              <div>
                <strong>Storage</strong>
                <span>رفع السيرة الذاتية إلى Storage</span>
              </div>
              <div>
                <strong>DB</strong>
                <span>حفظ الملفات والتحليل داخل قاعدة البيانات</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-card">
              <p className="panel-label">المرحلة الثانية</p>
              <h2>حالة المنصة الآن</h2>
              <ul className="mini-list">
                <li>تسجيل حساب ودخول عبر البريد وكلمة المرور</li>
                <li>ملف مستخدم محفوظ في جدول profiles</li>
                <li>جدول للسير الذاتية وجدول لنتائج التحليل</li>
                <li>رفع الملف إلى bucket باسم resumes</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section-grid" id="features">
          <div className="section-heading">
            <span className="eyebrow">ما تم تنفيذه</span>
            <h2>النسخة الحالية أصبحت جاهزة كأساس حقيقي للمنتج بدل العرض الثابت فقط.</h2>
          </div>
          <div className="feature-grid">
            <article className="feature-card">
              <h3>مصادقة حقيقية</h3>
              <p>تسجيل وإنشاء حساب، جلسة مستخدم، وتسجيل خروج مع مزامنة تلقائية للحالة داخل التطبيق.</p>
            </article>
            <article className="feature-card">
              <h3>ملف شخصي محفوظ</h3>
              <p>يمكن للمستخدم حفظ الاسم، المدينة، الوظيفة المستهدفة، سنوات الخبرة، والمهارات داخل قاعدة البيانات.</p>
            </article>
            <article className="feature-card">
              <h3>رفع وتخزين السيرة</h3>
              <p>الملف يُرفع إلى Supabase Storage ويُسجل في جدول resumes مع بياناته الأساسية.</p>
            </article>
            <article className="feature-card">
              <h3>تحليل محفوظ</h3>
              <p>بعد الرفع يتم إنشاء تحليل أولي تلقائيًا وحفظه في جدول analyses تمهيدًا للمرحلة الذكية التالية.</p>
            </article>
          </div>
        </section>

        <section className="journey" id="journey">
          <div className="section-heading">
            <span className="eyebrow">رحلة المستخدم</span>
            <h2>من التسجيل إلى رفع السيرة ثم مشاهدة آخر النتائج المخزنة داخل الحساب.</h2>
          </div>
          <div className="journey-steps">
            <div className="step-card">
              <span>1</span>
              <h3>إنشاء الحساب أو تسجيل الدخول</h3>
              <p>واجهة واحدة تدعم التسجيل والدخول وتجهز ملف المستخدم في الخلفية.</p>
            </div>
            <div className="step-card">
              <span>2</span>
              <h3>إكمال الملف الشخصي</h3>
              <p>حفظ البيانات المهنية الأساسية لاستخدامها لاحقًا في تخصيص التحليل والتوصيات.</p>
            </div>
            <div className="step-card">
              <span>3</span>
              <h3>رفع السيرة واستعراض التحليل</h3>
              <p>بعد الرفع يتم حفظ السجل وعرض أحدث نتيجة تحليلية داخل لوحة التحكم.</p>
            </div>
          </div>
        </section>

        <section className="dashboard-preview" id="dashboard">
          <div className="section-heading compact">
            <span className="eyebrow">المنصة</span>
            <h2>لوحة التحكم الآن مرتبطة ببنية Supabase الحقيقية.</h2>
            <p>أضف مفاتيح البيئة ثم طبّق ملف الـ SQL ليصبح التدفق كاملًا على مشروع Supabase.</p>
          </div>

          {message ? <div className="notice-card">{message}</div> : null}

          {!hasSupabaseCredentials ? (
            <div className="cta-strip">
              <div>
                <strong>مفاتيح Supabase غير مضافة بعد</strong>
                <p>أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env.local لتفعيل المصادقة والبيانات.</p>
              </div>
            </div>
          ) : loading ? (
            <div className="cta-strip">
              <div>
                <strong>جارٍ تحميل الجلسة والبيانات</strong>
                <p>يتم الآن فحص الجلسة الحالية وقراءة الملف الشخصي والسير الذاتية والتحليلات.</p>
              </div>
            </div>
          ) : !isAuthenticated ? (
            <div className="auth-layout">
              <div className="auth-card">
                <div className="auth-tabs">
                  <button
                    className={authMode === 'signup' ? 'menu-item active' : 'menu-item'}
                    onClick={() => setAuthMode('signup')}
                    type="button"
                  >
                    إنشاء حساب
                  </button>
                  <button
                    className={authMode === 'signin' ? 'menu-item active' : 'menu-item'}
                    onClick={() => setAuthMode('signin')}
                    type="button"
                  >
                    تسجيل الدخول
                  </button>
                </div>
                <form className="auth-form" onSubmit={handleAuthSubmit}>
                  {authMode === 'signup' ? (
                    <label>
                      <span>الاسم الكامل</span>
                      <input
                        required
                        value={authForm.full_name}
                        onChange={(event) => setAuthForm((current) => ({ ...current, full_name: event.target.value }))}
                      />
                    </label>
                  ) : null}
                  <label>
                    <span>البريد الإلكتروني</span>
                    <input
                      type="email"
                      required
                      value={authForm.email}
                      onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
                    />
                  </label>
                  <label>
                    <span>كلمة المرور</span>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={authForm.password}
                      onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                    />
                  </label>
                  {authMode === 'signup' ? (
                    <>
                      <label>
                        <span>الوظيفة المستهدفة</span>
                        <input
                          value={authForm.target_role}
                          onChange={(event) =>
                            setAuthForm((current) => ({ ...current, target_role: event.target.value }))
                          }
                        />
                      </label>
                      <label>
                        <span>المدينة</span>
                        <input
                          value={authForm.city}
                          onChange={(event) => setAuthForm((current) => ({ ...current, city: event.target.value }))}
                        />
                      </label>
                    </>
                  ) : null}
                  <button className="primary-button" type="submit" disabled={authLoading}>
                    {authLoading ? 'جارٍ التنفيذ...' : authMode === 'signup' ? 'إنشاء الحساب' : 'تسجيل الدخول'}
                  </button>
                </form>
              </div>
            </div>
          ) : shouldShowWorkspace ? (
            <div className="workspace">
              <aside className="sidebar">
                <div>
                  <p className="sidebar-label">حساب الباحث عن عمل</p>
                  <h3>{profile?.full_name || currentUserEmail}</h3>
                  <p>{profile?.target_role || 'أكمل ملفك المهني'}</p>
                </div>
                <div className="status-chip">
                  <span className="status-dot online" />
                  Supabase متصل والجلسة نشطة
                </div>
                <div className="sidebar-menu">
                  {menu.map((item) => (
                    <button
                      key={item.id}
                      className={item.id === activeTab ? 'menu-item active' : 'menu-item'}
                      onClick={() => setActiveTab(item.id)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </aside>

              <section className="dashboard-stage">
                {activeTab === 'overview' ? (
                  <div className="card-stack">
                    <div className="dashboard-hero">
                      <div>
                        <p className="eyebrow">مرحبًا {profile?.full_name || 'بك'}</p>
                        <h3>لوحة تحكم الباحث عن عمل</h3>
                        <p>البيانات المعروضة هنا قادمة من حسابك الفعلي في Supabase وليست مجرد بيانات ثابتة.</p>
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
                ) : null}

                {activeTab === 'profile' ? (
                  <div className="card-stack">
                    <form className="form-card" onSubmit={handleSaveProfile}>
                      <h3>الملف الشخصي</h3>
                      <div className="profile-grid">
                        <label>
                          <span>الاسم</span>
                          <input
                            value={profileDraft.full_name}
                            onChange={(event) =>
                              setProfileDraft((current) => ({ ...current, full_name: event.target.value }))
                            }
                          />
                        </label>
                        <label>
                          <span>المدينة</span>
                          <input
                            value={profileDraft.city}
                            onChange={(event) =>
                              setProfileDraft((current) => ({ ...current, city: event.target.value }))
                            }
                          />
                        </label>
                        <label>
                          <span>سنوات الخبرة</span>
                          <input
                            type="number"
                            min="0"
                            value={profileDraft.years_experience}
                            onChange={(event) =>
                              setProfileDraft((current) => ({
                                ...current,
                                years_experience: event.target.value,
                              }))
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
                            onChange={(event) =>
                              setProfileDraft((current) => ({ ...current, target_role: event.target.value }))
                            }
                          />
                        </label>
                        <label className="profile-grid-wide">
                          <span>المهارات</span>
                          <textarea
                            value={profileDraft.skills}
                            onChange={(event) =>
                              setProfileDraft((current) => ({ ...current, skills: event.target.value }))
                            }
                          />
                        </label>
                      </div>
                      <button className="primary-button" type="submit" disabled={saveLoading}>
                        {saveLoading ? 'جارٍ الحفظ...' : 'حفظ الملف الشخصي'}
                      </button>
                    </form>
                  </div>
                ) : null}

                {activeTab === 'resume' ? (
                  <div className="card-stack">
                    <div className="form-card">
                      <h3>رفع السيرة الذاتية</h3>
                      <p>يتم رفع الملف إلى Supabase Storage ثم إنشاء سجل في قاعدة البيانات مع تحليل أولي محفوظ.</p>
                      <label className="upload-box">
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} disabled={uploadLoading} />
                        <span>اختر ملف السيرة الذاتية</span>
                        <strong>{uploadLoading ? 'جارٍ رفع الملف...' : latestResume?.file_name ?? 'لا يوجد ملف مرفوع بعد'}</strong>
                      </label>
                    </div>
                    <div className="info-card">
                      <h4>السير الذاتية المرفوعة</h4>
                      <ul className="mini-list">
                        {resumes.length ? resumes.map((item) => <li key={item.id}>{item.file_name}</li>) : <li>لا توجد ملفات بعد.</li>}
                      </ul>
                    </div>
                  </div>
                ) : null}

                {activeTab === 'analysis' ? (
                  latestAnalysis ? (
                    <div className="card-stack">
                      <div className="analysis-summary">
                        <div className="score-panel">
                          <strong>{latestAnalysis.score}</strong>
                          <span>درجة السيرة الذاتية</span>
                        </div>
                        <div>
                          <h3>ملخص التحليل</h3>
                          <p>{latestAnalysis.summary}</p>
                        </div>
                      </div>
                      <div className="analysis-columns">
                        <article className="info-card">
                          <h4>نقاط القوة</h4>
                          <ul className="mini-list">
                            {latestAnalysis.strengths.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </article>
                        <article className="info-card">
                          <h4>فرص التحسين</h4>
                          <ul className="mini-list">
                            {latestAnalysis.improvements.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </article>
                      </div>
                      <div className="insight-grid">
                        {latestAnalysis.insights.map((insight) => (
                          <article key={insight.title} className={`insight-card ${insight.tone}`}>
                            <h4>{insight.title}</h4>
                            <p>{insight.detail}</p>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="info-card">
                      <h4>لا توجد نتائج تحليل بعد</h4>
                      <p>ارفع أول سيرة ذاتية من تبويب السيرة الذاتية لبدء إنشاء السجلات داخل قاعدة البيانات.</p>
                    </div>
                  )
                ) : null}
              </section>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function normalizeAnalysis(record: AnalysisRecord): AnalysisRecord {
  return {
    ...record,
    insights: Array.isArray(record.insights) ? record.insights : [],
  };
}

export default App;
