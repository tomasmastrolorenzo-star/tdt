import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { nicho, seguidores, etapa, contexto } = await req.json();

  const SYSTEM_PROMPT = `You are a sales assistant for TDT, an Instagram growth agency.
Your job is to write short, natural-sounding DMs in Spanish (Latin American casual).
Rules:
- Never sell in the first message
- Sound human, not like a bot
- Max 2 sentences for cold DM, max 3 for follow-ups
- Adapt tone to the niche: fitness = casual/bro, emprendedor = sharp/direct, modelo/lifestyle = friendly
- Never use exclamation marks more than once
- Never say "I hope this message finds you well"
Output: only the message text, nothing else.`;

  const USER_PROMPT = `Niche: ${nicho}
Follower range: ${seguidores}
Stage: ${etapa}${contexto ? `\nContext: ${contexto}` : ''}`;

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: USER_PROMPT }
        ],
        max_tokens: 300,
        temperature: 0.85,
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'OpenAI error');
    const script = data.choices?.[0]?.message?.content?.trim() || '';
    return NextResponse.json({ script });
  } catch(err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
