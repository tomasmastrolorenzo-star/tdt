"use client";

import { useState } from "react";
import { toast } from "sonner"; 

type Lead = any; 

export function LeadsClientRenderer({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState("all");

  const statuses = ["new", "contacted", "qualified", "closed"];

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    // Optimistic update
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));

    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, new_status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(`Status updated to ${newStatus} and event logged.`);
    } catch(err) {
      toast.error("Failed to update status.");
    }
  };

  const filtered = filter === "all" ? leads : leads.filter(l => l.status === filter);

  // Helper to extract the count since Supabase returns [{count: X}] 
  const getCount = (field: any) => {
    if (Array.isArray(field) && field.length > 0) return field[0].count || 0;
    return 0;
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setFilter("all")} 
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === "all" ? 'bg-white text-black' : 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400'}`}
        >
          All ({leads.length})
        </button>
        {statuses.map(s => (
          <button 
            key={s} 
            onClick={() => setFilter(s)} 
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${filter === s ? 'bg-white text-black' : 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400'}`}
          >
            {s} ({leads.filter(l => l.status === s).length})
          </button>
        ))}
      </div>

      <div className="border border-zinc-900 rounded-xl overflow-x-auto bg-zinc-950">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-zinc-900 bg-black">
              <th className="p-4 text-xs font-bold tracking-widest text-zinc-500 uppercase">Username</th>
              <th className="p-4 text-xs font-bold tracking-widest text-zinc-500 uppercase">Source</th>
              <th className="p-4 text-xs font-bold tracking-widest text-zinc-500 uppercase">Status</th>
              <th className="p-4 text-xs font-bold tracking-widest text-zinc-500 uppercase">Created</th>
              <th className="p-4 text-xs font-bold tracking-widest text-zinc-500 uppercase text-center">Interactions</th>
              <th className="p-4 text-xs font-bold tracking-widest text-zinc-500 uppercase text-center">Events Log</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No leads found.</td></tr>
            )}
            {filtered.map(lead => (
              <tr key={lead.id} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className="p-4 font-bold text-lg">@{lead.instagram_username}</td>
                <td className="p-4 text-zinc-400 capitalize text-sm">{lead.source}</td>
                <td className="p-4">
                  <select 
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="bg-black border border-zinc-700 hover:border-zinc-500 text-white text-sm rounded-lg px-3 py-2 flex items-center focus:ring-1 focus:ring-white outline-none capitalize cursor-pointer transition-colors"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 text-zinc-500 text-sm whitespace-nowrap">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-zinc-900 rounded-full text-xs font-bold text-zinc-300">
                    {getCount(lead.interactions)}
                  </span>
                </td>
                <td className="p-4 text-center">
                   <span className="inline-flex items-center justify-center w-6 h-6 bg-zinc-900 rounded-full text-xs font-bold text-zinc-300">
                    {getCount(lead.events_log)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
