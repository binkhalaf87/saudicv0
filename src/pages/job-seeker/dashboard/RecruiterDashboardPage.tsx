import { useMemo, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';

const candidates = [
  { name: 'Maha Alotaibi', role: 'Product Designer', skills: ['Design Systems', 'Research', 'Figma'], experience: 6, match: 94 },
  { name: 'Omar Alharbi', role: 'Frontend Engineer', skills: ['React', 'TypeScript', 'Accessibility'], experience: 5, match: 88 },
  { name: 'Reem Alenezi', role: 'Data Analyst', skills: ['SQL', 'Python', 'Power BI'], experience: 4, match: 82 },
  { name: 'Saad Alzahrani', role: 'HR Operations Lead', skills: ['Hiring', 'Compliance', 'Workflows'], experience: 8, match: 79 },
];

export function RecruiterDashboardPage() {
  const { uiLocale } = useAppContext();
  const [skillFilter, setSkillFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('all');

  const filtered = useMemo(
    () =>
      candidates.filter((candidate) => {
        const matchesSkill =
          !skillFilter || candidate.skills.some((skill) => skill.toLowerCase().includes(skillFilter.toLowerCase()));
        const matchesExperience =
          experienceFilter === 'all' ||
          (experienceFilter === 'senior' ? candidate.experience >= 6 : candidate.experience < 6);
        return matchesSkill && matchesExperience;
      }),
    [experienceFilter, skillFilter],
  );

  const t =
    uiLocale === 'en'
      ? {
          eyebrow: 'Recruiter dashboard',
          title: 'Review candidate fit in a high-trust hiring workspace.',
          subtitle: 'The recruiter view uses structured filters, clear tables, and quick-action cards to support scale.',
          skills: 'Skills',
          experience: 'Experience',
          all: 'All',
          senior: 'Senior 6+',
          mid: 'Mid <6',
          table: ['Candidate', 'Role', 'Skills', 'Experience', 'Match', 'Actions'],
          review: 'Review profile',
          shortlist: 'Shortlist',
        }
      : {
          eyebrow: 'لوحة التوظيف',
          title: 'راجع ملاءمة المرشحين ضمن مساحة توظيف عالية الموثوقية.',
          subtitle: 'تعتمد الواجهة على مرشحات منظمة وجداول واضحة وبطاقات إجراءات سريعة تدعم التوسع.',
          skills: 'المهارات',
          experience: 'الخبرة',
          all: 'الكل',
          senior: 'كبير 6+',
          mid: 'متوسط أقل من 6',
          table: ['المرشح', 'الدور', 'المهارات', 'الخبرة', 'نسبة التطابق', 'الإجراءات'],
          review: 'مراجعة الملف',
          shortlist: 'إضافة للقائمة',
        };

  return (
    <div className="page-stack">
      <section className="surface-card">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="filter-row">
        <label className="surface-card filter-card">
          <span>{t.skills}</span>
          <input value={skillFilter} onChange={(event) => setSkillFilter(event.target.value)} placeholder={uiLocale === 'en' ? 'React, SQL, Figma...' : 'React أو SQL أو Figma...'} />
        </label>
        <label className="surface-card filter-card">
          <span>{t.experience}</span>
          <select value={experienceFilter} onChange={(event) => setExperienceFilter(event.target.value)}>
            <option value="all">{t.all}</option>
            <option value="senior">{t.senior}</option>
            <option value="mid">{t.mid}</option>
          </select>
        </label>
      </section>

      <section className="surface-card">
        <div className="section-intro">
          <h2>{uiLocale === 'en' ? 'Candidate table' : 'جدول المرشحين'}</h2>
          <p>{uiLocale === 'en' ? 'Modern SaaS table design with readable density and fast actions.' : 'تصميم جدول SaaS حديث بكثافة مقروءة وإجراءات سريعة.'}</p>
        </div>
        <div className="table-shell">
          <table className="candidate-table">
            <thead>
              <tr>
                {t.table.map((head) => (
                  <th key={head}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((candidate) => (
                <tr key={candidate.name}>
                  <td>
                    <div className="candidate-cell">
                      <span className="candidate-avatar">{candidate.name.slice(0, 2).toUpperCase()}</span>
                      <div>
                        <strong>{candidate.name}</strong>
                        <p>{uiLocale === 'en' ? 'Government-ready profile' : 'ملف جاهز للجهات الحكومية'}</p>
                      </div>
                    </div>
                  </td>
                  <td>{candidate.role}</td>
                  <td>
                    <div className="tag-row">
                      {candidate.skills.map((skill) => (
                        <span className="tag" key={skill}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{candidate.experience}y</td>
                  <td>
                    <span className="match-pill">{candidate.match}%</span>
                  </td>
                  <td>
                    <div className="button-row compact">
                      <button className="button button-ghost button-sm" type="button">
                        {t.review}
                      </button>
                      <button className="button button-secondary button-sm" type="button">
                        {t.shortlist}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="recruiter-card-grid">
        {filtered.slice(0, 3).map((candidate) => (
          <article className="surface-card candidate-card" key={candidate.name}>
            <div className="candidate-card-top">
              <div>
                <h3>{candidate.name}</h3>
                <p>{candidate.role}</p>
              </div>
              <span className="match-pill">{candidate.match}%</span>
            </div>
            <div className="tag-row">
              {candidate.skills.map((skill) => (
                <span className="tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
            <div className="button-row compact">
              <button className="button button-primary button-sm" type="button">
                {t.review}
              </button>
              <button className="button button-ghost button-sm" type="button">
                {t.shortlist}
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
