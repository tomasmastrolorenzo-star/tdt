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

  const body = await req.json();
  const { titulo, tipo, nicho, estado } = body;

  const { data, error } = await supabase.from('marketing_content').insert({
    titulo,
    tipo,
    nicho,
    estado: estado || 'Ideas',
    resultado_alcance: 0,
    resultado_leads: 0,
    es_winner: false
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, item: data });
}

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, ...updates } = await req.json();

  const updatePayload: any = {};
  
  // Aceptamos cualquier campo permitido en el schema v15+ Bloque 3
  const allowedFields = [
    'estado', 'titulo', 'tipo', 'nicho', 'semana_programada', 
    'hook', 'cta', 'resultado_alcance', 'resultado_leads', 'es_winner'
  ];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
       updatePayload[field] = updates[field];
    }
  }

  const { data, error } = await supabase.from('marketing_content').update(updatePayload).eq('id', id).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, item: data });
}
