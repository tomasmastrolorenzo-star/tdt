"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function QuickAddLead() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    handle_ig: "",
    fuente: "dm",
    nicho: "fitness",
    seguidores: "5k_20k",
  });

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.handle_ig.trim()) return toast.error("Instagram handle is required.");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to create lead");
      toast.success(`@${form.handle_ig} added to pipeline.`);
      setForm({ handle_ig: "", fuente: "dm", nicho: "fitness", seguidores: "5k_20k" });
      setOpen(false);
    } catch(err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectClass = "w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-zinc-600 transition-colors";
  const labelClass = "text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1.5";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-white text-black font-black uppercase text-[10px] tracking-widest px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors"
      >
        <Plus className="w-4 h-4" /> Quick Add Lead
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black text-white mb-1">Quick Add Lead</h2>
            <p className="text-zinc-500 text-xs font-bold mb-6">Add to CRM Pipeline instantly</p>

            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className={labelClass}>Instagram Handle *</label>
                <div className="flex items-center bg-black border border-zinc-800 rounded-xl overflow-hidden focus-within:border-zinc-600 transition-colors">
                  <span className="text-zinc-500 font-black px-3">@</span>
                  <input
                    type="text"
                    value={form.handle_ig}
                    onChange={e => set("handle_ig", e.target.value.replace("@",""))}
                    placeholder="username"
                    className="flex-1 bg-transparent px-2 py-2.5 text-sm text-white font-bold focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Fuente</label>
                  <select value={form.fuente} onChange={e => set("fuente", e.target.value)} className={selectClass}>
                    <option value="dm">DM</option>
                    <option value="referido">Referido</option>
                    <option value="landing">Landing</option>
                    <option value="ads">Ads</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Nicho</label>
                  <select value={form.nicho} onChange={e => set("nicho", e.target.value)} className={selectClass}>
                    <option value="fitness">Fitness</option>
                    <option value="emprendedor">Emprendedor</option>
                    <option value="modelo">Modelo</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Seguidores</label>
                <select value={form.seguidores} onChange={e => set("seguidores", e.target.value)} className={selectClass}>
                  <option value="5k_20k">5K – 20K</option>
                  <option value="20k_100k">20K – 100K</option>
                  <option value="100k_200k">100K – 200K</option>
                </select>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-white text-black font-black uppercase text-[10px] tracking-widest py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add to Pipeline
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
