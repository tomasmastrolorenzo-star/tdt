"use client";

import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import { Loader2, DollarSign, Package, PackageCheck, CheckCircle2, UserCheck, UserX, Clock, Tag, Save, LayoutGrid, List } from "lucide-react";
import { FulfillmentBoard } from "./fulfillment-board";

export function ClientsClient({ initialClients }: any) {
  const [clients, setClients] = useState(initialClients || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'active' | 'inactive'>('active');
  const [viewMode, setViewMode] = useState<'fulfillment' | 'ledger'>('fulfillment');

  const filteredClients = clients.filter((c: any) => (c.status || 'active') === filter);

  // Core Financial Engine Metrics
  const totalRevenue = clients.reduce((sum: number, client: any) => sum + (Number(client.payment_amount) || 0), 0);
  const totalActive = clients.filter((c: any) => (c.status || 'active') === 'active').length;
  const pendingDeliveries = clients.filter((c: any) => c.delivery_status === 'pending' || c.delivery_status === 'processing').length;

  const toggleDelivery = async (clientId: string, currentStatus: string) => {
    setLoadingId(clientId + '-delivery');
    const newStatus = currentStatus === 'pending' ? 'delivered' : 'pending';
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/delivery`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ delivery_status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClients(clients.map((c: any) => c.id === clientId ? { ...c, delivery_status: newStatus } : c));
      toast.success(newStatus === 'delivered' ? "Delivery Complete." : "Rolled back to Pending.");
    } catch (err: any) { toast.error(err.message); } finally { setLoadingId(null); }
  };

  const updateClientField = async (clientId: string, payload: any) => {
    setLoadingId(clientId + '-update');
    try {
      // If we are updating delivery_status, use the pure delivery endpoint for trigger safety
      if (payload.delivery_status !== undefined) {
          const res = await fetch(`/api/admin/clients/${clientId}/delivery`, {
              method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error(await res.text());
          setClients(clients.map((c: any) => c.id === clientId ? { ...c, delivery_status: payload.delivery_status } : c));
          toast.success("Delivery stage synced to Postgres.");
          return;
      }
      
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setClients(clients.map((c: any) => c.id === clientId ? { ...c, ...data.client, ...payload } : c));
      
      if (payload.action === 'check_now') toast.success("Operation visually tracked for today.");
      if (payload.status) toast.success(`Client shifted to ${payload.status}`);
      if (payload.notes !== undefined || payload.delivery_notes !== undefined) toast.success("Post-Venta notes synced perfectly.");
      if (payload.renewal_date !== undefined) toast.success("Renewal Date locked.");
    } catch (err: any) { toast.error(err.message); } finally { setLoadingId(null); }
  };

  return (
    <div className="pb-16 pt-4">
      
      {/* ── TOP FINANCIAL FRAMEWORK ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
           <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-green-500/10 blur-[50px] pointer-events-none"></div>
           <div className="flex items-center gap-3 mb-2 opacity-50 text-[10px] uppercase font-black tracking-widest text-green-400">
             <DollarSign className="w-4 h-4" /> System Total Yield
           </div>
           <h2 className="text-4xl font-black text-white relative z-10">${totalRevenue.toLocaleString()}</h2>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
           <div className="flex items-center gap-3 mb-2 opacity-50 text-[10px] uppercase font-black tracking-widest text-white">
             <CheckCircle2 className="w-4 h-4" /> Active Subscriptions
           </div>
           <h2 className="text-4xl font-black text-white relative z-10">{totalActive}</h2>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
           <div className={`absolute top-[-30px] right-[-30px] w-32 h-32 ${pendingDeliveries > 0 ? 'bg-orange-500/10' : 'bg-cyan-500/10'} blur-[50px] pointer-events-none`}></div>
           <div className={`flex items-center gap-3 mb-2 opacity-50 text-[10px] uppercase font-black tracking-widest ${pendingDeliveries > 0 ? 'text-orange-400' : 'text-cyan-400'}`}>
             <Package className="w-4 h-4" /> Operations Pending
           </div>
           <h2 className="text-4xl font-black text-white relative z-10">{pendingDeliveries}</h2>
        </div>
      </div>

      {/* ── VIEW MODE TOGGLE ── */}
      <div className="flex justify-center mb-8">
         <div className="bg-black border border-zinc-900 rounded-2xl p-1.5 flex gap-2">
            <button 
              onClick={() => setViewMode('fulfillment')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${viewMode === 'fulfillment' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Fulfillment Board
            </button>
            <button 
              onClick={() => setViewMode('ledger')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${viewMode === 'ledger' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              <List className="w-3.5 h-3.5" /> Financial Ledger
            </button>
         </div>
      </div>

      {viewMode === 'fulfillment' ? (
         <FulfillmentBoard clients={clients} updateClientField={updateClientField} />
      ) : (
         <div>
            {/* ── FILTERING (Only visible in Ledger) ── */}
            <div className="flex items-center gap-4 mb-6">
         <button 
           onClick={() => setFilter('active')} 
           className={`px-6 py-3 rounded-xl text-[10px] uppercase font-black tracking-[0.2em] transition-all ${filter === 'active' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white'}`}
         >
           🟢 Activos ({totalActive})
         </button>
         <button 
           onClick={() => setFilter('inactive')} 
           className={`px-6 py-3 rounded-xl text-[10px] uppercase font-black tracking-[0.2em] transition-all ${filter === 'inactive' ? 'bg-red-950 text-red-500 border border-red-900 shadow-[0_0_20px_rgba(220,38,38,0.1)]' : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white'}`}
         >
           ⛔ Inactivos ({clients.length - totalActive})
         </button>
      </div>

      {/* ── LEDGER GRID (DELIVERY SYSTEM) ── */}
      <div className="grid grid-cols-1 gap-6">
        {filteredClients.length === 0 && (
          <div className="text-center bg-zinc-950 border border-zinc-900 py-16 rounded-2xl text-[10px] uppercase tracking-widest font-black text-zinc-600">
             No records in {filter} pipeline state
          </div>
        )}

        {filteredClients.map((client: any) => {
          const isUpdating = loadingId?.startsWith(client.id);
          
          return (
            <div key={client.id} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col xl:flex-row gap-6 items-start xl:items-center" style={{ opacity: isUpdating ? 0.6 : 1 }}>
               {/* IDENTITY & DEAL */}
               <div className="w-full xl:w-2/12 shrink-0">
                  <div className="flex items-start gap-3 mb-3">
                     <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                       <CheckCircle2 className="w-4 h-4 text-green-500" />
                     </div>
                     <div>
                       <h3 className="text-white font-black truncate max-w-[150px]">@{client.instagram}</h3>
                       <span className="text-[10px] uppercase tracking-widest font-black text-green-500/80 bg-green-950/30 border border-green-900/50 px-2 rounded-sm inline-block mt-1">
                         ${Number(client.payment_amount).toLocaleString()}
                       </span>
                     </div>
                  </div>
                  <div className="flex gap-2 text-xs font-bold text-zinc-500">
                     <Tag className="w-3.5 h-3.5" />
                     <span className="truncate max-w-[130px]">{client.service_type || 'General Deal'}</span>
                  </div>
               </div>

               {/* DATE CORE & RENEWAL SYSTEM (PHASE 11) */}
               <div className={`w-full xl:w-3/12 shrink-0 flex flex-col gap-3 p-4 border rounded-xl relative transition-all ${client.renewal_date && new Date(client.renewal_date).getTime() <= Date.now() ? 'bg-red-950/20 border-red-900/50 shadow-[0_0_20px_rgba(220,38,38,0.1)]' : 'bg-black border-zinc-800/60'}`}>
                  {client.renewal_date && new Date(client.renewal_date).getTime() <= Date.now() && (
                     <div className="absolute -top-3 left-3 bg-red-600 text-white font-black uppercase tracking-[0.2em] text-[8px] px-2 py-0.5 rounded shadow-lg animate-pulse">
                        Suscripción Vencida
                     </div>
                  )}

                  <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase mt-1">
                    <span className="text-zinc-500">Start Date</span>
                    <span className="text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{format(new Date(client.created_at), "dd MMM, yy")}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
                    <span className="text-zinc-500 whitespace-nowrap mr-3">Renewal / End</span>
                    <input 
                      type="date"
                      value={client.renewal_date ? new Date(client.renewal_date).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateClientField(client.id, { renewal_date: e.target.value ? new Date(e.target.value).toISOString() : null })}
                      className={`bg-black font-bold px-2 py-1 rounded w-[115px] focus:outline-none cursor-pointer text-right transition-colors border ${client.renewal_date && new Date(client.renewal_date).getTime() <= Date.now() ? 'border-red-900/50 text-red-500 focus:border-red-500' : 'border-cyan-900/50 text-cyan-500 focus:border-cyan-500'}`}
                    />
                  </div>

                  {/* Operational Action */}
                  <div className="flex gap-2 mt-1">
                     <button
                       onClick={async () => {
                         setLoadingId(client.id + '-coll');
                         try {
                           const prompt = `System Alert: Write an Instagram DM for @${client.instagram || 'client'} whose subscription for ${client.service_type || 'services'} expired on ${client.renewal_date}. Ask strictly for renewal payment casually without sounding like a corporate robot.`;
                           navigator.clipboard.writeText(prompt);
                           toast.success("Prompt natively snapped to clipboard! (Collection Route Active)");
                         } finally { setLoadingId(null); }
                       }}
                       className={`flex-1 font-black uppercase tracking-widest text-[9px] py-2 rounded-lg transition-colors flex justify-center items-center gap-1.5 border
                          ${client.renewal_date && new Date(client.renewal_date).getTime() <= Date.now() ? 'bg-red-900/40 border-red-900/80 text-white hover:bg-red-600' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'}`}
                     >
                       <DollarSign className="w-3 h-3" /> Request
                     </button>
                     <button
                       onClick={() => {
                          if(!client.renewal_date) return;
                          const nextMonth = new Date(client.renewal_date);
                          nextMonth.setMonth(nextMonth.getMonth() + 1);
                          updateClientField(client.id, { renewal_date: nextMonth.toISOString() });
                       }}
                       className="flex-1 bg-green-950/30 border border-green-900/50 hover:bg-green-900/60 text-green-500 font-black uppercase tracking-widest text-[9px] py-2 rounded-lg transition-colors flex justify-center items-center gap-1.5"
                     >
                        +1 Month
                     </button>
                  </div>
               </div>

               {/* POST-SALE MAINTENANCE (Last Check & Delivery) */}
               <div className="w-full xl:w-3/12 shrink-0 flex flex-col gap-3 p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl">
                 <div className="flex items-center justify-between">
                   <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Last Check</span>
                   {client.last_check ? (
                     <span className="text-xs font-black text-cyan-400">{formatDistanceToNow(new Date(client.last_check))} ago</span>
                   ) : <span className="text-xs font-black text-red-500/70">Never Checked</span>}
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => updateClientField(client.id, { action: 'check_now' })}
                      className="flex-1 bg-cyan-950/30 border border-cyan-900/50 hover:bg-cyan-900/50 text-cyan-400 font-black uppercase tracking-widest text-[9px] py-2 rounded-lg transition-colors flex justify-center items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Check Today
                    </button>
                    <button
                      onClick={() => toggleDelivery(client.id, client.delivery_status || 'pending')}
                      className={`flex-1 font-black uppercase tracking-widest text-[9px] py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 border
                        ${(client.delivery_status === 'delivered') ? 'bg-green-950/20 text-green-500 border-green-900/40' : 'bg-orange-950/20 text-orange-500 border-orange-900/40'}`}
                    >
                      {(client.delivery_status === 'delivered') ? <><PackageCheck className="w-3 h-3"/> Delivered</> : <><Package className="w-3 h-3"/> Pending</>}
                    </button>
                 </div>
               </div>

               {/* NOTES LOG */}
               <div className="w-full xl:flex-1 relative">
                 <textarea 
                   defaultValue={client.notes || ''}
                   onBlur={(e) => updateClientField(client.id, { notes: e.target.value })}
                   placeholder="Post-Venta notes, complaints, service iterations..."
                   className="w-full h-[85px] bg-black border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-300 placeholder:text-zinc-700 resize-none focus:outline-none focus:border-zinc-500 transition-colors custom-scrollbar"
                 />
                 <Save className="w-3.5 h-3.5 text-zinc-700 absolute bottom-3 right-3 pointer-events-none" />
               </div>

               {/* KILL SWITCH (Active/Inactive) */}
               <div className="w-full xl:w-[60px] shrink-0 flex xl:flex-col gap-2">
                 {client.status === 'inactive' ? (
                   <button 
                     onClick={() => updateClientField(client.id, { status: 'active' })}
                     className="flex-1 xl:h-[85px] bg-green-950/30 border border-green-900/50 hover:bg-green-900/50 text-green-500 rounded-xl flex items-center justify-center transition-colors" title="Reactivate Client"
                   >
                     <UserCheck className="w-5 h-5" />
                   </button>
                 ) : (
                   <button 
                     onClick={() => updateClientField(client.id, { status: 'inactive' })}
                     className="flex-1 xl:h-[85px] bg-red-950/20 border border-red-900/30 hover:bg-red-900/50 text-red-500 rounded-xl flex items-center justify-center transition-colors" title="Deactivate Client"
                   >
                     <UserX className="w-5 h-5" />
                   </button>
                 )}
               </div>

            </div>
          );
        })}
      </div>
     </div>
    </div>
  );
}
