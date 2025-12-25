import { Shield, Lock, Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import SmartGrowthConsultant from "@/components/trend-up/smart-growth-consultant";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#1A202C] font-sans selection:bg-[#0A2540] selection:text-white flex flex-col">

      {/* 1. HERO / ABOVE THE FOLD */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-24 pb-12 text-center md:pt-32">

        {/* Technical Label */}
        <div className="mb-6 flex justify-center fade-in text-slate-500">
          <div className="flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-1 rounded-full">
            <Activity className="w-3 h-3 text-[#0A2540]" />
            <span className="text-[10px] font-mono uppercase tracking-widest font-medium">System v1.2 Active</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0A2540] mb-6 leading-[1.1]">
          Forensic Authority Analysis
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-[#4A5568] max-w-2xl mx-auto leading-relaxed mb-12">
          Diagnosticamos la brecha entre tu posicionamiento actual y tu capacidad de escala real. Sin ruido. Sin métricas de vanidad.
        </p>

        {/* 3. OBJETO CENTRAL: EL ANALYZER (Terminal) */}
        <div className="relative w-full max-w-3xl mx-auto shadow-2xl shadow-[#0A2540]/10 rounded-lg overflow-hidden border border-slate-200 bg-[#02040a]">
          {/* The "Terminal" is the Component itself */}
          <SmartGrowthConsultant />
        </div>

      </section>

      {/* 2. BLOQUE "QUÉ ES ESTO" */}
      <section className="w-full max-w-2xl mx-auto px-6 py-20 text-center border-t border-slate-100">
        <h2 className="text-sm font-bold text-[#0A2540] uppercase tracking-widest mb-8">Protocolo de Evaluación</h2>
        <p className="text-base md:text-lg text-[#4A5568] leading-loose font-medium">
          TDT Analyzer no es una herramienta de marketing. Es un motor de decisión logística que evalúa la coherencia entre tu <span className="text-[#0A2540] font-bold">Arquitectura Digital</span>, tu <span className="text-[#0A2540] font-bold">Percepción de Mercado</span> y tus <span className="text-[#0A2540] font-bold">Sistemas de Conversión</span>.
        </p>
      </section>

      {/* 4. AUTORIDAD SOCIAL SILENCIOSA */}
      <section className="w-full bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-8">
            Infraestructura utilizada por
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale">
            {/* Text based logos for silence and speed - User requested small logos or text */}
            <span className="text-sm font-bold text-[#0A2540]">VENTURE CAPITAL</span>
            <span className="text-sm font-bold text-[#0A2540]">MEDICAL BOARDS</span>
            <span className="text-sm font-bold text-[#0A2540]">PREMIUM BROKERS</span>
            <span className="text-sm font-bold text-[#0A2540]">ELITE FOUNDERS</span>
          </div>
        </div>
      </section>

      {/* 5. FOOTER MINIMAL */}
      <footer className="w-full py-12 text-center text-slate-400 border-t border-slate-100 mt-auto bg-white">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-slate-300" />
            <span className="text-xs font-mono uppercase tracking-widest">TDT Secure Architecture</span>
          </div>
          <div className="flex gap-6 text-[10px] font-mono uppercase tracking-widest">
            <a href="#" className="hover:text-[#0A2540] transition-colors">Legal</a>
            <a href="#" className="hover:text-[#0A2540] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[#0A2540] transition-colors">Contacto</a>
          </div>
          <p className="text-[10px] text-slate-300 mt-4">
            © 2024 Trend Digital Trade. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
