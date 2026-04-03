import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { SalesClient } from './sales-client';
import { Banknote } from 'lucide-react';
import { NotificationBell } from '@/components/admin/notification-bell';
import { LogoutButton } from '@/components/auth/logout-button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SalesOnboardingPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() } , setAll() {} }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch pending clients (leads that are closed but not onboarded into Ledger properly?)
  // Wait, TDT creates the client automatically via update_lead_status_atomic.
  // We should pull clients where net_revenue is null (meaning they haven't been financially onboarded)
  const { data: rawClients, error } = await supabase
    .from('clients')
    .select('*, leads(instagram_username)')
    .order('created_at', { ascending: false });

  if (error || !rawClients) {
     return <div className="p-10 text-white font-black">Database Unreachable</div>;
  }

  // Filter clients that need onboarding (no payment method set)
  const pendingOnboarding = rawClients.filter(c => !c.payment_method);
  const onboardedClients = rawClients.filter(c => c.payment_method);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        
        <header className="flex items-center justify-between mb-12 pb-6 border-b border-zinc-900">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#1b624a] rounded-xl flex items-center justify-center border border-[#1D9E75]/30">
                <Banknote className="w-6 h-6 text-[#1D9E75]" />
             </div>
             <div>
                <h1 className="text-3xl font-black tracking-tighter">Sales Ledger</h1>
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Financial Onboarding & Accounting</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <NotificationBell />
             <LogoutButton />
           </div>
        </header>

        <SalesClient pending={pendingOnboarding} ledger={onboardedClients} />

      </div>
    </div>
  );
}
