import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { type } = await req.json(); // 'usage' or 'conversion'
    const scriptId = params.id;

    if (!['usage', 'conversion'].includes(type)) {
      return NextResponse.json({ error: 'Invalid update type' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Use RPC or atomic increment if possible, but for simplicity since we disabled RLS:
    // We increment based on current value.
    const { data: current } = await supabase
      .from('scripts')
      .select('usos, conversiones')
      .eq('id', scriptId)
      .single();

    if (!current) return NextResponse.json({ error: 'Script not found' }, { status: 404 });

    const update: any = {
      usos: (current.usos || 0) + 1
    };

    if (type === 'conversion') {
      update.conversiones = (current.conversiones || 0) + 1;
      update.es_ganador = true; // Auto-promote to winner if it converts (optional but good)
    }

    const { data: script, error } = await supabase
      .from('scripts')
      .update(update)
      .eq('id', scriptId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, script });

  } catch (error: any) {
    console.error('Script conversion tracking error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
