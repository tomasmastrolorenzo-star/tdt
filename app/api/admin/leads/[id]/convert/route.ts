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

  const { payment_amount, service_type, instagram } = await req.json();

  // 1. Shift Lead Pipeline Status via standard Atomic constraint
  const { error: rpcError } = await supabase.rpc('update_lead_status_atomic', {
      p_lead_id: id,
      p_new_status: 'closed',
      p_admin_user_id: user.id
  });

  // Ignore safe duplicates (e.g if it was already marked closed by another parallel setter)
  if (rpcError && !rpcError.message.includes('Duplicate')) {
     return NextResponse.json({ error: rpcError.message }, { status: 500 });
  }

  // 2. Hydrate Client Table bridging final conversion
  const { data: client, error: clientErr } = await supabase.from('clients').insert({
      lead_id: id,
      instagram: instagram || 'internal_conversion',
      service_type: service_type || 'Custom CRM Service',
      payment_amount: Number(payment_amount) || 0,
      status: 'active'
  }).select().single();

  if (clientErr) {
    return NextResponse.json({ error: clientErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, client });
}
