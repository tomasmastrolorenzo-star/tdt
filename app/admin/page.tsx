import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CommandCenter } from "./command-center";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} }
  });

  // Parallel Baseline Extraction
  const [
    { count: totalLeads },
    { count: hotLeads },
    { data: recentLeads },
    { data: ledger }
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('temperature', 'HOT'),
    supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('clients').select('net_revenue').not('net_revenue', 'is', null)
  ]);

  const totalNet = ledger?.reduce((acc, curr) => acc + (curr.net_revenue || 0), 0) || 0;

  const stats = {
    totalLeads: totalLeads || 0,
    hotLeads: hotLeads || 0,
    totalNet: totalNet,
    recentLeads: recentLeads || []
  };

  return (
    <div className="flex-1 min-h-screen bg-[#050505] p-6 lg:p-12 overflow-y-auto custom-scrollbar">
       <CommandCenter stats={stats} />
    </div>
  );
}
