import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function PATCH(req: Request) {
  try {
    const { lead_id, new_status } = await req.json();

    if (!lead_id || !new_status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Update Lead Status
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status: new_status, updated_at: new Date().toISOString() })
      .eq('id', lead_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 2. Log Event
    await supabase.from('events_log').insert([
      {
        event_type: 'status_changed',
        entity_id: lead_id,
        metadata: { new_status }
      }
    ]);

    // 3. Create Interaction (manual_update)
    await supabase.from('interactions').insert([
      {
        lead_id: lead_id,
        type: 'manual_update',
        content: { note: `Status manually updated to ${new_status}` }
      }
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
