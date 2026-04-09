import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';

// ─── Constants ───────────────────────────────────────────────────────────────

const VALID_EXTS = ['.pdf', '.docx', '.doc'];
const VALID_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function isValidFile(f: File) {
  const ext = '.' + (f.name.split('.').pop() ?? '').toLowerCase();
  return VALID_MIME.includes(f.type) || VALID_EXTS.includes(ext);
}

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1_048_576) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1_048_576).toFixed(1)} MB`;
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function scoreColor(n: number) {
  if (n >= 85) return '#0f6d73';
  if (n >= 70) return '#0369a1';
  if (n >= 50) return '#b45309';
  return '#dc2626';
}

function scoreBg(n: number) {
  if (n >= 85) return '#dff4f2';
  if (n >= 70) return '#e0f2fe';
  if (n >= 50) return '#fef3c7';
  return '#fee2e2';
}

function scoreVerdict(n: number): { label: string; sub: string } {
  if (n >= 85) return { label: 'ممتاز', sub: 'سيرتك جاهزة للتقديم' };
  if (n >= 70) return { label: 'جيد', sub: 'قابل للتحسين' };
  if (n >= 50) return { label: 'متوسط', sub: 'يحتاج تطوير إضافي' };
  return { label: 'يحتاج مراجعة', sub: 'نوصي بإعادة الهيكلة' };
}

// ─── SVG Score Ring ───────────────────────────────────────────────────────────

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 50;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(score, 100) / 100) * circ;
  return (
    <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden="true">
      <circle cx="66" cy="66" r={r} fill="none" stroke="#f1f5f9" strokeWidth="11" />
      <circle
        cx="66" cy="66" r={r}
        fill="none"
        stroke={color}
        strokeWidth="11"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 66 66)"
        style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)' }}
      />
    </svg>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IcUpload() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function IcFile() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

function IcX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function IcSparkles() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}

function IcCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function IcAlert() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function IcRefresh() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  );
}

function IcInfo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );
}

function IcBarChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}

function IcThumbUp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10v12"/>
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>
    </svg>
  );
}

function IcTarget() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );
}

function IcLightbulb() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
      <path d="M9 18h6"/><path d="M10 22h4"/>
    </svg>
  );
}

function IcArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="ar-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="ar-empty">
      <div className="ar-empty-icon">{icon}</div>
      <p className="ar-empty-title">{title}</p>
      <p className="ar-empty-sub">{sub}</p>
    </div>
  );
}

// ─── Bullet List ─────────────────────────────────────────────────────────────

function BulletList({ items, tone }: { items: string[]; tone: 'good' | 'warn' | 'neutral' }) {
  if (!items.length) {
    return <p className="ar-empty-sub" style={{ margin: 0 }}>لا توجد بيانات متاحة.</p>;
  }
  return (
    <ul className="ar-bullet-list">
      {items.map((item, i) => (
        <li key={i} className={`ar-bullet-item ar-bullet-${tone}`}>
          <span className="ar-bullet-dot">
            {tone === 'good' ? <IcCheck /> : tone === 'warn' ? <IcAlert /> : <IcInfo />}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function JobSeekerAnalysisPage() {
  const {
    analyses,
    resumes,
    uploadLoading,
    message,
    handleResumeUpload,
    analyzeResume,
    deleteAnalysis,
    getResumePreviewUrl,
  } = useAppContext();

  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-select latest analysis
  useEffect(() => {
    if (!activeAnalysisId && analyses.length > 0) {
      setActiveAnalysisId(analyses[0].id);
    }
  }, [analyses, activeAnalysisId]);

  const activeAnalysis = useMemo(
    () => analyses.find((a) => a.id === activeAnalysisId) ?? analyses[0] ?? null,
    [analyses, activeAnalysisId],
  );

  const activeResume = useMemo(
    () => resumes.find((r) => r.id === activeAnalysis?.resume_id) ?? null,
    [resumes, activeAnalysis],
  );

  const unanalyzed = useMemo(
    () => resumes.filter((r) => !analyses.some((a) => a.resume_id === r.id)),
    [resumes, analyses],
  );

  // Derived insights
  const goodInsights = activeAnalysis?.insights.filter((i) => i.tone === 'good') ?? [];
  const warnInsights = activeAnalysis?.insights.filter((i) => i.tone === 'warn') ?? [];
  const neutralInsights = activeAnalysis?.insights.filter((i) => i.tone === 'neutral') ?? [];

  const sColor = activeAnalysis ? scoreColor(activeAnalysis.score) : '#94a3b8';
  const sBg = activeAnalysis ? scoreBg(activeAnalysis.score) : '#f8fafc';
  const verdict = activeAnalysis ? scoreVerdict(activeAnalysis.score) : null;

  // ── File selection ──
  function selectFile(file: File) {
    if (!isValidFile(file)) {
      setFileError('الملف غير مدعوم. يرجى اختيار ملف PDF أو DOCX.');
      setPendingFile(null);
      return;
    }
    setFileError(null);
    setPendingFile(file);
  }

  function onDragOver(e: React.DragEvent) { e.preventDefault(); setIsDragOver(true); }
  function onDragLeave(e: React.DragEvent) { e.preventDefault(); setIsDragOver(false); }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) selectFile(f);
  }
  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) selectFile(f);
  }

  // ── Upload & analyze ──
  async function handleAnalyze() {
    if (!pendingFile || !fileInputRef.current || uploadLoading) return;
    try {
      const dt = new DataTransfer();
      dt.items.add(pendingFile);
      fileInputRef.current.files = dt.files;
      const mock = { target: fileInputRef.current } as ChangeEvent<HTMLInputElement>;
      const ok = await handleResumeUpload(mock);
      if (ok) {
        setPendingFile(null);
        requestAnimationFrame(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    } catch {
      setFileError('حدث خطأ غير متوقع. حاول مرة أخرى.');
    }
  }

  async function handleReanalyze(resumeId: string) {
    const ok = await analyzeResume(resumeId);
    if (ok) {
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  async function handleDelete(analysisId: string) {
    setDeletingId(analysisId);
    await deleteAnalysis(analysisId);
    if (activeAnalysisId === analysisId) setActiveAnalysisId(null);
    setDeletingId(null);
  }

  async function handlePreview(resumeId: string) {
    const url = await getResumePreviewUrl(resumeId);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        /* ── Keyframes ── */
        @keyframes ar-spin { to { transform: rotate(360deg); } }
        @keyframes ar-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ar-pulse-border {
          0%, 100% { border-color: rgba(15,109,115,0.4); }
          50%       { border-color: rgba(15,109,115,0.85); }
        }

        /* ── Shell ── */
        .ar-shell {
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: ar-fade-up 0.3s ease both;
        }

        /* ── Page Header ── */
        .ar-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .ar-header-eyebrow {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #0f6d73;
          background: #dff4f2;
          padding: 4px 10px;
          border-radius: 999px;
          display: inline-block;
          margin-bottom: 8px;
        }
        .ar-header-title {
          font-size: 1.55rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin: 0 0 5px;
          line-height: 1.2;
        }
        .ar-header-sub {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }
        .ar-header-stats {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: flex-start;
        }
        .ar-stat-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.85);
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 10px 18px;
          min-width: 80px;
          gap: 2px;
          box-shadow: 0 2px 8px rgba(15,23,42,0.04);
        }
        .ar-stat-pill strong {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .ar-stat-pill span {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 500;
        }

        /* ── Upload Block ── */
        .ar-upload-block {
          background: rgba(255,255,255,0.9);
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(15,23,42,0.04);
        }
        .ar-upload-zone {
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          text-align: center;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
          border-bottom: 1px dashed #e2e8f0;
          position: relative;
          min-height: 200px;
        }
        .ar-upload-zone:hover {
          background: rgba(15,109,115,0.03);
          border-bottom-color: rgba(15,109,115,0.3);
        }
        .ar-upload-zone.drag {
          background: rgba(15,109,115,0.06);
          border: 2px dashed transparent;
          animation: ar-pulse-border 1.4s ease infinite;
        }
        .ar-upload-zone.has-file {
          background: rgba(15,109,115,0.03);
          border-bottom-color: rgba(15,109,115,0.2);
        }
        .ar-upload-zone.loading {
          pointer-events: none;
          background: #fafbff;
        }
        .ar-upload-input { display: none; }
        .ar-upload-icon-wrap {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f6d73, #1f8fa5);
          color: #fff;
          box-shadow: 0 8px 24px rgba(15,109,115,0.28);
          transition: transform 0.18s;
        }
        .ar-upload-zone:hover .ar-upload-icon-wrap { transform: translateY(-2px); }
        .ar-upload-zone.drag .ar-upload-icon-wrap { transform: scale(1.08) translateY(-2px); }
        .ar-upload-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .ar-upload-sub {
          font-size: 0.88rem;
          color: #64748b;
          margin: 0;
        }
        .ar-upload-types {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }
        .ar-type-badge {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #0f6d73;
          background: #dff4f2;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .ar-upload-browse {
          font-size: 0.85rem;
          font-weight: 600;
          color: #0f6d73;
          text-decoration: underline;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }

        /* File preview strip */
        .ar-file-strip {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: rgba(255,255,255,0.6);
          animation: ar-fade-up 0.2s ease both;
        }
        .ar-file-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #dff4f2;
          color: #0f6d73;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ar-file-info { flex: 1; min-width: 0; }
        .ar-file-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ar-file-size { font-size: 0.78rem; color: #94a3b8; }
        .ar-file-clear {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .ar-file-clear:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

        /* File error */
        .ar-file-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #fff7f7;
          color: #dc2626;
          font-size: 0.85rem;
          font-weight: 500;
          border-top: 1px solid #fecaca;
          animation: ar-fade-up 0.2s ease both;
        }

        /* Loading overlay inside zone */
        .ar-loading-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 40px 32px;
          min-height: 200px;
          justify-content: center;
          border-bottom: 1px dashed #e2e8f0;
        }
        .ar-spinner {
          animation: ar-spin 0.9s linear infinite;
          color: #0f6d73;
        }
        .ar-loading-label {
          font-size: 0.92rem;
          font-weight: 600;
          color: #0f172a;
        }
        .ar-loading-msg {
          font-size: 0.82rem;
          color: #64748b;
          max-width: 42ch;
          text-align: center;
          line-height: 1.6;
        }

        /* Action bar (below upload block) */
        .ar-action-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 20px;
          background: #fafbff;
          flex-wrap: wrap;
        }
        .ar-action-hint {
          font-size: 0.82rem;
          color: #94a3b8;
        }
        .ar-action-btns { display: flex; gap: 10px; flex-wrap: wrap; }

        /* Buttons */
        .ar-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0f6d73, #1f8fa5);
          color: #fff;
          font-size: 0.9rem;
          font-weight: 700;
          padding: 11px 22px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: opacity 0.18s, transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 6px 18px rgba(15,109,115,0.3);
          text-decoration: none;
        }
        .ar-btn-primary:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(15,109,115,0.36); }
        .ar-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; transform: none; }

        .ar-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.85);
          color: #334155;
          font-size: 0.88rem;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          text-decoration: none;
        }
        .ar-btn-ghost:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
        .ar-btn-ghost:disabled { opacity: 0.45; cursor: not-allowed; }

        .ar-btn-danger {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          color: #dc2626;
          font-size: 0.84rem;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid #fecaca;
          cursor: pointer;
          transition: background 0.15s;
        }
        .ar-btn-danger:hover:not(:disabled) { background: #fee2e2; }
        .ar-btn-danger:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── History Tabs ── */
        .ar-history-section { }
        .ar-history-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 10px;
        }
        .ar-history-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ar-history-tab {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.88);
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 10px 16px;
          cursor: pointer;
          transition: all 0.18s;
          text-align: start;
          max-width: 260px;
        }
        .ar-history-tab:hover { border-color: #cbd5e1; background: #fff; }
        .ar-history-tab.active {
          background: linear-gradient(135deg, #f0fdfb, #fff);
          border-color: rgba(15,109,115,0.4);
          box-shadow: 0 4px 14px rgba(15,109,115,0.1);
        }
        .ar-history-tab-score {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 800;
          flex-shrink: 0;
        }
        .ar-history-tab-info { min-width: 0; }
        .ar-history-tab-name {
          font-size: 0.84rem;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }
        .ar-history-tab-date { font-size: 0.74rem; color: #94a3b8; }

        /* ── Results Section ── */
        .ar-results {
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: ar-fade-up 0.35s ease both;
        }

        /* Score Hero */
        .ar-score-hero {
          background: rgba(255,255,255,0.95);
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 32px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 28px;
          align-items: center;
          box-shadow: 0 4px 20px rgba(15,23,42,0.05);
        }
        .ar-score-ring-wrap {
          position: relative;
          width: 132px;
          height: 132px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ar-score-ring-wrap svg { position: absolute; top: 0; left: 0; }
        .ar-score-center {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .ar-score-number {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.05em;
          line-height: 1;
        }
        .ar-score-denom {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 600;
        }
        .ar-score-info { display: flex; flex-direction: column; gap: 12px; }
        .ar-score-top { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .ar-verdict-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 7px 14px;
          border-radius: 999px;
        }
        .ar-verdict-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .ar-verdict-sub {
          font-size: 0.84rem;
          color: #64748b;
        }
        .ar-score-summary {
          font-size: 0.92rem;
          color: #334155;
          line-height: 1.75;
          max-width: 72ch;
          margin: 0;
        }
        .ar-score-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 4px;
        }
        .ar-meta-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #94a3b8;
          font-weight: 500;
        }
        .ar-meta-chip-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #cbd5e1;
        }

        /* ── Quick Metrics Row ── */
        .ar-metrics-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .ar-metric-card {
          background: rgba(255,255,255,0.9);
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 18px 20px;
          box-shadow: 0 2px 10px rgba(15,23,42,0.04);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .ar-metric-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,0.07); }
        .ar-metric-label {
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 6px;
        }
        .ar-metric-value {
          font-size: 1.55rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 4px;
        }
        .ar-metric-sub { font-size: 0.78rem; color: #94a3b8; }

        /* ── Detail Grid ── */
        .ar-detail-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        /* ── Card ── */
        .ar-card {
          background: rgba(255,255,255,0.92);
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(15,23,42,0.04);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ar-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ar-card-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ar-card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .ar-card-count {
          margin-inline-start: auto;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #64748b;
        }

        /* ── Bullet List ── */
        .ar-bullet-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ar-bullet-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #334155;
        }
        .ar-bullet-dot {
          width: 22px;
          height: 22px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .ar-bullet-good .ar-bullet-dot { background: #dcfce7; color: #16a34a; }
        .ar-bullet-warn .ar-bullet-dot { background: #fef3c7; color: #b45309; }
        .ar-bullet-neutral .ar-bullet-dot { background: #f1f5f9; color: #64748b; }

        /* ── Insights Grid ── */
        .ar-insights-title {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 12px;
        }
        .ar-insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }
        .ar-insight-card {
          padding: 18px 20px;
          border-radius: 16px;
          border: 1px solid transparent;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .ar-insight-card:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(15,23,42,0.08); }
        .ar-insight-card.good  { background: #f0fdf4; border-color: #bbf7d0; }
        .ar-insight-card.warn  { background: #fffbeb; border-color: #fde68a; }
        .ar-insight-card.neutral { background: #f8fafc; border-color: #e2e8f0; }
        .ar-insight-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .ar-insight-icon {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .good .ar-insight-icon  { background: #dcfce7; color: #16a34a; }
        .warn .ar-insight-icon  { background: #fef3c7; color: #b45309; }
        .neutral .ar-insight-icon { background: #e2e8f0; color: #64748b; }
        .ar-insight-title-text {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .ar-insight-detail {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.65;
          margin: 0;
        }

        /* ── Unanalyzed Resumes ── */
        .ar-unanalyzed-card {
          background: rgba(255,255,255,0.88);
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 20px 24px;
          box-shadow: 0 4px 16px rgba(15,23,42,0.04);
        }
        .ar-unanalyzed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ar-unanalyzed-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ar-unanalyzed-badge {
          font-size: 0.72rem;
          font-weight: 700;
          background: #fef3c7;
          color: #b45309;
          padding: 3px 9px;
          border-radius: 999px;
        }
        .ar-unanalyzed-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ar-unanalyzed-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          background: #fafbff;
          border: 1px solid #f1f5f9;
          border-radius: 14px;
          flex-wrap: wrap;
        }
        .ar-unanalyzed-file {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ar-unanalyzed-file-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: #fef3c7;
          color: #b45309;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ar-unanalyzed-file-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #0f172a;
        }
        .ar-unanalyzed-actions { display: flex; gap: 8px; }

        /* ── Next Steps CTA ── */
        .ar-next-steps {
          background: linear-gradient(145deg, #0f6d73, #1f8fa5);
          border-radius: 22px;
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
        }
        .ar-next-steps::before {
          content: '';
          position: absolute;
          top: -40%;
          left: -8%;
          width: 40%;
          height: 160%;
          background: radial-gradient(circle, rgba(255,255,255,0.1), transparent 60%);
          pointer-events: none;
        }
        .ar-next-steps-copy { position: relative; z-index: 1; }
        .ar-next-steps-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          margin-bottom: 6px;
        }
        .ar-next-steps-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 4px;
        }
        .ar-next-steps-sub {
          font-size: 0.86rem;
          color: rgba(255,255,255,0.72);
          margin: 0;
        }
        .ar-next-steps-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
        .ar-btn-white {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #fff;
          color: #0f6d73;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
          text-decoration: none;
        }
        .ar-btn-white:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(0,0,0,0.16); }
        .ar-btn-white-ghost {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          color: rgba(255,255,255,0.88);
          font-size: 0.88rem;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.3);
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          text-decoration: none;
        }
        .ar-btn-white-ghost:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.55); }

        /* ── Empty State ── */
        .ar-empty {
          text-align: center;
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .ar-empty-icon {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          background: #f1f5f9;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .ar-empty-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .ar-empty-sub {
          font-size: 0.88rem;
          color: #94a3b8;
          line-height: 1.65;
          max-width: 40ch;
          margin: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .ar-score-hero { grid-template-columns: 1fr; text-align: center; }
          .ar-score-ring-wrap { margin: 0 auto; }
          .ar-score-top { justify-content: center; }
          .ar-score-meta { justify-content: center; }
          .ar-detail-grid { grid-template-columns: 1fr; }
          .ar-metrics-row { grid-template-columns: 1fr; }
          .ar-next-steps { flex-direction: column; }
          .ar-header { flex-direction: column; }
          .ar-header-stats { width: 100%; }
        }
        @media (max-width: 540px) {
          .ar-insights-grid { grid-template-columns: 1fr; }
          .ar-upload-zone { padding: 28px 20px; }
          .ar-action-bar { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="ar-shell">

        {/* ── Page Header ─────────────────────────────────────────────────────── */}
        <header className="ar-header">
          <div>
            <span className="ar-header-eyebrow">لوحة التحليل</span>
            <h1 className="ar-header-title">تحليل السيرة الذاتية</h1>
            <p className="ar-header-sub">ارفع ملفك واحصل على تقييم ATS شامل مع توصيات قابلة للتطبيق.</p>
          </div>
          <div className="ar-header-stats">
            <div className="ar-stat-pill">
              <strong>{analyses.length}</strong>
              <span>تحليل</span>
            </div>
            <div className="ar-stat-pill">
              <strong>{resumes.length}</strong>
              <span>سيرة</span>
            </div>
            {activeAnalysis && (
              <div className="ar-stat-pill">
                <strong style={{ color: scoreColor(activeAnalysis.score) }}>{activeAnalysis.score}</strong>
                <span>آخر درجة</span>
              </div>
            )}
          </div>
        </header>

        {/* ── Upload Block ─────────────────────────────────────────────────────── */}
        <div className="ar-upload-block">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="ar-upload-input"
            onChange={onInputChange}
            disabled={uploadLoading}
          />

          {uploadLoading ? (
            <div className="ar-loading-overlay">
              <Spinner />
              <p className="ar-loading-label">جارٍ رفع الملف وتحليله...</p>
              {message && <p className="ar-loading-msg">{message}</p>}
            </div>
          ) : (
            <div
              className={[
                'ar-upload-zone',
                isDragOver ? 'drag' : '',
                pendingFile ? 'has-file' : '',
              ].join(' ')}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => !pendingFile && fileInputRef.current?.click()}
            >
              <div className="ar-upload-icon-wrap">
                <IcUpload />
              </div>
              {isDragOver ? (
                <>
                  <p className="ar-upload-title">أفلت الملف هنا</p>
                  <p className="ar-upload-sub">سيتم بدء التحليل تلقائياً</p>
                </>
              ) : pendingFile ? (
                <>
                  <p className="ar-upload-title">الملف جاهز للتحليل</p>
                  <p className="ar-upload-sub">اضغط "تحليل الآن" للمتابعة</p>
                </>
              ) : (
                <>
                  <p className="ar-upload-title">اسحب سيرتك الذاتية هنا</p>
                  <p className="ar-upload-sub">
                    أو{' '}
                    <button
                      className="ar-upload-browse"
                      type="button"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      اختر ملفاً من جهازك
                    </button>
                  </p>
                  <div className="ar-upload-types">
                    <span className="ar-type-badge">PDF</span>
                    <span className="ar-type-badge">DOCX</span>
                    <span className="ar-type-badge">DOC</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* File strip */}
          {pendingFile && !uploadLoading && (
            <div className="ar-file-strip">
              <span className="ar-file-icon"><IcFile /></span>
              <div className="ar-file-info">
                <div className="ar-file-name">{pendingFile.name}</div>
                <div className="ar-file-size">{fmtBytes(pendingFile.size)}</div>
              </div>
              <button
                className="ar-file-clear"
                type="button"
                onClick={() => { setPendingFile(null); setFileError(null); }}
                title="إزالة الملف"
              >
                <IcX />
              </button>
            </div>
          )}

          {/* File error */}
          {fileError && (
            <div className="ar-file-error">
              <IcAlert />
              {fileError}
            </div>
          )}

          {/* Action bar */}
          <div className="ar-action-bar">
            <p className="ar-action-hint">
              {pendingFile
                ? `${pendingFile.name} · جاهز`
                : 'اختر ملف PDF أو DOCX للبدء'}
            </p>
            <div className="ar-action-btns">
              {pendingFile && (
                <button
                  className="ar-btn-ghost"
                  type="button"
                  disabled={uploadLoading}
                  onClick={() => { setPendingFile(null); setFileError(null); }}
                >
                  إلغاء
                </button>
              )}
              <button
                className="ar-btn-primary"
                type="button"
                disabled={!pendingFile || uploadLoading}
                onClick={() => void handleAnalyze()}
              >
                {uploadLoading ? <><Spinner /> جارٍ التحليل...</> : <><IcSparkles /> تحليل الآن</>}
              </button>
            </div>
          </div>
        </div>

        {/* ── Unanalyzed Resumes ───────────────────────────────────────────────── */}
        {unanalyzed.length > 0 && (
          <div className="ar-unanalyzed-card">
            <div className="ar-unanalyzed-header">
              <span className="ar-unanalyzed-title">
                سير بدون تحليل
                <span className="ar-unanalyzed-badge">{unanalyzed.length}</span>
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                هذه الملفات مرفوعة ولم تُحلَّل بعد
              </span>
            </div>
            <div className="ar-unanalyzed-list">
              {unanalyzed.map((r) => (
                <div key={r.id} className="ar-unanalyzed-row">
                  <div className="ar-unanalyzed-file">
                    <span className="ar-unanalyzed-file-icon"><IcFile /></span>
                    <div>
                      <div className="ar-unanalyzed-file-name">{r.file_name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                        {r.upload_status === 'failed' ? '⚠ فشل التحليل السابق' : 'لم يُحلَّل بعد'}
                      </div>
                    </div>
                  </div>
                  <div className="ar-unanalyzed-actions">
                    <button
                      className="ar-btn-ghost"
                      type="button"
                      style={{ fontSize: '0.82rem', padding: '7px 13px' }}
                      onClick={() => void handlePreview(r.id)}
                    >
                      معاينة
                    </button>
                    <button
                      className="ar-btn-primary"
                      type="button"
                      style={{ fontSize: '0.82rem', padding: '7px 13px', boxShadow: 'none' }}
                      disabled={uploadLoading || r.upload_status === 'processing'}
                      onClick={() => void handleReanalyze(r.id)}
                    >
                      {r.upload_status === 'processing' ? <><Spinner /> جارٍ...</> : <><IcSparkles /> تحليل</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Analysis History Tabs ────────────────────────────────────────────── */}
        {analyses.length > 0 && (
          <div className="ar-history-section">
            <p className="ar-history-label">التحليلات المحفوظة — {analyses.length} نتيجة</p>
            <div className="ar-history-tabs">
              {analyses.map((a) => {
                const r = resumes.find((x) => x.id === a.resume_id);
                const col = scoreColor(a.score);
                const bg = scoreBg(a.score);
                return (
                  <button
                    key={a.id}
                    className={`ar-history-tab ${a.id === activeAnalysis?.id ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveAnalysisId(a.id)}
                  >
                    <span
                      className="ar-history-tab-score"
                      style={{ background: bg, color: col }}
                    >
                      {a.score}
                    </span>
                    <div className="ar-history-tab-info">
                      <div className="ar-history-tab-name">{r?.file_name ?? 'سيرة محذوفة'}</div>
                      <div className="ar-history-tab-date">{fmtDate(a.created_at)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────────────────────── */}
        {activeAnalysis && activeResume ? (
          <div ref={resultsRef} className="ar-results">

            {/* Score Hero */}
            <section className="ar-score-hero">
              <div className="ar-score-ring-wrap">
                <ScoreRing score={activeAnalysis.score} color={sColor} />
                <div className="ar-score-center">
                  <span className="ar-score-number" style={{ color: sColor }}>
                    {activeAnalysis.score}
                  </span>
                  <span className="ar-score-denom">/100</span>
                </div>
              </div>

              <div className="ar-score-info">
                <div className="ar-score-top">
                  <span
                    className="ar-verdict-badge"
                    style={{ background: sBg, color: sColor }}
                  >
                    <span className="ar-verdict-dot" style={{ background: sColor }} />
                    {verdict?.label}
                  </span>
                  <span className="ar-verdict-sub">{verdict?.sub}</span>
                </div>

                {activeAnalysis.summary && (
                  <p className="ar-score-summary">{activeAnalysis.summary}</p>
                )}

                <div className="ar-score-meta">
                  <span className="ar-meta-chip">
                    <span className="ar-meta-chip-dot" />
                    {activeResume.file_name}
                  </span>
                  <span className="ar-meta-chip">
                    <span className="ar-meta-chip-dot" />
                    {fmtDate(activeAnalysis.created_at)}
                  </span>
                  <span className="ar-meta-chip">
                    <span className="ar-meta-chip-dot" />
                    {activeAnalysis.analysis_source}
                  </span>
                  <div style={{ marginInlineStart: 'auto', display: 'flex', gap: '8px' }}>
                    <button
                      className="ar-btn-ghost"
                      style={{ fontSize: '0.8rem', padding: '7px 12px' }}
                      type="button"
                      onClick={() => void handlePreview(activeResume.id)}
                    >
                      معاينة الملف
                    </button>
                    <button
                      className="ar-btn-ghost"
                      style={{ fontSize: '0.8rem', padding: '7px 12px' }}
                      type="button"
                      disabled={uploadLoading}
                      onClick={() => void handleReanalyze(activeResume.id)}
                    >
                      {uploadLoading ? <Spinner /> : <IcRefresh />}
                      إعادة التحليل
                    </button>
                    <button
                      className="ar-btn-danger"
                      style={{ fontSize: '0.8rem', padding: '7px 12px' }}
                      type="button"
                      disabled={deletingId === activeAnalysis.id}
                      onClick={() => void handleDelete(activeAnalysis.id)}
                    >
                      {deletingId === activeAnalysis.id ? <Spinner /> : <IcX />}
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Metrics */}
            <div className="ar-metrics-row">
              <div className="ar-metric-card">
                <div className="ar-metric-label">نقاط القوة</div>
                <div className="ar-metric-value" style={{ color: '#16a34a' }}>
                  {activeAnalysis.strengths.length}
                </div>
                <div className="ar-metric-sub">ميزة إيجابية مرصودة</div>
              </div>
              <div className="ar-metric-card">
                <div className="ar-metric-label">فرص التحسين</div>
                <div className="ar-metric-value" style={{ color: '#b45309' }}>
                  {activeAnalysis.improvements.length}
                </div>
                <div className="ar-metric-sub">توصية قابلة للتطبيق</div>
              </div>
              <div className="ar-metric-card">
                <div className="ar-metric-label">ملاحظات تفصيلية</div>
                <div className="ar-metric-value" style={{ color: '#0369a1' }}>
                  {activeAnalysis.insights.length}
                </div>
                <div className="ar-metric-sub">
                  {goodInsights.length} إيجابية · {warnInsights.length} تحذيرية
                </div>
              </div>
            </div>

            {/* Strengths + Improvements */}
            <div className="ar-detail-grid">
              <section className="ar-card">
                <div className="ar-card-header">
                  <span className="ar-card-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
                    <IcThumbUp />
                  </span>
                  <h3 className="ar-card-title">نقاط القوة</h3>
                  <span className="ar-card-count">{activeAnalysis.strengths.length}</span>
                </div>
                {activeAnalysis.strengths.length > 0 ? (
                  <BulletList items={activeAnalysis.strengths} tone="good" />
                ) : (
                  <EmptyState
                    icon={<IcThumbUp />}
                    title="لا توجد بيانات"
                    sub="لم يُرصد نقاط قوة في هذا التحليل."
                  />
                )}
              </section>

              <section className="ar-card">
                <div className="ar-card-header">
                  <span className="ar-card-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
                    <IcTarget />
                  </span>
                  <h3 className="ar-card-title">فرص التحسين</h3>
                  <span className="ar-card-count">{activeAnalysis.improvements.length}</span>
                </div>
                {activeAnalysis.improvements.length > 0 ? (
                  <BulletList items={activeAnalysis.improvements} tone="warn" />
                ) : (
                  <EmptyState
                    icon={<IcTarget />}
                    title="لا توجد بيانات"
                    sub="لم تُوجَد فرص تحسين في هذا التحليل."
                  />
                )}
              </section>
            </div>

            {/* Insights */}
            {activeAnalysis.insights.length > 0 && (
              <section className="ar-card">
                <div className="ar-card-header">
                  <span className="ar-card-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                    <IcBarChart />
                  </span>
                  <h3 className="ar-card-title">التحليل التفصيلي</h3>
                  <span className="ar-card-count">{activeAnalysis.insights.length} ملاحظة</span>
                </div>

                {goodInsights.length > 0 && (
                  <>
                    <p className="ar-insights-title">إيجابيات · {goodInsights.length}</p>
                    <div className="ar-insights-grid">
                      {goodInsights.map((ins, i) => (
                        <div key={i} className="ar-insight-card good">
                          <div className="ar-insight-card-header">
                            <span className="ar-insight-icon"><IcCheck /></span>
                            <p className="ar-insight-title-text">{ins.title}</p>
                          </div>
                          <p className="ar-insight-detail">{ins.detail}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {warnInsights.length > 0 && (
                  <>
                    <p className="ar-insights-title" style={{ marginTop: goodInsights.length ? '16px' : 0 }}>
                      تحذيرات · {warnInsights.length}
                    </p>
                    <div className="ar-insights-grid">
                      {warnInsights.map((ins, i) => (
                        <div key={i} className="ar-insight-card warn">
                          <div className="ar-insight-card-header">
                            <span className="ar-insight-icon"><IcAlert /></span>
                            <p className="ar-insight-title-text">{ins.title}</p>
                          </div>
                          <p className="ar-insight-detail">{ins.detail}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {neutralInsights.length > 0 && (
                  <>
                    <p className="ar-insights-title" style={{ marginTop: (goodInsights.length || warnInsights.length) ? '16px' : 0 }}>
                      معلومات · {neutralInsights.length}
                    </p>
                    <div className="ar-insights-grid">
                      {neutralInsights.map((ins, i) => (
                        <div key={i} className="ar-insight-card neutral">
                          <div className="ar-insight-card-header">
                            <span className="ar-insight-icon"><IcInfo /></span>
                            <p className="ar-insight-title-text">{ins.title}</p>
                          </div>
                          <p className="ar-insight-detail">{ins.detail}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            {/* Next Steps CTA */}
            <section className="ar-next-steps">
              <div className="ar-next-steps-copy">
                <p className="ar-next-steps-eyebrow">الخطوة التالية</p>
                <h3 className="ar-next-steps-title">
                  {activeAnalysis.score >= 70
                    ? 'سيرتك في مستوى جيد — طوّرها أكثر'
                    : 'طبّق التوصيات ورفع سيرتك المحسّنة'}
                </h3>
                <p className="ar-next-steps-sub">
                  {activeAnalysis.score >= 70
                    ? `درجتك ${activeAnalysis.score}/100. أضف المزيد من المهارات وحسّن الكلمات المفتاحية لترتفع إلى 85+.`
                    : `طبّق التوصيات الـ${activeAnalysis.improvements.length} الموضحة أعلاه ثم ارفع نسخة محسّنة للتحقق من تحسن نتيجتك.`}
                </p>
              </div>
              <div className="ar-next-steps-actions">
                <button
                  className="ar-btn-white"
                  type="button"
                  disabled={uploadLoading}
                  onClick={() => void handleReanalyze(activeResume.id)}
                >
                  <IcRefresh />
                  إعادة التحليل
                </button>
                <button
                  className="ar-btn-white-ghost"
                  type="button"
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); fileInputRef.current?.click(); }}
                >
                  <IcUpload />
                  رفع نسخة جديدة
                </button>
              </div>
            </section>
          </div>
        ) : (
          /* Empty Results State */
          <div className="ar-card">
            <EmptyState
              icon={<IcSparkles />}
              title={analyses.length === 0 ? 'لا توجد تحليلات بعد' : 'اختر تحليلاً لعرض نتائجه'}
              sub={
                analyses.length === 0
                  ? 'ارفع سيرتك الذاتية من الأعلى وسيبدأ التحليل تلقائياً خلال ثوانٍ.'
                  : 'اختر أي تحليل من القائمة أعلاه لعرض تفاصيله كاملة.'
              }
            />
            {analyses.length === 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '8px' }}>
                <button
                  className="ar-btn-primary"
                  type="button"
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); fileInputRef.current?.click(); }}
                >
                  <IcUpload />
                  ابدأ برفع سيرتك الذاتية
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
