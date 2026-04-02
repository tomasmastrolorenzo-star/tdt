"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Plus, Disc, Activity, Crown, ChevronDown, Rocket, Loader2, Calendar } from "lucide-react";

// Kanban configuration based on Bloque 3 spec
const STAGES = ["Ideas", "En producción", "Listo", "Publicado", "Winners"];
const STAGE_COLORS: Record<string, string> = {
  "Ideas": "border-zinc-500 text-zinc-400 bg-zinc-950/20",
  "En producción": "border-orange-500 text-orange-400 bg-orange-950/20",
  "Listo": "border-blue-500 text-blue-400 bg-blue-950/20",
  "Publicado": "border-indigo-500 text-indigo-400 bg-indigo-950/20",
  "Winners": "border-green-500 text-green-400 bg-green-950/20"
};

export function TrafficClient({ initialContent }: any) {
  const [content, setContent] = useState(initialContent || []);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // New Content State
  const [newTitle, setNewTitle] = useState("");
  const [newTipo, setNewTipo] = useState("reel");
  const [newNicho, setNewNicho] = useState("general");

  const addContent = async () => {
    if (!newTitle.trim()) return;
    setAddingId("new");
    try {
      const res = await fetch("/api/admin/traffic", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          titulo: newTitle, 
          tipo: newTipo, 
          nicho: newNicho, 
          estado: 'Ideas'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Sincronizar UI con el backend (asumiendo que POST devuelve la row insertada)
      setContent([data.item, ...content]);
      setNewTitle("");
      toast.success("Pieza añadida al Content Bank.");
    } catch(err: any) {
      toast.error(err.message);
    } finally {
      setAddingId(null);
    }
  };

  const updateCard = async (id: string, payload: any) => {
    if (updating === id) return;
    setUpdating(id);
    
    // Si cambia a Winners, prender la bandera es_winner auto
    if (payload.estado === 'Winners') {
       payload.es_winner = true;
    }

    const original = content.find((c: any) => c.id === id);
    setContent((prev: any) => prev.map((c: any) => c.id === id ? { ...c, ...payload } : c));

    try {
      const res = await fetch("/api/admin/traffic", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Content Pipeline sincronizado.");
    } catch(err: any) {
      toast.error(err.message);
      setContent((prev: any) => prev.map((c: any) => c.id === id ? { ...c, ...original } : c));
    } finally {
      setUpdating(null);
    }
  };

  const totalWinners = content.filter((c:any) => c.es_winner).length;
  const totalLeads = content.reduce((acc: number, cur: any) => acc + Number(cur.resultado_leads || 0), 0);

  return (
    <div className="flex flex-col h-full bg-[#050505]">
       
       {/* ── KPI HEADER & QUICK ADD ── */}
       <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 mb-8 shrink-0 shadow-2xl flex flex-col xl:flex-row gap-6 justify-between items-center">
         <div className="flex flex-wrap lg:flex-nowrap w-full xl:w-2/3 gap-3 items-center">
            <input 
              type="text" 
              placeholder="Nueva idea (Ej: Before/after...)" 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              disabled={!!addingId}
              onKeyDown={e => e.key === 'Enter' && addContent()}
              className="flex-1 bg-black border border-zinc-800 rounded-xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#1D9E75] transition-colors uppercase tracking-widest placeholder:text-zinc-700 min-w-[200px]"
            />
            <select
              value={newTipo}
              disabled={!!addingId}
              onChange={e => setNewTipo(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-4 text-[10px] font-black uppercase tracking-widest text-[#1D9E75] focus:outline-none focus:border-[#1D9E75] transition-colors cursor-pointer"
            >
              <option value="reel">Reel</option>
              <option value="carrusel">Carrusel</option>
              <option value="story">Story</option>
              <option value="foto">Foto</option>
            </select>
            <select
              value={newNicho}
              disabled={!!addingId}
              onChange={e => setNewNicho(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer"
            >
              <option value="general">General</option>
              <option value="fitness">Fitness</option>
              <option value="emprendedor">Emprendedor</option>
              <option value="modelo">Modelo</option>
            </select>
            <button onClick={addContent} disabled={!!addingId || !newTitle.trim()} className="bg-[#1D9E75] text-white hover:bg-[#168260] p-4 rounded-xl transition-all shadow-[0_0_15px_rgba(29,158,117,0.2)] hover:scale-[1.02] disabled:opacity-50 shrink-0">
               {addingId ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            </button>
         </div>

         <div className="flex gap-8 items-center border-t xl:border-t-0 xl:border-l xl:border-zinc-900 xl:pl-12 w-full xl:w-auto pt-6 xl:pt-0 justify-around">
            <div className="flex flex-col text-center xl:text-left">
               <span className="text-[9px] uppercase font-black tracking-widest text-zinc-600 mb-1">Total Winners</span>
               <span className="text-2xl font-black text-yellow-500 flex items-center gap-1.5 justify-center xl:justify-start"><Crown className="w-5 h-5"/>{totalWinners}</span>
            </div>
            <div className="flex flex-col text-center xl:text-left">
               <span className="text-[9px] uppercase font-black tracking-widest text-zinc-600 mb-1">Leads Generados</span>
               <span className="text-2xl font-black text-[#1D9E75]">{totalLeads}</span>
            </div>
         </div>
       </div>

       {/* ── CALENDARIO SEMANAL VISIBLE ── */}
       <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl mb-8 overflow-hidden">
          <div className="bg-zinc-900/50 px-6 py-3 border-b border-zinc-900 flex items-center gap-3 text-zinc-400">
             <Calendar className="w-4 h-4 text-[#1D9E75]" />
             <h3 className="text-[10px] font-black uppercase tracking-widest">Calendario Semanal Estructural</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-900">
             <div className="p-5">
                <span className="block text-[10px] font-black uppercase tracking-widest text-white mb-2">Lunes</span>
                <span className="inline-block px-2 py-1 bg-[#1D9E75]/20 text-[#1D9E75] rounded text-[9px] uppercase font-bold tracking-widest mb-1.5">Resultado Real (Reel/Carrusel)</span>
                <p className="text-xs text-zinc-500 italic">Demostrar capacidad técnica con un caso de estudio crudo.</p>
             </div>
             <div className="p-5">
                <span className="block text-[10px] font-black uppercase tracking-widest text-white mb-2">Miércoles</span>
                <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-[9px] uppercase font-bold tracking-widest mb-1.5">Educación / Autoridad (Carrusel)</span>
                <p className="text-xs text-zinc-500 italic">Aportar valor accionable. Por qué algo no funciona y cómo arreglarlo.</p>
             </div>
             <div className="p-5">
                <span className="block text-[10px] font-black uppercase tracking-widest text-white mb-2">Viernes</span>
                <span className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-[9px] uppercase font-bold tracking-widest mb-1.5">Proceso / Detrás de escena (Reel)</span>
                <p className="text-xs text-zinc-500 italic">Mostrar el sistema trabajando. Build in public.</p>
             </div>
          </div>
       </div>

       {/* ── CONTENT KANBAN ── */}
       <div className="flex-1 overflow-x-auto flex gap-6 custom-scrollbar pb-6 px-1">
         {STAGES.map(stage => {
            // Filter by "estado". Default "Ideas" if null.
            const items = content.filter((c: any) => (c.estado || 'Ideas') === stage).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            const colorClass = STAGE_COLORS[stage];

            return (
              <div key={stage} className="min-w-[340px] w-[340px] flex flex-col bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shrink-0 shadow-xl relative">
                 
                 <div className={`px-5 py-4 border-b ${colorClass} flex items-center justify-between font-black uppercase tracking-widest text-[10px] shrink-0 bg-black/40`}>
                   <span>{stage}</span>
                   <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] tabular-nums">{items.length}</span>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                   {items.map((item: any) => {
                     const isUpdating = updating === item.id;

                     return (
                        <div key={item.id} className={`bg-[#050505] border ${item.es_winner ? 'border-yellow-900/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-zinc-800'} p-5 rounded-2xl shadow-lg relative transition-all ${isUpdating ? 'opacity-50 scale-[0.98]' : ''}`}>
                           
                           {item.es_winner && (
                             <div className="absolute top-[-8px] right-[-8px] w-7 h-7 bg-yellow-500 text-black rounded-full flex flex-col items-center justify-center shadow-lg z-10">
                               <Crown className="w-3.5 h-3.5" />
                             </div>
                           )}

                           <div className="flex items-start justify-between mb-3 gap-3">
                             <h4 className="font-bold text-white text-sm leading-snug">{item.titulo}</h4>
                           </div>
                           
                           <div className="flex gap-2 mb-4 flex-wrap">
                             <span className="text-[8px] uppercase font-black tracking-widest px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                               {item.tipo}
                             </span>
                             <span className="text-[8px] uppercase font-black tracking-widest px-2 py-1 rounded bg-[#1D9E75]/10 border border-[#1D9E75]/30 text-[#1D9E75]">
                               {item.nicho}
                             </span>
                           </div>

                           <div className="space-y-3 mb-5 py-4 border-y border-zinc-900 text-xs">
                              <div>
                                <label className="text-[8px] text-zinc-600 block uppercase font-bold tracking-widest mb-1.5">Hook (Ganchos de 3s)</label>
                                <textarea 
                                  defaultValue={item.hook || ''}
                                  onBlur={e => updateCard(item.id, { hook: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-300 resize-none h-14 focus:outline-none focus:border-[#1D9E75]"
                                  placeholder="Escribe el hook aquí..."
                                />
                              </div>
                              <div>
                                <label className="text-[8px] text-zinc-600 block uppercase font-bold tracking-widest mb-1.5">Call to Action (CTA)</label>
                                <input 
                                  defaultValue={item.cta || ''}
                                  onBlur={e => updateCard(item.id, { cta: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-300 focus:outline-none focus:border-[#1D9E75]"
                                  placeholder="DM me GROW..."
                                />
                              </div>
                           </div>

                           {/* Ads Tracker Matrix (Visible tracking inputs) */}
                           <div className="grid grid-cols-2 gap-3 mb-5 bg-black rounded-xl border border-zinc-900 p-2">
                              <div>
                                <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 px-1 text-center">Alcance</label>
                                <input 
                                  type="number" 
                                  value={item.resultado_alcance || ""}
                                  onChange={e => updateCard(item.id, { resultado_alcance: e.target.value })}
                                  disabled={isUpdating}
                                  placeholder="0"
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs font-bold text-white text-center focus:outline-none focus:border-indigo-900 transition-colors tabular-nums"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 px-1 text-center">Leads</label>
                                <input 
                                  type="number" 
                                  value={item.resultado_leads || ""}
                                  onChange={e => updateCard(item.id, { resultado_leads: e.target.value })}
                                  disabled={isUpdating}
                                  placeholder="0"
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs font-bold text-[#1D9E75] text-center focus:outline-none focus:border-[#1D9E75] transition-colors tabular-nums"
                                />
                              </div>
                           </div>

                           {/* Status Changer */}
                           <div className="relative">
                             <select 
                               value={item.estado || 'Ideas'}
                               onChange={e => updateCard(item.id, { estado: e.target.value })}
                               disabled={isUpdating}
                               className={`w-full bg-zinc-900 border text-[10px] font-black uppercase tracking-widest rounded-xl pl-4 pr-8 py-3 outline-none cursor-pointer transition-colors appearance-none flex items-center ${colorClass.split(' ')[0]} text-white`}
                             >
                               {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                             </select>
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
                           </div>
                           
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
