import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { TodayClient } from './today-client';
import { LogoutButton } from '@/components/auth/logout-button';
import { CalendarClock } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TodayPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() } , setAll() {} }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Securely query targets mapped to Today's tracker blocking Closed or Lost pipelines
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .not('status', 'in', '("closed","lost","reengage")')
    .lte('next_action_date', new Date().toISOString())
    .order('next_action_date', { ascending: true });

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800">
      <div className="max-w-[1400px] mx-auto px-6 pt-12">
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-900">
           <div>
             <a href="/admin/leads" className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block transition-colors">← Back to Pipeline</a>
             <div className="flex items-center gap-3">
                <CalendarClock className="w-8 h-8 text-zinc-500" />
                <h1 className="text-3xl font-black tracking-tighter">Daily Execution Feed</h1>
             </div>
           </div>
           
           <div className="flex gap-4 items-center">
              <a href="/admin/leads" className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] uppercase tracking-widest font-black py-2.5 px-4 rounded-lg transition-colors">
                 Full System
              </a>
              <LogoutButton />
           </div>
        </header>

        <TodayClient initialLeads={leads || []} />
      </div>
    </div>
  );
}
