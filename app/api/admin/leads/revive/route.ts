import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { lead_id } = await req.json();
    if (!lead_id) return NextResponse.json({ error: 'Missing lead_id' }, { status: 400 });

    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey) throw new Error('OPENAI_API_KEY missing');

    // 1. Fetch Lead & Context
    const { data: lead } = await supabase.from('leads').select('*').eq('id', lead_id).single();
    const { data: interactions } = await supabase.from('interactions')
      .select('content, type')
      .eq('lead_id', lead_id)
      .order('created_at', { ascending: false })
      .limit(3);

    const context = interactions?.map(i => `${i.type}: ${i.content}`).join('\n') || 'No previous history.';

    const systemPrompt = `
You are a high-level IG sales assistant. Your goal is to REVIVE a conversation that went cold.
The lead is @${lead.instagram_username} (Niche: ${lead.niche}). 
Status: ${lead.status}.

LAST CONTEXT:
${context}

RULES:
- Spanish ONLY.
- Predominantly lowercase.
- Extremely short (max 12 words).
- No greetings, no formal stuff. 
- Goal: Ask a lightweight question or make a brief comment to get a reply.
- Examples: "viste lo que te mandé?", "sigues por ahí?", "che me olvidé de preguntarte, [pregunta]"
- Output ONLY the message.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }],
        temperature: 0.8
      })
    });

    const aiData = await response.json();
    if (!response.ok) throw new Error(aiData.error?.message || 'OpenAI Error');

    const message = aiData.choices[0].message.content.trim();

    return NextResponse.json({ success: true, message });

  } catch (error: any) {
    console.error('Revive AI Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
