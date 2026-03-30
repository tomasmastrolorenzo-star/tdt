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

  const { nicho, etapa, contenido } = await req.json();
  if (!contenido?.trim()) return NextResponse.json({ error: 'Contenido requerido' }, { status: 400 });

  const { data: script, error } = await supabase
    .from('scripts')
    .insert({ nicho: nicho || 'todos', etapa: etapa || 'cold_dm', contenido, es_ganador: false })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ script });
}
