"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2, FileText, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type ParsedLead = { handle_ig: string; nicho: string; seguidores: string; fuente: string; valid: boolean; error?: string };

function parseCSV(text: string): ParsedLead[] {
  const lines = text.trim().split('\n');
  const validNichos = ["fitness", "emprendedor", "modelo", "otro"];
  const validSeguidores = ["5k_20k", "20k_100k", "100k_200k"];
  const validFuentes = ["dm", "referido", "landing", "ads"];

  return lines.slice(1).map(line => {
    const [handle_ig, nicho, seguidores, fuente] = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    const errors = [];
    if (!handle_ig) errors.push("handle required");
    if (!validNichos.includes(nicho?.toLowerCase())) errors.push(`nicho inválido (${nicho})`);
    if (!validSeguidores.includes(seguidores?.toLowerCase())) errors.push(`seguidores inválido`);
    if (fuente && !validFuentes.includes(fuente?.toLowerCase())) errors.push(`fuente inválida`);
    return {
      handle_ig: handle_ig?.replace('@', ''),
      nicho: nicho?.toLowerCase() || 'otro',
      seguidores: seguidores?.toLowerCase() || '5k_20k',
      fuente: fuente?.toLowerCase() || 'dm',
      valid: errors.length === 0,
      error: errors.join(', ')
    };
  }).filter(l => l.handle_ig);
}

export default function BulkImportPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<ParsedLead[]>([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number } | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      setParsed(parseCSV(text));
      setResults(null);
    };
    reader.readAsText(file);
  };

  const importLeads = async () => {
    const validLeads = parsed.filter(l => l.valid);
    if (validLeads.length === 0) return toast.error("No hay leads válidos para importar.");
    setImporting(true);
    try {
      const res = await fetch("/api/admin/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: validLeads })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults({ success: data.success, failed: data.failed || 0 });
      toast.success(`${data.success} leads importados correctamente.`);
    } catch(e: any) { toast.error(e.message); }
    finally { setImporting(false); }
  };

  const validCount = parsed.filter(l => l.valid).length;
  const invalidCount = parsed.filter(l => !l.valid).length;

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      <div className="max-w-[1000px] mx-auto px-6 pt-12">
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-900">
          <div className="flex items-center gap-4">
            <Upload className="w-8 h-8 text-cyan-500" />
            <div>
              <h1 className="text-3xl font-black tracking-tighter">Bulk Import</h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">CSV → Pipeline automático</p>
            </div>
          </div>
          <Link href="/admin/leads" className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">← Pipeline</Link>
        </header>

        {/* CSV FORMAT GUIDE */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 mb-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Formato CSV requerido</h3>
          <code className="text-xs text-green-400 bg-black rounded-xl p-3 block font-mono">
            handle_ig,nicho,seguidores,fuente<br/>
            usuario1,fitness,5k_20k,dm<br/>
            usuario2,emprendedor,20k_100k,referido
          </code>
          <p className="text-[9px] text-zinc-600 font-bold mt-2">Nichos: fitness | emprendedor | modelo | otro &nbsp;·&nbsp; Seguidores: 5k_20k | 20k_100k | 100k_200k &nbsp;·&nbsp; Fuente: dm | referido | landing | ads</p>
        </div>

        {/* DROP ZONE */}
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if(f) handleFile(f); }}
          className="border-2 border-dashed border-zinc-800 hover:border-zinc-600 rounded-3xl p-14 text-center cursor-pointer transition-colors mb-6 group"
        >
          <Upload className="w-10 h-10 text-zinc-600 group-hover:text-zinc-400 mx-auto mb-3 transition-colors" />
          <p className="text-zinc-500 font-bold text-sm group-hover:text-zinc-300 transition-colors">Arrastra tu CSV aquí o click para seleccionar</p>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => { if(e.target.files?.[0]) handleFile(e.target.files[0]); }} />
        </div>

        {/* PREVIEW TABLE */}
        {parsed.length > 0 && (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden mb-6">
            <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{parsed.length} filas detectadas</span>
                {validCount > 0 && <span className="text-[9px] font-black text-green-500 bg-green-950/30 border border-green-900/50 px-2 py-1 rounded-lg">{validCount} válidos</span>}
                {invalidCount > 0 && <span className="text-[9px] font-black text-red-500 bg-red-950/30 border border-red-900/50 px-2 py-1 rounded-lg">{invalidCount} errores</span>}
              </div>
              <button onClick={() => { setParsed([]); setResults(null); }} className="text-zinc-600 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
              <table className="w-full">
                <thead className="bg-black text-[9px] uppercase font-black tracking-widest text-zinc-500">
                  <tr>
                    <th className="p-3 pl-5 text-left">Handle</th>
                    <th className="p-3 text-left">Nicho</th>
                    <th className="p-3 text-left">Seguidores</th>
                    <th className="p-3 text-left">Fuente</th>
                    <th className="p-3 text-right pr-5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {parsed.map((lead, i) => (
                    <tr key={i} className={lead.valid ? '' : 'bg-red-950/10'}>
                      <td className="p-3 pl-5 font-bold text-white text-sm">@{lead.handle_ig}</td>
                      <td className="p-3 text-zinc-400 text-sm">{lead.nicho}</td>
                      <td className="p-3 text-zinc-400 text-sm">{lead.seguidores}</td>
                      <td className="p-3 text-zinc-400 text-sm">{lead.fuente}</td>
                      <td className="p-3 text-right pr-5">
                        {lead.valid
                          ? <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                          : <div className="flex items-center justify-end gap-1.5"><AlertCircle className="w-4 h-4 text-red-500" /><span className="text-[9px] text-red-400">{lead.error}</span></div>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-zinc-900 flex justify-end">
              <button onClick={importLeads} disabled={importing || validCount === 0}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase text-[10px] tracking-widest px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Importar {validCount} leads
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS RESULT */}
        {results && (
          <div className="bg-green-950/20 border border-green-900/40 rounded-2xl p-6 text-center">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h3 className="font-black text-white text-xl mb-1">{results.success} Leads Importados</h3>
            <p className="text-zinc-400 text-sm">{results.failed > 0 ? `${results.failed} fallaron.` : "Todos importados correctamente."}</p>
            <Link href="/admin/leads" className="inline-block mt-4 bg-white text-black font-black uppercase text-[10px] tracking-widest px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors">
              Ver Pipeline →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
