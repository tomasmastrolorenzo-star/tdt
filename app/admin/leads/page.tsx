import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { LeadsClientRenderer } from './leads-client';
import { LogoutButton } from '@/components/auth/logout-button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLeadsPage() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return <div className="p-8 text-white bg-black h-screen">Database configuration missing</div>;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
    }
  });

  const { data: leads, error } = await supabase
    .from('leads')
    .select(`
      *,
      interactions (count),
      events_log (count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500 bg-black h-screen">Error loading leads: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans selection:bg-zinc-800">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">Data Core: Leads</h1>
            <p className="text-zinc-500 mt-2">Central system foundation. All actions are tracked.</p>
          </div>
          <LogoutButton />
        </header>

        <LeadsClientRenderer initialLeads={leads || []} />
      </div>
    </div>
  );
}
