import { createClient } from '@supabase/supabase-js';
import { LeadsClientRenderer } from './leads-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLeadsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return <div className="p-8 text-white bg-black h-screen">Database configuration missing</div>;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch leads with interaction count and event log count
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
        <header className="mb-8 border-b border-zinc-900 pb-6">
          <h1 className="text-3xl font-black tracking-tighter">Data Core: Leads</h1>
          <p className="text-zinc-500 mt-2">Central system foundation. All actions are tracked.</p>
        </header>

        <LeadsClientRenderer initialLeads={leads || []} />
      </div>
    </div>
  );
}
