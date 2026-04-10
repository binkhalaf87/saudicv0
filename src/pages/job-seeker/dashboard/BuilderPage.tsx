import { useMemo, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';

type BuilderDraft = {
  fullName: string;
  role: string;
  summary: string;
  experience: string;
  skills: string;
};

export function JobSeekerBuilderPage() {
  const { profile, uiLocale } = useAppContext();
  const [draft, setDraft] = useState<BuilderDraft>({
    fullName: profile?.full_name ?? 'Maha Alotaibi',
    role: profile?.target_role ?? 'AI Product Designer',
    summary:
      uiLocale === 'en'
        ? 'Designing trusted digital experiences for high-stakes public and enterprise products.'
        : 'أصمم تجارب رقمية موثوقة للمنتجات الحكومية والمؤسسية عالية الأثر.',
    experience:
      uiLocale === 'en'
        ? 'Led redesigns for onboarding, analytics, and candidate lifecycle products across B2B SaaS teams.'
        : 'قدت إعادة تصميم تجارب الانضمام والتحليلات ودورة حياة المرشح ضمن منتجات SaaS.',
    skills: profile?.skills?.join(', ') || 'UX Strategy, Design Systems, Product Thinking, Figma',
  });

  const t =
    uiLocale === 'en'
      ? {
          eyebrow: 'Resume builder',
          title: 'Compose structured resume content with a live recruiter-ready preview.',
          subtitle: 'This split layout is designed for scalable future form modules, AI rewriting, and export workflows.',
          ai: 'Enhance with AI',
          preview: 'Live preview',
        }
      : {
          eyebrow: 'بناء السيرة',
          title: 'أنشئ محتوى السيرة بشكل منظم مع معاينة حية جاهزة للمجند.',
          subtitle: 'التخطيط الثنائي مصمم ليتوسع لاحقا مع نماذج إضافية وإعادة صياغة ذكية وتدفقات التصدير.',
          ai: 'حسن بالذكاء الاصطناعي',
          preview: 'المعاينة المباشرة',
        };

  const skillList = useMemo(() => draft.skills.split(',').map((item) => item.trim()).filter(Boolean), [draft.skills]);

  return (
    <div className="page-stack">
      <section className="surface-card">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="builder-grid">
        <form className="surface-card form-stack">
          <div className="field-grid">
            <label>
              <span>{uiLocale === 'en' ? 'Full name' : 'الاسم الكامل'}</span>
              <input value={draft.fullName} onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} />
            </label>
            <label>
              <span>{uiLocale === 'en' ? 'Target role' : 'الوظيفة المستهدفة'}</span>
              <input value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })} />
            </label>
          </div>

          <label>
            <span>{uiLocale === 'en' ? 'Professional summary' : 'الملخص المهني'}</span>
            <textarea value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} />
          </label>

          <label>
            <span>{uiLocale === 'en' ? 'Experience highlight' : 'أبرز الخبرات'}</span>
            <textarea value={draft.experience} onChange={(event) => setDraft({ ...draft, experience: event.target.value })} />
          </label>

          <label>
            <span>{uiLocale === 'en' ? 'Skills' : 'المهارات'}</span>
            <textarea value={draft.skills} onChange={(event) => setDraft({ ...draft, skills: event.target.value })} />
          </label>

          <div className="button-row">
            <button className="button button-primary" type="button">
              {t.ai}
            </button>
            <button className="button button-secondary" type="button">
              {uiLocale === 'en' ? 'Save draft' : 'حفظ المسودة'}
            </button>
          </div>
        </form>

        <article className="surface-card preview-panel">
          <div className="preview-head">
            <span className="eyebrow">{t.preview}</span>
            <span className="tag">{uiLocale === 'en' ? 'A4 friendly' : 'جاهز للطباعة'}</span>
          </div>
          <div className="resume-preview-sheet">
            <div className="resume-preview-header">
              <div>
                <h2>{draft.fullName}</h2>
                <p>{draft.role}</p>
              </div>
              <span className="resume-status">{uiLocale === 'en' ? 'AI optimized' : 'محسن بالذكاء'}</span>
            </div>
            <div className="resume-section">
              <h3>{uiLocale === 'en' ? 'Summary' : 'الملخص'}</h3>
              <p>{draft.summary}</p>
            </div>
            <div className="resume-section">
              <h3>{uiLocale === 'en' ? 'Experience' : 'الخبرات'}</h3>
              <p>{draft.experience}</p>
            </div>
            <div className="resume-section">
              <h3>{uiLocale === 'en' ? 'Skills' : 'المهارات'}</h3>
              <div className="tag-row">
                {skillList.map((skill) => (
                  <span className="tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
