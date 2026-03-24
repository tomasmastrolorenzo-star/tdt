import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function PATCH(req: Request) {
  try {
    const { lead_id, new_status } = await req.json();

    if (!lead_id || !new_status) {
      return NextResponse.json({ error: 'Missing parameters: require lead_id and new_status' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // SSR Client automatically checks JWT session validating the authenticated admin user
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
         return NextResponse.json({ error: 'Unauthorized to perform this action' }, { status: 401 });
    }

    // Call the Postgres RPC guaranteeing 100% Atomic Execution
    const { data, error } = await supabase.rpc('update_lead_status_atomic', {
      p_lead_id: lead_id,
      p_new_status: new_status,
      p_admin_user_id: user.id
    });

    if (error) {
      console.error('RPC Error:', error);
      // Clean rollback intercept allowing UI to handle duplicate graceful updates without crashing
      if (error.message && error.message.includes('Duplicate update: Status is already')) {
        return NextResponse.json({ success: true, message: 'Status already matches baseline' });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
