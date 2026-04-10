import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string, locale: 'en' | 'ar') {
  return new Date(iso).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const STATUS_LABELS = {
  en: {
    uploaded: 'Uploaded',
    processing: 'Processing',
    analyzed: 'Analyzed',
    failed: 'Failed',
  },
  ar: {
    uploaded: 'مرفوع',
    processing: 'قيد التحليل',
    analyzed: 'تم التحليل',
    failed: 'فشل',
  },
} as const;

export function FileManagerPage() {
  const {
    analyses,
    analyzeResume,
    deleteAnalysis,
    deleteResume,
    getResumePreviewUrl,
    handleResumeUpload,
    resumes,
    uiLocale,
    uploadLoading,
  } = useAppContext();

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'resume' | 'analysis'; id: string } | null>(null);

  // Map resume_id → analysis for quick lookup
  const analysisMap = new Map(analyses.map((a) => [a.resume_id, a]));

  const t =
    uiLocale === 'en'
      ? {
          eyebrow: 'File manager',
          title: 'All your resumes and analyses in one place.',
          subtitle: 'Upload, preview, re-analyze, or delete. Each file tracks its own ATS history.',
          upload: 'Upload resume',
          resumeSection: 'Resume files',
          resumeSubtitle: 'All uploaded resumes — PDF and DOCX supported.',
          analysisSection: 'Analysis history',
          analysisSubtitle: 'Every ATS scan stored and linked to its source file.',
          emptyResumes: 'No resumes uploaded yet.',
          emptyAnalyses: 'No analyses yet — upload a resume to generate one.',
          preview: 'Preview',
          analyze: 'Analyze',
          reanalyze: 'Re-analyze',
          delete: 'Delete',
          viewAnalysis: 'View analysis',
          confirmTitle: 'Are you sure?',
          confirmResume: 'This will permanently delete the resume and its analysis.',
          confirmAnalysis: 'This will permanently delete this analysis record.',
          confirmYes: 'Yes, delete',
          confirmNo: 'Cancel',
          score: 'ATS score',
          noScore: 'Not analyzed',
          strengths: 'strengths',
          improvements: 'improvements',
          status: STATUS_LABELS.en,
        }
      : {
          eyebrow: 'مدير الملفات',
          title: 'جميع سيرك الذاتية وتحليلاتك في مكان واحد.',
          subtitle: 'ارفع، استعرض، أعد التحليل، أو احذف. كل ملف يتتبع سجل ATS الخاص به.',
          upload: 'رفع سيرة ذاتية',
          resumeSection: 'ملفات السير الذاتية',
          resumeSubtitle: 'جميع السير المرفوعة — PDF و DOCX مدعومان.',
          analysisSection: 'سجل التحليلات',
          analysisSubtitle: 'كل فحص ATS محفوظ ومرتبط بملفه المصدر.',
          emptyResumes: 'لم يتم رفع أي سيرة بعد.',
          emptyAnalyses: 'لا توجد تحليلات بعد — ارفع سيرة لإنشاء أول تحليل.',
          preview: 'معاينة',
          analyze: 'تحليل',
          reanalyze: 'إعادة تحليل',
          delete: 'حذف',
          viewAnalysis: 'عرض التحليل',
          confirmTitle: 'هل أنت متأكد؟',
          confirmResume: 'سيتم حذف السيرة الذاتية وتحليلها نهائياً.',
          confirmAnalysis: 'سيتم حذف هذا التحليل نهائياً.',
          confirmYes: 'نعم، احذف',
          confirmNo: 'إلغاء',
          score: 'درجة ATS',
          noScore: 'لم يُحلَّل',
          strengths: 'نقاط قوة',
          improvements: 'تحسينات',
          status: STATUS_LABELS.ar,
        };

  async function handlePreview(resumeId: string) {
    setBusyId(resumeId);
    const url = await getResumePreviewUrl(resumeId);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    setBusyId(null);
  }

  async function handleAnalyze(resumeId: string) {
    setBusyId(resumeId);
    const success = await analyzeResume(resumeId);
    if (success) navigate('/job-seeker/dashboard/analysis');
    setBusyId(null);
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setBusyId(confirmDelete.id);
    setConfirmDelete(null);
    if (confirmDelete.type === 'resume') {
      await deleteResume(confirmDelete.id);
    } else {
      await deleteAnalysis(confirmDelete.id);
    }
    setBusyId(null);
  }

  const statusClass = (status: string) => {
    if (status === 'analyzed') return 'status-badge status-analyzed';
    if (status === 'processing') return 'status-badge status-processing';
    if (status === 'failed') return 'status-badge status-failed';
    return 'status-badge status-uploaded';
  };

  return (
    <div className="page-stack">
      {/* Header */}
      <section className="surface-card">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <div className="button-row" style={{ marginTop: 16 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            disabled={uploadLoading}
            onChange={async (event) => {
              const success = await handleResumeUpload(event);
              if (success) navigate('/job-seeker/dashboard/analysis');
            }}
          />
          <button
            className="button button-primary"
            disabled={uploadLoading}
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadLoading ? (uiLocale === 'en' ? 'Uploading...' : 'جار الرفع...') : t.upload}
          </button>
        </div>
      </section>

      {/* Resume files */}
      <section className="surface-card">
        <div className="section-intro">
          <h2>{t.resumeSection}</h2>
          <p>{t.resumeSubtitle}</p>
        </div>

        {resumes.length === 0 ? (
          <div className="empty-state-inline">
            <p>{t.emptyResumes}</p>
          </div>
        ) : (
          <div className="file-card-grid">
            {resumes.map((resume) => {
              const linkedAnalysis = analysisMap.get(resume.id);
              const isBusy = busyId === resume.id || uploadLoading;

              return (
                <article className="file-card" key={resume.id}>
                  <div className="file-card-top">
                    <div className="file-icon">
                      {resume.file_name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOC'}
                    </div>
                    <span className={statusClass(resume.upload_status)}>
                      {t.status[resume.upload_status as keyof typeof t.status] ?? resume.upload_status}
                    </span>
                  </div>

                  <div className="file-card-body">
                    <strong className="file-name">{resume.file_name}</strong>
                    <div className="file-meta-row">
                      <span>{resume.file_size != null ? formatBytes(resume.file_size) : '—'}</span>
                      <span>·</span>
                      <span>{formatDate(resume.created_at, uiLocale)}</span>
                    </div>
                  </div>

                  {linkedAnalysis ? (
                    <div className="file-score-strip">
                      <span>{t.score}</span>
                      <strong className="file-score-value">{linkedAnalysis.score}/100</strong>
                    </div>
                  ) : (
                    <div className="file-score-strip muted">
                      <span>{t.noScore}</span>
                    </div>
                  )}

                  <div className="file-card-actions">
                    <button
                      className="button button-ghost button-sm"
                      disabled={isBusy}
                      type="button"
                      onClick={() => void handlePreview(resume.id)}
                    >
                      {t.preview}
                    </button>
                    <button
                      className="button button-ghost button-sm"
                      disabled={isBusy}
                      type="button"
                      onClick={() => void handleAnalyze(resume.id)}
                    >
                      {linkedAnalysis ? t.reanalyze : t.analyze}
                    </button>
                    <button
                      className="button button-danger button-sm"
                      disabled={isBusy}
                      type="button"
                      onClick={() => setConfirmDelete({ type: 'resume', id: resume.id })}
                    >
                      {t.delete}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Analysis history */}
      <section className="surface-card">
        <div className="section-intro">
          <h2>{t.analysisSection}</h2>
          <p>{t.analysisSubtitle}</p>
        </div>

        {analyses.length === 0 ? (
          <div className="empty-state-inline">
            <p>{t.emptyAnalyses}</p>
          </div>
        ) : (
          <div className="analysis-history-list">
            {analyses.map((analysis) => {
              const linkedResume = resumes.find((r) => r.id === analysis.resume_id);
              const isBusy = busyId === analysis.id;

              return (
                <article className="analysis-history-row" key={analysis.id}>
                  <div className="analysis-history-score">
                    <strong>{analysis.score}</strong>
                    <span>/100</span>
                  </div>

                  <div className="analysis-history-meta">
                    <strong>{linkedResume?.file_name ?? 'Resume'}</strong>
                    <div className="file-meta-row">
                      <span>{formatDate(analysis.created_at, uiLocale)}</span>
                      <span>·</span>
                      <span>{analysis.strengths.length} {t.strengths}</span>
                      <span>·</span>
                      <span>{analysis.improvements.length} {t.improvements}</span>
                    </div>
                    <span className="tag muted" style={{ marginTop: 4, display: 'inline-block' }}>
                      {analysis.analysis_source}
                    </span>
                  </div>

                  <div className="analysis-history-actions">
                    <button
                      className="button button-ghost button-sm"
                      disabled={isBusy}
                      type="button"
                      onClick={() => navigate('/job-seeker/dashboard/analysis')}
                    >
                      {t.viewAnalysis}
                    </button>
                    <button
                      className="button button-danger button-sm"
                      disabled={isBusy}
                      type="button"
                      onClick={() => setConfirmDelete({ type: 'analysis', id: analysis.id })}
                    >
                      {t.delete}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{t.confirmTitle}</h3>
            <p>{confirmDelete.type === 'resume' ? t.confirmResume : t.confirmAnalysis}</p>
            <div className="button-row">
              <button className="button button-danger" type="button" onClick={() => void handleDelete()}>
                {t.confirmYes}
              </button>
              <button className="button button-ghost" type="button" onClick={() => setConfirmDelete(null)}>
                {t.confirmNo}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
