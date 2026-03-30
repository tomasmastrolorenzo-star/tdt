"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Loader2, CalendarClock, MessageCircle, X, CheckSquare, FastForward } from "lucide-react";
import { useRouter } from "next/navigation";

export function TodayClient({ initialLeads }: any) {
  const router = useRouter();
  const priorityScore: Record<string, number> = { high: 3, medium: 2, low: 1 };
  const sortedLeads = (initialLeads || []).sort((a: any, b: any) => {
    const pA = priorityScore[a.priority || 'medium'] || 0;
    const pB = priorityScore[b.priority || 'medium'] || 0;
    return pB - pA;
  });

  const [leads, setLeads] = useState(sortedLeads);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (leadId: string, actionType: 'replied' | 'defer' | 'discard') => {
    setProcessingId(leadId);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type: actionType })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Optimistic eviction bridging real-time pipeline performance
      setLeads((prev: any) => prev.filter((l: any) => l.id !== leadId));
      
      const msgs = {
        replied: "Messaged. Scheduled +2 days sequentially.",
        defer: "Deferred. Target shifted to tomorrow +1 day.",
        discard: "Target Discarded. Shifted to lost off-grid."
      };
      toast.success(msgs[actionType]);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (leads.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center border border-zinc-900 rounded-3xl p-10 bg-zinc-950/50 shadow-2xl">
           <CheckSquare className="w-16 h-16 text-zinc-900 mb-6" />
           <h2 className="text-3xl font-black tracking-tighter text-zinc-600">INBOX ZERO</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700 mt-3">Target feed empty. All daily operations fulfilled.</p>
        </div>
      );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
       {leads.map((lead: any) => {
         const isProcessing = processingId === lead.id;
         const p = lead.priority || 'medium';
         return (
            <div key={lead.id} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-opacity" style={{ opacity: isProcessing ? 0.5 : 1 }}>
               <div>
                 <div className="flex items-start justify-between mb-5">
                    <a href={`/admin/leads/${lead.id}`} target="_blank" className="text-lg font-black text-white hover:text-cyan-400 transition-colors truncate max-w-[70%]">@{lead.instagram_username}</a>
                    <div className="flex gap-2">
                      <span className={`text-[8px] uppercase font-black tracking-widest px-2 py-1 rounded border
                         ${p === 'high' ? 'bg-red-950/30 text-red-500 border-red-900/50' : 
                           p === 'medium' ? 'bg-orange-950/30 text-orange-500 border-orange-900/50' : 
                           'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                         {p}
                      </span>
                    </div>
                 </div>
                 
                 <div className="flex gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 border-b border-zinc-900 pb-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-zinc-700">Follow-Ups</span>
                      <span className="text-white bg-black border border-zinc-800 px-3 py-1 rounded-full inline-block text-center">{lead.follow_up_count || 0}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-zinc-700">Elapsed</span>
                      <span className="text-zinc-300 font-bold">{lead.next_action_date ? formatDistanceToNow(new Date(lead.next_action_date)) : 'N/A'}</span>
                    </div>
                 </div>
               </div>

               <div className="flex flex-col gap-2 mt-auto">
                 <button 
                   disabled={isProcessing} onClick={() => handleAction(lead.id, 'replied')}
                   className={`w-full font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]
                      ${p === 'high' ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]' : 'bg-white text-black'}`}
                 >
                   <MessageCircle className="w-4 h-4" /> {p === 'high' ? 'MÁX. PRIORIDAD AHORA' : 'Ya le escribí (+2D)'}
                 </button>
                 <div className="flex gap-2">
                   <button 
                     disabled={isProcessing} onClick={() => handleAction(lead.id, 'defer')}
                     className={`flex-1 bg-zinc-900 border text-zinc-300 font-black uppercase tracking-widest text-[9px] py-3 rounded-xl hover:text-white transition-colors flex items-center justify-center gap-1.5
                       ${p === 'low' ? 'border-orange-900/50 hover:bg-orange-950' : 'border-zinc-800 hover:bg-zinc-800'}`}
                   >
                     <FastForward className="w-3.5 h-3.5" /> {p === 'low' ? 'Dormir (3 Días)' : 'Mañana'}
                   </button>
                   <button 
                     disabled={isProcessing} onClick={() => handleAction(lead.id, 'discard')}
                     className="flex-1 bg-red-950/20 border border-red-900/30 text-red-500 font-black uppercase tracking-widest text-[9px] py-3 rounded-xl hover:bg-red-900/50 hover:text-red-400 transition-colors flex items-center justify-center gap-1.5"
                   >
                     <X className="w-3 h-3" /> Descartar
                   </button>
                 </div>
               </div>
               
               {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
               )}
            </div>
         );
       })}
    </div>
  );
}
