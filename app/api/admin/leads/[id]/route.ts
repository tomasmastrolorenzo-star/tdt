import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// GET: Aggregate lead profile data for dynamic hydration
export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const id = (await props.params).id;
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 1. Fetch Lead
  const { data: lead, error: leadErr } = await supabase.from('leads').select('*').eq('id', id).single();
  if (leadErr || !lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  // 2. Fetch Interactions
  const { data: interactions } = await supabase.from('interactions').select('*').eq('lead_id', id).order('created_at', { ascending: false });

  // 3. Fetch Events
  const { data: events } = await supabase.from('events_log').select('*').eq('entity_id', id).order('created_at', { ascending: false });

  // 4. Fetch Client Check
  const { data: client } = await supabase.from('clients').select('*').eq('lead_id', id).single();

  return NextResponse.json({ 
    lead, 
    interactions: interactions || [], 
    events: events || [], 
    client: client || null 
  });
}

// PATCH: Safe Deep-Merge specifically targeting the Sales Context Metadata
export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const id = (await props.params).id;
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sales_context } = await req.json();
  if (!sales_context) return NextResponse.json({ error: 'Missing payload' }, { status: 400 });

  // Native structural validation protecting the core JSONB mapping
  const validBuyers = [null, 'impulse', 'logical', 'unsure'];
  const validInterests = [null, 'low', 'medium', 'high'];

  if (sales_context.buyer_type !== undefined && !validBuyers.includes(sales_context.buyer_type)) {
    return NextResponse.json({ error: 'Invalid buyer_type schema' }, { status: 400 });
  }
  if (sales_context.interest_level !== undefined && !validInterests.includes(sales_context.interest_level)) {
    return NextResponse.json({ error: 'Invalid interest_level schema' }, { status: 400 });
  }

  // Baseline Pull for Safe Merge
  const { data: lead } = await supabase.from('leads').select('metadata').eq('id', id).single();
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  const existingMetadata = lead.metadata || {};
  const existingSalesContext = existingMetadata.sales_context || {};

  const mergedMetadata = {
    ...existingMetadata,
    sales_context: {
      ...existingSalesContext,
      ...sales_context
    }
  };

  const { data: updatedLead, error: updateErr } = await supabase
    .from('leads')
    .update({ metadata: mergedMetadata, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });
  
  return NextResponse.json({ success: true, lead: updatedLead });
}
