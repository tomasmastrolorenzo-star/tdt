"use client";

import { format, differenceInHours } from "date-fns";
import { Loader2, Package, Check, Save } from "lucide-react";
import { useState } from "react";

export function FulfillmentBoard({ clients, updateClientField }: { clients: any[], updateClientField: (id: string, payload: any) => Promise<void> }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const pending = clients.filter(c => c.delivery_status === 'pending');
  const processing = clients.filter(c => c.delivery_status === 'processing');
  const delivered = clients.filter(c => c.delivery_status === 'delivered');

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id + '-status');
    await updateClientField(id, { delivery_status: newStatus });
    setLoadingId(null);
  };

  const Column = ({ title, colorClass, items }: { title: string, colorClass: string, items: any[] }) => (
    <div className="flex flex-col bg-zinc-950/20 border border-zinc-900 rounded-3xl p-4 min-h-[500px]">
      <div className={`mb-6 flex items-center justify-between border-b border-zinc-900/50 pb-4 px-2`}>
        <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${colorClass}`}>{title} <span className="opacity-50">({items.length})</span></h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {items.map(client => {
          const isUpdating = loadingId?.startsWith(client.id);
          const deadline = new Date(client.created_at).getTime() + (48 * 60 * 60 * 1000); // Created At + 48h
          const hoursLeft = Math.max(0, differenceInHours(deadline, Date.now()));
          const isLate = Date.now() > deadline;

          return (
            <div key={client.id} className="bg-black border border-zinc-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4 relative overflow-hidden" style={{ opacity: isUpdating ? 0.5 : 1 }}>
              {isLate && client.delivery_status !== 'delivered' && (
                 <div className="absolute top-0 right-0 w-2 h-full bg-red-600 animate-pulse"></div>
              )}

              {/* Header */}
              <div className="flex justify-between items-start">
                 <div>
                   <h4 className="text-white font-black text-lg max-w-[140px] truncate">@{client.instagram_username || client.instagram || 'client'}</h4>
                   <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">{client.service_type || 'General Service'}</span>
                 </div>
                 <div className="text-right">
                   <div className="text-zinc-400 text-[10px] uppercase font-black tracking-widest bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5">
                      Pago: {format(new Date(client.created_at), "dd MMM")}
                   </div>
                   {client.delivery_status !== 'delivered' && (
                     <div className={`mt-1 text-[9px] uppercase font-black flex justify-end tracking-widest ${isLate ? 'text-red-500' : 'text-orange-500'}`}>
                        {isLate ? 'SLA FAILED' : `${hoursLeft}H LEFT`}
                     </div>
                   )}
                 </div>
              </div>

              {/* Notes Context */}
              <div className="relative">
                 <textarea 
                   defaultValue={client.delivery_notes || client.notes || ''}
                   onBlur={(e) => updateClientField(client.id, { delivery_notes: e.target.value })}
                   placeholder="Añadir notas operativas, links de drive..."
                   className="w-full min-h-[70px] bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-medium text-zinc-300 placeholder:text-zinc-600 resize-none focus:outline-none focus:border-cyan-500/50 transition-colors custom-scrollbar"
                 />
                 <Save className="w-3 h-3 text-zinc-700 absolute bottom-3 right-3 pointer-events-none" />
              </div>

              {/* Operations Array */}
              <div className="flex gap-2">
                 {client.delivery_status === 'pending' && (
                    <button 
                      onClick={() => handleStatusChange(client.id, 'processing')}
                      className="w-full bg-cyan-950/30 text-cyan-500 hover:bg-cyan-900/40 border border-cyan-900/50 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-colors"
                    >
                      <Package className="w-4 h-4" /> Start Delivery
                    </button>
                 )}
                 {client.delivery_status === 'processing' && (
                    <button 
                      onClick={() => handleStatusChange(client.id, 'delivered')}
                      className="w-full bg-green-950/30 text-green-500 hover:bg-green-900/40 border border-green-900/50 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-colors"
                    >
                      <Check className="w-4 h-4" /> Mark Delivered
                    </button>
                 )}
                 {client.delivery_status === 'delivered' && (
                    <div className="w-full text-zinc-600 bg-zinc-900/40 border border-zinc-800 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 pointer-events-none">
                      <Check className="w-4 h-4 text-zinc-500" /> Retention Engaged
                    </div>
                 )}
                 {isUpdating && <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]"><Loader2 className="w-6 h-6 animate-spin text-cyan-500" /></div>}
              </div>

            </div>
          );
        })}
        {items.length === 0 && <div className="text-zinc-600 text-center font-bold text-xs p-10 uppercase tracking-widest border border-dashed border-zinc-800 rounded-2xl">Vacio</div>}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Column title="New Client (Action Required)" colorClass="text-zinc-400" items={pending} />
      <Column title="In Progress (Executing)" colorClass="text-cyan-400" items={processing} />
      <Column title="Delivered (Retention Active)" colorClass="text-green-500" items={delivered} />
    </div>
  );
}
