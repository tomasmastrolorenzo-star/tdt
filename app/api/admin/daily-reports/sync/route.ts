import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: { getAll() { return cookieStore.getAll() } , setAll() {} }
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const todayStr = new Date().toISOString().split('T')[0];
    
    // UPSERT methodology: Try to find today's report
    const { data: existing } = await supabase
       .from('daily_reports')
       .select('id')
       .eq('report_date', todayStr)
       .maybeSingle();

    if (existing && existing.id) {
       const { error } = await supabase
         .from('daily_reports')
         .update(payload)
         .eq('id', existing.id);
       if(error) throw error;
    } else {
       const { error } = await supabase
         .from('daily_reports')
         .insert({ report_date: todayStr, ...payload });
       if(error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
