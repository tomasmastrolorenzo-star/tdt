"use client";

import { 
  TrendingUp, Users, Zap, Flame, 
  ArrowUpRight, Clock, Target, ShieldCheck, 
  ChevronRight, Activity, MessageSquarePlus,
  BarChart3, Globe, ZapIcon
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export function CommandCenter({ stats }: { stats: any }) {
  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      
      {/* ── MISSION CONTROL HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Operation Command Centre</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">Mission Control</h1>
            <p className="text-zinc-600 font-bold text-xs mt-2 uppercase tracking-widest">Real-time engagement footprint detected across all nodes.</p>
         </div>

         <div className="flex gap-3">
            <div className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-3">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Stabilized</span>
            </div>
            <div className="px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-3">
               <Zap className="w-4 h-4 text-amber-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">API Latency: 12ms</span>
            </div>
         </div>
      </div>

      {/* ── GLOBAL KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
         <KPICard 
           icon={Users} 
           label="Active Portfolio" 
           value={stats.totalLeads} 
           subValue="+4% vs yesterday" 
           color="text-blue-500" 
         />
         <KPICard 
           icon={Flame} 
           label="Conversion High" 
           value={stats.hotLeads} 
           subValue="Actionable Priority" 
           color="text-rose-500" 
         />
         <KPICard 
           icon={TrendingUp} 
           label="Net Revenue" 
           value={`$${stats.totalNet.toLocaleString()}`} 
           subValue="Total Audit Compliant" 
           color="text-emerald-500" 
         />
         <KPICard 
           icon={Target} 
           label="Next Milestone" 
           value="100 Clients" 
           subValue="94% towards target" 
           color="text-amber-500" 
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
         {/* ── RECENT ACTIVITY FEED ── */}
         <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
               <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600">Sync Pipeline Status</h3>
               <Link href="/admin/leads" className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1 hover:text-white transition-colors">
                  Open CRM <ChevronRight className="w-3 h-3" />
               </Link>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] blur-[100px] pointer-events-none"></div>
              
              <table className="w-full text-left">
                <thead className="bg-zinc-900/40 border-b border-zinc-900">
                  <tr>
                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-zinc-500">Lead Identity</th>
                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-zinc-500">Analysis</th>
                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-zinc-500">Intensity</th>
                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-zinc-500">Time-Log</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {stats.recentLeads.map((lead: any) => (
                    <tr key={lead.id} className="group hover:bg-zinc-900/30 transition-all cursor-pointer">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center font-black text-xs text-zinc-700">@</div>
                            <span className="text-sm font-black text-white group-hover:text-emerald-500 transition-colors">@{lead.instagram_username}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">{lead.niche || 'General'}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-2 ${
                           lead.temperature === 'HOT' ? 'text-rose-500' : 
                           lead.temperature === 'WARM' ? 'text-amber-500' : 'text-blue-500'
                         }`}>
                           <Activity className="w-3.5 h-3.5" />
                           {lead.temperature || 'Normal'}
                         </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-medium text-zinc-600">
                         {formatDistanceToNow(new Date(lead.created_at))} ago
                      </td>
                    </tr>
                  ))}
                  {stats.recentLeads.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-xs font-black text-zinc-800 uppercase tracking-[0.3em]">No incoming leads detected.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
         </div>

         {/* ── QUICK ACTIONS ── */}
         <div className="lg:col-span-4 flex flex-col gap-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600">Operational Directives</h3>
            
            <div className="grid grid-cols-2 gap-4">
               <ActionCard 
                 icon={MessageSquarePlus} 
                 label="Manual Lead" 
                 href="/admin/leads?action=add" 
                 color="bg-blue-500/10 text-blue-500" 
               />
               <ActionCard 
                 icon={ZapIcon} 
                 label="Gen Traffic" 
                 href="/admin/traffic" 
                 color="bg-amber-500/10 text-amber-500" 
               />
               <ActionCard 
                 icon={BarChart3} 
                 label="SMM Sync" 
                 href="/admin/today" 
                 color="bg-purple-500/10 text-purple-500" 
               />
               <ActionCard 
                 icon={Globe} 
                 label="Vault Open" 
                 href="/admin/vault" 
                 color="bg-emerald-500/10 text-emerald-500" 
               />
            </div>

            <div className="bg-[#1D9E75]/5 border border-[#1D9E75]/20 rounded-[2rem] p-8 mt-2 relative overflow-hidden group">
               <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#1D9E75]/20 blur-3xl pointer-events-none group-hover:bg-[#1D9E75]/40 transition-all duration-700"></div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1D9E75] mb-2 flex items-center gap-2">
                 <Zap className="w-3.5 h-3.5 fill-[#1D9E75]" /> CEO System Update
               </p>
               <h4 className="text-lg font-black text-white leading-tight">Ready for deployment.</h4>
               <p className="text-xs text-zinc-500 font-medium mt-3 leading-relaxed">System diagnostics confirm all core nodes are reactive. TDT engine optimized for Monday's launch.</p>
            </div>
         </div>

      </div>

    </div>
  );
}

function KPICard({ icon: Icon, label, value, subValue, color }: any) {
  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl group hover:border-zinc-700 hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
       <div className={`absolute top-0 right-0 w-32 h-32 ${color.replace('text-', 'bg-')}/5 blur-[80px] pointer-events-none group-hover:scale-150 transition-all duration-700`}></div>
       <div className={`w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 shadow-inner ${color}`}>
          <Icon className="w-6 h-6" />
       </div>
       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">{label}</p>
       <h3 className="text-4xl font-black text-white tracking-tighter mb-2">{value}</h3>
       <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{subValue}</p>
    </div>
  );
}

function ActionCard({ icon: Icon, label, href, color }: any) {
  return (
    <Link 
      href={href}
      className={`p-6 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/30 group`}
    >
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${color}`}>
          <Icon className="w-5 h-5" />
       </div>
       <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center">{label}</span>
    </Link>
  );
}
