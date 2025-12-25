
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Terminal } from "lucide-react"

// --- TYPES & ENUMS ---
enum TerminalStep {
    IDLE = 0,
    STREAM = 1,
    READY = 2
}

const STREAM_SEQUENCE = [
    // FASE 1
    "Inicializando entorno de análisis.",
    "Verificando accesibilidad del activo digital.",
    "Estableciendo parámetros de lectura pública.",
    // FASE 2
    "Cartografiando capas visibles de emisión.",
    "Aislando patrones dominantes de señal.",
    "Calculando relación señal–ruido.",
    // FASE 3
    "Correlacionando coordenadas de posicionamiento.",
    "Verificando consistencia entre interfaz de autoridad y patrón de emisión.",
    "Detectando discontinuidades estructurales.",
    // FASE 4
    "Modelando dinámicas sistémicas predominantes.",
    "Estimando efectos algorítmicos secundarios.",
    "Preparando síntesis diagnóstica.",
    // FASE 5
    "Diagnóstico listo.",
    "Procediendo a visualización de arquitectura."
];

export default function SmartGrowthConsultant() {
    const router = useRouter()

    // State
    const [step, setStep] = useState<TerminalStep>(TerminalStep.IDLE)
    const [handle, setHandle] = useState("")
    const [streamLines, setStreamLines] = useState<string[]>([])

    // Logic
    const startDiagnosis = () => {
        if (!handle) return;
        setStep(TerminalStep.STREAM);
    }

    // Stream Effect
    useEffect(() => {
        if (step === TerminalStep.STREAM) {
            let index = 0;
            const interval = setInterval(() => {
                if (index < STREAM_SEQUENCE.length) {
                    setStreamLines(prev => [...prev, STREAM_SEQUENCE[index]]);
                    index++;
                    // Auto-scroll logic if needed, but lines act as a log
                } else {
                    clearInterval(interval);
                    setTimeout(() => setStep(TerminalStep.READY), 1000);
                }
            }, 800); // 800ms per line -> ~12 seconds total for 14 lines

            return () => clearInterval(interval);
        }
    }, [step]);


    // --- RENDERERS ---

    // 1. INPUT STATE
    if (step === TerminalStep.IDLE) {
        return (
            <div className="w-full max-w-md mx-auto space-y-8">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#0A2540] to-slate-800 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-[#02040a] border border-white/10 p-1 flex items-center gap-4 rounded-lg">
                        <span className="pl-4 text-slate-500 font-mono">@</span>
                        <input
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            placeholder="usuario"
                            className="bg-transparent border-none text-white font-mono text-lg py-4 w-full focus:ring-0 placeholder:text-slate-700 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && startDiagnosis()}
                        />
                    </div>
                </div>

                <div className="text-center space-y-8">
                    <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                        Iniciando protocolo de escaneo de infraestructura visible.
                    </p>

                    <button
                        onClick={startDiagnosis}
                        disabled={!handle}
                        className="text-[#0A2540] bg-white hover:bg-slate-200 transition-colors px-8 py-3 font-mono text-xs uppercase tracking-[0.2em] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        INICIAR DIAGNÓSTICO DE ARQUITECTURA
                    </button>
                </div>
            </div>
        )
    }

    // 2. STREAM STATE
    if (step === TerminalStep.STREAM) {
        return (
            <div className="w-full max-w-lg mx-auto bg-[#02040a] border border-white/10 p-6 rounded-lg min-h-[300px] font-mono text-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0A2540] to-transparent opacity-50 animate-pulse" />

                <div className="space-y-2">
                    {streamLines.map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-slate-400 border-l border-white/10 pl-3 flex gap-3"
                        >
                            <span className="text-[#0A2540]">{`> `}</span>
                            {line}
                        </motion.div>
                    ))}
                    <div className="animate-pulse text-[#0A2540]">_</div>
                </div>
            </div>
        )
    }

    // 3. PLACEHOLDER STATE
    if (step === TerminalStep.READY) {
        return (
            <div className="w-full max-w-lg mx-auto bg-[#02040a] border border-white/10 p-12 rounded-lg text-center space-y-6">
                <Activity className="w-8 h-8 text-[#0A2540] mx-auto animate-pulse" />
                <h3 className="text-white font-mono text-sm tracking-widest uppercase">
                    Visualización de arquitectura en preparación.
                </h3>
                <div className="h-1 w-24 bg-[#0A2540]/20 mx-auto overflow-hidden rounded-full">
                    <div className="h-full bg-[#0A2540] w-1/2 animate-shimmer" />
                </div>
            </div>
        )
    }

    return null;
}

