import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const id = (await props.params).id;
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action_type } = await req.json();

  if (!['replied', 'defer', 'discard'].includes(action_type)) {
     return NextResponse.json({ error: 'Invalid core action_type schema' }, { status: 400 });
  }

  // Baseline Pull
  const { data: lead, error: fetchErr } = await supabase.from('leads').select('follow_up_count, priority').eq('id', id).single();
  if (fetchErr || !lead) return NextResponse.json({ error: 'System lead disconnected' }, { status: 404 });

  const now = new Date();
  let nextActionDate: string | null = null;
  let newFollowUpCount = lead.follow_up_count || 0;
  let interactionLogMsg: string | null = null;

  // Algorithm intervals mapped mathematically
  if (action_type === 'replied') {
      nextActionDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(); // +2 Days
      newFollowUpCount += 1;
      interactionLogMsg = 'Standard interaction sent. Lead pushed automatically +2 days back into queue.';
  } else if (action_type === 'defer') {
      const p = lead.priority || 'medium';
      const deferDays = p === 'low' ? 3 : 1;
      nextActionDate = new Date(now.getTime() + deferDays * 24 * 60 * 60 * 1000).toISOString();
      interactionLogMsg = `Action explicitly deferred by +${deferDays} day(s) based on systemic Priority rules (${p}).`;
  } else if (action_type === 'discard') {
      nextActionDate = null; // Purge from Radar completely
      interactionLogMsg = 'Lead physically discarded from active tracking routines.';
  }

  // Fallback to internal RPC logic if dropping lead from engine totally
  if (action_type === 'discard') {
      const { error: rpcError } = await supabase.rpc('update_lead_status_atomic', {
          p_lead_id: id,
          p_new_status: 'lost',
          p_admin_user_id: user.id
      });
      if (rpcError && !rpcError.message.includes('Duplicate')) throw new Error(rpcError.message);
  }

  // Flush date calculations physically into Table
  const updatePayload: any = { 
      next_action_date: nextActionDate, 
      follow_up_count: newFollowUpCount,
      updated_at: new Date().toISOString()
  };

  const { data: updatedLead, error: updateErr } = await supabase
    .from('leads')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  // Flush Timeline Log natively bridging records
  if (interactionLogMsg) {
      await supabase.from('interactions').insert({
          lead_id: id,
          type: 'manual_update',
          content: { note: interactionLogMsg }
      });
  }
  
  return NextResponse.json({ success: true, lead: updatedLead });
}
