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
    if (!openAiKey) return NextResponse.json({ error: 'OPENAI_API_KEY missing' }, { status: 500 });

    // 1. Consultar marketing_content WHERE es_winner = true
    const { data: winners, error: winErr } = await supabase
      .from('marketing_content')
      .select('hook, cta, titulo, nicho, tipo')
      .eq('es_winner', true)
      .limit(5);
    
    if (winErr) throw winErr;

    // (Optional: Implementar lógica "Consultar leads — obtener nichos" here)
    // Para simplificar, inyectamos en el prompt como ordenó Claude.

    const winnerContext = winners && winners.length > 0 
      ? winners.map(w => `Title: ${w.titulo} | Hook: ${w.hook}`).join('\n') 
      : 'Generar Hooks iniciales de crecimiento en Instagram.';

    const systemPrompt = `
You are a social media content strategist for TDT, an Instagram growth agency.
Analyze the winning hooks provided and generate new content ideas following the same patterns.
Focus on: before/after results, educational content about Instagram growth, behind-the-scenes process.
Target niches: fitness, entrepreneurs, lifestyle/models.
Output: JSON array of 5 content ideas with fields: titulo, tipo, nicho, hook, cta.
Output only the JSON array, nothing else.

WINNING HOOKS PATTERNS:
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
    if (!response.ok) throw new Error(aiData.error?.message || 'OpenAI Error');

    const cleanJson = aiData.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedIdeas = JSON.parse(cleanJson);

    // Insertar en columna 'Ideas'
    const inserts = parsedIdeas.map((h: any) => ({
      ...h,
      estado: 'Ideas',
      resultado_alcance: 0,
      resultado_leads: 0,
      es_winner: false
    }));

    await supabase.from('marketing_content').insert(inserts);

    return NextResponse.json({ success: true, generated: inserts.length });

  } catch (error: any) {
    console.error('AI Ideas Gen Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
