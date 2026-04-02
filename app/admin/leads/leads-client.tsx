"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Search, Filter, Loader2, ChevronDown } from "lucide-react";

// The organically ordered stages of the CRM Pipeline
// The organically ordered stages of the CRM Pipeline - Simplified for TDT Reset
const PIPELINE_STAGES = [
  "nuevo", 
  "respondio", 
  "cerrado", 
  "perdido"
];

// Structural UI coloring for Kanban columns
const STATUS_COLORS: Record<string, string> = {
  nuevo: "border-blue-500 text-blue-400 bg-blue-950/20",
  respondio: "border-orange-500 text-orange-400 bg-orange-950/20",
  cerrado: "border-green-500 text-green-400 bg-green-950/20",
  perdido: "border-red-500 text-red-500 bg-red-950/20"
};

type Lead = any; 

export function LeadsClientRenderer({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [nichoFilter, setNichoFilter] = useState("all");
  const [followersFilter, setFollowersFilter] = useState("all");
  const [moneyOnly, setMoneyOnly] = useState(false);
  
  // Track active mutations to disable matching cards gracefully (preventing race conditions)
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    if (updating === leadId) return;
    
    // Identity baseline for optimistic rollbacks
    const originalLead = leads.find(l => l.id === leadId);
    if (!originalLead || originalLead.status === newStatus) return;

    setUpdating(leadId);

    // Snapshot applying optimistic UI instantly
    setLeads(current => current.map(l => l.id === leadId ? { ...l, status: newStatus, updated_at: new Date().toISOString() } : l));

    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, new_status: newStatus })
      });
      
      const payload = await res.json();
      
      if (!res.ok) {
        throw new Error(payload.error || "Failed to execute atomic track sequence");
      }
      
      toast.success("Estado actualizado.");
    } catch(err: any) {
      toast.error(err.message || "Error al actualizar. Revirtiendo.");
      // Rollback pipeline
      setLeads(current => current.map(l => l.id === leadId ? { ...l, status: originalLead.status, updated_at: originalLead.updated_at } : l));
    } finally {
      setUpdating(null);
    }
  };

  // Aggressive Performance Filtering & AI Priority Sorting
  const priorityScore: Record<string, number> = { high: 3, medium: 2, low: 1 };
  
  const moneyStatuses = ['cerrado']; // Closest to money in simple view
  const filteredLeads = leads.filter(l => {
    const matchSearch = l.instagram_username.toLowerCase().includes(search.toLowerCase());
    const matchSource = sourceFilter === "all" || l.source === sourceFilter;
    const matchNicho = nichoFilter === "all" || l.niche === nichoFilter;
    const matchFollowers = followersFilter === "all" || l.followers_range === followersFilter;
    const matchMoney = !moneyOnly || l.status === 'cerrado';
    return matchSearch && matchSource && matchNicho && matchFollowers && matchMoney;
  }).sort((a, b) => {
     const pA = priorityScore[a.priority || 'medium'] || 0;
     const pB = priorityScore[b.priority || 'medium'] || 0;
     return pB - pA;
  });

  const grouped: Record<string, Lead[]> = {};
  PIPELINE_STAGES.forEach(stage => grouped[stage] = []);
  filteredLeads.forEach(lead => {
    // Map legacy English statuses to new Spanish ones for the UI if needed
    let uiStatus = lead.status;
    if (uiStatus === 'new') uiStatus = 'nuevo';
    if (['contacted', 'responded', 'qualified', 'offer_sent', 'payment_pending', 'reengage'].includes(uiStatus)) uiStatus = 'respondio';
    if (uiStatus === 'closed') uiStatus = 'cerrado';
    if (uiStatus === 'lost') uiStatus = 'perdido';

    if (grouped[uiStatus]) {
      grouped[uiStatus].push(lead);
    } else {
      // Default to responded if unknown
      grouped['respondio'].push(lead);
    }
  });

  return (
    <div className="flex flex-col flex-1 h-full min-h-[700px] overflow-hidden pb-4">
      {/* STRATEGIC COMMAND HEADER */}
      <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Buscar prospectos..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-sm text-white rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-300 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-zinc-600 appearance-none cursor-pointer uppercase tracking-widest transition-colors"
            >
              <option value="all">Todas las fuentes</option>
              <option value="dm">DM</option>
              <option value="referido">Referido</option>
              <option value="landing">Landing</option>
              <option value="ads">Ads</option>
            </select>
          </div>
          <select value={nichoFilter} onChange={e => setNichoFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-600 appearance-none cursor-pointer uppercase tracking-widest transition-colors"
          >
            <option value="all">Todos los nichos</option>
            <option value="fitness">Fitness</option>
            <option value="emprendedor">Emprendedor</option>
            <option value="modelo">Modelo</option>
            <option value="otro">Otro</option>
          </select>
          <select value={followersFilter} onChange={e => setFollowersFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-600 appearance-none cursor-pointer uppercase tracking-widest transition-colors"
          >
            <option value="all">Seguidores (Todos)</option>
            <option value="5k_20k">5K–20K</option>
            <option value="20k_100k">20K–100K</option>
            <option value="100k_200k">100K–200K</option>
          </select>
          <button onClick={() => setMoneyOnly(!moneyOnly)}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
              moneyOnly ? 'bg-green-950/40 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
            }`}
          >
            💰 Cerrados
          </button>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-400 font-bold tracking-widest uppercase">
          <span className="bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
            En Proceso: {filteredLeads.filter(l => !['closed', 'lost', 'cerrado', 'perdido'].includes(l.status)).length}
          </span>
          <span className="bg-green-950/30 text-green-500 px-3 py-1.5 rounded-lg border border-green-900/50">
            Cerrados: {filteredLeads.filter(l => ['closed', 'cerrado'].includes(l.status)).length}
          </span>
        </div>
      </div>

      {/* HORIZONTAL KANBAN GRID */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden flex gap-4 pb-4 px-1 custom-scrollbar">
        {PIPELINE_STAGES.map(stage => {
          const stageLeads = grouped[stage] || [];
          const colorClass = STATUS_COLORS[stage] || "border-zinc-500 text-zinc-400 bg-zinc-900/50";
          
          return (
            <div key={stage} className="min-w-[320px] w-[320px] flex flex-col bg-zinc-950/80 rounded-xl overflow-hidden shrink-0 border border-zinc-900">
              
              {/* STAGE HEADER */}
              <div className={`px-4 py-3 border-b-2 ${colorClass} flex items-center justify-between font-black uppercase tracking-widest text-xs shrink-0`}>
                <span>{stage.replace('_', ' ')}</span>
                <span className="bg-black/60 px-2 py-1 rounded-md text-[10px]">{stageLeads.length}</span>
              </div>

              {/* CARDS LIST */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {stageLeads.map(lead => {
                  const p = lead.priority || 'medium';
                  
                  // Money Priority Heuristic
                  const isMoney = ['offer_sent', 'payment_pending'].includes(lead.status) || 
                                  /precio|price|payment|pago|comprar|send|envia|transferencia|tarjeta/i.test(`${lead.notes || ''} ${JSON.stringify(lead.metadata || {})}`);

                  return (
                    <div 
                      key={lead.id} 
                      onClick={() => window.open(`/admin/leads/${lead.id}`, '_blank')}
                      className={`bg-black border p-4 rounded-xl shadow-lg hover:scale-[1.01] transition-all relative overflow-hidden cursor-pointer cursor-crosshair group flex flex-col gap-3 
                      ${updating === lead.id ? 'opacity-50 blur-[1px] pointer-events-none' : ''} 
                      ${isMoney ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)] bg-green-950/10' : 
                        (lead.status === 'contacted' && ((Date.now() - new Date(lead.updated_at).getTime()) / (1000 * 60 * 60)) > 96) ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-red-950/10' :
                        (lead.status === 'contacted' && ((Date.now() - new Date(lead.updated_at).getTime()) / (1000 * 60 * 60)) > 48) ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)] bg-orange-950/10' :
                        'border-zinc-800 hover:border-zinc-500'}`}
                    >
                      {isMoney && <div className="absolute -top-6 -right-6 w-16 h-16 bg-green-500/20 rounded-full blur-[20px] pointer-events-none"></div>}
                      {(lead.status === 'contacted' && ((Date.now() - new Date(lead.updated_at).getTime()) / (1000 * 60 * 60)) > 96) && <div className="absolute -top-6 -right-6 w-16 h-16 bg-red-500/20 rounded-full blur-[20px] pointer-events-none"></div>}
                      
                      {/* IDENTITY HEADER */}
                      <div className="flex items-start justify-between relative z-10">
                        <span className="font-bold truncate text-[15px] group-hover:text-cyan-400 transition-colors block max-w-[120px]">@{lead.instagram_username}</span>
                        <div className="flex gap-1.5 shrink-0">
                          {isMoney ? (
                             <span className="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded border bg-green-950/40 text-green-500 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)] animate-pulse">
                                $$$
                             </span>
                          ) : (
                             <span className={`text-[8px] uppercase font-black tracking-widest px-2 py-0.5 rounded border
                                ${p === 'high' ? 'bg-red-950/30 text-red-500 border-red-900/50' : 
                                  p === 'medium' ? 'bg-orange-950/30 text-orange-500 border-orange-900/50' : 
                                  'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                                {p}
                             </span>
                          )}
                        </div>
                      </div>
                    
                    {/* CONTEXT ROW */}
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 relative z-10 border-b border-zinc-800/50 pb-2">
                       <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">{lead.metadata?.niche || 'General'}</span>
                       {lead.metadata?.followers && <span className="text-zinc-500">{lead.metadata.followers} Followers</span>}
                    </div>

                    {/* METRICS ROW */}
                    <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 tracking-wide uppercase relative z-10">
                      <span>{formatDistanceToNow(new Date(lead.updated_at))} in {stage.replace('_', ' ')}</span>
                      {updating === lead.id && <Loader2 className="w-3.5 h-3.5 text-zinc-400 animate-spin"/>}
                    </div>

                    {/* SELECTOR */}
                    <div className="relative mt-1" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        disabled={updating === lead.id}
                        className={`w-full bg-zinc-900 border text-[11px] font-black uppercase tracking-[0.2em] rounded-lg pl-3 pr-8 py-2 outline-none cursor-pointer transition-colors appearance-none flex items-center ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}
                      >
                         {PIPELINE_STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
                    </div>
                  </div>
                );
               })}

                {stageLeads.length === 0 && (
                   <div className="h-24 mx-1 flex items-center justify-center border-2 border-dashed border-zinc-800/50 rounded-xl">
                      <span className="text-[10px] font-black text-zinc-700 tracking-widest uppercase">Target Unknown</span>
                   </div>
                )}
              </div>

            </div>
          )
        })}
      </div>
    </div>
  );
}
