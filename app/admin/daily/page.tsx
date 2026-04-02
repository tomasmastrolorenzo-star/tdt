import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout-button';
import { DailyRoutineClient } from './daily-client';
import { Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DailyRoutinePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() } , setAll() {} }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const todayStr = new Date().toISOString().split('T')[0];

  const [
    { data: leads },
    { data: actionableLeads },
    { data: todayReport }
  ] = await Promise.all([
    supabase.from('leads').select('id, status, updated_at, created_at'),
    supabase.from('leads')
      .select('*')
      .not('status', 'in', '("closed","lost","reengage")')
      .lte('next_action_date', new Date().toISOString())
      .order('next_action_date', { ascending: true }),
    supabase.from('daily_reports').select('*').eq('report_date', todayStr).maybeSingle()
  ]);

  if (!leads) return <div className="p-10 text-white font-black text-center text-xl bg-red-950">Database Unreachable. Execute Core Module Migrations.</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800 pb-20">
      <div className="max-w-[900px] mx-auto px-6 pt-12">
        
        {/* HEADER */}
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-900">
           <div className="flex gap-12 items-center">
             <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-orange-500" />
                <div>
                  <h1 className="text-3xl font-black tracking-tighter">Operaciones Diarias</h1>
                  <p className="text-zinc-500 mt-2">Tu motor de ejecución. Cada acción importa.</p>
                </div>
             </div>
             <nav className="hidden md:flex gap-6 items-center">
                <a href="/admin/ceo" className="text-zinc-500 hover:text-white text-[10px] uppercase font-black tracking-widest transition-colors">CEO Control</a>
                <a href="/admin/leads" className="text-zinc-500 hover:text-white text-[10px] uppercase font-black tracking-widest transition-colors">CRM Pipeline</a>
             </nav>
           </div>
           <LogoutButton />
        </header>

        <DailyRoutineClient 
          initialLeads={leads} 
          initialActionableLeads={actionableLeads}
          initialReport={todayReport} 
        />
      </div>
    </div>
  );
}
