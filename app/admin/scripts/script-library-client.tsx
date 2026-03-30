"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Plus, Star, Trash2, Loader2, X, Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";

const NICHOS = ["todos", "fitness", "emprendedor", "modelo", "otro"] as const;
const ETAPAS = ["cold_dm", "followup_1", "followup_2", "oferta", "cierre", "reengagement"] as const;

const ETAPA_LABELS: Record<string, string> = {
  cold_dm: "Cold DM", followup_1: "Follow-Up 1", followup_2: "Follow-Up 2",
  oferta: "Oferta", cierre: "Cierre", reengagement: "Reengagement"
};
const ETAPA_COLORS: Record<string, string> = {
  cold_dm: "text-blue-400 bg-blue-950/30 border-blue-900/50",
  followup_1: "text-purple-400 bg-purple-950/30 border-purple-900/50",
  followup_2: "text-indigo-400 bg-indigo-950/30 border-indigo-900/50",
  oferta: "text-yellow-400 bg-yellow-950/30 border-yellow-900/50",
  cierre: "text-green-400 bg-green-950/30 border-green-900/50",
  reengagement: "text-pink-400 bg-pink-950/30 border-pink-900/50",
};

type Script = {
  id: string; nicho: string; etapa: string; contenido: string;
  es_ganador: boolean; usos: number; conversiones: number; created_at: string;
};

