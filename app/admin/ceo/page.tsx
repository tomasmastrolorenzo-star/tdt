import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout-button';
import { Activity, ShieldAlert, BadgeDollarSign, HeartPulse, UserCircle2, Clock, ArrowRight } from 'lucide-react';
import { DailyDmsClient } from './daily-dms-client';
import { NotificationBell } from '@/components/admin/notification-bell';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CEODashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() } , setAll() {} }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Parallel Raw Data Extraction (High-Speed Analytics Array - Phase 14)
  const todayStr = new Date().toISOString().split('T')[0];
  const [
    { data: clients },
    { data: leads },
    { data: dailyReport },
    { data: actions }
  ] = await Promise.all([
    supabase.from('clients').select('*'),
    supabase.from('leads').select('id, status, created_at, updated_at, instagram_username'),
    supabase.from('daily_reports').select('dms_sent').eq('report_date', todayStr).maybeSingle(),
    supabase.from('scheduled_actions').select('id, status, execute_at, action_type')
  ]);

  if (!clients || !leads) return <div className="p-10 text-white font-black text-center text-xl bg-red-950">Analytics Database Unreachable. Note: Execute V14 Migrations first.</div>;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  // 1. Core Mathematical Deductions (Módulo 5 Strict Spec)
  const revenue_today = clients
    .filter(c => new Date(c.created_at).toISOString().split('T')[0] === todayStr)
    .reduce((sum, c) => sum + (Number(c.net_revenue) || Number(c.payment_amount) || 0), 0);

  const revenue_month = clients
    .filter(c => new Date(c.created_at).getTime() >= startOfMonth)
    .reduce((sum, c) => sum + (Number(c.net_revenue) || Number(c.payment_amount) || 0), 0);

  const active_clients = clients.filter(c => c.delivery_status !== 'delivered').length;
  
  const leads_today = leads.filter(l => new Date(l.created_at).toISOString().split('T')[0] === todayStr).length;
  
  const conversaciones_activas = leads.filter(l => ['responded', 'qualified', 'offer_sent', 'payment_pending'].includes(l.status)).length;
  
  const closes_today = leads.filter(l => l.status === 'closed' && new Date(l.updated_at).toISOString().split('T')[0] === todayStr).length;
  
  const initialDms = dailyReport?.dms_sent || 0;
  
  const conversion_rate_dms = leads_today > 0 ? ((conversaciones_activas / leads_today) * 100).toFixed(1) : "0.0";
  
  const entregas_pendientes = clients.filter(c => ['pending', 'processing'].includes(c.delivery_status)).length;
  
  const retention_due = (actions || []).filter(a => a.action_type === 'retention_message' && new Date(a.execute_at).getTime() <= now.getTime() && a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 pt-12">
        
        {/* HEADER */}
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-900">
           <div className="flex gap-12 items-center">
             <div className="flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-indigo-500" />
                <h1 className="text-3xl font-black tracking-tighter">CEO Control</h1>
             </div>
             <nav className="hidden md:flex gap-6 items-center">
                <a href="/admin/leads" className="text-zinc-500 hover:text-white text-[10px] uppercase font-black tracking-widest transition-colors">CRM</a>
                <a href="/admin/sales" className="text-zinc-500 hover:text-white text-[10px] uppercase font-black tracking-widest transition-colors">Sales</a>
                <a href="/admin/clients" className="text-zinc-500 hover:text-white text-[10px] uppercase font-black tracking-widest transition-colors">Ledger</a>
                <a href="/admin/daily" className="text-zinc-500 hover:text-white text-[10px] uppercase font-black tracking-widest transition-colors flex items-center gap-1.5"><Clock className="w-3 h-3"/> Daily</a>
             </nav>
           </div>
           <div className="flex items-center gap-3">
             <NotificationBell />
             <LogoutButton />
           </div>
        </header>

        {/* 1. MAIN METRICS GRID (MÓDULO 5 Spec) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
           
           {/* Revenue Matrices */}
           <div className="col-span-2 lg:col-span-2 bg-gradient-to-br from-indigo-950/40 text-left to-black border border-indigo-900/50 rounded-2xl p-6 shadow-2xl relative">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-60 flex items-center gap-1.5"><BadgeDollarSign className="w-3.5 h-3.5"/> Revenue YTD</span>
              <h2 className="text-4xl lg:text-5xl font-black mt-2 text-white">${revenue_month.toLocaleString()}</h2>
              <div className="mt-4 text-[10px] font-bold tracking-widest text-zinc-500">TODAY INCOME: <span className="text-green-500 border border-green-900/50 bg-green-950/30 px-2 pl-1.5 py-1 rounded inline-flex items-center gap-1"><BadgeDollarSign className="w-3 h-3"/> ${revenue_today.toLocaleString()}</span></div>
           </div>
           
           {/* Intake & Outbound Volumes */}
           <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">DMs Sent Today</span>
             <DailyDmsClient initialValue={initialDms} />
           </div>

           <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">New Leads Today</span>
             <h3 className="text-3xl font-black text-white">{leads_today}</h3>
           </div>
           
           <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
             <span className="text-[9px] font-black uppercase tracking-widest text-cyan-500 flex items-center gap-1 mb-2"><Activity className="w-3.5 h-3.5"/> Reply Rate</span>
             <h3 className="text-3xl font-black text-cyan-400">{conversion_rate_dms}%</h3>
           </div>

           {/* Conversion Tracking */}
           <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
             <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 mb-2">Active Convs</span>
             <h3 className="text-3xl font-black text-blue-400">{conversaciones_activas}</h3>
           </div>

           <div className="bg-zinc-950 border border-green-900/50 rounded-2xl p-5 shadow-[0_0_20px_rgba(34,197,94,0.05)] flex flex-col justify-between">
             <span className="text-[9px] font-black uppercase tracking-widest text-green-500 flex items-center gap-1 mb-2"><BadgeDollarSign className="w-3.5 h-3.5"/> Closes Today</span>
             <h3 className="text-3xl font-black text-green-400">{closes_today}</h3>
           </div>

           {/* Operations / Delivery */}
           <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1 mb-2"><HeartPulse className="w-3.5 h-3.5"/> Active Clients</span>
             <h3 className="text-3xl font-black text-white">{active_clients}</h3>
           </div>

           <div className={`bg-zinc-950 border ${entregas_pendientes > 0 ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-zinc-900'} rounded-2xl p-5 shadow-xl flex flex-col justify-between`}>
             <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 mb-2">Pending Delivery</span>
             <h3 className="text-3xl font-black text-orange-400">{entregas_pendientes}</h3>
           </div>

           <div className={`bg-zinc-950 border ${retention_due > 0 ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-zinc-900'} rounded-2xl p-5 shadow-xl flex flex-col justify-between`}>
             <span className="text-[9px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1 mb-2"><ShieldAlert className="w-3.5 h-3.5"/> Retention Due</span>
             <h3 className="text-3xl font-black text-red-400">{retention_due}</h3>
           </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
           
           {/* 1.5 CONVERSION PIPELINE FUNNEL (PHASE 12) */}
           <div className="lg:col-span-12 bg-zinc-950 border border-zinc-900 rounded-2xl shadow-xl overflow-hidden mb-4 p-6 flex flex-col xl:flex-row gap-8 items-center justify-between">
             <div className="w-full xl:w-1/3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 mb-2">Macro Funnel Array</h3>
                <p className="text-zinc-500 text-xs font-bold leading-relaxed">System tracking exact performance drops from raw lead logic to client activation. Evaluates systemic bottlenecks real-time.</p>
             </div>
             
             {(() => {
                const step1Leads = leads.length;
                const step2Contacted = leads.filter(l => l.status !== 'new').length;
                const step3Qualified = leads.filter(l => ['qualified', 'offer_sent', 'payment_pending', 'closed'].includes(l.status)).length;
                const step4Closed = clients.length;

                const drop1 = step1Leads > 0 ? Math.round((step2Contacted / step1Leads) * 100) : 0;
                const drop2 = step2Contacted > 0 ? Math.round((step3Qualified / step2Contacted) * 100) : 0;
                const drop3 = step3Qualified > 0 ? Math.round((step4Closed / step3Qualified) * 100) : 0;

                return (
                   <div className="w-full xl:w-2/3 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-end shrink-0">
                      
                      {/* Step 1 */}
                      <div className="flex flex-col items-center bg-black border border-zinc-800 rounded-xl p-4 w-full sm:w-[140px] shadow-lg">
                        <span className="text-[9px] uppercase font-black tracking-widest text-zinc-500 mb-2">1. Raw Load</span>
                        <span className="text-2xl font-black text-white">{step1Leads}</span>
                      </div>
                      
                      <div className="hidden sm:flex flex-col items-center gap-1">
                        <ArrowRight className="w-4 h-4 text-zinc-700" />
                        <span className={`text-[8px] font-black ${drop1 < 50 ? 'text-red-500' : 'text-zinc-500'}`}>{drop1}%</span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 w-full sm:w-[140px] shadow-lg">
                        <span className="text-[9px] uppercase font-black tracking-widest text-blue-500 mb-2">2. Engaged</span>
                        <span className="text-2xl font-black text-blue-400">{step2Contacted}</span>
                      </div>

                      <div className="hidden sm:flex flex-col items-center gap-1">
                        <ArrowRight className="w-4 h-4 text-zinc-700" />
                        <span className={`text-[8px] font-black ${drop2 < 20 ? 'text-red-500' : 'text-zinc-500'}`}>{drop2}%</span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-4 w-full sm:w-[140px] shadow-lg">
                        <span className="text-[9px] uppercase font-black tracking-widest text-indigo-500 mb-2">3. Qualified</span>
                        <span className="text-2xl font-black text-indigo-400">{step3Qualified}</span>
                      </div>

                      <div className="hidden sm:flex flex-col items-center gap-1">
                        <ArrowRight className="w-4 h-4 text-zinc-700" />
                        <span className={`text-[8px] font-black ${drop3 < 30 ? 'text-red-500' : 'text-zinc-500'}`}>{drop3}%</span>
                      </div>

                      {/* Step 4 */}
                      <div className="flex flex-col items-center bg-green-950/20 border border-green-900/40 rounded-xl p-4 w-full sm:w-[140px] shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                        <span className="text-[9px] uppercase font-black tracking-widest text-green-500 mb-2">4. Closed Won</span>
                        <span className="text-2xl font-black text-green-400">{step4Closed}</span>
                      </div>

                   </div>
                )
             })()}
           </div>

         </div>

         {/* MRR / CHURN ANALYTICS BLOCK */}
         {(() => {
           // Build last 6 months MRR from clients
           const months: { label: string; mrr: number; count: number }[] = [];
           for (let i = 5; i >= 0; i--) {
             const d = new Date();
             d.setMonth(d.getMonth() - i);
             const label = d.toLocaleString('default', { month: 'short' });
             const y = d.getFullYear(); const m = d.getMonth();
             const monthClients = clients.filter((c: any) => {
               const cd = new Date(c.created_at);
               return cd.getFullYear() === y && cd.getMonth() === m;
             });
             months.push({ label, mrr: monthClients.reduce((s: number, c: any) => s + (Number(c.net_revenue) || Number(c.payment_amount) || 0), 0), count: monthClients.length });
           }
           const maxMRR = Math.max(...months.map(m => m.mrr), 1);
           const totalActive = clients.filter((c: any) => (c.status || 'active') === 'active').length;
           const totalInactive = clients.filter((c: any) => c.status === 'inactive').length;
           const churnRate = clients.length > 0 ? ((totalInactive / clients.length) * 100).toFixed(1) : '0.0';
           const currentMRR = months[months.length - 1].mrr;
           const prevMRR = months[months.length - 2].mrr;
           const mrrGrowth = prevMRR > 0 ? (((currentMRR - prevMRR) / prevMRR) * 100).toFixed(1) : null;

           return (
             <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl overflow-hidden relative">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">MRR & Retention Analytics</h3>
                 <div className="flex items-center gap-4">
                   <div className="text-right">
                     <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Current MRR</div>
                     <div className="text-xl font-black text-green-400">${currentMRR.toLocaleString()}</div>
                     {mrrGrowth && <div className={`text-[9px] font-black ${parseFloat(mrrGrowth) >= 0 ? 'text-green-500' : 'text-red-500'}`}>{parseFloat(mrrGrowth) >= 0 ? '+' : ''}{mrrGrowth}% vs prev month</div>}
                   </div>
                   <div className="text-right">
                     <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Churn Rate</div>
                     <div className={`text-xl font-black ${parseFloat(churnRate) > 20 ? 'text-red-400' : 'text-white'}`}>{churnRate}%</div>
                     <div className="text-[9px] font-black text-zinc-600">{totalInactive} churned / {clients.length} total</div>
                   </div>
                 </div>
               </div>
               {/* Bar Chart */}
               <div className="flex items-end gap-2 h-24">
                 {months.map((m, i) => (
                   <div key={i} className="flex flex-col items-center flex-1 gap-1">
                     <div className="text-[8px] font-black text-zinc-500">${m.mrr > 0 ? m.mrr >= 1000 ? `${(m.mrr/1000).toFixed(1)}k` : m.mrr : '0'}</div>
                     <div
                       className={`w-full rounded-t-lg transition-all ${i === months.length - 1 ? 'bg-green-500' : 'bg-zinc-800'}`}
                       style={{ height: `${Math.max((m.mrr / maxMRR) * 64, m.mrr > 0 ? 4 : 0)}px` }}
                     />
                     <div className="text-[8px] font-black text-zinc-600">{m.label}</div>
                   </div>
                 ))}
               </div>
             </div>
           );
         })()}

      </div>
    </div>
  );
}
