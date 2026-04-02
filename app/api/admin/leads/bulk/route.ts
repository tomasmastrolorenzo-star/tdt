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

  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const { error } = await supabase.from('leads').insert(row);
    if (error) {
      if (error.code === '23505') {
        skipped++;
      } else {
        errors.push(`@${row.instagram_username}: ${error.message}`);
      }
    } else {
      inserted++;
    }
  }

  return NextResponse.json({ inserted, skipped, errors });
}