function ScriptCard({ script, onToggleWinner, onDelete, onCopy, loadingId }: {
  script: Script; onToggleWinner: (id: string, cur: boolean) => void;
  onDelete: (id: string) => void; onCopy: (content: string) => void; loadingId: string | null;
}) {
  const tasa = script.usos > 0 ? ((script.conversiones / script.usos) * 100).toFixed(0) : null;
  const canWin = script.conversiones >= 3;
  return (
    <div className={`bg-zinc-950 border rounded-2xl p-5 flex flex-col gap-4 relative transition-all ${script.es_ganador ? 'border-yellow-900/60 shadow-[0_0_20px_rgba(234,179,8,0.07)]' : 'border-zinc-900 hover:border-zinc-800'}`}>
      {script.es_ganador && (
        <div className="absolute top-3 right-3 text-yellow-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 bg-yellow-950/40 border border-yellow-900/50 px-2 py-1 rounded-lg">
          <Star className="w-3 h-3 fill-current" /> Winner
        </div>
      )}
      <div className="flex items-center gap-2 flex-wrap pr-16">
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${ETAPA_COLORS[script.etapa] || 'text-zinc-400 bg-zinc-900 border-zinc-800'}`}>
          {ETAPA_LABELS[script.etapa] || script.etapa}
        </span>
        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800">
          {script.nicho}
        </span>
        {tasa && (
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${parseFloat(tasa) >= 30 ? 'text-green-400 bg-green-950/20 border-green-900/40' : 'text-zinc-500 bg-zinc-900 border-zinc-800'}`}>
            {tasa}% conv
          </span>
        )}
        <span className="text-[9px] text-zinc-600 font-bold">{script.usos} usos</span>
      </div>
      <p className="text-sm text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap flex-1">{script.contenido}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => onCopy(script.contenido)}
          className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors"
        >
          <Copy className="w-3.5 h-3.5" /> Copy
        </button>
        <button onClick={() => onToggleWinner(script.id, script.es_ganador)}
          disabled={!canWin && !script.es_ganador || loadingId === script.id + '-win'}
          title={!canWin && !script.es_ganador ? "Necesita mínimo 3 conversiones" : ""}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-colors disabled:opacity-40 ${script.es_ganador ? 'bg-yellow-950/30 border-yellow-900/50 text-yellow-400 hover:bg-yellow-900/40' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-yellow-400'}`}
        >
          {loadingId === script.id + '-win' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Star className="w-3.5 h-3.5" />}
          {script.es_ganador ? 'Winner' : 'Mark'}
        </button>
        <button onClick={() => onDelete(script.id)} disabled={loadingId === script.id + '-del'}
          className="ml-auto flex items-center gap-1.5 bg-zinc-900 hover:bg-red-950/30 border border-zinc-800 hover:border-red-900/50 text-zinc-600 hover:text-red-400 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors"
        >
          {loadingId === script.id + '-del' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

export function ScriptLibraryClient({ initialScripts }: { initialScripts: Script[] }) {
  const [scripts, setScripts] = useState<Script[]>(initialScripts);
  const [activeNicho, setActiveNicho] = useState<string>("todos");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nicho: "fitness", etapa: "cold_dm", contenido: "" });

  const nichoScripts = activeNicho === "todos"
    ? scripts
    : scripts.filter(s => s.nicho === activeNicho || s.nicho === "todos");

  const byEtapa = ETAPAS.reduce((acc, e) => {
    const items = nichoScripts.filter(s => s.etapa === e);
    // winners first
    acc[e] = [...items.filter(s => s.es_ganador), ...items.filter(s => !s.es_ganador)];
    return acc;
  }, {} as Record<string, Script[]>);

  const totalInNicho = nichoScripts.length;
  const winners = nichoScripts.filter(s => s.es_ganador).length;

  const save = async () => {
    if (!form.contenido.trim()) return toast.error("El contenido es obligatorio.");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/scripts", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScripts(prev => [data.script, ...prev]);
      setForm({ nicho: "fitness", etapa: "cold_dm", contenido: "" });
      setShowForm(false);
      toast.success("Script guardado.");
    } catch(e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const toggleWinner = async (id: string, current: boolean) => {
    setLoadingId(id + '-win');
    try {
      const res = await fetch(`/api/admin/scripts/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ es_ganador: !current })
      });
      if (!res.ok) throw new Error();
      setScripts(prev => prev.map(s => s.id === id ? { ...s, es_ganador: !current } : s));
      toast.success(current ? "Removed from winners." : "Marked as Winner ⭐");
    } catch { toast.error("Failed to update."); }
    finally { setLoadingId(null); }
  };

  const deleteScript = async (id: string) => {
    if (!confirm("Delete this script?")) return;
    setLoadingId(id + '-del');
    try {
      const res = await fetch(`/api/admin/scripts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setScripts(prev => prev.filter(s => s.id !== id));
      toast.success("Script eliminado.");
    } catch { toast.error("Error deleting."); }
    finally { setLoadingId(null); }
  };

  const copy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard.");
  };

  const selectCls = "w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-zinc-600 transition-colors appearance-none";
  const labelCls = "text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1.5";

  return (
    <div>
      {/* HEADER ACTIONS */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            {scripts.length} Total · <span className="text-yellow-400">{scripts.filter(s=>s.es_ganador).length} Winners</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/scripts/generate" className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-purple-500 text-zinc-300 hover:text-purple-400 font-black uppercase text-[10px] tracking-widest px-4 py-2.5 rounded-xl transition-all">
            <Sparkles className="w-3.5 h-3.5" /> AI Generator
          </Link>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-white text-black font-black uppercase text-[10px] tracking-widest px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Script
          </button>
        </div>
      </div>

      {/* NEW SCRIPT FORM */}
      {showForm && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-6 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-zinc-600 hover:text-white"><X className="w-5 h-5" /></button>
          <h3 className="text-sm font-black uppercase tracking-widest text-white mb-5">New Script</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Nicho</label>
              <select value={form.nicho} onChange={e => setForm(p=>({...p,nicho:e.target.value}))} className={selectCls}>
                {NICHOS.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase()+n.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Etapa</label>
              <select value={form.etapa} onChange={e => setForm(p=>({...p,etapa:e.target.value}))} className={selectCls}>
                {ETAPAS.map(e => <option key={e} value={e}>{ETAPA_LABELS[e]}</option>)}
              </select>
            </div>
          </div>
          <textarea value={form.contenido} onChange={e => setForm(p=>({...p,contenido:e.target.value}))}
            placeholder="Escribe el mensaje completo aquí..."
            rows={6}
            className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 font-medium focus:outline-none focus:border-zinc-600 resize-none mb-4"
          />
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 bg-white text-black font-black uppercase text-[10px] tracking-widest px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Save Script
          </button>
        </div>
      )}

      {/* NICHO TABS */}
      <div className="flex items-center gap-2 mb-8 border-b border-zinc-900 pb-0 overflow-x-auto">
        {NICHOS.map(n => {
          const count = n === "todos" ? scripts.length : scripts.filter(s => s.nicho === n || s.nicho === "todos").length;
          return (
            <button key={n} onClick={() => setActiveNicho(n)}
              className={`shrink-0 px-5 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeNicho === n ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              {n === "todos" ? "All" : n.charAt(0).toUpperCase()+n.slice(1)} <span className="ml-1 opacity-50">({count})</span>
            </button>
          );
        })}
      </div>

      {totalInNicho === 0 && (
        <div className="text-center py-24 text-zinc-600 text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-zinc-900 rounded-3xl">
          No scripts for this niche yet. Add one ↑
        </div>
      )}

      {/* ETAPA SECTIONS */}
      <div className="space-y-10">
        {ETAPAS.map(etapa => {
          const items = byEtapa[etapa] || [];
          if (items.length === 0) return null;
          return (
            <div key={etapa}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${ETAPA_COLORS[etapa]}`}>
                  {ETAPA_LABELS[etapa]}
                </span>
                <span className="text-zinc-600 text-[9px] font-black uppercase">{items.length} scripts</span>
                {items.some(s => s.es_ganador) && (
                  <span className="text-yellow-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> {items.filter(s=>s.es_ganador).length} winners
                  </span>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {items.map(script => (
                  <ScriptCard key={script.id} script={script}
                    onToggleWinner={toggleWinner} onDelete={deleteScript} onCopy={copy} loadingId={loadingId}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
