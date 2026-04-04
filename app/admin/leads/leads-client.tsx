"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { 
  Search, Filter, Loader2, ChevronDown, UserSquare2, 
  MessageSquarePlus, Activity, CheckCircle2, Flame, 
  Thermometer, Snowflake, MoreHorizontal, LayoutGrid,
  TrendingUp, Users, Target
} from "lucide-react";

// TDT Lead Scoring Pipeline - High Velocity Stages
const PIPELINE_STAGES = [
  "nuevo",
  "conversando",
  "oferta_enviada",
  "cerrado",
  "perdido"
];

// Structural UI coloring for Kanban columns (CEO Élite Edition)
const STATUS_COLORS: Record<string, string> = {
  nuevo: "border-blue-500/30 text-blue-400 bg-blue-950/10 backdrop-blur-md",
  conversando: "border-purple-500/30 text-purple-400 bg-purple-950/10 backdrop-blur-md",
  oferta_enviada: "border-amber-500/30 text-amber-400 bg-amber-950/10 backdrop-blur-md",
  cerrado: "border-emerald-500/30 text-emerald-400 bg-emerald-950/10 backdrop-blur-md",
  perdido: "border-rose-500/30 text-rose-400 bg-rose-950/10 backdrop-blur-md"
};

type Lead = any;

