import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, source } = body;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env variables");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const cleanUsername = username.replace('@', '');

    // 1. Create Lead in Data Core
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert([
        { 
          instagram_username: cleanUsername, 
          source: source || 'landing',
          status: 'new'
        }
      ])
      .select('id')
      .single();

    if (leadError || !lead) {
      console.error("Supabase insert error (lead):", leadError);
      return NextResponse.json({ error: leadError?.message || "Failed to save lead" }, { status: 500 });
    }

    // 2. Create Initial Interaction 
    const { error: ixError } = await supabase
      .from('interactions')
      .insert([
        { 
          lead_id: lead.id,
          type: 'message_sent',
          content: { note: 'Initial request from landing page' }
        }
      ]);
    if (ixError) console.error("Data Core Error (ix):", ixError);

    // 3. Log Event
    const { error: eventError } = await supabase
      .from('events_log')
      .insert([
        {
          event_type: 'lead_created',
          entity_id: lead.id,
          metadata: { source: source || 'landing' }
        }
      ]);
    if (eventError) console.error("Data Core Error (event):", eventError);

    return NextResponse.json({ success: true, lead_id: lead.id });
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
