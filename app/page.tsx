import SmartGrowthConsultant from "@/components/trend-up/smart-growth-consultant";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#02040a] text-slate-300 font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A2540]/10 to-transparent pointer-events-none" />

      {/* 1. BLOQUE ÚNICO CENTRAL */}
      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center space-y-12">

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-xs md:text-sm text-[#4A5568] tracking-[0.3em] uppercase">
            TDT // SYSTEM CORE
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            AUDITORÍA DE ARQUITECTURA DIGITAL
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] max-w-lg mx-auto leading-relaxed border-l border-white/10 pl-4 text-left md:text-center md:border-l-0 md:pl-0">
            Diagnóstico forense de dinámicas, discontinuidades y potencial latente en activos digitales profesionales.
          </p>
        </div>

        {/* 3. OBJETO CENTRAL: EL ANALYZER (Terminal Input) */}
        <div className="w-full">
          <SmartGrowthConsultant />
        </div>

      </div>

      {/* Minimal Footer */}
      <div className="absolute bottom-8 text-[10px] text-[#334155] tracking-widest uppercase">
        System Ready // V1.2
      </div>

    </main>
  );
}
