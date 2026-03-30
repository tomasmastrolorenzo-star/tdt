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

  // Dynamically map any provided Post-Sale fields (excluding primary keys natively)
  const payload = await req.json();
  const safePayload: any = { updated_at: new Date().toISOString() };

  if (payload.status !== undefined) {
    if (!['active', 'inactive'].includes(payload.status)) return NextResponse.json({ error: 'Invalid state struct' }, { status: 400 });
    safePayload.status = payload.status;
  }
  if (payload.notes !== undefined) safePayload.notes = payload.notes;
  if (payload.renewal_date !== undefined) safePayload.renewal_date = payload.renewal_date;
  
  // Specific Native System Timestamp Command ('check_now')
  if (payload.action === 'check_now') {
    safePayload.last_check = new Date().toISOString();
  }

  const { data: updatedClient, error: updateErr } = await supabase
    .from('clients')
    .update(safePayload)
    .eq('id', id)
    .select()
    .single();

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  return NextResponse.json({ success: true, client: updatedClient });
}
