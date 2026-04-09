import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const analysisSchema = {
  name: 'resume_analysis',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      score: {
        type: 'integer',
        minimum: 0,
        maximum: 100,
      },
      summary: {
        type: 'string',
      },
      strengths: {
        type: 'array',
        items: { type: 'string' },
      },
      improvements: {
        type: 'array',
        items: { type: 'string' },
      },
      insights: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            title: { type: 'string' },
            detail: { type: 'string' },
            tone: {
              type: 'string',
              enum: ['good', 'warn', 'neutral'],
            },
          },
          required: ['title', 'detail', 'tone'],
        },
      },
    },
    required: ['score', 'summary', 'strengths', 'improvements', 'insights'],
  },
  strict: true,
};

function buildPrompt(resumeText: string, targetRole: string | null) {
  return `
You are an expert Arabic resume reviewer for job seekers in Saudi Arabia.
Analyze the resume content and return practical, concise feedback in Arabic.

Rules:
- Score from 0 to 100.
- Focus on resume quality, clarity, relevance, structure, quantified achievements, and skills alignment.
- If the text is weak or incomplete, say so directly.
- Keep strengths and improvements actionable.
- Insights should be short, specific, and useful.
- Prefer advice that helps the candidate improve job application readiness.
${targetRole ? `- The target role is: ${targetRole}` : '- No explicit target role was provided.'}

Resume text:
"""
${resumeText.slice(0, 18000)}
"""
`.trim();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authorization = req.headers.get('Authorization');

    if (!authorization) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY') ?? Deno.env.get('GPT_API_KAY') ?? '';
    const openAiModel = Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini';

    if (!supabaseUrl || !supabaseAnonKey || !openAiApiKey) {
      return new Response(JSON.stringify({ error: 'Missing required environment variables' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authorization,
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const resumeId = body.resumeId as string | undefined;
    const resumeText = (body.resumeText as string | undefined)?.trim();
    const targetRole = (body.targetRole as string | undefined)?.trim() ?? null;

    if (!resumeId || !resumeText) {
      return new Response(JSON.stringify({ error: 'resumeId and resumeText are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabase.from('resumes').update({ upload_status: 'processing' }).eq('id', resumeId).eq('user_id', user.id);

    const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: openAiModel,
        input: buildPrompt(resumeText, targetRole),
        text: {
          format: {
            type: 'json_schema',
            name: analysisSchema.name,
            schema: analysisSchema.schema,
            strict: analysisSchema.strict,
          },
        },
      }),
    });

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text();
      await supabase.from('resumes').update({ upload_status: 'failed' }).eq('id', resumeId).eq('user_id', user.id);

      return new Response(JSON.stringify({ error: errorText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const responseJson = await openAiResponse.json();
    const contentText = responseJson.output?.[0]?.content?.[0]?.text;

    if (!contentText) {
      await supabase.from('resumes').update({ upload_status: 'failed' }).eq('id', resumeId).eq('user_id', user.id);

      return new Response(JSON.stringify({ error: 'No analysis content returned from OpenAI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const analysis = JSON.parse(contentText);

    const { data, error } = await supabase
      .from('analyses')
      .upsert({
        resume_id: resumeId,
        user_id: user.id,
        score: analysis.score,
        summary: analysis.summary,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        insights: analysis.insights,
        analysis_source: openAiModel,
      }, { onConflict: 'resume_id' })
      .select()
      .single();

    if (error) {
      await supabase.from('resumes').update({ upload_status: 'failed' }).eq('id', resumeId).eq('user_id', user.id);

      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabase.from('resumes').update({ upload_status: 'analyzed' }).eq('id', resumeId).eq('user_id', user.id);

    return new Response(JSON.stringify({ analysis: data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
