"use client";

import { useAnalyzer } from "./context";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function AccessControl() {
    const { setPhase, setHandle, handle } = useAnalyzer();

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-12 animate-in fade-in zoom-in-95 duration-700">

            {/* Icon */}
            <div className="relative">
                <div className="absolute inset-0 bg-[#C9A24D] blur-[40px] opacity-10 rounded-full" />
                <Lock className="w-16 h-16 text-[#E6E8EC] stroke-[1px] relative z-10" />
            </div>

            {/* Title Block */}
            <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-semibold text-[#E6E8EC] tracking-tight">
                    Identificación de Activo de Élite
                </h2>
                <p className="text-[#9AA4B2] text-sm uppercase tracking-[0.2em] font-mono">
                    Acceso seguro al sistema de evaluación
                </p>
            </div>

            {/* CTA */}
            {/* Input Field */}
            <div className="w-full max-w-sm mx-auto space-y-2 relative group z-20">
                <input
                    type="text"
                    placeholder="INTRODUCIR USUARIO (Ej: @cristiano)"
                    onChange={(e) => setHandle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handle && setPhase("VALIDATION")}
                    className="w-full bg-[#0B0D10] border border-[#1F2533] text-[#E6E8EC] text-center font-mono py-4 px-6 focus:border-[#C9A24D] focus:shadow-[0_0_20px_rgba(201,162,77,0.1)] outline-none transition-all placeholder:text-[#9AA4B2]/30 uppercase tracking-widest text-xs relative z-20"
                />
            </div>

            {/* CTA */}
            <button
                onClick={() => setPhase("VALIDATION")}
                disabled={!handle}
                className="group relative px-10 py-5 bg-[#C9A24D] text-[#0B0D10] font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#b08d44] transition-all shadow-[0_0_30px_rgba(201,162,77,0.2)] hover:shadow-[0_0_50px_rgba(201,162,77,0.4)] disabled:opacity-50 disabled:cursor-not-allowed z-20"
            >
                <span className="relative z-10">Iniciar escaneo de estatus</span>
            </button>

            {/* Micro-copy (Sense of Security) */}
            <div className="flex items-center gap-2 text-[10px] text-[#9AA4B2]/40 font-mono uppercase tracking-widest">
                <div className="w-1 h-1 bg-[#2ECC71] rounded-full animate-pulse" />
                Sistema Encriptado v5.0
            </div>

        </div>
    );
}
