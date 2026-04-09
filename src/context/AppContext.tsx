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
import { generateResumeAnalysis } from '../lib/analysis';
import { hasSupabaseCredentials, supabase } from '../lib/supabase';
import { AnalysisRecord, Profile, ResumeRecord } from '../types';

type AuthMode = 'signin' | 'signup';

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
  setAuthMode: (mode: AuthMode) => void;
  setAuthForm: (updater: (current: AuthForm) => AuthForm) => void;
  setProfileDraft: (updater: (current: ProfileDraft) => ProfileDraft) => void;
  clearMessage: () => void;
  handleAuthSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleSaveProfile: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleResumeUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
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
        setMessage('تم إنشاء الحساب. إذا كان تأكيد البريد مفعّلًا في Supabase فافتح بريدك أولًا ثم سجّل الدخول.');
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

    if (!file || !supabase || !session?.user) return;

    setUploadLoading(true);
    setMessage('');

    const fileExt = file.name.split('.').pop() ?? 'pdf';
    const safeName = file.name.replace(/\s+/g, '-').toLowerCase();
    const normalizedName = safeName.endsWith(`.${fileExt}`) ? safeName : `${safeName}.${fileExt}`;
    const filePath = `${session.user.id}/${Date.now()}-${normalizedName}`;

    const uploadResult = await supabase.storage.from('resumes').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadResult.error) {
      setMessage(uploadResult.error.message);
      setUploadLoading(false);
      return;
    }

    const resumeInsert = await supabase
      .from('resumes')
      .insert({
        user_id: session.user.id,
        file_name: file.name,
        file_path: filePath,
        mime_type: file.type || null,
        file_size: file.size,
        upload_status: 'analyzed',
      })
      .select()
      .single();

    if (resumeInsert.error) {
      setMessage(resumeInsert.error.message);
      setUploadLoading(false);
      return;
    }

    const resumeRecord = resumeInsert.data as ResumeRecord;
    const generated = generateResumeAnalysis(file.name, file.size);

    const analysisInsert = await supabase
      .from('analyses')
      .insert({
        resume_id: resumeRecord.id,
        user_id: session.user.id,
        score: generated.score,
        summary: generated.summary,
        strengths: generated.strengths,
        improvements: generated.improvements,
        insights: generated.insights,
        analysis_source: 'metadata-rules',
      })
      .select()
      .single();

    if (analysisInsert.error) {
      setMessage(analysisInsert.error.message);
    } else {
      setResumes((current) => [resumeRecord, ...current]);
      setAnalyses((current) => [normalizeAnalysis(analysisInsert.data as AnalysisRecord), ...current]);
      setMessage('تم رفع السيرة وحفظ نتيجة تحليل أولية في قاعدة البيانات.');
    }

    event.target.value = '';
    setUploadLoading(false);
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
    setAuthMode,
    setAuthForm: (updater) => setAuthFormState((current) => updater(current)),
    setProfileDraft: (updater) => setProfileDraftState((current) => updater(current)),
    clearMessage: () => setMessage(''),
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
