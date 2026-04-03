import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { clientId } = await req.json();
    if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 });

    // 1. Fetch Client Details
    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('*, leads(instagram_username)')
      .eq('id', clientId)
      .single();

    if (clientErr || !client) {
       return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const igHandle = client.leads?.instagram_username;
    if (!igHandle) {
       return NextResponse.json({ error: 'No Instagram handle found for client' }, { status: 400 });
    }

    // 2. Gatekeeping: Don't re-run if already completed or has order ID
    if (client.smm_order_id && client.smm_status !== 'failed') {
       return NextResponse.json({ message: 'Order already dispatched previously' }, { status: 200 });
    }

    // 3. SMM API Integration Setup
    const SMM_KEY = process.env.SMM_API_KEY;
    if (!SMM_KEY) {
       // Silent fail but don't break the CRM if the key isn't provided yet
       return NextResponse.json({ error: 'SMM_API_KEY missing from environment variables' }, { status: 500 });
    }

    // Heurística de conversión basada en el ledger: 
    // Usamos el servicio predeterminado del panel. (Ajustar constants aquí).
    const SMM_SERVICE_ID = 15; 
    let SMM_QUANTITY = 5000; // Plan Standard default

    if (Number(client.payment_amount) >= 1000) SMM_QUANTITY = 15000; // Plan Elite
    
    // 4. Perfect Panel v2 Call
    // Docs standard: /api/v2?key=&action=add&service=&link=&quantity=
    const panelUrl = "https://panel.trenddigitaltrade.es/api/v2";
    
    const params = new URLSearchParams();
    params.append('key', SMM_KEY);
    params.append('action', 'add');
    params.append('service', SMM_SERVICE_ID.toString());
    params.append('link', `https://www.instagram.com/${igHandle}/`);
    params.append('quantity', SMM_QUANTITY.toString());

    const smmRes = await fetch(panelUrl, {
      method: "POST",
      body: params
    });

    const smmData = await smmRes.json();

    // {"order": 12345} o {"error": "Insufficient balance"}
    if (smmData.error) {
      await supabase.from('clients').update({ smm_status: 'failed' }).eq('id', clientId);
      throw new Error(`SMM Panel Error: ${smmData.error}`);
    }

    const orderId = smmData.order;

    // 5. Update DB
    const { error: patchErr } = await supabase.from('clients')
        .update({ 
          smm_order_id: orderId?.toString() || 'unknown',
          smm_status: 'processing' 
        })
        .eq('id', clientId);

    if (patchErr) throw patchErr;

    return NextResponse.json({ success: true, order: orderId, handle: igHandle });

  } catch (error: any) {
    console.error('SMM Gateway Error:', error);
    return NextResponse.json({ error: error.message || 'Internal SMM gateway failure' }, { status: 500 });
  }
}
