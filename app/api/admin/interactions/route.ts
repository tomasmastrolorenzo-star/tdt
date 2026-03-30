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

  const { lead_id, type, content, follow_up_days } = await req.json();
  if (!lead_id || !type || !content) return NextResponse.json({ error: 'Missing core interaction payload' }, { status: 400 });

  if (follow_up_days) {
     const nextActionDate = new Date(Date.now() + Number(follow_up_days) * 24 * 60 * 60 * 1000).toISOString();
     // Update lead action date silently
     await supabase.from('leads').update({ next_action_date: nextActionDate }).eq('id', lead_id);
  }

  const { data, error } = await supabase.from('interactions').insert({
    lead_id,
    user_id: user.id, // Phase 8: Setter Tracking Assignment natively locked
    type, 
    content,
    created_at: new Date().toISOString()
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, interaction: data });
}
