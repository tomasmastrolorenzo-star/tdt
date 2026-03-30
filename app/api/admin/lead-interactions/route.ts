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

  const { lead_id, tipo, contenido } = await req.json();
  if (!lead_id || !tipo || !contenido) {
    return NextResponse.json({ error: 'lead_id, tipo, contenido required' }, { status: 400 });
  }

  const { data: interaction, error } = await supabase
    .from('lead_interactions')
    .insert({ lead_id, tipo, contenido })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ interaction });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lead_id = searchParams.get('lead_id');
  
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!lead_id) return NextResponse.json({ error: 'lead_id required' }, { status: 400 });

  const { data, error } = await supabase
    .from('lead_interactions')
    .select('*')
    .eq('lead_id', lead_id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ interactions: data });
}
