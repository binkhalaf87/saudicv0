import { useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';

export function AnalysisPage() {
  const { analyses, resumes, latestAnalysis, latestResume, deleteAnalysis } = useAppContext();
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  const selectedResume = useMemo(
    () => resumes.find((item) => item.id === (selectedResumeId ?? latestResume?.id)) ?? latestResume ?? null,
    [latestResume, resumes, selectedResumeId],
  );

  const selectedAnalysis = useMemo(
    () =>
      analyses.find((item) => item.resume_id === (selectedResume?.id ?? '')) ??
      (selectedResume?.id === latestResume?.id ? latestAnalysis : null),
    [analyses, latestAnalysis, latestResume?.id, selectedResume?.id],
  );

  if (selectedResume && selectedResume.upload_status === 'processing') {
    return (
      <div className="info-card">
        <h4>التحليل قيد المعالجة</h4>
        <p>تم رفع آخر سيرة ذاتية بنجاح ويجري الآن تحليل محتواها. حدّث الصفحة بعد لحظات.</p>
      </div>
    );
  }

  if (!selectedResume && !latestAnalysis) {
    return (
      <div className="info-card">
        <h4>لا توجد نتائج تحليل بعد</h4>
        <p>ارفع أول سيرة ذاتية من صفحة السيرة الذاتية لبدء إنشاء السجلات داخل قاعدة البيانات.</p>
      </div>
    );
  }

  if (selectedResume && selectedResume.upload_status === 'failed' && !selectedAnalysis) {
    return (
      <div className="card-stack">
        <div className="info-card">
          <h4>فشل تحليل هذه السيرة</h4>
          <p>الملف المحدد لم ينتج تحليلًا جديدًا. جرّب نسخة PDF أو DOCX تحتوي على نص قابل للاستخراج.</p>
        </div>
        <ResumeAnalysisList
          resumes={resumes}
          analyses={analyses}
          selectedResumeId={selectedResume.id}
          onSelect={setSelectedResumeId}
          onDeleteAnalysis={deleteAnalysis}
        />
      </div>
    );
  }

  if (!selectedAnalysis) {
    return (
      <div className="card-stack">
        <div className="info-card">
          <h4>لا يوجد تحليل لهذه السيرة بعد</h4>
          <p>اختر سيرة أخرى من القائمة أو ارفع نسخة جديدة لتحصل على تحليل.</p>
        </div>
        <ResumeAnalysisList
          resumes={resumes}
          analyses={analyses}
          selectedResumeId={selectedResume?.id ?? null}
          onSelect={setSelectedResumeId}
          onDeleteAnalysis={deleteAnalysis}
        />
      </div>
    );
  }

  return (
    <div className="card-stack">
      <ResumeAnalysisList
        resumes={resumes}
        analyses={analyses}
        selectedResumeId={selectedResume?.id ?? null}
        onSelect={setSelectedResumeId}
        onDeleteAnalysis={deleteAnalysis}
      />
      <div className="analysis-summary">
        <div className="score-panel">
          <strong>{selectedAnalysis.score}</strong>
          <span>درجة السيرة الذاتية</span>
        </div>
        <div>
          <h3>ملخص التحليل</h3>
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
  );
}

function ResumeAnalysisList({
  resumes,
  analyses,
  selectedResumeId,
  onSelect,
  onDeleteAnalysis,
}: {
  resumes: ReturnType<typeof useAppContext>['resumes'];
  analyses: ReturnType<typeof useAppContext>['analyses'];
  selectedResumeId: string | null;
  onSelect: (resumeId: string) => void;
  onDeleteAnalysis: (analysisId: string) => Promise<boolean>;
}) {
  return (
    <div className="info-card">
      <h4>السير الذاتية وتحليلاتها</h4>
      <div className="record-list">
        {resumes.length ? (
          resumes.map((resume) => {
            const analysis = analyses.find((item) => item.resume_id === resume.id);

            return (
              <div key={resume.id} className={resume.id === selectedResumeId ? 'record-row selected' : 'record-row'}>
                <div>
                  <strong>{resume.file_name}</strong>
                  <p className="record-meta">
                    الحالة: {resume.upload_status}
                    {analysis ? ` | الدرجة: ${analysis.score}` : ' | لا يوجد تحليل محفوظ'}
                  </p>
                </div>
                <div className="record-actions">
                  <button className="ghost-button small-button" type="button" onClick={() => onSelect(resume.id)}>
                    عرض التحليل
                  </button>
                  {analysis ? (
                    <button
                      className="ghost-button small-button danger-button"
                      type="button"
                      onClick={() => void onDeleteAnalysis(analysis.id)}
                    >
                      حذف التحليل
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <p>لا توجد سير ذاتية بعد.</p>
        )}
      </div>
    </div>
  );
}
