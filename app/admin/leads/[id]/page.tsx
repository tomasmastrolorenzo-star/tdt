import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { LeadProfileClient } from './lead-profile-client';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout-button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LeadProfilePage(props: { params: Promise<{ id: string }> }) {
  const leadId = (await props.params).id;
  const cookieStore = await cookies();
  
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() } , setAll() {} }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: lead } = await supabase.from('leads').select('*').eq('id', leadId).single();
  
  if (!lead) {
      return (
        <div className="p-12 text-center text-white bg-black min-h-screen">
          <p className="text-zinc-500 mb-4">Lead strictly not found or dropped from ledger.</p>
          <a href="/admin/leads" className="text-white border border-zinc-800 px-4 py-2 rounded-lg font-bold hover:bg-zinc-900 transition-colors">Return to Pipeline</a>
        </div>
      );
  }

  const { data: interactions } = await supabase.from('interactions').select('*').eq('lead_id', leadId).order('created_at', { ascending: false });
  const { data: events } = await supabase.from('events_log').select('*').eq('entity_id', leadId).order('created_at', { ascending: false });
  const { data: client } = await supabase.from('clients').select('*').eq('lead_id', leadId).single();

  // Fast Travel Algorithm (Execution Speed Protocol)
  const { data: siblingLeads } = await supabase.from('leads').select('id, priority').eq('status', lead.status);
  let prevId = null;
  let nextId = null;
  
  if (siblingLeads) {
    const priorityScore: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const sorted = siblingLeads.sort((a, b) => {
        const pA = priorityScore[a.priority || 'medium'] || 0;
        const pB = priorityScore[b.priority || 'medium'] || 0;
        return pB - pA;
    });
    
    const idx = sorted.findIndex(l => l.id === leadId);
    if (idx > 0) prevId = sorted[idx - 1].id;
    if (idx !== -1 && idx < sorted.length - 1) nextId = sorted[idx + 1].id;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800">
      <div className="max-w-[1400px] mx-auto px-6 pt-12">
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-900">
           <div>
             <a href="/admin/leads" className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] mb-3 inline-block transition-colors">← Back to Pipeline</a>
             <h1 className="text-3xl font-black tracking-tighter">Closer Engine</h1>
           </div>
           <LogoutButton />
        </header>

        <LeadProfileClient 
           initialLead={lead} 
           initialInteractions={interactions || []}
           initialEvents={events || []}
           initialClient={client || null}
           prevId={prevId}
           nextId={nextId}
        />
      </div>
    </div>
  );
}
