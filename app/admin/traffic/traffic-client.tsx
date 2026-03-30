"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Plus, Disc, Activity, Crown, ChevronDown, DollarSign, Loader2 } from "lucide-react";

const STAGES = ["ideas", "produccion", "publicado", "winners"];
const STAGE_LABELS: Record<string, string> = {
  "ideas": "Centro de Ideas",
  "produccion": "En Producción",
  "publicado": "Lanzados (Testing)",
  "winners": "Escalamiento (Winners)"
};

const STAGE_COLORS: Record<string, string> = {
  "ideas": "border-zinc-500 text-zinc-400 bg-zinc-950/20",
  "produccion": "border-blue-500 text-blue-400 bg-blue-950/20",
  "publicado": "border-orange-500 text-orange-400 bg-orange-950/20",
  "winners": "border-green-500 text-green-400 bg-green-950/20"
};

export function TrafficClient({ initialContent }: any) {
  const [content, setContent] = useState(initialContent || []);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // New Content State
  const [newTitle, setNewTitle] = useState("");
  const [newFormat, setNewFormat] = useState("reel");

  const addContent = async () => {
    if (!newTitle.trim()) return;
    setAddingId("new");
    try {
      const res = await fetch("/api/admin/traffic", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, format: newFormat })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setContent([data.item, ...content]);
      setNewTitle("");
      toast.success("Marketing vector deployed to Matrix.");
    } catch(err: any) {
      toast.error(err.message);
    } finally {
      setAddingId(null);
    }
  };

  const updateCard = async (id: string, payload: any) => {
    if (updating === id) return;
    setUpdating(id);
    
    // Optimistic mutation tracking
    const original = content.find((c: any) => c.id === id);
    setContent((prev: any) => prev.map((c: any) => c.id === id ? { ...c, ...payload } : c));

    try {
      const res = await fetch("/api/admin/traffic", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Algorithm synchronized.");
    } catch(err: any) {
      toast.error(err.message);
      setContent((prev: any) => prev.map((c: any) => c.id === id ? { ...c, ...original } : c));
    } finally {
      setUpdating(null);
    }
  };

  // Aggregations
  const totalSpend = content.reduce((acc: number, cur: any) => acc + Number(cur.budget || 0), 0);
  const totalLeads = content.reduce((acc: number, cur: any) => acc + Number(cur.leads_generated || 0), 0);
  const overallCPL = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : "0.00";

  return (
    <div className="flex flex-col h-full bg-black">
       {/* ── KPI HEADER ── */}
       <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 mb-8 shrink-0 shadow-2xl flex flex-col md:flex-row gap-6 md:gap-12 justify-between items-center">
         
         <div className="flex w-full md:w-1/2 gap-3 items-center">
            <input 
              type="text" 
              placeholder="Deploy explicit creative concept or Ads..." 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              disabled={!!addingId}
              onKeyDown={e => e.key === 'Enter' && addContent()}
              className="flex-1 bg-black border border-zinc-800 rounded-xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:border-zinc-500 transition-colors uppercase tracking-widest placeholder:text-zinc-700"
            />
            <select
              value={newFormat}
              disabled={!!addingId}
              onChange={e => setNewFormat(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-4 text-[10px] font-black uppercase tracking-widest text-indigo-400 focus:outline-none focus:border-zinc-500 appearance-none transition-colors cursor-pointer"
            >
              <option value="reel">Instagram Reel</option>
              <option value="story">Sequence Story</option>
              <option value="thread">Twitter/X Thread</option>
              <option value="ad_creative">Paid Ad Creative</option>
            </select>
            <button onClick={addContent} disabled={!!addingId || !newTitle.trim()} className="bg-white text-black hover:bg-zinc-200 p-4 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-[1.02] disabled:opacity-50 shrink-0">
               {addingId ? <Loader2 className="w-4 h-4 animate-spin text-zinc-500" /> : <Plus className="w-4 h-4" />}
            </button>
         </div>

         <div className="flex gap-8 items-center border-l md:border-zinc-900 md:pl-12 w-full md:w-auto h-full justify-around md:justify-end">
            <div className="flex flex-col">
               <span className="text-[9px] uppercase font-black tracking-widest text-zinc-600 mb-1">Total Matrix Spend</span>
               <span className="text-xl font-black text-red-500 flex items-center gap-1"><DollarSign className="w-5 h-5"/>{totalSpend.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] uppercase font-black tracking-widest text-zinc-600 mb-1">Inbound Leads Flow</span>
               <span className="text-xl font-black text-green-500">{totalLeads}</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] uppercase font-black tracking-widest text-indigo-500 mb-1">Systemic CPL</span>
               <span className="text-xl font-black text-indigo-400 flex items-center gap-1"><DollarSign className="w-5 h-5"/>{overallCPL}</span>
            </div>
         </div>
       </div>

       {/* ── CONTENT KANBAN ── */}
       <div className="flex-1 overflow-x-auto flex gap-6 custom-scrollbar pb-6 px-1">
         {STAGES.map(stage => {
            const items = content.filter((c: any) => c.status === stage).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            const colorClass = STAGE_COLORS[stage];

            return (
              <div key={stage} className="min-w-[340px] w-[340px] flex flex-col bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shrink-0 shadow-xl relative">
                 
                 <div className={`px-5 py-4 border-b ${colorClass} flex items-center justify-between font-black uppercase tracking-widest text-[11px] shrink-0 bg-black/40`}>
                   <span>{STAGE_LABELS[stage]}</span>
                   <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] tabular-nums">{items.length}</span>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                   {items.map((item: any) => {
                     const isUpdating = updating === item.id;
                     const cpl = item.leads_generated > 0 ? (Number(item.budget) / Number(item.leads_generated)).toFixed(2) : "0.00";

                     return (
                        <div key={item.id} className={`bg-black border border-zinc-800 p-5 rounded-2xl shadow-lg relative group transition-all ${isUpdating ? 'opacity-50 scale-[0.98]' : ''}`}>
                           <div className="flex items-start justify-between mb-3 gap-3">
                             <h4 className="font-bold text-white text-sm leading-snug">{item.title}</h4>
                             <span className="text-[8px] uppercase font-black tracking-widest px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 shrink-0">
                               {item.format.replace('_', ' ')}
                             </span>
                           </div>

                           <div className="flex items-center justify-between text-[10px] font-bold text-zinc-600 mb-5 tracking-widest uppercase">
                             <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                             {isUpdating && <Loader2 className="w-3 h-3 text-zinc-400 animate-spin"/>}
                           </div>

                           {/* Ads Tracker Matrix (Visible tracking inputs) */}
                           <div className="grid grid-cols-2 gap-3 mb-5 border-t border-zinc-900 pt-4">
                              <div>
                                <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 px-1">Gasto Ads ($)</label>
                                <input 
                                  type="number" 
                                  value={item.budget || ""}
                                  onChange={e => updateCard(item.id, { budget: e.target.value })}
                                  disabled={isUpdating}
                                  placeholder="0"
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-bold text-white text-center focus:outline-none focus:border-red-900 transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 px-1">Leads Cerrados</label>
                                <input 
                                  type="number" 
                                  value={item.leads_generated || ""}
                                  onChange={e => updateCard(item.id, { leads_generated: e.target.value })}
                                  disabled={isUpdating}
                                  placeholder="0"
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-bold text-white text-center focus:outline-none focus:border-green-900 transition-colors"
                                />
                              </div>
                           </div>

                           {/* Performance Readout */}
                           {item.budget > 0 && (
                             <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-3 mb-5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                               <span className="text-indigo-500/80">CPL Calculado:</span>
                               <span className={Number(cpl) < 5 && item.leads_generated > 0 ? "text-green-400" : "text-white"}>${cpl}</span>
                             </div>
                           )}

                           {/* Status Changer */}
                           <div className="relative">
                             <select 
                               value={item.status}
                               onChange={e => updateCard(item.id, { status: e.target.value })}
                               disabled={isUpdating}
                               className={`w-full bg-zinc-900 border text-[10px] font-black uppercase tracking-widest rounded-xl pl-4 pr-8 py-3 outline-none cursor-pointer transition-colors appearance-none flex items-center ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}
                             >
                               {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                             </select>
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
                           </div>
                           
                           {item.status === 'winners' && (
                             <div className="absolute top-[-8px] right-[-8px] w-6 h-6 bg-yellow-500 text-black rounded-full flex flex-col items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)] z-10">
                               <Crown className="w-3 h-3" />
                             </div>
                           )}
                        </div>
                     );
                   })}

                   {items.length === 0 && (
                      <div className="h-32 mx-1 flex flex-col items-center gap-2 justify-center border-2 border-dashed border-zinc-800/50 rounded-2xl">
                         <Activity className="w-5 h-5 text-zinc-800" />
                         <span className="text-[9px] font-black text-zinc-700 tracking-widest uppercase">Grid Vacío</span>
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
