// Rule-based job matching — no AI involved in scoring
// Input: resume text + job description text
// Output: match_percentage, matched_skills, missing_skills, keyword_gap

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'in', 'to', 'for', 'with', 'on', 'at',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'that', 'this', 'it', 'we', 'you', 'they', 'our', 'your', 'their',
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word)),
  );
}

function extractPhrases(text: string, maxWords = 3): string[] {
  const lower = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  const phrases: string[] = [];
  const words = lower.split(/\s+/).filter((w) => w.length > 1);

  for (let i = 0; i < words.length; i++) {
    for (let len = 2; len <= maxWords; len++) {
      if (i + len <= words.length) {
        const phrase = words.slice(i, i + len).join(' ');
        if (!phrase.split(' ').every((w) => STOP_WORDS.has(w))) {
          phrases.push(phrase);
        }
      }
    }
  }

  return phrases;
}

export type JobMatchResult = {
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  keyword_gap: string[];
  score_breakdown: {
    keyword_overlap: number;    // 40%
    phrase_match: number;       // 35%
    length_adequacy: number;    // 15%
    structure_bonus: number;    // 10%
  };
};

export function matchResumeToJob(resumeText: string, jobDescription: string): JobMatchResult {
  const resumeTokens = tokenize(resumeText);
  const jobTokens = tokenize(jobDescription);
  const jobPhrases = extractPhrases(jobDescription);
  const resumeText_lower = resumeText.toLowerCase();

  // ── Keyword overlap (40%) ─────────────────────────────────────────────────
  const matched = [...jobTokens].filter((token) => resumeTokens.has(token));
  const keywordOverlap = Math.min(100, Math.round((matched.length / Math.max(1, jobTokens.size)) * 100));

  // ── Phrase match (35%) ───────────────────────────────────────────────────
  const matchedPhrases = jobPhrases.filter((phrase) => resumeText_lower.includes(phrase));
  const phraseMatch = Math.min(100, Math.round((matchedPhrases.length / Math.max(1, Math.min(jobPhrases.length, 30))) * 100));

  // ── Length adequacy (15%) ────────────────────────────────────────────────
  const lengthAdequacy = resumeText.length > 1500 ? 100 : resumeText.length > 600 ? 70 : 40;

  // ── Structure bonus (10%) ────────────────────────────────────────────────
  const sectionSignals = ['experience', 'skills', 'education', 'summary', 'achievements'];
  const sectionCount = sectionSignals.filter((s) => resumeText_lower.includes(s)).length;
  const structureBonus = Math.min(100, sectionCount * 20);

  const score_breakdown = {
    keyword_overlap: keywordOverlap,
    phrase_match: phraseMatch,
    length_adequacy: lengthAdequacy,
    structure_bonus: structureBonus,
  };

  const match_percentage = Math.round(
    (keywordOverlap * 40 + phraseMatch * 35 + lengthAdequacy * 15 + structureBonus * 10) / 100,
  );

  // ── Skill gap analysis ───────────────────────────────────────────────────
  // Filter job tokens to likely skills/tools (length > 2, not common words)
  const jobSkillCandidates = [...jobTokens]
    .filter((t) => t.length > 2)
    .sort();

  const matched_skills = jobSkillCandidates.filter((skill) => resumeTokens.has(skill)).slice(0, 12);
  const missing_skills = jobSkillCandidates.filter((skill) => !resumeTokens.has(skill)).slice(0, 10);

  // keyword_gap: important phrases from JD not in resume
  const keyword_gap = jobPhrases
    .filter((phrase) => !resumeText_lower.includes(phrase) && phrase.split(' ').length >= 2)
    .slice(0, 8);

  return {
    match_percentage,
    matched_skills,
    missing_skills,
    keyword_gap,
    score_breakdown,
  };
}
