"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Edit2, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function DailyDmsClient({ initialValue }: { initialValue: number }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue.toString());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0) return toast.error("Invalid number payload.");
    
    setSaving(true);
    try {
      const res = await fetch("/api/admin/daily-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: 'dms_enviados', value: num })
      });
      if (!res.ok) throw new Error("Sync failure");
      setEditing(false);
      toast.success("Daily Volume Authorized.");
      router.refresh(); // Refresh CEO Matrix Realtime
    } catch (err) {
      toast.error("Network payload crashed.");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div 
        onClick={() => setEditing(true)}
        className="group cursor-pointer flex items-center gap-2 hover:bg-zinc-900/50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-zinc-800"
      >
        <h3 className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">{initialValue}</h3>
        <Edit2 className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-500 opacity-0 group-hover:opacity-100 transition-all" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-1">
      <input 
        type="number"
        value={value}
        onChange={e => setValue(e.target.value)}
        className="bg-black border border-cyan-900/50 text-xl font-black text-cyan-400 w-24 px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
        autoFocus
        onKeyDown={e => e.key === 'Enter' && handleSave()}
      />
      <button 
        onClick={handleSave}
        disabled={saving}
        className="bg-cyan-950/50 border border-cyan-900 text-cyan-500 p-2 rounded-lg hover:bg-cyan-900/50 transition-colors"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
      </button>
    </div>
  );
}
