import { ResumeInsight } from '../types';

export type GeneratedAnalysis = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  insights: ResumeInsight[];
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function generateResumeAnalysis(fileName: string, fileSize: number) {
  const lowerName = fileName.toLowerCase();
  const sizeInKb = Math.round(fileSize / 1024);
  let score = 62;

  const strengths: string[] = [];
  const improvements: string[] = [];
  const insights: ResumeInsight[] = [];

  if (lowerName.includes('cv') || lowerName.includes('resume')) {
    score += 8;
    strengths.push('اسم الملف واضح ويشير مباشرة إلى السيرة الذاتية.');
  } else {
    improvements.push('يفضل تسمية الملف باسم مهني واضح مثل `firstname-lastname-resume.pdf`.');
  }

  if (sizeInKb >= 150 && sizeInKb <= 1024) {
    score += 9;
    strengths.push('حجم الملف مناسب عادة لسيرة ذاتية تحتوي على محتوى كاف دون مبالغة.');
  } else if (sizeInKb < 150) {
    improvements.push('حجم الملف صغير جدًا وقد يعني أن المحتوى مختصر أكثر من اللازم.');
  } else {
    improvements.push('حجم الملف كبير نسبيًا؛ يفضل تبسيط التنسيق والصور إن وجدت.');
  }

  if (lowerName.includes('final')) {
    improvements.push('يفضل حذف كلمات مثل final من اسم الملف وإبقاء التسمية مهنية وبسيطة.');
  } else {
    score += 5;
  }

  if (lowerName.endsWith('.pdf')) {
    score += 6;
    strengths.push('صيغة PDF مناسبة للمشاركة وتحافظ على التنسيق.');
  } else {
    improvements.push('يفضل توفير نسخة PDF إلى جانب DOCX لثبات التنسيق عند التقديم.');
  }

  score = clamp(score, 48, 91);

  insights.push(
    {
      title: 'جاهزية التقديم',
      detail: 'الملف تم رفعه بنجاح ويمكن الآن ربطه بتحليل نصي أعمق عبر Edge Function أو نموذج ذكاء اصطناعي.',
      tone: 'good',
    },
    {
      title: 'التحليل الحالي',
      detail: 'هذه النتيجة أولية وتعتمد على بيانات الملف الوصفية، وليست بعد تحليلًا دلاليًا لمحتوى السيرة.',
      tone: 'warn',
    },
    {
      title: 'الخطوة التالية',
      detail: 'المرحلة القادمة المقترحة هي استخراج نص السيرة ومقارنته بالوظيفة المستهدفة لإنتاج توصيات أدق.',
      tone: 'neutral',
    },
  );

  return {
    score,
    summary:
      score >= 75
        ? 'السيرة تبدو جاهزة كبداية جيدة، ويمكن تحسينها أكثر عبر تحليل المحتوى الفعلي وربطها بالدور المستهدف.'
        : 'السيرة مرفوعة بنجاح، لكن ما زالت تحتاج تحسينات أوضح في الصياغة والتخصيص لتصبح أقوى في التقديم.',
    strengths,
    improvements: improvements.length
      ? improvements
      : ['أضف ملخصًا مهنيًا مختصرًا، وركّز على الإنجازات بالأرقام، وخصص المهارات حسب الوظيفة المستهدفة.'],
    insights,
  };
}

