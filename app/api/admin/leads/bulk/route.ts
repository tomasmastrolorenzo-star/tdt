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

  const { leads } = await req.json();
  if (!Array.isArray(leads) || leads.length === 0) {
    return NextResponse.json({ error: 'No leads provided' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const rows = leads.map((l: any) => ({
    instagram_username: l.handle_ig?.replace('@', '').trim(),
    source: l.fuente || 'dm',
    niche: l.nicho || 'otro',
    followers_range: l.seguidores || '5k_20k',
    status: 'new',
    last_contact: now,
    created_at: now,
    updated_at: now,
  }));

  const { data, error } = await supabase.from('leads').insert(rows).select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: data?.length || 0, failed: leads.length - (data?.length || 0) });
}
