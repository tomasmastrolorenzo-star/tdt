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

  const { lead_id, instagram, status, metadata, interactions } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
     return NextResponse.json({ error: 'OpenAI integration offline. Key restricted.' }, { status: 500 });
  }

  // System Prompt for Unified Native Smart Automation
  const systemPrompt = `
You are the elite "TDT Central Brain". Your job is to strictly classify the given lead and preemptively write 3 highly converting Instagram DM outreach messages natively for the user to copy. 
The messages MUST sound like natural Instagram chat from a young entrepreneur (TDT founder). Short, no caps, no corporate talk, zero emojis. 
Your output MUST be plain raw JSON, exactly matching following schema:
{
  "niche": (guess based on instagram username or interactions, single noun, e.g. "fitness", "agencia", "desconocido"),
  "interest_level": ("high", "medium", "low"),
  "priority": ("high", "medium", "low"),
  "buyer_type": ("b2b", "b2c", "unknown"),
  "draft_start": "...",
  "draft_follow_up": "...",
  "draft_close": "..."
}
  `;

  const leadContext = `
Instagram: @${instagram}
Current Status: ${status}
Past Metadata Context: ${JSON.stringify(metadata?.sales_context || {})}
Recent Interactions: ${interactions?.slice(0,5).map((i:any) => i.content).join(' | ') || 'None yet'}
  `;

  try {
     const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
           model: "gpt-4o-mini", // Cost efficient native brain structure
           temperature: 0.7,
           messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: leadContext }
           ],
           response_format: { type: "json_object" }
        })
     });

     const openaiData = await openaiRes.json();
     if (openaiData.error) throw new Error(openaiData.error.message);

     const aiResponseText = openaiData.choices[0].message.content.trim();
     const aiClassification = JSON.parse(aiResponseText);

     // Execute unified database patch immediately combining metadata JSONB and strictly typed priority column
     
     const currentMetadata = metadata || {};
     const currentSalesContext = currentMetadata.sales_context || {};
     
     const newMetadata = {
       ...currentMetadata,
       sales_context: {
         ...currentSalesContext,
         buyer_type: aiClassification.buyer_type,
         interest_level: aiClassification.interest_level,
       },
       niche: aiClassification.niche,
       ai_drafts: {
         start: aiClassification.draft_start,
         follow_up: aiClassification.draft_follow_up,
         close: aiClassification.draft_close
       }
     };

     const { error: updateError } = await supabase
       .from('leads')
       .update({ 
          metadata: newMetadata, 
          priority: aiClassification.priority 
       })
       .eq('id', lead_id);

     if (updateError) throw new Error(updateError.message);

     return NextResponse.json({ success: true, ai_data: aiClassification, metadata: newMetadata });
  } catch (error: any) {
     return NextResponse.json({ error: error.message || 'AI Generation explicitly failed' }, { status: 500 });
  }
}
