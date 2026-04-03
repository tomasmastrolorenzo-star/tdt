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

    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey) return NextResponse.json({ error: 'OPENAI_API_KEY is missing in backend environment.' }, { status: 500 });

    // 1. Fetch Top Winners from marketing_content (Max 3)
    const { data: winners, error: winErr } = await supabase
      .from('marketing_content')
      .select('hook, cta, titulo, nicho, tipo')
      .eq('es_winner', true)
      .order('resultado_alcance', { ascending: false })
      .limit(3);

    if (winErr) throw winErr;

    const winnerContext = winners && winners.length > 0 
      ? winners.map(w => `Title: ${w.titulo} | Hook: ${w.hook} | CTA: ${w.cta} | Niche: ${w.nicho}`).join('\n') 
      : 'No previous winners found. Generate generic high-converting hooks for a digital marketing/business growth agency.';

    // 2. OpenAI Generation
    const systemPrompt = `
You are an elite short-form content creator (TikTok/Reels).
Your job is to generate 3 new high-converting Reel hooks based on the agency's previous top performing hooks.
Output EXCLUSIVELY a JSON array with 3 objects. NO markdown formatting, NO extra text.
Format required exactly:
[
  { 
    "titulo": "Catchy short title 1",
    "hook": "The first 3 seconds verbal hook to retain attention...",
    "cta": "The call to action text...",
    "nicho": "Emprendedores",
    "tipo": "reel"
  }
]

PREVIOUS TOP PERFORMERS FOR INSPIRATION:
${winnerContext}
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
        temperature: 0.85
      })
    });

    const aiData = await response.json();
    if (!response.ok) throw new Error(aiData.error?.message || 'OpenAI handshake failed');

    const generatedRaw = aiData.choices[0].message.content.trim();
    
    // Clean potential markdown blocks from OpenAI
    const cleanJson = generatedRaw.replace(/```json/g, '').replace(/```/g, '').trim();
    const newHooks = JSON.parse(cleanJson);

    // 3. Inject into Kanban Database (estado: Ideas)
    const inserts = newHooks.map((h: any) => ({
      titulo: h.titulo,
      hook: h.hook,
      cta: h.cta,
      nicho: h.nicho || 'General',
      tipo: h.tipo || 'reel',
      estado: 'Ideas',
      resultado_alcance: 0,
      resultado_leads: 0,
      es_winner: false
    }));

    const { error: insertErr } = await supabase.from('marketing_content').insert(inserts);
    if (insertErr) throw insertErr;

    return NextResponse.json({ success: true, generated: inserts.length });

  } catch (error: any) {
    console.error('Traffic Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Error generating content' }, { status: 500 });
  }
}
