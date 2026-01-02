"use client";

import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center bg-black text-white overflow-hidden px-6">

            {/* Background Ambience (Subtle Luxury) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#007AFF] opacity-[0.08] blur-[150px] rounded-full" />
                {/* Subtle grid pattern for "Structure" feel */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">

                {/* Authority Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
                    <ShieldCheck className="w-4 h-4 text-[#007AFF]" />
                    <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/70">
                        Official Verification Partner
                    </span>
                </div>

                {/* Main Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight leading-[1.1] animate-in fade-in zoom-in-95 duration-1000 delay-100">
                    La Autoridad no se pide,<br />
                    <span className="italic font-light text-[#007AFF]">se construye.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                    Verificamos y posicionamos tu marca profesional en 30 días.
                    De perfil amateur a activo digital de élite.
                </p>

                {/* CTA */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <button
                        onClick={() => document.getElementById('analyzer-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative px-8 py-4 bg-white text-black text-sm font-bold tracking-[0.2em] uppercase overflow-hidden hover:bg-[#E6E8EB] transition-all"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Iniciar Auditoría
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                    <span className="text-xs text-white/40 font-mono tracking-widest uppercase">
                        Solo 5 cupos mensuales
                    </span>
                </div>

            </div>

            {/* Floating UI Elements (Abstract "Assets") */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center animate-bounce duration-[3000ms] opacity-30">
                <ArrowRight className="w-6 h-6 rotate-90 text-white" />
            </div>

        </section>
    );
}
