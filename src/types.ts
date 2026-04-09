export type InsightTone = 'good' | 'warn' | 'neutral';

export type ResumeInsight = {
  title: string;
  detail: string;
  tone: InsightTone;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  target_role: string;
  city: string;
  years_experience: number | null;
  skills: string[];
};

export type ResumeRecord = {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  mime_type: string | null;
  file_size: number | null;
  upload_status: 'uploaded' | 'processing' | 'analyzed' | 'failed';
  created_at: string;
};

export type AnalysisRecord = {
  id: string;
  resume_id: string;
  user_id: string;
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  insights: ResumeInsight[];
  analysis_source: string;
  created_at: string;
};

