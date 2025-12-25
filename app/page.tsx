import SmartGrowthConsultant from "@/components/trend-up/smart-growth-consultant";

export default function Home() {
  return (
    <main className="h-screen w-full bg-[#02040a] text-slate-300 font-mono flex flex-col relative overflow-hidden selection:bg-[#d4af37] selection:text-black">

      {/* Background Noise (Subtle Texture) */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      {/* HEADER: Minimal */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <div className="font-bold text-white tracking-widest text-xs">TDT // PROTOCOL</div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Sistema v1.4</div>
      </header>

      {/* CORE ACTIVATOR [CENTERED] */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-2xl mx-auto px-6">

        {/* HEADLINES: Technical only */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            DIAGNÓSTICO DE ARQUITECTURA
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
            Análisis forense de emisión, distribución y captura de valor en activos digitales.
          </p>
        </div>

        {/* INPUT COMPONENT */}
        <div className="w-full">
          <SmartGrowthConsultant />
        </div>

      </div>

      {/* FOOTER: Minimal (Only if needed, user said 'Footer minimal with indicators ONLY if real data') */}
      {/* Keeping empty for now to satisfy Phase 1 Elimination */}

    </main>
  );
}
