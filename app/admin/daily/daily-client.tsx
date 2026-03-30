"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Square, Loader2, Save, HeartPulse, Check } from "lucide-react";
import { toast } from "sonner";

const CHECKLIST_KEY = "tdt_daily_routine";
type ChecklistState = { date: string; tasks: Record<string, boolean> };
type RetentionAction = { id: string; client_id: string; action_type: string; message_template: string; scheduled_for: string; status: string };

export function DailyRoutineClient({ initialLeads, initialReport }: any) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [dmsSent, setDmsSent] = useState(initialReport?.dms_sent?.toString() || "0");
  const [responses, setResponses] = useState(initialReport?.replies?.toString() || "0");
  const [savingMetrics, setSavingMetrics] = useState(false);
  const [retentionActions, setRetentionActions] = useState<RetentionAction[]>([]);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const contactedOver48h = initialLeads.filter((l: any) => l.status === 'contacted' && ((Date.now() - new Date(l.updated_at).getTime()) / 3600000) > 48).length;
  const activeConversations = initialLeads.filter((l: any) => ['responded', 'qualified', 'offer_sent', 'payment_pending'].includes(l.status)).length;
  const closesToday = initialLeads.filter((l: any) => l.status === 'closed' && new Date(l.updated_at).toISOString().split('T')[0] === todayStr).length;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHECKLIST_KEY);
      if (stored) {
        const parsed: ChecklistState = JSON.parse(stored);
        if (parsed.date === todayStr) setTasks(parsed.tasks);
        else localStorage.removeItem(CHECKLIST_KEY);
      }
    } catch(e) {}
    fetchRetentionActions();
  }, [todayStr]);

  const fetchRetentionActions = async () => {
    try {
      const res = await fetch("/api/admin/retention-actions");
      if (res.ok) { const data = await res.json(); setRetentionActions(data.actions || []); }
    } catch(e) {}
  };

  const completeRetentionAction = async (id: string) => {
    setCompletingId(id);
    try {
      const res = await fetch(`/api/admin/retention-actions/${id}/complete`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
      setRetentionActions(prev => prev.filter(a => a.id !== id));
      toast.success("Retention action marked complete.");
    } catch(e) { toast.error("Could not complete action."); }
    finally { setCompletingId(null); }
  };

  const toggleTask = (taskId: string) => {
    const newTasks = { ...tasks, [taskId]: !tasks[taskId] };
    setTasks(newTasks);
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify({ date: todayStr, tasks: newTasks }));
  };

  const syncMetrics = async () => {
    setSavingMetrics(true);
    try {
      const res = await fetch("/api/admin/daily-reports/sync", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dms_sent: parseInt(dmsSent)||0, replies: parseInt(responses)||0, conversations: activeConversations, closes: closesToday })
      });
      if (!res.ok) throw new Error("Sync failure");
      toast.success("Daily Execution Logged.");
    } catch(err) { toast.error("Failed executing sync protocol."); }
    finally { setSavingMetrics(false); }
  };

  const Task = ({ id, label, highlight }: { id: string, label: string, highlight?: string }) => (
    <div onClick={() => toggleTask(id)} className="flex items-start gap-4 p-4 rounded-xl cursor-pointer hover:bg-zinc-900/40 border border-transparent hover:border-zinc-800 transition-colors group">
      <div className="shrink-0 mt-0.5">
         {tasks[id] ? <CheckSquare className="w-5 h-5 text-green-500" /> : <Square className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />}
      </div>
      <div className={`text-sm font-bold leading-relaxed ${tasks[id] ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>
         {label}
         {highlight && <span className="ml-2 bg-orange-950/40 text-orange-500 border border-orange-900/50 px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest">{highlight}</span>}
      </div>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7 space-y-6">
         <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
            <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-cyan-500 mb-4 border-b border-zinc-900 pb-3">Block 1: Preparación (5 min)</h2>
            <Task id="prep_1" label="Revisar leads en 'Contactado' con +48h sin respuesta → mover o descartar" highlight={contactedOver48h > 0 ? `${contactedOver48h} Stalled` : undefined} />
            <Task id="prep_2" label="Revisar leads en 'Conversación activa' → anotar pendientes" highlight={`${activeConversations} Active`} />
            <Task id="prep_3" label="Definir nicho operativo dominante del día" />
         </div>
         <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
            <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-indigo-500 mb-4 border-b border-zinc-900 pb-3">Block 2: Operaciones DM (60 min)</h2>
            <Task id="dms_1" label="Meta operativa: Ejecutar 50 cold DMs estructurados." />
            <Task id="dms_2" label="Filtrar bajo los 5 Criterios Estrictos SOP antes de inyectar el DM." />
            <Task id="dms_3" label="Desplegar Scripts Validados del Cerebro (Nicho Contextualizado)." />
         </div>
         <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
            <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-green-500 mb-4 border-b border-zinc-900 pb-3">Block 3: Respuestas (25 min)</h2>
            <Task id="resp_1" label="Procesar Inbox nativo de Instagram completamente a Zero (Inbox Zero)." />
            <Task id="resp_2" label="Actualizar el CRM Pipeline estructurando las fases hacia el cierre." />
         </div>

         {retentionActions.length > 0 && (
           <div className="bg-cyan-950/10 border border-cyan-900/40 rounded-2xl p-6 shadow-xl">
             <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-cyan-400 mb-4 border-b border-cyan-900/30 pb-3 flex items-center gap-2">
               <HeartPulse className="w-4 h-4" /> Retention Queue — {retentionActions.length} Misiones
             </h2>
             <div className="flex flex-col gap-3">
               {retentionActions.map(action => (
                 <div key={action.id} className="bg-black border border-cyan-900/30 rounded-xl p-4 flex items-start justify-between gap-4">
                   <div className="flex-1">
                     <p className="text-sm font-bold text-white leading-relaxed">{action.message_template}</p>
                     <span className="text-[9px] font-black uppercase tracking-widest text-cyan-600 mt-1 block">
                       Scheduled: {new Date(action.scheduled_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                   </div>
                   <button onClick={() => completeRetentionAction(action.id)} disabled={completingId === action.id}
                     className="shrink-0 bg-cyan-950/40 border border-cyan-900/50 hover:bg-cyan-900/60 text-cyan-400 px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center gap-1.5 transition-colors disabled:opacity-50"
                   >
                     {completingId === action.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Done
                   </button>
                 </div>
               ))}
             </div>
           </div>
         )}
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6">
         <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl sticky top-6">
            <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-4">
              <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-400">Block 4: Registro Final</h2>
              <button onClick={syncMetrics} disabled={savingMetrics}
                 className="bg-zinc-900 hover:bg-zinc-800 text-[9px] uppercase font-black tracking-widest text-zinc-300 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                 {savingMetrics ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Sync
              </button>
            </div>
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">Volume DMs Sent</span>
                  <input type="number" value={dmsSent} onChange={e => setDmsSent(e.target.value)} className="bg-black border border-zinc-800 w-20 text-center px-2 py-1.5 rounded-lg focus:outline-none focus:border-zinc-500 font-black text-white" />
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">Respuestas (Manual)</span>
                  <input type="number" value={responses} onChange={e => setResponses(e.target.value)} className="bg-black border border-zinc-800 w-20 text-center px-2 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500 font-black text-cyan-400" />
               </div>
               <div className="flex items-center justify-between pt-4 border-t border-zinc-900 border-dashed">
                  <span className="text-[10px] uppercase tracking-widest font-black text-zinc-600">Auto Conversaciones Activas</span>
                  <span className="text-lg font-black text-white">{activeConversations}</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-black text-zinc-600">Auto Cierres del Día</span>
                  <span className="text-lg font-black text-green-500">{closesToday}</span>
               </div>
               {retentionActions.length > 0 && (
                 <div className="flex items-center justify-between">
                   <span className="text-[10px] uppercase tracking-widest font-black text-cyan-700">Retention Pendiente</span>
                   <span className="text-lg font-black text-cyan-400">{retentionActions.length}</span>
                 </div>
               )}
               <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-6 text-center">Protocol resets at 00:00 midnight.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
