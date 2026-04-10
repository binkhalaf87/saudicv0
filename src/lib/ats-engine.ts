import { ResumeInsight } from '../types';

// ─── Category weights (must sum to 100) ───────────────────────────────────────
const WEIGHTS = {
  skills: 25,
  experience: 25,
  keywords: 20,
  format: 15,
  achievements: 15,
} as const;

// ─── Keyword banks ────────────────────────────────────────────────────────────
const SKILLS_BANK = [
  'python', 'sql', 'javascript', 'typescript', 'react', 'node', 'java',
  'figma', 'excel', 'power bi', 'tableau', 'jira', 'confluence', 'git',
  'agile', 'scrum', 'kanban', 'product management', 'ux', 'ui', 'design systems',
  'machine learning', 'data analysis', 'data science', 'project management',
  'stakeholder management', 'roadmap', 'communication', 'leadership',
];

const ATS_KEYWORDS = [
  'results', 'achieved', 'delivered', 'led', 'managed', 'developed', 'improved',
  'increased', 'reduced', 'built', 'launched', 'created', 'designed', 'analyzed',
  'collaborated', 'coordinated', 'implemented', 'optimized', 'streamlined',
];

const FORMAT_SIGNALS = [
  'experience', 'education', 'skills', 'summary', 'objective', 'achievements',
];

const ACHIEVEMENT_PATTERNS = [
  /\d+\s*%/,
  /\$[\d,]+/,
  /\b\d+\s*(million|billion)/i,
  /\b(increased|reduced|improved|saved|generated|delivered)\b.{0,40}\d/i,
  /team\s+of\s+\d+/i,
];

// ─── Scoring helpers ──────────────────────────────────────────────────────────
function scoreSkills(text: string) {
  const lower = text.toLowerCase();
  const found = SKILLS_BANK.filter((skill) => lower.includes(skill));
  const missing = SKILLS_BANK.filter((skill) => !lower.includes(skill)).slice(0, 6);
  const raw = Math.min(100, Math.round((found.length / Math.max(1, Math.min(found.length + 4, 12))) * 100));
  return { raw, found, missing };
}

function scoreExperience(text: string) {
  const yearPatterns = [
    /(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)/i,
    /experience[:\s]+(\d+)\+?\s*years?/i,
  ];

  let yearsFound: number | null = null;
  for (const pattern of yearPatterns) {
    const match = pattern.exec(text);
    if (match) {
      yearsFound = parseInt(match[1], 10);
      break;
    }
  }

  if (!yearsFound) {
    const dateRanges = [...text.matchAll(/(\d{4})\s*[-–]\s*(\d{4}|present)/gi)];
    if (dateRanges.length > 0) {
      const totalYears = dateRanges.reduce((sum, match) => {
        const start = parseInt(match[1], 10);
        const end = match[2].toLowerCase() === 'present' ? 2025 : parseInt(match[2], 10);
        return sum + Math.max(0, end - start);
      }, 0);
      yearsFound = Math.min(30, totalYears);
    }
  }

  let raw = 40;
  if (yearsFound !== null) {
    if (yearsFound >= 10) raw = 100;
    else if (yearsFound >= 7) raw = 88;
    else if (yearsFound >= 5) raw = 78;
    else if (yearsFound >= 3) raw = 68;
    else if (yearsFound >= 1) raw = 55;
    else raw = 42;
  }

  const jobEntries = (text.match(/\d{4}\s*[-–]\s*(\d{4}|present)/gi) ?? []).length;
  raw = Math.min(100, raw + jobEntries * 3);

  return { raw, yearsFound };
}

function scoreKeywords(text: string) {
  const lower = text.toLowerCase();
  const found = ATS_KEYWORDS.filter((kw) => lower.includes(kw));
  const missing = ATS_KEYWORDS.filter((kw) => !lower.includes(kw)).slice(0, 5);
  const raw = Math.min(100, Math.round((found.length / 8) * 100));
  return { raw, found, missing };
}

function scoreFormat(text: string, fileName: string) {
  const lower = text.toLowerCase();
  const signals: string[] = [];
  let raw = 30;

  const sectionCount = FORMAT_SIGNALS.filter((signal) => lower.includes(signal)).length;
  raw += Math.min(40, sectionCount * 8);
  if (sectionCount >= 4) signals.push('Well-structured with clear section headings');

  if (fileName.toLowerCase().endsWith('.pdf')) {
    raw += 15;
    signals.push('PDF format preserves layout across systems');
  }

  if (text.length > 2000) { raw += 10; signals.push('Sufficient content depth detected'); }
  else if (text.length > 800) { raw += 5; }

  return { raw: Math.min(100, raw), signals };
}

