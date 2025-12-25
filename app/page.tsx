import SmartGrowthConsultant from "@/components/trend-up/smart-growth-consultant";

export default function Home() {
  return (
    <main className="h-screen w-full bg-[#02040a] text-slate-300 font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-[#d4af37] selection:text-black">

      {/* Background Noise */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] pointer-events-none mix-blend-overlay" />

      {/* 1. SINGLE SCREEN BLOCK (NO SCROLL) */}
      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center space-y-10">

        {/* Header - Simple & Technical */}
        <div className="space-y-4">
          <h1 className="text-xs text-[#64748B] tracking-[0.3em] uppercase">
            TDT // SYSTEM CORE
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            DIAGNÓSTICO DE ARQUITECTURA DIGITAL
          </h2>
          <p className="text-[10px] text-[#4A5568] uppercase tracking-widest max-w-md mx-auto">
            Auditoría forense de activos de alto valor
          </p>
        </div>

        {/* 2. THE TERMINAL (SmartGrowthConsultant) */}
        {/* This component handles Input -> Analysis -> Result in-place */}
        <div className="w-full">
          <SmartGrowthConsultant />
        </div>

      </div>

      {/* Footer Branding - Fixed Bottom */}
      <div className="absolute bottom-8 text-[9px] text-[#334155] tracking-widest uppercase flex gap-4">
        <span>System Ready v1.3</span>
        <span>Secure Protocol</span>
      </div>

    </main>
  );
}
