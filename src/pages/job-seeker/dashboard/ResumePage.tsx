import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';

export function JobSeekerResumePage() {
  const { resumes, latestResume, uploadLoading, handleResumeUpload, getResumePreviewUrl, deleteResume } =
    useAppContext();
  const navigate = useNavigate();
  const [busyResumeId, setBusyResumeId] = useState<string | null>(null);

  return (
    <div className="card-stack">
      <div className="form-card">
        <h3>رفع السيرة الذاتية</h3>
        <p>يتم رفع الملف، استخراج النص من محتواه، ثم إرساله إلى تحليل ذكاء اصطناعي فعلي عبر Supabase Edge Function.</p>
        <label className="upload-box">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={async (event) => {
              const success = await handleResumeUpload(event);
              if (success) {
                navigate('/job-seeker/dashboard/analysis');
              }
            }}
            disabled={uploadLoading}
          />
          <span>اختر ملف السيرة الذاتية</span>
          <strong>{uploadLoading ? 'جارٍ رفع الملف...' : latestResume?.file_name ?? 'لا يوجد ملف مرفوع بعد'}</strong>
        </label>
      </div>
      <div className="info-card">
        <h4>السير الذاتية المرفوعة</h4>
        <div className="record-list">
          {resumes.length ? (
            resumes.map((item) => (
              <div key={item.id} className="record-row">
                <div>
                  <strong>{item.file_name}</strong>
                  <p className="record-meta">الحالة: {item.upload_status}</p>
                </div>
                <div className="record-actions">
                  <button
                    className="ghost-button small-button"
                    type="button"
                    disabled={busyResumeId === item.id}
                    onClick={async () => {
                      setBusyResumeId(item.id);
                      const url = await getResumePreviewUrl(item.id);
                      if (url) {
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }
                      setBusyResumeId(null);
                    }}
                  >
                    معاينة الملف
                  </button>
                  <button
                    className="ghost-button small-button danger-button"
                    type="button"
                    disabled={busyResumeId === item.id}
                    onClick={async () => {
                      setBusyResumeId(item.id);
                      await deleteResume(item.id);
                      setBusyResumeId(null);
                    }}
                  >
                    حذف السيرة
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>لا توجد ملفات بعد.</p>
          )}
        </div>
      </div>
    </div>
  );
}

