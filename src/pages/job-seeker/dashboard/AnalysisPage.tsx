import { useMemo, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';

export function JobSeekerAnalysisPage() {
  const { analyses, handleResumeUpload, latestAnalysis, latestResume, resumes, uiLocale, uploadLoading } = useAppContext();
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(latestAnalysis?.id ?? null);

  const selectedAnalysis = useMemo(
    () => analyses.find((item) => item.id === selectedAnalysisId) ?? latestAnalysis ?? null,
    [analyses, latestAnalysis, selectedAnalysisId],
  );
  const selectedResume = resumes.find((resume) => resume.id === selectedAnalysis?.resume_id) ?? latestResume ?? null;

  const t =
    uiLocale === 'en'
      ? {
          eyebrow: 'Resume analysis',
          title: 'Measure ATS fit, clarity, and recruiter readability in one screen.',
          subtitle: 'The layout is designed as a modern SaaS diagnostics page with a primary score, structured findings, and fast follow-up actions.',
          upload: 'Drop resume here or browse',
          helper: 'PDF or DOCX, optimized for fast scoring and AI review.',
          score: 'ATS score',
          strengths: 'Strengths',
          weaknesses: 'Weaknesses',
          suggestions: 'Suggestions',
          improvement: 'Improvement progress',
          empty: 'Upload a resume to generate your first structured analysis.',
        }
      : {
          eyebrow: 'تحليل السيرة',
          title: 'قِس ملاءمة ATS ووضوح المحتوى وقابلية القراءة للمجند في شاشة واحدة.',
          subtitle: 'الصفحة مصممة كواجهة تشخيص SaaS حديثة تتضمن الدرجة الرئيسية والملاحظات المنظمة وخطوات المتابعة السريعة.',
          upload: 'اسحب السيرة هنا أو اختر ملفا',
          helper: 'PDF أو DOCX مع تهيئة سريعة للتقييم والمراجعة الذكية.',
          score: 'درجة ATS',
          strengths: 'نقاط القوة',
          weaknesses: 'نقاط الضعف',
          suggestions: 'اقتراحات التحسين',
          improvement: 'تقدم التحسين',
          empty: 'ارفع سيرة ذاتية لإنشاء أول تحليل منظم.',
        };

  const weaknessItems = selectedAnalysis?.improvements ?? [];
  const suggestionItems = selectedAnalysis?.insights.map((item) => `${item.title}: ${item.detail}`) ?? [];
  const progress = Math.min(100, Math.max(28, selectedAnalysis?.score ?? 42));

  return (
    <div className="page-stack">
      <section className="analysis-hero">
        <div className="surface-card upload-panel">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <label className="dropzone">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              disabled={uploadLoading}
              onChange={(event) => void handleResumeUpload(event)}
            />
            <strong>{uploadLoading ? (uiLocale === 'en' ? 'Analyzing...' : 'جار التحليل...') : t.upload}</strong>
            <span>{selectedResume?.file_name ?? t.helper}</span>
          </label>
        </div>

        <div className="surface-card score-spotlight">
          <span className="card-label">{t.score}</span>
          <div className="score-orb">
            <strong>{selectedAnalysis?.score ?? '--'}</strong>
            <span>/100</span>
          </div>
          <div className="progress-meta">
            <div className="progress-row">
              <span>{t.improvement}</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="tag-row">
            <span className="tag">{selectedResume?.file_name ?? 'Resume'}</span>
            <span className="tag muted">{selectedAnalysis?.analysis_source ?? 'AI Engine'}</span>
          </div>
        </div>
      </section>

      {analyses.length > 0 ? (
        <>
          <section className="surface-card">
            <div className="section-intro">
              <h2>{uiLocale === 'en' ? 'Saved analyses' : 'التحليلات المحفوظة'}</h2>
              <p>{uiLocale === 'en' ? 'Switch between previous resume scans without losing context.' : 'تنقل بين التحليلات السابقة دون فقدان السياق.'}</p>
            </div>
            <div className="analysis-switcher">
              {analyses.map((analysis) => (
                <button
                  key={analysis.id}
                  className={analysis.id === selectedAnalysis?.id ? 'analysis-chip active' : 'analysis-chip'}
                  onClick={() => setSelectedAnalysisId(analysis.id)}
                  type="button"
                >
                  <strong>{analysis.score}</strong>
                  <span>{resumes.find((resume) => resume.id === analysis.resume_id)?.file_name ?? 'Resume'}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="insights-grid-three">
            <article className="surface-card">
              <div className="section-intro">
                <h2>{t.strengths}</h2>
                <p>{uiLocale === 'en' ? 'Signals the system considers healthy and recruiter-friendly.' : 'إشارات يعتبرها النظام قوية وسهلة القراءة للمجند.'}</p>
              </div>
              <div className="bullet-stack">
                {(selectedAnalysis?.strengths ?? []).map((item) => (
                  <div className="bullet-row positive" key={item}>
                    <span className="bullet-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface-card">
              <div className="section-intro">
                <h2>{t.weaknesses}</h2>
                <p>{uiLocale === 'en' ? 'Structural gaps reducing match confidence or clarity.' : 'فجوات هيكلية تقلل الثقة أو الوضوح.'}</p>
              </div>
              <div className="bullet-stack">
                {weaknessItems.map((item) => (
                  <div className="bullet-row warning" key={item}>
                    <span className="bullet-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface-card">
              <div className="section-intro">
                <h2>{t.suggestions}</h2>
                <p>{uiLocale === 'en' ? 'Actionable refinements designed for the next version.' : 'تحسينات قابلة للتنفيذ للنسخة القادمة.'}</p>
              </div>
              <div className="bullet-stack">
                {suggestionItems.map((item) => (
                  <div className="bullet-row neutral" key={item}>
                    <span className="bullet-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      ) : (
        <section className="surface-card empty-state">
          <h2>{t.empty}</h2>
          <p>{t.helper}</p>
        </section>
      )}
    </div>
  );
}
