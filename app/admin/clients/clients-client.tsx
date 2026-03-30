"use client";

import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import { Loader2, DollarSign, Package, PackageCheck, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function ClientsClient({ initialClients }: any) {
  const router = useRouter();
  const [clients, setClients] = useState(initialClients || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Financial Engine Metrics
  const totalRevenue = clients.reduce((sum: number, client: any) => sum + (Number(client.payment_amount) || 0), 0);
  const pendingDeliveries = clients.filter((c: any) => c.delivery_status === 'pending').length;

  const toggleDelivery = async (clientId: string, currentStatus: string) => {
    setLoadingId(clientId);
    const newStatus = currentStatus === 'pending' ? 'delivered' : 'pending';
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/delivery`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delivery_status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Optimistic update over UI rendering instantly
      setClients(clients.map((c: any) => c.id === clientId ? { ...c, delivery_status: newStatus } : c));
      toast.success(newStatus === 'delivered' ? "Service marked successfully delivered." : "Delivery rolled back to pending.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="pb-16">
      {/* FINANCIAL TOP ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
           <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-green-500/10 blur-[50px] pointer-events-none"></div>
           <div className="flex items-center gap-3 mb-2 opacity-50 text-[10px] uppercase font-black tracking-widest text-green-400">
             <DollarSign className="w-4 h-4" /> System Revenue Total
           </div>
           <h2 className="text-4xl font-black text-white relative z-10">${totalRevenue.toLocaleString()}</h2>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
           <div className="flex items-center gap-3 mb-2 opacity-50 text-[10px] uppercase font-black tracking-widest text-white">
             <CheckCircle2 className="w-4 h-4" /> Active Converted Clients
           </div>
           <h2 className="text-4xl font-black text-white relative z-10">{clients.length}</h2>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
           <div className={`absolute top-[-30px] right-[-30px] w-32 h-32 ${pendingDeliveries > 0 ? 'bg-orange-500/10' : 'bg-cyan-500/10'} blur-[50px] pointer-events-none`}></div>
           <div className={`flex items-center gap-3 mb-2 opacity-50 text-[10px] uppercase font-black tracking-widest ${pendingDeliveries > 0 ? 'text-orange-400' : 'text-cyan-400'}`}>
             <Package className="w-4 h-4" /> Pending Deliverables
           </div>
           <h2 className="text-4xl font-black text-white relative z-10">{pendingDeliveries}</h2>
        </div>

      </div>

      {/* CORE LEDGER VIEW */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl shadow-xl overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-zinc-900 text-zinc-400 text-[10px] uppercase font-black tracking-widest border-b border-zinc-800">
                 <th className="p-5 font-bold">Client Target</th>
                 <th className="p-5 font-bold">Service / Deal</th>
                 <th className="p-5 font-bold">Payment Value</th>
                 <th className="p-5 font-bold">Conversion Date</th>
                 <th className="p-5 font-bold text-center">Delivery Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-zinc-900">
               {clients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-zinc-600 font-bold text-sm">Financial ledger empty. Convert leads to populate data.</td>
                  </tr>
               )}
               {clients.map((client: any) => (
                 <tr key={client.id} className="hover:bg-zinc-900/30 transition-colors">
                   <td className="p-5">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800">
                         <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
                       </div>
                       <span className="font-bold text-white">@{client.instagram}</span>
                     </div>
                   </td>
                   <td className="p-5 text-zinc-400 text-sm font-medium">{client.service_type || 'Custom Service'}</td>
                   <td className="p-5">
                      <span className="bg-green-950/30 text-green-400 border border-green-900/50 px-3 py-1.5 rounded-lg text-xs font-black tracking-wider">
                        ${Number(client.payment_amount).toLocaleString()}
                      </span>
                   </td>
                   <td className="p-5 text-zinc-500 text-xs font-bold tracking-wider uppercase">
                      {format(new Date(client.created_at), "MMM d, yyyy")}
                   </td>
                   <td className="p-5 text-center">
                     <button
                       onClick={() => toggleDelivery(client.id, client.delivery_status || 'pending')}
                       disabled={loadingId === client.id}
                       className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                         ${(client.delivery_status === 'delivered') 
                           ? 'bg-cyan-950/20 text-cyan-500 border border-cyan-900/40 hover:bg-cyan-900/40' 
                           : 'bg-orange-950/20 text-orange-500 border border-orange-900/40 hover:bg-orange-900/40'}
                         disabled:opacity-50`}
                     >
                       {loadingId === client.id ? (
                         <Loader2 className="w-3.5 h-3.5 animate-spin" />
                       ) : client.delivery_status === 'delivered' ? (
                         <><PackageCheck className="w-3.5 h-3.5" /> Delivered</>
                       ) : (
                         <><Package className="w-3.5 h-3.5" /> Pending</>
                       )}
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}
