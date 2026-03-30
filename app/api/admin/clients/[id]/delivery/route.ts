import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const id = (await props.params).id;
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { delivery_status } = await req.json();

  if (!['pending', 'delivered'].includes(delivery_status)) {
     return NextResponse.json({ error: 'Invalid delivery_status payload' }, { status: 400 });
  }

  const { data: updatedClient, error: updateErr } = await supabase
    .from('clients')
    .update({ delivery_status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  return NextResponse.json({ success: true, client: updatedClient });
}
