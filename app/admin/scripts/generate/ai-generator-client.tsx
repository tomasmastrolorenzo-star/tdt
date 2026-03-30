"use client";

import { useState } from "react";
import { Sparkles, Copy, Save, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const NICHOS = ["fitness", "emprendedor", "modelo", "otro"];
const ETAPAS = [
  { value: "cold_dm", label: "Cold DM — primer mensaje" },
  { value: "followup_1", label: "Follow-Up 1 — no respondió" },
  { value: "followup_2", label: "Follow-Up 2 — segunda chance" },
  { value: "oferta", label: "Oferta — presentar propuesta" },
  { value: "cierre", label: "Cierre — cerrar con urgencia" },
  { value: "reengagement", label: "Reengagement — lead frío" },
];
const SEGUIDORES = ["5k_20k", "20k_100k", "100k_200k"];

export function AIScriptGeneratorClient({ defaultNicho = "fitness", defaultSeguidores = "5k_20k" }: {
  defaultNicho?: string; defaultSeguidores?: string;
}) {
  const [nicho, setNicho] = useState(defaultNicho);
  const [etapa, setEtapa] = useState("cold_dm");
  const [seguidores, setSeguidores] = useState(defaultSeguidores);
  const [contexto, setContexto] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/scripts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nicho, etapa, seguidores, contexto })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setGenerated(data.script);
      setGenerationCount(c => c + 1);
    } catch(e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const copy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated);
    toast.success("Copied to clipboard.");
  };

  const saveToLibrary = async () => {
    if (!generated) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nicho, etapa, contenido: generated })
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Saved to Script Library.");
    } catch(e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const selectClass = "w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-zinc-600 transition-colors appearance-none";
  const labelClass = "text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1.5";

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      <div className="max-w-[900px] mx-auto px-6 pt-12">
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-900">
          <div className="flex items-center gap-4">
            <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-2xl">
              <Sparkles className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter">AI Script Generator</h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-0.5">DMs personalizados · powered by AI</p>
            </div>
          </div>
          <Link href="/admin/scripts" className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Script Library
          </Link>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* CONFIG PANEL */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 space-y-5">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-purple-400 border-b border-zinc-900 pb-3">Configurar Script</h2>
            <div>
              <label className={labelClass}>Nicho del Lead</label>
              <select value={nicho} onChange={e => setNicho(e.target.value)} className={selectClass}>
                {NICHOS.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase()+n.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Etapa del Script</label>
              <select value={etapa} onChange={e => setEtapa(e.target.value)} className={selectClass}>
                {ETAPAS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Rango de Seguidores</label>
              <select value={seguidores} onChange={e => setSeguidores(e.target.value)} className={selectClass}>
                {SEGUIDORES.map(f => <option key={f} value={f}>{f.replace('_', '–')}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Contexto adicional (opcional)</label>
              <textarea value={contexto} onChange={e => setContexto(e.target.value)}
                placeholder='Ej: "responde que ya tiene muchos seguidores pero poco engagement"'
                rows={4}
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 font-medium focus:outline-none focus:border-zinc-600 resize-none"
              />
            </div>
            <button onClick={generate} disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black uppercase text-[10px] tracking-widest py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Generando...</>
                : generationCount === 0
                  ? <><Sparkles className="w-4 h-4" /> Generar Script</>
                  : <><RefreshCw className="w-4 h-4" /> Regenerate</>
              }
            </button>
          </div>

          {/* OUTPUT PANEL */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex flex-col">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-5">Script Generado</h2>
            {loading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-3" />
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Generating...</p>
                </div>
              </div>
            )}
            {!loading && !generated && (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl min-h-[180px]">
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest text-center px-6">
                  Configura los parámetros<br />y presiona Generar
                </p>
              </div>
            )}
            {!loading && generated && (
              <>
                <div className="flex-1 bg-black border border-zinc-800 rounded-2xl p-5 mb-4 min-h-[180px]">
                  <p className="text-sm text-zinc-200 font-medium leading-relaxed whitespace-pre-wrap">{generated}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={copy} className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 font-black uppercase text-[9px] tracking-widest py-2.5 rounded-xl transition-colors">
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                  <button onClick={saveToLibrary} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-black uppercase text-[9px] tracking-widest py-2.5 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50">
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save to Library
                  </button>
                </div>
                <button onClick={generate} disabled={loading} className="mt-3 w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-purple-800 text-zinc-400 hover:text-purple-400 font-black uppercase text-[9px] tracking-widest py-2.5 rounded-xl transition-all">
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
