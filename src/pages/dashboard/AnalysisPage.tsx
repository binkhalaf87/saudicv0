import { useAppContext } from '../../context/AppContext';

export function AnalysisPage() {
  const { latestAnalysis } = useAppContext();

  if (!latestAnalysis) {
    return (
      <div className="info-card">
        <h4>لا توجد نتائج تحليل بعد</h4>
        <p>ارفع أول سيرة ذاتية من صفحة السيرة الذاتية لبدء إنشاء السجلات داخل قاعدة البيانات.</p>
      </div>
    );
  }

  return (
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
  );
}