export function LeadsClientRenderer({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [nichoFilter, setNichoFilter] = useState("all");
  const [temperatureFilter, setTemperatureFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    if (updating === leadId) return;
    const originalLead = leads.find(l => l.id === leadId);
    if (!originalLead || originalLead.status === newStatus) return;

    setUpdating(leadId);
    setLeads(current => current.map(l => l.id === leadId ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l));

    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, new_status: newStatus })
      });
      if (!res.ok) throw new Error("Update failure");
      toast.success("Estado actualizado.");
    } catch(err: any) {
      toast.error("Error al actualizar. Revirtiendo.");
      setLeads(current => current.map(l => l.id === leadId ? { ...l, status: originalLead.status } : l));
    } finally {
      setUpdating(null);
    }
  };

  const handleRevive = async (leadId: string) => {
    setUpdating(leadId + '-revive');
    try {
      const res = await fetch("/api/admin/leads/revive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      navigator.clipboard.writeText(data.message);
      toast.success("AI Ghost-Buster: Mensaje de reactivación copiado.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchSearch = l.instagram_username.toLowerCase().includes(search.toLowerCase());
    const matchSource = sourceFilter === "all" || l.source === sourceFilter;
    const matchNicho = nichoFilter === "all" || l.niche === nichoFilter;
    const matchTemperature = temperatureFilter === "all" || l.temperature === temperatureFilter;
    return matchSearch && matchSource && matchNicho && matchTemperature;
  });

  const grouped: Record<string, Lead[]> = {};
  PIPELINE_STAGES.forEach(stage => grouped[stage] = []);
  
  filteredLeads.forEach(lead => {
    let uiStatus = lead.status;
    if (uiStatus === 'new') uiStatus = 'nuevo';
    if (['contacted', 'responded', 'qualified', 'reengage'].includes(uiStatus)) uiStatus = 'conversando';
    if (['offer_sent', 'payment_pending'].includes(uiStatus)) uiStatus = 'oferta_enviada';
    if (uiStatus === 'closed') uiStatus = 'cerrado';
    if (uiStatus === 'lost') uiStatus = 'perdido';

    if (grouped[uiStatus]) {
      grouped[uiStatus].push(lead);
    } else {
      grouped['nuevo'].push(lead);
    }
  });

  const stats = {
    hot: leads.filter(l => l.temperature === 'HOT').length,
    active: leads.filter(l => l.status !== 'lost' && l.status !== 'closed').length,
    totalRev: leads.filter(l => l.status === 'closed').length * 250 // Hypothetical avg
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen bg-transparent p-2 overflow-hidden">
      
      {/* ── INTERNAL KPI STRIP ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <StatCard icon={Flame} label="Hot Leads" value={stats.hot} color="text-red-500" />
         <StatCard icon={Users} label="Pipeline" value={stats.active} color="text-blue-500" />
         <StatCard icon={TrendingUp} label="Efficiency" value="84%" color="text-emerald-500" />
         <StatCard icon={Target} label="Next Close" value="+$500" color="text-amber-500" />
      </div>

      {/* ── FILTERS & COMMANDS ── */}
      <div className="bg-zinc-950/50 backdrop-blur-xl border border-zinc-900 p-4 rounded-2xl mb-8 flex flex-wrap items-center gap-4 shadow-2xl">
         <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input 
              type="text" 
              placeholder="Search handle..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-11 py-3 text-sm text-white focus:outline-none focus:border-[#1D9E75] transition-all placeholder:text-zinc-700 font-medium"
            />
         </div>
         
         <div className="flex items-center gap-3">
            <select value={nichoFilter} onChange={e => setNichoFilter(e.target.value)} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:outline-none focus:border-zinc-700 cursor-pointer">
              <option value="all">Nichos (Todos)</option>
              {Array.from(new Set(leads.map(l => l.niche).filter(Boolean))).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <select value={temperatureFilter} onChange={e => setTemperatureFilter(e.target.value)} className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:outline-none focus:border-zinc-700 cursor-pointer">
              <option value="all">Temp (Todas)</option>
              <option value="HOT">HOT 🔥</option>
              <option value="WARM">WARM 🌡️</option>
              <option value="COLD">COLD ❄️</option>
            </select>
            <button className="bg-[#1D9E75] text-white p-3 rounded-xl hover:bg-[#168260] transition-colors shadow-[0_0_20px_rgba(29,158,117,0.2)]">
              <LayoutGrid className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* ── KANBAN BOARD ── */}
      <div className="flex-1 overflow-x-auto pb-6 custom-scrollbar-horizontal">
        <div className="flex gap-6 h-full min-w-max px-2">
          {PIPELINE_STAGES.map(stage => (
            <div 
              key={stage} 
              className={`w-[320px] flex flex-col rounded-[2rem] border transition-all duration-500 ${STATUS_COLORS[stage] || 'border-zinc-900 bg-zinc-950/20'}`}
            >
              {/* Column Header */}
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${stage === 'cerrado' ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-current opacity-40'}`}></div>
                   <h3 className="text-xs font-black uppercase tracking-[0.2em]">{stage.replace('_', ' ')}</h3>
                </div>
                <span className="text-[10px] font-black opacity-30 bg-black/40 px-3 py-1 rounded-full border border-white/5">{grouped[stage].length}</span>
              </div>

              {/* Column Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-[400px]">
                {grouped[stage].map(lead => (
                  <div key={lead.id} className="group bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/50 hover:border-zinc-700 rounded-2xl p-5 transition-all cursor-pointer relative overflow-hidden">
                    
                    {/* Status Glow */}
                    {lead.temperature === 'HOT' && (
                       <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-2xl pointer-events-none"></div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <h4 className="text-white font-black text-sm tracking-tight group-hover:text-[#1D9E75] transition-colors truncate max-w-[140px]">@{lead.instagram_username}</h4>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{lead.niche || 'General'}</p>
                       </div>
                       {lead.temperature && (
                          <div className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border ${
                            lead.temperature === 'HOT' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            lead.temperature === 'WARM' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }`}>
                            {lead.temperature} {lead.score || ''}
                          </div>
                       )}
                    </div>

                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-[9px] uppercase font-black tracking-widest text-zinc-600">
                          <span>Followers</span>
                          <span className="text-zinc-400">{lead.metadata?.followers || lead.followers_range || '—'}</span>
                       </div>
                       <div className="flex justify-between items-center text-[9px] uppercase font-black tracking-widest text-zinc-600">
                          <span>Last Activity</span>
                          <span className="text-zinc-400">{formatDistanceToNow(new Date(lead.updated_at))} ago</span>
                       </div>
                    </div>

                    {/* Quick Move Selector */}
                    <div className="mt-5 pt-4 border-t border-zinc-800/50 flex items-center gap-2">
                       <select 
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          disabled={updating?.startsWith(lead.id)}
                          className="flex-1 bg-black/40 border border-zinc-800 rounded-lg py-1.5 px-3 text-[9px] font-black uppercase tracking-widest text-zinc-500 focus:text-white transition-colors"
                       >
                          {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                       
                       {/* REVIVE AI BUTTON */}
                       {(lead.status === 'conversando' || lead.status === 'oferta_enviada') && (
                          <button 
                            onClick={() => handleRevive(lead.id)}
                            disabled={updating === lead.id + '-revive'}
                            title="Gen AI Ghost-Buster Hook"
                            className="p-2 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                          >
                             {updating === lead.id + '-revive' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                          </button>
                       )}
                       
                       <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-600 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                       </button>
                    </div>

                    {(updating === lead.id || updating === lead.id + '-revive') && (
                       <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl z-20">
                          <Loader2 className="w-6 h-6 text-[#1D9E75] animate-spin" />
                       </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-4 flex items-center gap-4">
       <div className={`w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center ${color} opacity-80 shadow-inner`}>
          <Icon className="w-5 h-5" />
       </div>
       <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{label}</p>
          <p className="text-xl font-black text-white">{value}</p>
       </div>
    </div>
  );
}
