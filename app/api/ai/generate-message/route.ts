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

  const { lead_id, message_type } = await req.json();
  if (!lead_id || !message_type) return NextResponse.json({ error: 'Missing core payload configuration' }, { status: 400 });

  // Baseline Extraction
  const { data: lead } = await supabase.from('leads').select('*').eq('id', lead_id).single();
  if (!lead) return NextResponse.json({ error: 'System lead disconnected' }, { status: 404 });

  // Extract Timeline Logic
  const { data: interactions } = await supabase.from('interactions')
    .select('created_at, type, content')
    .eq('lead_id', lead_id)
    .order('created_at', { ascending: false })
    .limit(5);

  const openAiKey = process.env.OPENAI_API_KEY;
  if (!openAiKey) return NextResponse.json({ error: 'ENGINE LOCK: OPENAI_API_KEY is completely missing natively in backend (.env.local)' }, { status: 500 });

  // STRICT TDT PROMPT ENGINEERING
  const systemPrompt = `
You are the elite closer for TDT (Trend Digital Trade). You represent Tomas.
The user is directly talking via Instagram DMs right now.

PERSONALITY RULES:
- Sound completely natural, extremely short, direct, and close.
- Exactly like a real IG chat (no email formats, strictly NO formal phrasing).
- NO technical language. NO sounding like a company/bot.
- NO robotic tone. NO greetings like 'Hola estimado' or 'Saludos cordiales'.
- Output ONLY the raw text ready to copy-paste. No quotes around it, no explanations. 
- Use lowercase predominantly if it fits the aesthetic, like: "hey bro, quick question"
- Language: Spanish.

TYPES OF MESSAGE INTENT:
- start: Start a conversation/icebreaker.
- follow_up: Resume contact seamlessly without sounding desperate.
- close: Lead heavily to payment and scarcity/urgency.
- reengage: Revive a totally cold lead natively.

TARGET LEAD CONTEXT (@${lead.instagram_username}):
Pipeline Status: ${lead.status}
Goal for this prompt: Execute a '${message_type}' message.
Sales Context Metadata => (Buyer Type: ${lead.metadata?.sales_context?.buyer_type || 'unknown'}, Interest: ${lead.metadata?.sales_context?.interest_level || 'unknown'}, Discussed Offer: ${lead.metadata?.sales_context?.offer_discussed || 'nothing yet'})

LAST 5 INTERACTIONS (Chronological Timeline History):
${JSON.stringify(interactions?.map(i => i.content), null, 2)}

Write the DM now:`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // using flagship model natively as requested for quality
        messages: [{ role: 'system', content: systemPrompt }],
        max_tokens: 180,
        temperature: 0.8
      })
    });

    const aiData = await response.json();
    if (!response.ok) throw new Error(aiData.error?.message || 'Upstream AI handshake failed');

    const generatedText = aiData.choices[0].message.content.trim();
    
    return NextResponse.json({ success: true, text: generatedText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
