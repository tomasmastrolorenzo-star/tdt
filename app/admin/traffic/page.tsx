import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout-button';
import { Target } from 'lucide-react';
import { TrafficClient } from './traffic-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TrafficDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() } , setAll() {} }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: contentBlocks } = await supabase
    .from('marketing_content')
    .select('*')
    .order('created_at', { ascending: false });

  if (!contentBlocks) return <div className="p-10 text-white font-black text-center text-xl bg-red-950">Traffic Marketing Database Unreachable.</div>;

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans selection:bg-zinc-800">
      <header className="flex items-center justify-between px-6 py-5 border-b border-zinc-900 bg-zinc-950 shrink-0">
         <div className="flex items-center gap-10">
           <div className="flex items-center gap-3">
              <Target className="w-7 h-7 text-indigo-500" />
              <h1 className="text-2xl font-black tracking-tighter text-white">Traffic Hub</h1>
           </div>
           
           <nav className="hidden md:flex items-center gap-5">
             <a href="/admin/leads" className="text-zinc-500 hover:text-white text-[10px] uppercase font-black tracking-widest transition-colors">CRM Pipeline</a>
             <a href="/admin/clients" className="text-zinc-500 hover:text-white text-[10px] uppercase font-black tracking-widest transition-colors">Financial Ledger</a>
             <a href="/admin/ceo" className="text-zinc-500 hover:text-white text-[10px] uppercase font-black tracking-widest transition-colors">CEO Control</a>
           </nav>
         </div>

         <div className="flex items-center gap-6">
            <LogoutButton />
         </div>
      </header>
      
      <main className="flex-1 overflow-hidden p-6 flex flex-col bg-black">
        <TrafficClient initialContent={contentBlocks} />
      </main>
    </div>
  );
}
