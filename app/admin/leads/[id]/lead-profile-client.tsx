"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import { Loader2, Send, Save, CheckCircle, ArrowRight, User, Sparkles, Copy, CalendarCog, Crown, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function LeadProfileClient({ initialLead, initialInteractions, initialEvents, initialLeadInteractions, initialClient, initialScripts, prevId, nextId }: any) {
  const router = useRouter();
  const [lead, setLead] = useState(initialLead);
  const [interactions, setInteractions] = useState(initialInteractions);
  const [events, setEvents] = useState(initialEvents);
  const [leadInteractions, setLeadInteractions] = useState(initialLeadInteractions || []);
  const [clientProfile, setClientProfile] = useState(initialClient);
  const scripts: any[] = initialScripts || [];
  const [activeScriptEtapa, setActiveScriptEtapa] = useState('cold_dm');

  // High-Speed Keyboard Navigation Hook (Phase 13)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === 'ArrowLeft' && prevId) router.push(`/admin/leads/${prevId}`);
      if (e.key === 'ArrowRight' && nextId) router.push(`/admin/leads/${nextId}`);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevId, nextId, router]);
  
  // Strict Nested Context Initialization mapped to API Logic
  const defaultSales = lead.metadata?.sales_context || { buyer_type: "", interest_level: "", offer_discussed: "", estimated_value: "" };
  const [salesContext, setSalesContext] = useState(defaultSales);
  const [savingSales, setSavingSales] = useState(false);

  // Manual Feed Injector State
  const [noteContent, setNoteContent] = useState("");
  const [followUpDays, setFollowUpDays] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const [converting, setConverting] = useState(false);

  // TDT Smart Automation State (PHASE 9)
  const [smartLoading, setSmartLoading] = useState(false);
  const aiDrafts = lead.metadata?.ai_drafts || null;
  const priority = lead.priority || 'medium';
  const niche = lead.metadata?.niche || 'Undetermined';
  const [activeDraftTab, setActiveDraftTab] = useState<'start' | 'follow_up' | 'close'>('start');

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

  // POST to lead_interactions (spec table)
  const addLeadInteraction = async (tipo: string, contenido: string) => {
    try {
      const res = await fetch('/api/admin/lead-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: lead.id, tipo, contenido })
      });
      const data = await res.json();
      if (res.ok && data.interaction) {
        setLeadInteractions((prev: any[]) => [data.interaction, ...prev]);
      }
    } catch {}
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
      // Also log to lead_interactions spec table
      await addLeadInteraction('nota', noteContent);
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

  const runSmartIntake = async () => {
     if(!confirm("Execute Smart Automation Intake? This will overwrite Context and generate 3 explicit AI Drafts natively.")) return;
     setSmartLoading(true);
     try {
       const pl = { lead_id: lead.id, instagram: lead.instagram_username, status: lead.status, metadata: lead.metadata, interactions };
       const res = await fetch("/api/ai/smart-intake", { method: "POST", headers:{ "Content-Type": "application/json" }, body: JSON.stringify(pl)});
       const data = await res.json();
       if(!res.ok) throw new Error(data.error);

       setLead({ ...lead, priority: data.ai_data.priority, metadata: data.metadata });
       setSalesContext({ ...salesContext, buyer_type: data.ai_data.buyer_type, interest_level: data.ai_data.interest_level });
       setActiveDraftTab('start');
       toast.success("Intelligence Payload integrated flawlessly.");
     } catch (err: any) { toast.error(err.message); } finally { setSmartLoading(false); }
  };

  const isClosed = lead.status === "closed" || clientProfile;

  return (
    <div className="grid lg:grid-cols-12 gap-8 pb-10">
      
      {/* LEFT COLUMN: IDENTITY & SALES METRICS */}
      <div className="lg:col-span-4 flex flex-col gap-6">

        {/* FAST TRAVEL COMMAND BAR */}
        {(prevId || nextId) && (
           <div className="flex gap-2">
              <button 
                onClick={() => prevId && router.push(`/admin/leads/${prevId}`)} 
                disabled={!prevId}
                className="flex-1 bg-zinc-950 border border-zinc-900 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-zinc-900 hover:border-zinc-700 disabled:opacity-30 transition-all font-black text-[10px] uppercase tracking-widest text-zinc-400 group"
              >
                 <ChevronLeft className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" /> Prev Target
              </button>
              <button 
                onClick={() => nextId && router.push(`/admin/leads/${nextId}`)} 
                disabled={!nextId}
                className="flex-1 bg-zinc-950 border border-zinc-900 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-zinc-900 hover:border-zinc-700 disabled:opacity-30 transition-all font-black text-[10px] uppercase tracking-widest text-zinc-400 group"
              >
                 Next Target <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </button>
           </div>
        )}
        
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

        {/* SMART AUTOMATION ENGINE (PHASE 9) */}
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-2xl p-6 shadow-[0_0_30px_rgba(139,92,246,0.03)] relative overflow-hidden">
           <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-violet-500/10 blur-[60px] pointer-events-none"></div>
           
           <div className="flex items-center justify-between mb-4 relative z-10">
             <h3 className="text-[10px] uppercase font-black tracking-widest text-violet-500 flex items-center gap-2">
               <Sparkles className="w-3.5 h-3.5" /> Intelligence Engine
             </h3>
             <button 
               onClick={runSmartIntake}
               disabled={smartLoading || isClosed}
               className="bg-violet-950/40 hover:bg-violet-900/60 border border-violet-900/50 text-violet-400 font-bold uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
             >
               {smartLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : <CalendarCog className="w-3 h-3"/>} Run Intake
             </button>
           </div>

           {/* Metrics Overlay (Phase 14 V1.1 Qualification) */}
           <div className="flex flex-col gap-3 mb-4 relative z-10">
              <div className="flex gap-2">
                <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-1 rounded border 
                  ${priority === 'high' ? 'bg-red-950/30 border-red-900 text-red-500' : 
                    priority === 'medium' ? 'bg-orange-950/30 border-orange-900 text-orange-500' : 
                    'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                  Priority: {priority}
                </span>
                <span className="text-[9px] uppercase font-black tracking-widest px-2 py-1 rounded border bg-zinc-900 border-zinc-800 text-zinc-400">
                  Niche: {niche}
                </span>
              </div>

              {lead.metadata && lead.metadata.is_qualified === true && (
                 <div className="bg-green-950/20 border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.15)] rounded-lg p-2.5 flex justify-center mt-1">
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-green-400">✅ TDT Target Qualified (V1.1)</span>
                 </div>
              )}
              {lead.metadata && lead.metadata.is_qualified === false && (
                 <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-2.5 flex flex-col justify-center mt-1">
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-red-500 text-center mb-1">⛔ Disqualified (Failed criteria)</span>
                    <span className="text-[9px] font-bold text-red-400/60 text-center uppercase tracking-widest">{lead.metadata.disqualification_reason}</span>
                 </div>
              )}
           </div>
           
           {aiDrafts ? (
             <div className="relative mt-2 z-10 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex gap-1 mb-2">
                  <button onClick={() => setActiveDraftTab('start')} className={`flex-1 text-[9px] uppercase font-black tracking-widest py-2 rounded-t-lg transition-colors ${activeDraftTab==='start' ? 'bg-violet-900/30 border-t border-x border-violet-900/50 text-violet-300' : 'text-zinc-600 border-b border-zinc-800'}`}>Start</button>
                  <button onClick={() => setActiveDraftTab('follow_up')} className={`flex-1 text-[9px] uppercase font-black tracking-widest py-2 rounded-t-lg transition-colors ${activeDraftTab==='follow_up' ? 'bg-violet-900/30 border-t border-x border-violet-900/50 text-violet-300' : 'text-zinc-600 border-b border-zinc-800'}`}>Follow Up</button>
                  <button onClick={() => setActiveDraftTab('close')} className={`flex-1 text-[9px] uppercase font-black tracking-widest py-2 rounded-t-lg transition-colors ${activeDraftTab==='close' ? 'bg-violet-900/30 border-t border-x border-violet-900/50 text-violet-300' : 'text-zinc-600 border-b border-zinc-800'}`}>Close</button>
                </div>
                <div className="relative">
                  <textarea 
                    readOnly
                    value={aiDrafts[activeDraftTab]}
                    className="w-full bg-black border border-violet-900/30 rounded-b-xl p-4 text-xs font-medium text-violet-50/90 resize-none h-32 focus:outline-none custom-scrollbar rounded-tr-xl"
                  />
                  
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                     <button
                       onClick={async () => {
                          try {
                            const pl = { lead_id: lead.id, type: "winning_script", content: { message: aiDrafts[activeDraftTab], type: activeDraftTab, niche: niche || "Unknown", result: "Manually tracked as winner by Exec", date: new Date().toISOString() }};
                            const res = await fetch(`/api/admin/interactions`, { method: "POST", headers:{ "Content-Type": "application/json" }, body: JSON.stringify(pl)});
                            const data = await res.json();
                            if(!res.ok) throw new Error(data.error);
                            setInteractions([data.interaction, ...interactions]);
                            toast.success("🏆 AI Script mapped to Winner Database");
                          } catch (err: any) { toast.error(err.message); }
                       }}
                       className="bg-yellow-950/40 border border-yellow-900/50 hover:bg-yellow-900/60 text-yellow-500 p-2.5 rounded-lg transition-colors shadow-lg"
                       title="Archive as Winner"
                     >
                       <Crown className="w-3.5 h-3.5" />
                     </button>
                     <button onClick={() => { navigator.clipboard.writeText(aiDrafts[activeDraftTab]); toast.success("Draft snapped to clipboard!"); }} className="bg-zinc-800 hover:bg-zinc-700 text-white p-2.5 rounded-lg transition-colors shadow-lg" title="Copy Message">
                       <Copy className="w-3.5 h-3.5" />
                     </button>
                  </div>
                </div>
             </div>
           ) : (
             <div className="text-center py-6 border border-dashed border-zinc-800/50 rounded-xl mt-2 z-10 relative">
               <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">No Intelligence Drafts Rendered</p>
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
                         <div className="text-xs text-zinc-500 font-medium">Pipeline shifted from <span className="bg-black border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 mx-1">{item.metadata?.from_status}</span> to <span className="text-white font-black bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 rounded mx-1">{item.metadata?.to_status}</span> by Root System</div>
                       ) : (
                         <p className="text-sm text-zinc-300 font-medium whitespace-pre-wrap leading-relaxed">{item.content?.note || JSON.stringify(item.content)}</p>
                       )}
                    </div>
                 </div>
               )
             })}
           </div>
        </div>

        {/* SCRIPT SUGGESTIONS PANEL */}
        {scripts.length > 0 && (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shadow-xl shrink-0">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-3">
              <h3 className="text-[10px] uppercase font-black tracking-widest text-yellow-500 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Script Suggestions — {lead.niche || 'General'}
              </h3>
              <a href="/admin/scripts" className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">Full Library →</a>
            </div>
            {/* Etapa tabs */}
            <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
              {['cold_dm', 'followup_1', 'followup_2', 'oferta', 'cierre', 'reengagement'].map(etapa => {
                const count = scripts.filter((s: any) => s.etapa === etapa).length;
                if (count === 0) return null;
                const labels: Record<string, string> = { cold_dm: 'Cold DM', followup_1: 'FU 1', followup_2: 'FU 2', oferta: 'Oferta', cierre: 'Cierre', reengagement: 'Reengage' };
                return (
                  <button key={etapa} onClick={() => setActiveScriptEtapa(etapa)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${activeScriptEtapa === etapa ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-black border-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {labels[etapa]} ({count})
                  </button>
                );
              })}
            </div>
            {/* Scripts for active etapa */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
              {scripts
                .filter((s: any) => s.etapa === activeScriptEtapa)
                .sort((a: any, b: any) => (b.es_ganador ? 1 : 0) - (a.es_ganador ? 1 : 0))
                .map((script: any) => {
                  const recordActivity = async (type: 'usage' | 'conversion') => {
                    try {
                      const res = await fetch(`/api/admin/scripts/${script.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type })
                      });
                      if (!res.ok) throw new Error("Failed logging script efficiency");
                      toast.success(type === 'conversion' ? "Script Conversion Marked! Winner flag active." : "Usage Logged.");
                      // Optional: update local script state if needed, here we just show toast
                    } catch (err: any) { toast.error(err.message); }
                  };

                  return (
                    <div key={script.id} className={`p-4 rounded-xl border relative ${script.es_ganador ? 'bg-yellow-950/10 border-yellow-900/40' : 'bg-black border-zinc-900'}`}>
                      {script.es_ganador && (
                        <span className="absolute top-2 right-2 text-yellow-400 text-[8px] font-black uppercase tracking-widest">⭐ Winner Script</span>
                      )}
                      <p className="text-sm text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap pr-16">{script.contenido}</p>
                      
                      <div className="mt-4 flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => { navigator.clipboard.writeText(script.contenido); toast.success("Script copied!"); recordActivity('usage'); }}
                          className="flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-[1.05] transition-transform"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy & Use
                        </button>
                        <button
                          onClick={() => recordActivity('conversion')}
                          className="flex items-center gap-1.5 bg-yellow-600/20 border border-yellow-600/40 text-yellow-500 hover:bg-yellow-600/40 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors"
                        >
                          <Crown className="w-3.5 h-3.5" /> Mark Won
                        </button>
                        <div className="flex gap-3 ml-auto opacity-50">
                           <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Usos: {script.usos || 0}</span>
                           <span className="text-[8px] font-black uppercase tracking-widest text-green-500">Conv: {script.conversiones || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {scripts.filter((s: any) => s.etapa === activeScriptEtapa).length === 0 && (
                <div className="text-center py-6 text-zinc-700 text-[9px] font-black uppercase tracking-widest border border-dashed border-zinc-900 rounded-xl">
                  No scripts for this stage yet
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
