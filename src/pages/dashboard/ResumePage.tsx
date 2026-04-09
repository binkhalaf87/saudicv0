import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export function ResumePage() {
  const { resumes, latestResume, uploadLoading, handleResumeUpload } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="card-stack">
      <div className="form-card">
        <h3>رفع السيرة الذاتية</h3>
        <p>يتم رفع الملف إلى Supabase Storage ثم إنشاء سجل في قاعدة البيانات مع تحليل أولي محفوظ.</p>
        <label className="upload-box">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={async (event) => {
              await handleResumeUpload(event);
              navigate('/dashboard/analysis');
            }}
            disabled={uploadLoading}
          />
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
  );
}

