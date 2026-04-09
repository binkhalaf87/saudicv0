import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';

export function JobSeekerAnalysisPage() {
  const { analyses, resumes, uploadLoading, analyzeResume, deleteAnalysis, getResumePreviewUrl } = useAppContext();
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedAnalysisId && analyses.length > 0) {
      setSelectedAnalysisId(analyses[0].id);
    }
  }, [analyses, selectedAnalysisId]);

  const selectedAnalysis = useMemo(
    () => analyses.find((item) => item.id === selectedAnalysisId) ?? analyses[0] ?? null,
    [analyses, selectedAnalysisId],
  );

  const selectedResume = useMemo(
    () => resumes.find((item) => item.id === (selectedAnalysis?.resume_id ?? '')) ?? null,
    [resumes, selectedAnalysis?.resume_id],
  );

  const unanalyzedResumes = useMemo(
    () => resumes.filter((resume) => !analyses.some((analysis) => analysis.resume_id === resume.id)),
    [analyses, resumes],
  );

  return (
    <div className="card-stack">
      <section className="analysis-page-hero">
        <div>
          <p className="eyebrow">مساحة التحليل</p>
          <h2>التحليلات السابقة والسير الذاتية غير المحللة في صفحة واحدة قابلة للإدارة.</h2>
          <p className="analysis-hero-copy">
            اختر أي تحليل سابق لعرضه، أو شغل التحليل مباشرة للسير التي لم تنتج نتيجة بعد.
          </p>
        </div>
        <div className="analysis-hero-metrics">
          <div>
            <strong>{analyses.length}</strong>
            <span>تحليل محفوظ</span>
          </div>
          <div>
            <strong>{unanalyzedResumes.length}</strong>
            <span>سيرة بدون تحليل</span>
          </div>
        </div>
      </section>

      <div className="analysis-board">
        <section className="analysis-column">
          <div className="section-title-row">
            <div>
              <h3>التحليلات السابقة</h3>
              <p>اختر أي تحليل محفوظ لعرض تفاصيله.</p>
            </div>
          </div>

          <div className="record-list">
            {analyses.length ? (
              analyses.map((analysis) => {
                const resume = resumes.find((item) => item.id === analysis.resume_id);

                return (
                  <div
                    key={analysis.id}
                    className={analysis.id === selectedAnalysis?.id ? 'record-row selected' : 'record-row'}
                  >
                    <div>
                      <strong>{resume?.file_name ?? 'سيرة ذاتية محذوفة'}</strong>
                      <p className="record-meta">
                        الدرجة: {analysis.score} | المصدر: {analysis.analysis_source}
                      </p>
                    </div>
                    <div className="record-actions">
                      <button
                        className="ghost-button small-button"
                        type="button"
                        onClick={() => {
                          setSelectedAnalysisId(analysis.id);
                          requestAnimationFrame(() => {
                            detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          });
                        }}
                      >
                        عرض التحليل
                      </button>
                      <button
                        className="ghost-button small-button danger-button"
                        type="button"
                        onClick={async () => {
                          const success = await deleteAnalysis(analysis.id);
                          if (success && selectedAnalysisId === analysis.id) {
                            setSelectedAnalysisId(null);
                          }
                        }}
                      >
                        حذف التحليل
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state-card">
                <h4>لا توجد تحليلات محفوظة بعد</h4>
                <p>ارفع سيرة ذاتية ثم شغل التحليل من نفس هذه الصفحة أو من صفحة السيرة الذاتية.</p>
              </div>
            )}
          </div>
        </section>

        <section className="analysis-column">
          <div className="section-title-row">
            <div>
              <h3>السير الذاتية غير المحللة</h3>
              <p>هذه الملفات مرفوعة لكن لا يوجد لها تحليل محفوظ حتى الآن.</p>
            </div>
          </div>

          <div className="record-list">
            {unanalyzedResumes.length ? (
              unanalyzedResumes.map((resume) => (
                <div key={resume.id} className="record-row">
                  <div>
                    <strong>{resume.file_name}</strong>
                    <p className="record-meta">الحالة: {resume.upload_status}</p>
                  </div>
                  <div className="record-actions">
                    <button
                      className="ghost-button small-button"
                      type="button"
                      onClick={async () => {
                        const url = await getResumePreviewUrl(resume.id);
                        if (url) {
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      معاينة الملف
                    </button>
                    <button
                      className="ghost-button small-button"
                      type="button"
                      disabled={uploadLoading || resume.upload_status === 'processing'}
                      onClick={async () => {
                        const success = await analyzeResume(resume.id);
                        if (success) {
                          requestAnimationFrame(() => {
                            detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          });
                        }
                      }}
                    >
                      {resume.upload_status === 'processing' ? 'جارٍ التحليل...' : 'تحليل الآن'}
                    </button>
                    <button
                      className="ghost-button small-button"
                      type="button"
                      onClick={() => navigate('/job-seeker/dashboard/resume')}
                    >
                      الذهاب للسير الذاتية
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state-card success">
                <h4>كل الملفات المرفوعة تمت معالجتها</h4>
                <p>لا توجد سيرة ذاتية معلقة بدون تحليل في الوقت الحالي.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="analysis-detail-card" ref={detailsRef}>
        {selectedAnalysis && selectedResume ? (
          <div className="card-stack">
            <div className="analysis-summary">
              <div className="score-panel">
                <strong>{selectedAnalysis.score}</strong>
                <span>درجة السيرة الذاتية</span>
              </div>
              <div>
                <h3>{selectedResume.file_name}</h3>
                <p>{selectedAnalysis.summary}</p>
                <p className="analysis-source">مصدر التحليل: {selectedAnalysis.analysis_source}</p>
              </div>
            </div>
            <div className="analysis-columns">
              <article className="info-card">
                <h4>نقاط القوة</h4>
                <ul className="mini-list">
                  {selectedAnalysis.strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="info-card">
                <h4>فرص التحسين</h4>
                <ul className="mini-list">
                  {selectedAnalysis.improvements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
            <div className="insight-grid">
              {selectedAnalysis.insights.map((insight) => (
                <article key={insight.title} className={`insight-card ${insight.tone}`}>
                  <h4>{insight.title}</h4>
                  <p>{insight.detail}</p>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state-card">
            <h4>اختر تحليلاً لعرض التفاصيل</h4>
            <p>من قائمة التحليلات السابقة في الأعلى، اضغط على زر عرض التحليل لأي سيرة تريد مراجعتها.</p>
          </div>
        )}
      </section>
    </div>
  );
}
