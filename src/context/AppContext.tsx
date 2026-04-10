import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Session } from '@supabase/supabase-js';
import { runAtsEngine } from '../lib/ats-engine';
import { extractResumeText } from '../lib/resume-parser';
import { supabase } from '../lib/supabase';
import { AnalysisRecord, Profile, ResumeRecord } from '../types';

type AuthMode = 'signin' | 'signup';
type UiLocale = 'en' | 'ar';

type ProfileDraft = {
  full_name: string;
  target_role: string;
  city: string;
  years_experience: string;
  skills: string;
};

type AuthForm = {
  full_name: string;
  email: string;
  password: string;
  target_role: string;
  city: string;
};

type AppContextValue = {
  session: Session | null;
  profile: Profile | null;
  profileDraft: ProfileDraft;
  resumes: ResumeRecord[];
  analyses: AnalysisRecord[];
  authForm: AuthForm;
  authMode: AuthMode;
  loading: boolean;
  authLoading: boolean;
  saveLoading: boolean;
  uploadLoading: boolean;
  message: string;
  isAuthenticated: boolean;
  currentUserEmail: string;
  latestResume: ResumeRecord | null;
  latestAnalysis: AnalysisRecord | null;
  profileCompletion: number;
  uiLocale: UiLocale;
  setAuthMode: (mode: AuthMode) => void;
  setUiLocale: (locale: UiLocale) => void;
  setAuthForm: (updater: (current: AuthForm) => AuthForm) => void;
  setProfileDraft: (updater: (current: ProfileDraft) => ProfileDraft) => void;
  clearMessage: () => void;
  getResumePreviewUrl: (resumeId: string) => Promise<string | null>;
  analyzeResume: (resumeId: string) => Promise<boolean>;
  deleteResume: (resumeId: string) => Promise<boolean>;
  deleteAnalysis: (analysisId: string) => Promise<boolean>;
  handleAuthSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleSaveProfile: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleResumeUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<boolean>;
  handleSignOut: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

const emptyProfileDraft: ProfileDraft = {
  full_name: '',
  target_role: '',
  city: '',
  years_experience: '',
  skills: '',
};

const emptyAuthForm: AuthForm = {
  full_name: '',
  email: '',
  password: '',
  target_role: '',
  city: '',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileDraft, setProfileDraftState] = useState<ProfileDraft>(emptyProfileDraft);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [authForm, setAuthFormState] = useState<AuthForm>(emptyAuthForm);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uiLocale, setUiLocale] = useState<UiLocale>('en');

  async function invokeResumeAnalysis(payload: {
    resumeId: string;
    resumeText: string;
    targetRole: string | null;
    atsScore: number;
    sectionScores: Record<string, number>;
    missingKeywords: string[];
  }) {
    if (!supabase) {
      throw new Error('Supabase غير مهيأ داخل التطبيق.');
    }

    // Always force a token refresh immediately before calling the edge function.
    // getSession() can return a stale token from localStorage that may have expired
    // during long operations like OCR. refreshSession() guarantees a fresh JWT.
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();

    const accessToken = refreshed.session?.access_token;

    if (refreshError || !accessToken) {
      throw new Error('انتهت جلسة الدخول. سجل الدخول مرة أخرى ثم أعد محاولة التحليل.');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

    // Use fetch directly — bypasses any SDK header-merging issues that cause 401
    const response = await fetch(`${supabaseUrl}/functions/v1/analyze-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      if (response.status === 401) {
        throw new Error('انتهت صلاحية الجلسة. سجّل الخروج ثم أعد الدخول وحاول مرة أخرى.');
      }
      throw new Error(`فشل التحليل (${response.status}): ${errorBody || response.statusText}`);
    }

    return response.json() as Promise<{ analysis: unknown }>;
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data, error }) => {
      if (!active) return;

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setSession(data.session);

      if (data.session?.user) {
        await bootstrapUser(data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (nextSession?.user) {
        void bootstrapUser(nextSession.user.id);
      } else {
        setProfile(null);
        setProfileDraftState(emptyProfileDraft);
        setResumes([]);
        setAnalyses([]);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function bootstrapUser(userId: string) {
    if (!supabase) return;

    setLoading(true);
    setMessage('');

    const [profileResult, resumesResult, analysesResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('resumes').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('analyses').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);

    if (profileResult.error) {
      setMessage(profileResult.error.message);
    } else {
      const nextProfile = profileResult.data as Profile | null;
      setProfile(nextProfile);
      setProfileDraftState(
        nextProfile
          ? {
              full_name: nextProfile.full_name,
              target_role: nextProfile.target_role,
              city: nextProfile.city,
              years_experience: nextProfile.years_experience?.toString() ?? '',
              skills: nextProfile.skills.join(', '),
            }
          : emptyProfileDraft,
      );
    }

    if (resumesResult.error) {
      setMessage(resumesResult.error.message);
    } else {
      setResumes((resumesResult.data as ResumeRecord[]) ?? []);
    }

    if (analysesResult.error) {
      setMessage(analysesResult.error.message);
    } else {
      setAnalyses(((analysesResult.data as AnalysisRecord[]) ?? []).map(normalizeAnalysis));
    }

    setLoading(false);
  }

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setAuthLoading(true);
    setMessage('');

    if (authMode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email: authForm.email,
        password: authForm.password,
        options: {
          data: {
            full_name: authForm.full_name,
            target_role: authForm.target_role,
            city: authForm.city,
            skills: [],
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('تم إنشاء الحساب. إذا كان تأكيد البريد مفعّلًا في Supabase فافتح بريدك أولًا ثم سجل الدخول.');
        setAuthMode('signin');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('تم تسجيل الدخول بنجاح.');
      }
    }

    setAuthLoading(false);
  }

  async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !session?.user) return;

    setSaveLoading(true);
    setMessage('');

    const payload = {
      id: session.user.id,
      email: session.user.email ?? profile?.email ?? '',
      full_name: profileDraft.full_name.trim(),
      target_role: profileDraft.target_role.trim(),
      city: profileDraft.city.trim(),
      years_experience: profileDraft.years_experience ? Number(profileDraft.years_experience) : null,
      skills: profileDraft.skills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const { data, error } = await supabase.from('profiles').upsert(payload).select().single();

    if (error) {
      setMessage(error.message);
    } else {
      const nextProfile = data as Profile;
      setProfile(nextProfile);
      setProfileDraftState({
        full_name: nextProfile.full_name,
        target_role: nextProfile.target_role,
        city: nextProfile.city,
        years_experience: nextProfile.years_experience?.toString() ?? '',
        skills: nextProfile.skills.join(', '),
      });
      setMessage('تم حفظ الملف الشخصي.');
    }

    setSaveLoading(false);
  }

  async function handleResumeUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !supabase || !session?.user) return false;

    setUploadLoading(true);
    setMessage('');
    let createdResumeId: string | null = null;

    try {
      const fileExt = file.name.split('.').pop() ?? 'pdf';
      const safeName = file.name.replace(/\s+/g, '-').toLowerCase();
      const normalizedName = safeName.endsWith(`.${fileExt}`) ? safeName : `${safeName}.${fileExt}`;
      const filePath = `${session.user.id}/${Date.now()}-${normalizedName}`;

      const uploadResult = await supabase.storage.from('resumes').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (uploadResult.error) {
        throw new Error(uploadResult.error.message);
      }

      const resumeInsert = await supabase
        .from('resumes')
        .insert({
          user_id: session.user.id,
          file_name: file.name,
          file_path: filePath,
          mime_type: file.type || null,
          file_size: file.size,
          upload_status: 'uploaded',
        })
        .select()
        .single();

      if (resumeInsert.error) {
        throw new Error(resumeInsert.error.message);
      }

      const resumeRecord = resumeInsert.data as ResumeRecord;
      createdResumeId = resumeRecord.id;
      setResumes((current) => [resumeRecord, ...current]);
      setMessage('تم رفع الملف. جارٍ استخراج النص وإرسال السيرة إلى التحليل الذكي...');

      const resumeText = await extractResumeText(file, (status) => {
        if (status === 'ocr-fallback') {
          setMessage('الملف يبدو ممسوحًا ضوئيًا أو قديمًا. جارٍ محاولة OCR لاستخراج النص...');
          return;
        }

        if (status.startsWith('ocr-page-')) {
          const pageNumber = status.replace('ocr-page-', '');
          setMessage(`جارٍ استخدام OCR لاستخراج النص من الصفحة ${pageNumber}...`);
        }
      });

      if (!resumeText || resumeText.length < 80) {
        throw new Error('تعذر استخراج نص كاف من السيرة الذاتية. تأكد أن الملف يحتوي على نص قابل للقراءة.');
      }

      // Run rule-based ATS scoring before calling the edge function
      const atsResult = runAtsEngine(resumeText, file.name);

      const invokeData = await invokeResumeAnalysis({
          resumeId: resumeRecord.id,
          resumeText,
          targetRole: profile?.target_role ?? null,
          atsScore: atsResult.score,
          sectionScores: atsResult.section_scores,
          missingKeywords: atsResult.missing_keywords,
      });

      const nextAnalysis = normalizeAnalysis(invokeData.analysis as AnalysisRecord);

      setAnalyses((current) => [nextAnalysis, ...current.filter((item) => item.resume_id !== nextAnalysis.resume_id)]);
      setResumes((current) =>
        current.map((item) => (item.id === resumeRecord.id ? { ...item, upload_status: 'analyzed' } : item)),
      );
      setMessage('تم تحليل محتوى السيرة الذاتية فعليًا وحفظ النتيجة الذكية في قاعدة البيانات.');
      return true;
    } catch (error) {
      if (createdResumeId) {
        void supabase
          .from('resumes')
          .update({ upload_status: 'failed' })
          .eq('id', createdResumeId)
          .eq('user_id', session.user.id);

        setResumes((current) =>
          current.map((item) => (item.id === createdResumeId ? { ...item, upload_status: 'failed' } : item)),
        );
      }
      setMessage(error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء تحليل السيرة الذاتية.');
      return false;
    } finally {
      event.target.value = '';
      setUploadLoading(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('تم تسجيل الخروج.');
    }
  }

  async function getResumePreviewUrl(resumeId: string) {
    if (!supabase) return null;

    const resume = resumes.find((item) => item.id === resumeId);
    if (!resume) {
      setMessage('تعذر العثور على السيرة الذاتية المطلوبة.');
      return null;
    }

    const { data, error } = await supabase.storage.from('resumes').createSignedUrl(resume.file_path, 60);

    if (error) {
      setMessage(error.message);
      return null;
    }

    return data.signedUrl;
  }

  async function analyzeResume(resumeId: string) {
    if (!supabase || !session?.user) return false;

    const resume = resumes.find((item) => item.id === resumeId);
    if (!resume) {
      setMessage('تعذر العثور على السيرة الذاتية المطلوبة للتحليل.');
      return false;
    }

    setUploadLoading(true);
    setMessage('جارٍ تجهيز السيرة الذاتية لإعادة التحليل...');

    try {
      const { data, error } = await supabase.storage.from('resumes').download(resume.file_path);

      if (error) {
        throw new Error(error.message);
      }

      const file = new File([data], resume.file_name, {
        type: resume.mime_type ?? data.type ?? 'application/pdf',
        lastModified: Date.now(),
      });

      const { error: processingError } = await supabase
        .from('resumes')
        .update({ upload_status: 'processing' })
        .eq('id', resume.id)
        .eq('user_id', session.user.id);

      if (processingError) {
        throw new Error(processingError.message);
      }

      setResumes((current) =>
        current.map((item) => (item.id === resume.id ? { ...item, upload_status: 'processing' } : item)),
      );

      const resumeText = await extractResumeText(file, (status) => {
        if (status === 'ocr-fallback') {
          setMessage('الملف يبدو ممسوحًا ضوئيًا أو قديمًا. جارٍ محاولة OCR لاستخراج النص...');
          return;
        }

        if (status.startsWith('ocr-page-')) {
          const pageNumber = status.replace('ocr-page-', '');
          setMessage(`جارٍ استخدام OCR لاستخراج النص من الصفحة ${pageNumber}...`);
        }
      });

      if (!resumeText || resumeText.length < 80) {
        throw new Error('تعذر استخراج نص كاف من السيرة الذاتية. تأكد أن الملف يحتوي على نص قابل للقراءة.');
      }

      // Run rule-based ATS scoring before calling the edge function
      const atsResult = runAtsEngine(resumeText, resume.file_name);

      const invokeData = await invokeResumeAnalysis({
          resumeId: resume.id,
          resumeText,
          targetRole: profile?.target_role ?? null,
          atsScore: atsResult.score,
          sectionScores: atsResult.section_scores,
          missingKeywords: atsResult.missing_keywords,
      });

      const nextAnalysis = normalizeAnalysis(invokeData.analysis as AnalysisRecord);

      setAnalyses((current) => [nextAnalysis, ...current.filter((item) => item.resume_id !== nextAnalysis.resume_id)]);
      setResumes((current) =>
        current.map((item) => (item.id === resume.id ? { ...item, upload_status: 'analyzed' } : item)),
      );
      setMessage('تم إنشاء تحليل جديد لهذه السيرة الذاتية بنجاح.');
      return true;
    } catch (error) {
      void supabase
        .from('resumes')
        .update({ upload_status: 'failed' })
        .eq('id', resume.id)
        .eq('user_id', session.user.id);

      setResumes((current) =>
        current.map((item) => (item.id === resume.id ? { ...item, upload_status: 'failed' } : item)),
      );
      setMessage(error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء تحليل السيرة الذاتية.');
      return false;
    } finally {
      setUploadLoading(false);
    }
  }

  async function deleteResume(resumeId: string) {
    if (!supabase || !session?.user) return false;

    const resume = resumes.find((item) => item.id === resumeId);
    if (!resume) {
      setMessage('تعذر العثور على السيرة الذاتية المطلوب حذفها.');
      return false;
    }

    const { error: storageError } = await supabase.storage.from('resumes').remove([resume.file_path]);
    if (storageError) {
      setMessage(storageError.message);
      return false;
    }

    const { error } = await supabase.from('resumes').delete().eq('id', resumeId).eq('user_id', session.user.id);
    if (error) {
      setMessage(error.message);
      return false;
    }

    setResumes((current) => current.filter((item) => item.id !== resumeId));
    setAnalyses((current) => current.filter((item) => item.resume_id !== resumeId));
    setMessage('تم حذف السيرة الذاتية وما يرتبط بها من تحليل.');
    return true;
  }

  async function deleteAnalysis(analysisId: string) {
    if (!supabase || !session?.user) return false;

    const { error } = await supabase.from('analyses').delete().eq('id', analysisId).eq('user_id', session.user.id);
    if (error) {
      setMessage(error.message);
      return false;
    }

    setAnalyses((current) => current.filter((item) => item.id !== analysisId));
    setMessage('تم حذف التحليل.');
    return true;
  }

  const latestResume = resumes[0] ?? null;
  const latestAnalysis = analyses[0] ?? null;
  const currentUserEmail = session?.user.email ?? '';
  const profileCompletion = useMemo(() => {
    const values = [
      profile?.full_name,
      profile?.target_role,
      profile?.city,
      profile?.years_experience?.toString(),
      profile?.skills?.length ? 'skills' : '',
    ];

    return Math.round((values.filter(Boolean).length / values.length) * 100);
  }, [profile]);

  const value: AppContextValue = {
    session,
    profile,
    profileDraft,
    resumes,
    analyses,
    authForm,
    authMode,
    loading,
    authLoading,
    saveLoading,
    uploadLoading,
    message,
    isAuthenticated: Boolean(session?.user),
    currentUserEmail,
    latestResume,
    latestAnalysis,
    profileCompletion,
    uiLocale,
    setAuthMode,
    setUiLocale,
    setAuthForm: (updater) => setAuthFormState((current) => updater(current)),
    setProfileDraft: (updater) => setProfileDraftState((current) => updater(current)),
    clearMessage: () => setMessage(''),
    getResumePreviewUrl,
    analyzeResume,
    deleteResume,
    deleteAnalysis,
    handleAuthSubmit,
    handleSaveProfile,
    handleResumeUpload,
    handleSignOut,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}

function normalizeAnalysis(record: AnalysisRecord): AnalysisRecord {
  return {
    ...record,
    insights: Array.isArray(record.insights) ? record.insights : [],
  };
}
