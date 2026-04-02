"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Square, Loader2, Save, HeartPulse, Check, RefreshCw, MessageCircle, X, FastForward, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const CHECKLIST_KEY = "tdt_daily_routine";
type ChecklistState = { date: string; tasks: Record<string, boolean> };
type RetentionAction = {
  id: string;
  client_id: string;
  action_type: string;
  message_template?: string;
  message_payload?: string;
  scheduled_for?: string;
  execute_at?: string;
  status: string;
};

function parseMessage(action: RetentionAction): string {
  if (action.message_payload) {
    try { const p = JSON.parse(action.message_payload); return p.message || action.message_template || "—"; }
    catch { return action.message_template || "—"; }
  }
  return action.message_template || "—";
}
function parseHandle(action: RetentionAction): string | null {
  if (action.message_payload) {
    try { const p = JSON.parse(action.message_payload); return p.client_handle || null; }
    catch { return null; }
  }
  return action.client_id || null;
}
function parseAmount(action: RetentionAction): string | null {
  if (action.message_payload) {
    try { const p = JSON.parse(action.message_payload); return p.original_amount ? `$${p.original_amount}` : null; }
    catch { return null; }
  }
  return null;
}

export function DailyRoutineClient({ initialLeads, initialActionableLeads, initialReport }: any) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [dmsSent, setDmsSent] = useState(initialReport?.dms_sent?.toString() || "0");
  const [responses, setResponses] = useState(initialReport?.replies?.toString() || "0");
  const [savingMetrics, setSavingMetrics] = useState(false);
  const [retentionActions, setRetentionActions] = useState<RetentionAction[]>([]);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [runningCron, setRunningCron] = useState(false);

  // Actionable Leads (Today Feed) logic
  const [actionableLeads, setActionableLeads] = useState(initialActionableLeads || []);
  const [processingLeadId, setProcessingLeadId] = useState<string | null>(null);

  const contactedOver48h = initialLeads.filter((l: any) => l.status === 'contacted' && ((Date.now() - new Date(l.updated_at).getTime()) / 3600000) > 48).length;
  const activeConversationsCount = initialLeads.filter((l: any) => ['responded', 'qualified', 'offer_sent', 'payment_pending'].includes(l.status)).length;
  const closesTodayCount = initialLeads.filter((l: any) => l.status === 'closed' && new Date(l.updated_at).toISOString().split('T')[0] === todayStr).length;
  const retentionOnly = retentionActions.filter(a => a.action_type === 'retention_message');
  const renewalOnly = retentionActions.filter(a => a.action_type === 'renewal_reminder');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHECKLIST_KEY);
      if (stored) {
        const parsed: ChecklistState = JSON.parse(stored);
        if (parsed.date === todayStr) setTasks(parsed.tasks);
        else localStorage.removeItem(CHECKLIST_KEY);
      }
    } catch {}
    fetchRetentionActions();
  }, [todayStr]);

  const fetchRetentionActions = async () => {
    try {
      const res = await fetch("/api/admin/retention-actions");
      if (res.ok) { const data = await res.json(); setRetentionActions(data.actions || []); }
    } catch {}
  };

  const handleLeadAction = async (leadId: string, actionType: 'replied' | 'defer' | 'discard') => {
    setProcessingLeadId(leadId);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type: actionType })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionableLeads((prev: any) => prev.filter((l: any) => l.id !== leadId));
      
      const msgs = {
        replied: "Messaged. Scheduled +2 days sequentially.",
        defer: "Deferred. Target shifted to tomorrow +1 day.",
        discard: "Target Discarded. Shifted to lost off-grid."
      };
      toast.success(msgs[actionType]);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessingLeadId(null);
    }
  };

  const triggerRenewalCheck = async () => {
    setRunningCron(true);
    try {
      const res = await fetch("/api/admin/renewal-check", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`${data.created} renewal reminders created, ${data.skipped} already existed.`);
      fetchRetentionActions();
    } catch(e: any) { toast.error(e.message); }
    finally { setRunningCron(false); }
  };

  const completeRetentionAction = async (id: string) => {
    setCompletingId(id);
    try {
      const res = await fetch(`/api/admin/retention-actions/${id}/complete`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
      setRetentionActions(prev => prev.filter(a => a.id !== id));
      toast.success("Action marked complete.");
    } catch { toast.error("Could not complete action."); }
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
        body: JSON.stringify({ 
          dms_sent: parseInt(dmsSent)||0, 
          replies: parseInt(responses)||0, 
          conversations: activeConversationsCount, 
          closes: closesTodayCount 
        })
      });
      if (!res.ok) throw new Error("Sync failure");
      toast.success("Daily Execution Logged.");
    } catch { toast.error("Failed executing sync protocol."); }
    finally { setSavingMetrics(false); }
  };

  const Task = ({ id, label, highlight }: { id: string; label: string; highlight?: string }) => (
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

  const ActionCard = ({ action, type }: { action: RetentionAction; type: 'retention' | 'renewal' }) => {
    const isRenewal = type === 'renewal';
    const handle = parseHandle(action);
    const amount = parseAmount(action);
    const message = parseMessage(action);
    const scheduledAt = action.execute_at || action.scheduled_for;
    return (
      <div className={`bg-black border rounded-xl p-4 flex items-start justify-between gap-4 ${isRenewal ? 'border-amber-900/40' : 'border-cyan-900/30'}`}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${isRenewal ? 'text-amber-400 bg-amber-950/30 border-amber-900/50' : 'text-cyan-400 bg-cyan-950/20 border-cyan-900/40'}`}>
              {isRenewal ? '🔄 Renewal' : '💬 Retention'}
            </span>
            {handle && <span className="text-[9px] font-black text-zinc-400">@{handle}</span>}
            {amount && <span className="text-[9px] font-black text-green-500">{amount}</span>}
          </div>
          <p className="text-sm font-bold text-white leading-relaxed">{message}</p>
          {scheduledAt && (
            <span className={`text-[9px] font-black uppercase tracking-widest mt-1 block ${isRenewal ? 'text-amber-700' : 'text-cyan-700'}`}>
              Due: {new Date(scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        <button onClick={() => completeRetentionAction(action.id)} disabled={completingId === action.id}
          className={`shrink-0 border px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center gap-1.5 transition-colors disabled:opacity-50 ${isRenewal ? 'bg-amber-950/40 border-amber-900/50 hover:bg-amber-900/60 text-amber-400' : 'bg-cyan-950/40 border-cyan-900/50 hover:bg-cyan-900/60 text-cyan-400'}`}
        >
          {completingId === action.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Done
        </button>
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7 space-y-8">
        
        {/* INBOX ZERO FEED (FUSED FROM TODAY) */}
        {actionableLeads.length > 0 && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between mb-6 border-b border-zinc-900 pb-4">
               <div className="flex items-center gap-3">
                 <CalendarClock className="w-5 h-5 text-white" />
                 <h2 className="text-xl font-black tracking-tighter">Feed de Ejecución</h2>
               </div>
               <span className="bg-white text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                 {actionableLeads.length} Pendientes
               </span>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 snap-x custom-scrollbar">
               {actionableLeads.map((lead: any) => {
                 const isProcessing = processingLeadId === lead.id;
                 const isMoney = ['offer_sent', 'payment_pending', 'cerrado'].includes(lead.status);
                 
                 return (
                   <div key={lead.id} className={`shrink-0 w-[300px] snap-center bg-black border rounded-2xl p-5 relative ${isMoney ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-zinc-800'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <a href={`/admin/leads/${lead.id}`} target="_blank" className="text-sm font-black text-white hover:text-cyan-400 transition-colors truncate">@{lead.instagram_username}</a>
                        {isMoney && <span className="text-[8px] font-black bg-green-500 text-black px-1.5 py-0.5 rounded tracking-widest">💰 Cerrado</span>}
                      </div>

                      <div className="flex gap-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-6 border-b border-zinc-900 pb-4">
                        <div className="flex flex-col gap-1">
                          <span>Seguimientos</span>
                          <span className="text-white">{lead.follow_up_count || 0}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span>Transcurrido</span>
                          <span className="text-zinc-400">{lead.next_action_date ? formatDistanceToNow(new Date(lead.next_action_date), { addSuffix: true }) : 'N/A'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <button onClick={() => handleLeadAction(lead.id, 'replied')} disabled={isProcessing} className="w-full bg-white text-black font-black uppercase text-[9px] tracking-widest py-3 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                           <MessageCircle className="w-3.5 h-3.5" /> Respondido
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => handleLeadAction(lead.id, 'defer')} disabled={isProcessing} className="bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[8px] py-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:text-white transition-colors">
                            <FastForward className="w-3 h-3" /> Posponer
                          </button>
                          <button onClick={() => handleLeadAction(lead.id, 'discard')} disabled={isProcessing} className="bg-red-950/20 border border-red-900/30 text-red-500 font-black uppercase text-[8px] py-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-red-900/50 transition-colors">
                            <X className="w-3 h-3" /> Descartar
                          </button>
                        </div>
                      </div>

                      {isProcessing && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                   </div>
                 );
               })}
            </div>
          </div>
        )}

        {/* BLOCK 1 */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
          <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-cyan-500 mb-4 border-b border-zinc-900 pb-3">Bloque 1: Preparación (5 min)</h2>
          <Task id="prep_1" label="Revisar leads en 'Proceso' con +48h sin respuesta → mover o descartar" highlight={contactedOver48h > 0 ? `${contactedOver48h} Estancados` : undefined} />
          <Task id="prep_2" label="Revisar leads en 'Conversación activa' → anotar pendientes" highlight={`${activeConversationsCount} Activos`} />
          <Task id="prep_3" label="Definir nicho operativo dominante del día" />
        </div>
        {/* BLOCK 2 */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
          <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-indigo-500 mb-4 border-b border-zinc-900 pb-3">Bloque 2: Operaciones DM (60 min)</h2>
          <Task id="dms_1" label="Meta operativa: Ejecutar 50 cold DMs estructurados." />
          <Task id="dms_2" label="Filtrar bajo los 5 Criterios Estrictos SOP antes de inyectar el DM." />
          <Task id="dms_3" label="Desplegar Scripts Validados del Cerebro (Nicho Contextualizado)." />
        </div>
        {/* BLOCK 3 */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
          <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-green-500 mb-4 border-b border-zinc-900 pb-3">Bloque 3: Respuestas (25 min)</h2>
          <Task id="resp_1" label="Procesar Inbox nativo de Instagram completamente a Zero (Inbox Zero)." />
          <Task id="resp_2" label="Actualizar el CRM Pipeline estructurando las fases hacia el cierre." />
        </div>

        {/* RENEWAL QUEUE — amber */}
        {renewalOnly.length > 0 && (
          <div className="bg-amber-950/10 border border-amber-900/40 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-amber-900/30 pb-3">
              <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-amber-400 flex items-center gap-2">
                🔄 Cola de Renovación — {renewalOnly.length} Vencidos
              </h2>
              <button onClick={triggerRenewalCheck} disabled={runningCron}
                className="flex items-center gap-1.5 bg-amber-950/30 border border-amber-900/40 hover:bg-amber-900/30 text-amber-500 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {runningCron ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />} Refrescar
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {renewalOnly.map(action => <ActionCard key={action.id} action={action} type="renewal" />)}
            </div>
          </div>
        )}

        {/* RETENTION QUEUE — cyan */}
        {retentionOnly.length > 0 && (
          <div className="bg-cyan-950/10 border border-cyan-900/40 rounded-2xl p-6 shadow-xl">
            <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-cyan-400 mb-4 border-b border-cyan-900/30 pb-3 flex items-center gap-2">
              <HeartPulse className="w-4 h-4" /> Cola de Retención — {retentionOnly.length} Misiones
            </h2>
            <div className="flex flex-col gap-3">
              {retentionOnly.map(action => <ActionCard key={action.id} action={action} type="retention" />)}
            </div>
          </div>
        )}

        {/* Empty queues */}
        {retentionActions.length === 0 && (
          <div className="border border-dashed border-zinc-800 rounded-2xl p-6 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700">Colas despejadas · Sin acciones de retención o renovación pendientes</p>
            <button onClick={triggerRenewalCheck} disabled={runningCron}
              className="mt-3 flex items-center gap-1.5 mx-auto bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-amber-400 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {runningCron ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />} Buscar Renovaciones
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR — BLOCK 4 */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl sticky top-6">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-4">
            <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-400">Bloque 4: Registro de Datos</h2>
            <button onClick={syncMetrics} disabled={savingMetrics}
              className="bg-zinc-900 hover:bg-zinc-800 text-[9px] uppercase font-black tracking-widest text-zinc-300 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {savingMetrics ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Sincronizar
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">Volumen DMs Enviados</span>
              <input type="number" value={dmsSent} onChange={e => setDmsSent(e.target.value)} className="bg-black border border-zinc-800 w-20 text-center px-2 py-1.5 rounded-lg focus:outline-none focus:border-zinc-500 font-black text-white" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">Respuestas (Manual)</span>
              <input type="number" value={responses} onChange={e => setResponses(e.target.value)} className="bg-black border border-zinc-800 w-20 text-center px-2 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500 font-black text-cyan-400" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-zinc-900 border-dashed">
              <span className="text-[10px] uppercase tracking-widest font-black text-zinc-600">Auto Conversaciones Activas</span>
              <span className="text-lg font-black text-white">{activeConversationsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-black text-zinc-600">Auto Cierres del Día</span>
              <span className="text-lg font-black text-green-500">{closesTodayCount}</span>
            </div>
            {renewalOnly.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-black text-amber-700">Renovaciones Pendientes</span>
                <span className="text-lg font-black text-amber-400">{renewalOnly.length}</span>
              </div>
            )}
            {retentionOnly.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-black text-cyan-700">Retenciones Pendientes</span>
                <span className="text-lg font-black text-cyan-400">{retentionOnly.length}</span>
              </div>
            )}
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-6 text-center">El protocolo se reinicia a las 00:00.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
