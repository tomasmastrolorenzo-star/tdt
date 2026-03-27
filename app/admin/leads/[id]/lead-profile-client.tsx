"use client";

import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import { Loader2, Send, Save, CheckCircle, ArrowRight, User, Sparkles, Copy, CalendarCog } from "lucide-react";
import { useRouter } from "next/navigation";

export function LeadProfileClient({ initialLead, initialInteractions, initialEvents, initialClient }: any) {
  const router = useRouter();
  const [lead, setLead] = useState(initialLead);
  const [interactions, setInteractions] = useState(initialInteractions);
  const [events, setEvents] = useState(initialEvents);
  const [clientProfile, setClientProfile] = useState(initialClient);
  
  // Strict Nested Context Initialization mapped to API Logic
  const defaultSales = lead.metadata?.sales_context || { buyer_type: "", interest_level: "", offer_discussed: "", estimated_value: "" };
  const [salesContext, setSalesContext] = useState(defaultSales);
  const [savingSales, setSavingSales] = useState(false);

  // Manual Feed Injector State
  const [noteContent, setNoteContent] = useState("");
  const [followUpDays, setFollowUpDays] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const [converting, setConverting] = useState(false);

  // TDT AI Sales Assistant State
  const [aiType, setAiType] = useState("start");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  // Deep merged structural timeline combining system audits with custom logs chronologically
  const timeline = [...interactions.map((i: any) => ({ ...i, __type: 'interaction' })), ...events.map((e: any) => ({ ...e, __type: 'event' }))]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Deep-Merge Executor
  const saveSalesContext = async () => {
    setSavingSales(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sales_context: {
            buyer_type: salesContext.buyer_type || null,
            interest_level: salesContext.interest_level || null,
            offer_discussed: salesContext.offer_discussed || null,
            estimated_value: salesContext.estimated_value || null
          } 
        })
      });
      if (!res.ok) throw new Error("Synchronization declined by JSONB schema");
      toast.success("Sales Context tightly synchronized");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingSales(false);
    }
  };

  const addNote = async () => {
    if (!noteContent.trim()) return;
    setSavingNote(true);
    try {
      const payload = { 
         lead_id: lead.id, 
         type: "manual_update", 
         content: { note: noteContent },
         ...(followUpDays ? { follow_up_days: parseInt(followUpDays) } : {}) 
      };
      
      const res = await fetch(`/api/admin/interactions`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setInteractions([data.interaction, ...interactions]);
      setNoteContent("");
      if (followUpDays) {
         setLead({ ...lead, next_action_date: new Date(Date.now() + parseInt(followUpDays) * 24 * 60 * 60 * 1000).toISOString() });
      }
      setFollowUpDays("");
      toast.success("Message deployed to historical ledger");
    } catch(err: any) {
      toast.error(err.message);
    } finally {
      setSavingNote(false);
    }
  };

  const handleConvert = async () => {
    if (!confirm("Execute conversion lock? This transfers lead state permanently into Client ledger.")) return;
    setConverting(true);
    try {
      const pl = { instagram: lead.instagram_username };
      const res = await fetch(`/api/admin/leads/${lead.id}/convert`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pl)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setClientProfile(data.client);
      setLead({ ...lead, status: 'closed' });
      toast.success("Conversion executed perfectly.");
      router.refresh(); 
    } catch(err: any) {
      toast.error(err.message);
    } finally {
      setConverting(false);
    }
  };

  const generateMessage = async () => {
    setAiLoading(true);
    setAiResult("");
    try {
      const res = await fetch(`/api/ai/generate-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, message_type: aiType })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error); // E.g. Missing OPENAI_API_KEY block
      
      setAiResult(data.text);
      toast.success("AI DM Payload Generated");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult);
    toast.success("Text snapped to native clipboard!");
  };

  const isClosed = lead.status === "closed" || clientProfile;

  return (
    <div className="grid lg:grid-cols-12 gap-8 pb-10">
      
      {/* LEFT COLUMN: IDENTITY & SALES METRICS */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* HEADER */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4 mb-5 relative z-10">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xl font-black truncate">@{lead.instagram_username}</h2>
              <span className="text-[9px] uppercase font-black tracking-[0.2em] text-zinc-500 bg-black border border-zinc-800 px-2 py-0.5 rounded mt-1 inline-block">{lead.source}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 text-[11px] font-bold text-zinc-600 bg-black border border-zinc-900 p-3 rounded-lg mb-6 relative z-10">
            <div className="flex justify-between">
               <span>Acquired:</span>
               <span className="text-zinc-400">{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</span>
            </div>
            <div className="flex justify-between">
               <span>Next Scheduled:</span>
               <span className="text-zinc-400">{lead.next_action_date ? formatDistanceToNow(new Date(lead.next_action_date), { addSuffix: true }) : 'N/A'}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-900 relative z-10">
             <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest text-zinc-600">Pipeline Sector</span>
                <span className={`text-[10px] uppercase font-black tracking-[0.2em] px-3 py-1.5 rounded-full border ${isClosed ? 'border-green-500/50 text-green-400 bg-green-950/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-zinc-700 text-zinc-300 bg-zinc-900'}`}>
                  {lead.status.replace('_', ' ')}
                </span>
             </div>
          </div>
        </div>

        {/* TDT AI SALES ASSISTANT (PHASE 5) */}
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-2xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.03)] relative overflow-hidden">
           <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-cyan-500/10 blur-[60px] pointer-events-none"></div>
           
           <h3 className="text-[10px] uppercase font-black tracking-widest text-cyan-500 mb-4 flex items-center gap-2 relative z-10">
             <Sparkles className="w-3.5 h-3.5" /> Closer Copilot
           </h3>
           
           <div className="flex gap-2 mb-3 relative z-10">
             <select 
               value={aiType} 
               onChange={e => setAiType(e.target.value)} 
               disabled={aiLoading || isClosed}
               className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-50 focus:border-cyan-900/50 outline-none transition-colors appearance-none"
             >
               <option value="start">Icebreaker (Start)</option>
               <option value="follow_up">Check-In (Follow Up)</option>
               <option value="close">Urgency Pitch (Close)</option>
               <option value="reengage">Revive (Re-engage)</option>
             </select>
             <button 
               onClick={generateMessage}
               disabled={aiLoading || isClosed}
               className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 font-bold uppercase tracking-widest text-[9px] px-4 py-2 rounded-xl transition-all disabled:opacity-50"
             >
               {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generar'}
             </button>
           </div>

           {aiResult && (
             <div className="relative mt-2 z-10 animate-in fade-in slide-in-from-top-2 duration-300">
                <textarea 
                  readOnly
                  value={aiResult}
                  className="w-full bg-black border border-cyan-900/30 rounded-xl p-4 text-xs font-medium text-cyan-50/90 resize-none h-32 focus:outline-none custom-scrollbar"
                />
                <button onClick={copyToClipboard} className="absolute bottom-3 right-3 bg-zinc-800 hover:bg-zinc-700 text-white p-2.5 rounded-lg transition-colors shadow-lg">
                  <Copy className="w-3.5 h-3.5" />
                </button>
             </div>
           )}
        </div>

        {/* CLOSER AUTHORITY BUTTON */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl relative z-10">
          <h3 className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-4">Command Action</h3>
          {isClosed ? (
             <div className="bg-green-950/20 border border-green-900/50 p-5 rounded-xl text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <p className="text-sm font-black tracking-tighter text-green-400">Ledger Closed</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-green-600/60 mt-2">Client locked in operational database.</p>
             </div>
          ) : (
            <button 
              onClick={handleConvert}
              disabled={converting}
              className="w-full bg-white text-black font-black uppercase tracking-[0.2em] text-xs py-4 rounded-xl hover:bg-zinc-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
               {converting ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle className="w-4 h-4" />}
               Force Conversion Match
            </button>
          )}
        </div>

        {/* JSONB SALES METADATA OVERRIDE */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl relative z-10">
           <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-900">
             <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-white">Advanced Context</h3>
             <button onClick={saveSalesContext} disabled={savingSales || isClosed} className="text-[10px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-md border border-zinc-800 flex items-center gap-1.5 uppercase font-black tracking-widest transition-colors">
               {savingSales ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Save className="w-3.5 h-3.5" />}
               Save
             </button>
           </div>

           <div className="space-y-5">
             <div>
               <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-600 mb-1.5">Buyer Paradigm</label>
               <select 
                 value={salesContext.buyer_type || ""} 
                 onChange={e => setSalesContext({...salesContext, buyer_type: e.target.value})} 
                 disabled={isClosed}
                 className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-zinc-300 focus:border-zinc-500 outline-none transition-colors appearance-none"
               >
                 <option value="">Undetermined</option>
                 <option value="impulse">Impulse</option>
                 <option value="logical">Logical</option>
                 <option value="unsure">Unsure</option>
               </select>
             </div>

             <div>
               <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-600 mb-1.5">Systemic Interest</label>
               <select 
                 value={salesContext.interest_level || ""} 
                 onChange={e => setSalesContext({...salesContext, interest_level: e.target.value})} 
                 disabled={isClosed}
                 className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-zinc-300 focus:border-zinc-500 outline-none transition-colors appearance-none"
               >
                 <option value="">Undetermined</option>
                 <option value="low">Low Priority</option>
                 <option value="medium">Medium Priority</option>
                 <option value="high">High Priority</option>
               </select>
             </div>

             <div>
               <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-600 mb-1.5">Negotiation Value ($)</label>
               <input 
                 type="number"
                 placeholder="0.00"
                 value={salesContext.estimated_value || ""}
                 onChange={e => setSalesContext({...salesContext, estimated_value: e.target.value})}
                 disabled={isClosed}
                 className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:border-zinc-500 outline-none placeholder:text-zinc-800 transition-colors"
               />
             </div>

             <div>
               <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-600 mb-1.5">Vector / Pitch Delivered</label>
               <textarea 
                 rows={4}
                 placeholder="Detail the exact structural pitch deployed."
                 value={salesContext.offer_discussed || ""}
                 onChange={e => setSalesContext({...salesContext, offer_discussed: e.target.value})}
                 disabled={isClosed}
                 className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:border-zinc-500 outline-none placeholder:text-zinc-800 resize-none transition-colors"
               />
             </div>
           </div>
        </div>

      </div>

      {/* RIGHT COLUMN: CORE TIMELINE AND INTERACTIONS */}
      <div className="lg:col-span-8 flex flex-col gap-6 h-[85vh]">
        
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shrink-0 flex gap-3 shadow-xl items-center relative z-10">
           <input 
             type="text"
             placeholder="Drop operational feedback or close log..."
             value={noteContent}
             onChange={e => setNoteContent(e.target.value)}
             disabled={savingNote || isClosed}
             onKeyDown={e => e.key === 'Enter' && addNote()}
             className="flex-1 bg-black border border-zinc-800 rounded-xl px-5 py-4 text-sm font-medium text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-700"
           />
           <select
             value={followUpDays}
             onChange={e => setFollowUpDays(e.target.value)}
             disabled={savingNote || isClosed}
             className="bg-black border border-zinc-800 rounded-xl px-4 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:outline-none focus:border-zinc-500 appearance-none transition-colors cursor-pointer"
           >
             <option value="">No Scheduled Alert</option>
             <option value="1">+1 Day Schedule</option>
             <option value="2">+2 Days Schedule</option>
             <option value="3">+3 Days Schedule</option>
             <option value="7">+1 Week Schedule</option>
           </select>
           <button onClick={addNote} disabled={savingNote || !noteContent.trim() || isClosed} className="bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-xl transition-all disabled:opacity-50">
             {savingNote ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
           </button>
        </div>

        <div className="flex-1 bg-zinc-950 border border-zinc-900 rounded-2xl p-8 overflow-y-auto custom-scrollbar shadow-xl relative z-10">
           <div className="flex items-center gap-3 mb-8 sticky top-0 bg-zinc-950/90 backdrop-blur-md py-2 z-20 border-b border-zinc-900/50">
             <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
             <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-white">Unified Core Timeline</h3>
           </div>
           
           <div className="space-y-2 pb-6 relative">
             {timeline.length === 0 && (
                <div className="text-center text-zinc-700 text-[10px] font-black uppercase tracking-widest py-10 border-2 border-dashed border-zinc-900 rounded-xl">Target feed fundamentally empty</div>
             )}

             {timeline.map((item: any) => {
               const isEvent = item.__type === 'event';
               return (
                 <div key={`${item.__type}-${item.id}`} className="flex gap-5 relative group">
                    <div className="w-[1.5px] bg-zinc-900 absolute top-10 bottom-[-10px] left-6 z-0 group-last:hidden" />
                    
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 z-10 border transition-colors ${isEvent ? 'bg-black border-zinc-900 text-zinc-600' : 'bg-zinc-900 border-zinc-700 text-zinc-300 group-hover:bg-zinc-800'}`}>
                       {isEvent ? <ArrowRight className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    
                    <div className={`flex-1 rounded-2xl p-5 border transition-all ${isEvent ? 'border-zinc-900/50 bg-black/30' : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 shadow-lg'}`}>
                       <div className="flex items-center justify-between mb-3 border-b border-zinc-800/50 pb-2">
                         <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isEvent ? 'text-zinc-600' : 'text-zinc-400'}`}>
                           {isEvent ? 'DB EVENT' : item.type.replace('_', ' ')}
                         </span>
                         <span className="text-[10px] text-zinc-500 font-bold tracking-widest">
                            {format(new Date(item.created_at), "MMM d, HH:mm")}
                         </span>
                       </div>
                       
                       {isEvent ? (
                         <div className="text-xs text-zinc-500 font-medium">Pipeline shifted from <span className="bg-black border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 mx-1">{item.metadata?.from_status}</span> to <span className="text-white font-black bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 rounded mx-1 shadow-[0_0_10px_rgba(255,255,255,0.05)]">{item.metadata?.to_status}</span> by Root System</div>
                       ) : (
                         <p className="text-sm text-zinc-300 font-medium whitespace-pre-wrap leading-relaxed">{item.content?.note || JSON.stringify(item.content)}</p>
                       )}
                    </div>
                 </div>
               )
             })}
           </div>
        </div>

      </div>
    </div>
  );
}
