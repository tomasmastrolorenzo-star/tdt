import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// SERVICE MAP DEFINED BY TOMAS FROM HIS PERFECT PANEL V2
const SERVICE_MAP: Record<string, { id: string; quantity: number }> = {
  followers_10k:  { id: '123', quantity: 10000 }, // REPLACE WITH REAL ID
  followers_50k:  { id: '456', quantity: 50000 },
  followers_100k: { id: '789', quantity: 100000 },
  engagement_basic:    { id: '101', quantity: 500 },
  engagement_advanced: { id: '102', quantity: 1000 },
};

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await req.json();
    const { client_id, instagram_handle, service_type } = payload;
    let { quantity } = payload;

    if (!client_id || !instagram_handle || !service_type) {
       return NextResponse.json({ error: 'Missing client_id, handle or service_type' }, { status: 400 });
    }

    const panelUrl = process.env.SMM_PANEL_URL;
    const apiKey = process.env.SMM_PANEL_API_KEY;

    if (!panelUrl || !apiKey) {
      return NextResponse.json({ error: 'SMM API configuration missing in Vercel' }, { status: 500 });
    }

    // Determine Service ID
    const mappedService = SERVICE_MAP[service_type];
    const serviceId = mappedService ? mappedService.id : service_type; // Fallback to raw if not in map
    if (!quantity && mappedService) {
      quantity = mappedService.quantity;
    }

    if (!serviceId || !quantity) {
        return NextResponse.json({ error: 'Invalid service map or missing quantity' }, { status: 400 });
    }

    const formData = new URLSearchParams();
    formData.append('key', apiKey);
    formData.append('action', 'add');
    formData.append('service', serviceId);
    formData.append('link', `https://instagram.com/${instagram_handle.replace('@', '')}`);
    formData.append('quantity', quantity.toString());

    // 1. Dispatch to panel
    const panelReq = await fetch(panelUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    const panelResStr = await panelReq.text();
    let panelRes: any;
    try { panelRes = JSON.parse(panelResStr); } catch(e) { panelRes = { error: 'Invalid JSON from Panel' }; }

    if (panelRes.error) {
       throw new Error(`Panel Rejected: ${panelRes.error}`);
    }

    const orderId = panelRes.order ? panelRes.order.toString() : 'unknown';

    // 2. Patch database
    const { error: dbErr } = await supabase
       .from('clients')
       .update({ 
          smm_order_id: orderId,
          delivery_status: 'processing'
       })
       .eq('id', client_id);

    if (dbErr) throw dbErr;

    return NextResponse.json({ success: true, order: orderId });

  } catch (error: any) {
    console.error("SMM API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