function scoreAchievements(text: string) {
  const count = ACHIEVEMENT_PATTERNS.filter((pattern) => pattern.test(text)).length;
  const raw = Math.min(100, count * 20);
  return { raw, count };
}

// ─── Main export ──────────────────────────────────────────────────────────────
export type AtsResult = {
  score: number;
  section_scores: {
    skills: number;
    experience: number;
    keywords: number;
    format: number;
    achievements: number;
  };
  strengths: string[];
  improvements: string[];
  insights: ResumeInsight[];
  missing_keywords: string[];
};

export function runAtsEngine(text: string, fileName: string): AtsResult {
  const skills = scoreSkills(text);
  const experience = scoreExperience(text);
  const keywords = scoreKeywords(text);
  const format = scoreFormat(text, fileName);
  const achievements = scoreAchievements(text);

  const section_scores = {
    skills: Math.round(skills.raw),
    experience: Math.round(experience.raw),
    keywords: Math.round(keywords.raw),
    format: Math.round(format.raw),
    achievements: Math.round(achievements.raw),
  };

  const score = Math.round(
    (section_scores.skills * WEIGHTS.skills +
      section_scores.experience * WEIGHTS.experience +
      section_scores.keywords * WEIGHTS.keywords +
      section_scores.format * WEIGHTS.format +
      section_scores.achievements * WEIGHTS.achievements) /
      100,
  );

  const strengths: string[] = [];
  if (skills.raw >= 70) strengths.push(`Strong skills profile — ${skills.found.length} relevant skills detected`);
  if (experience.yearsFound && experience.yearsFound >= 5) strengths.push(`${experience.yearsFound} years of experience clearly demonstrated`);
  if (keywords.raw >= 60) strengths.push('Good use of action verbs and ATS-friendly language');
  strengths.push(...format.signals);
  if (achievements.count >= 3) strengths.push(`${achievements.count} quantified achievements found`);
  if (strengths.length === 0) strengths.push('Resume submitted and ready for deeper analysis');

  const improvements: string[] = [];
  if (skills.raw < 60) improvements.push(`Add more relevant skills — detected: ${skills.found.length}. Consider: ${skills.missing.slice(0, 3).join(', ')}`);
  if (experience.raw < 60) improvements.push('Clarify work history with role titles and date ranges (e.g. 2020–2023)');
  if (keywords.raw < 50) improvements.push('Use more action verbs: led, delivered, improved, achieved, built');
  if (format.raw < 60) improvements.push('Add clear section headers: Summary, Experience, Skills, Education, Achievements');
  if (achievements.count < 2) improvements.push('Add quantified achievements: percentages, amounts, team sizes, time saved');
  if (improvements.length === 0) improvements.push('Tailor your skills section to the target job description for higher match');

  const insights: ResumeInsight[] = [
    {
      title: 'Skills match',
      detail: skills.found.length >= 6
        ? `${skills.found.length} matching skills detected — solid ATS foundation.`
        : `Only ${skills.found.length} common skills found. Add domain-specific tools.`,
      tone: skills.raw >= 70 ? 'good' : 'warn',
    },
    {
      title: 'Experience quality',
      detail: experience.yearsFound
        ? `${experience.yearsFound} years of experience extracted. Use STAR format per role.`
        : 'Work history dates unclear. Add year ranges for each role (e.g. 2019–2023).',
      tone: experience.raw >= 70 ? 'good' : 'warn',
    },
    {
      title: 'Keyword density',
      detail: keywords.raw >= 60
        ? 'Good action verb usage — reads as achievement-oriented.'
        : `Low keyword score. Add: ${keywords.missing.slice(0, 4).join(', ')}.`,
      tone: keywords.raw >= 60 ? 'good' : 'warn',
    },
    {
      title: 'ATS format',
      detail: format.raw >= 70
        ? 'Structure is clean and machine-readable.'
        : 'Missing standard sections. ATS parsers expect: Summary, Experience, Skills, Education.',
      tone: format.raw >= 70 ? 'good' : 'warn',
    },
    {
      title: 'Quantified achievements',
      detail: achievements.count >= 3
        ? `${achievements.count} quantified impact statements found.`
        : 'Add numbers to your bullets: % improvement, $ saved, team size, time to deliver.',
      tone: achievements.count >= 3 ? 'good' : 'warn',
    },
  ];

  const missing_keywords = [...keywords.missing, ...skills.missing].slice(0, 8);

  return { score, section_scores, strengths, improvements, insights, missing_keywords };
}
