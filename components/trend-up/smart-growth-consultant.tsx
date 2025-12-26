"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Terminal, AlertTriangle, Database, Lock, Activity, ChevronRight } from "lucide-react"

// --- TYPES (Matching Backend Intelligence) ---

interface InterventionDecision {
    recommended_intervention: 'NO_INTERVENIR' | 'AJUSTE_TECNICO_PUNTUAL' | 'OPTIMIZACION_GUIADA' | 'INTERVENCION_ESTRUCTURAL' | 'AUDITORIA_PROFUNDA';
    complexity_level: 'baja' | 'media' | 'alta' | 'critica';
    investment_coherence: boolean;
    intervention_risk: 'bajo' | 'medio' | 'alto';
    rationale: string;
}

interface DiagnosisData {
    asset_classification: {
        subtype: string;
    };
    problems: {
        critical: { code: string; type: string }[];
    };
    intervention_decision: InterventionDecision;
}

// --- SEQUENCER ---
enum VisualStep {
    IDLE = 0,           // Input
    PROCESSING_1 = 1,   // Silent Ingestion (4s)
    VALIDATION = 2,     // Show Fragments (Real Data)
    ASYMMETRY = 3,      // Primary Failure Phrase
    MAPPING = 4,        // Visual Block Indicator
    INERTIA = 5,        // Consequence (Clean Screen)
    PROCESSING_2 = 6,   // Silent Judgment (3s)
    SENTENCE = 7        // Final Decision
}

export default function SmartGrowthConsultant() {
    const [step, setStep] = useState<VisualStep>(VisualStep.IDLE)
    const [handle, setHandle] = useState("")
    const [error, setError] = useState("")

    // Data Containers
    const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null)
    const [fragments, setFragments] = useState<{ url: string, caption?: string }[]>([])
    const [profile, setProfile] = useState<{ username: string, img: string } | null>(null)

    // --- LOGIC ---

    const executeAnalysis = async () => {
        if (!handle) return

        let cleanHandle = handle.trim()
        if (!cleanHandle.startsWith('@')) cleanHandle = '@' + cleanHandle

        setStep(VisualStep.PROCESSING_1)

        try {
            const res = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ handle: cleanHandle })
            })

            if (!res.ok) throw new Error("Connection Refused")

            const data = await res.json()

            if (data._forensic_diagnosis) {
                setDiagnosis(data._forensic_diagnosis)
                setFragments(data.latest_posts || [])
                setProfile({ username: data.username, img: data.profilePicUrl })

                // --- SEQUENCER TRIGGER ---
                // 4s Silence (Processing 1) -> Validation
                setTimeout(() => setStep(VisualStep.VALIDATION), 4000)
            } else {
                throw new Error("Invalid Structure")
            }

        } catch (e) {
            setStep(VisualStep.IDLE)
            setError("ERR: SISTEMA NO RESPONDE")
        }
    }

    // Auto-Sequencer
    useEffect(() => {
        if (step === VisualStep.VALIDATION) {
            // Show fragments for 3s then Asymmetry
            setTimeout(() => setStep(VisualStep.ASYMMETRY), 3000)
        }
        if (step === VisualStep.ASYMMETRY) {
            // Show Failure Phrase for 2.5s then Mapping
            setTimeout(() => setStep(VisualStep.MAPPING), 2500)
        }
        if (step === VisualStep.MAPPING) {
            // Show Block Diagram for 2s then Inertia
            setTimeout(() => setStep(VisualStep.INERTIA), 2000)
        }
        if (step === VisualStep.INERTIA) {
            // Show Consequence for 3s then Silence 2
            setTimeout(() => setStep(VisualStep.PROCESSING_2), 3000)
        }
        if (step === VisualStep.PROCESSING_2) {
            // Silence for 3s then Judgment
            setTimeout(() => setStep(VisualStep.SENTENCE), 3000)
        }
    }, [step])


    // --- RENDER HELPERS ---

    const getInterventionCopy = (type: InterventionDecision['recommended_intervention']) => {
        switch (type) {
            case 'NO_INTERVENIR':
                return {
                    status: "CONFIGURACIÓN ACTUAL NO APTA PARA ESCALA.",
                    action: "PROCEDIMIENTO ABORTADO"
                }
            case 'AJUSTE_TECNICO_PUNTUAL':
                return {
                    status: "DESVIACIÓN OPERATIVA DETECTADA.",
                    action: "REQUERIDO: REALINEACIÓN DE CAPA DE SUPERFICIE"
                }
            case 'OPTIMIZACION_GUIADA':
                return {
                    status: "POTENCIAL ESTRUCTURAL DETECTADO.",
                    action: "REQUIERE ESTRUCTURACIÓN DE SALIDA"
                }
            case 'INTERVENCION_ESTRUCTURAL':
                return {
                    status: "FALLA CRÍTICA EN ARQUITECTURA.",
                    action: "INTERVENCIÓN INMEDIATA REQUERIDA"
                }
            case 'AUDITORIA_PROFUNDA':
                return {
                    status: "ALTO VALOR ESTRATÉGICO.",
                    action: "SOLICITAR DESGLOSE DE CAPITALIZACIÓN"
                }
            default:
                return { status: "ERROR", action: "N/A" }
        }
    }

    // --- VIEWS ---

    if (step === VisualStep.IDLE) {
        return (
            <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in duration-500 font-mono">
                <div className="border border-white/10 bg-[#02040a] p-8 space-y-6">
                    <div className="flex items-center justify-between text-[10px] text-slate-600 uppercase tracking-widest border-b border-white/5 pb-4">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-3 h-3" />
                            <span>System_Ready // v2.0</span>
                        </div>
                        <div className="w-2 h-2 bg-green-900 rounded-full animate-pulse" />
                    </div>

                    <div className="py-8">
                        <input
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            placeholder="INGRESAR IDENTIFICADOR"
                            className="bg-transparent border-none text-white text-xl w-full focus:ring-0 placeholder:text-slate-800 outline-none uppercase tracking-widest text-center"
                            onKeyDown={(e) => e.key === 'Enter' && executeAnalysis()}
                        />
                    </div>
                </div>

                {error && <div className="text-[10px] text-red-500 bg-red-900/10 p-2 border border-red-900/20 text-center uppercase tracking-widest">{error}</div>}

                <button
                    onClick={executeAnalysis}
                    disabled={!handle}
                    className="w-full bg-[#d4af37] disabled:opacity-50 text-black py-4 text-xs uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors"
                >
                    INICIAR SECUENCIA
                </button>
            </div>
        )
    }

    if (step === VisualStep.PROCESSING_1 || step === VisualStep.PROCESSING_2) {
        // PURE SILENCE / BLACK BOX
        return (
            <div className="w-full h-64 flex items-center justify-center">
                {/* No Loader. Just a blinking cursor implies processing but barely visible */}
                <div className="w-1 h-1 bg-[#d4af37] animate-pulse" />
            </div>
        )
    }

    if (step === VisualStep.VALIDATION && profile) {
        return (
            <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in duration-700">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest text-center">VALIDACIÓN DE CAPAS REALES</div>

                <div className="grid grid-cols-3 gap-1 opacity-50 grayscale hover:grayscale-0 transition-all duration-1000">
                    {fragments.slice(0, 3).map((f, i) => (
                        <div key={i} className="aspect-square bg-slate-900 border border-white/10 overflow-hidden relative">
                            {f.url && <img src={`https://wsrv.nl/?url=${encodeURIComponent(f.url)}`} className="w-full h-full object-cover" />}
                        </div>
                    ))}
                </div>

                <div className="text-center font-mono text-xs text-slate-400">
                    OBJETIVO: {profile.username} <br />
                    SUBTIPO: {diagnosis?.asset_classification.subtype}
                </div>
            </div>
        )
    }

    if (step === VisualStep.ASYMMETRY && diagnosis) {
        // Show ONE technical phrase
        const problemCode = diagnosis.problems.critical[0]?.code || "LATENCIA_ESTRUCTURAL";

        return (
            <div className="w-full h-64 flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95 duration-300">
                <AlertTriangle className="w-8 h-8 text-[#d4af37] animate-pulse" />
                <h2 className="text-2xl font-mono text-white tracking-tighter uppercase text-center border-b border-[#d4af37] pb-2">
                    {problemCode.replace(/_/g, " ")}
                </h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">ERROR PRIMARIO IDENTIFICADO</p>
            </div>
        )
    }

    if (step === VisualStep.MAPPING) {
        // Visual Block Indicator
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center space-y-2 animate-in fade-in duration-500 font-mono text-xs text-slate-600">
                <div className="p-2 border border-slate-800">[CAPA_01: SUPERFICIE]</div>
                <div className="h-4 w-[1px] bg-[#d4af37]"></div>
                <div className="p-2 border border-[#d4af37] text-[#d4af37] bg-[#d4af37]/5 font-bold">[FRICCIÓN DETECTADA]</div>
                <div className="h-4 w-[1px] bg-slate-800"></div>
                <div className="p-2 border border-slate-800">[CAPA_03: CONVERSIÓN]</div>
            </div>
        )
    }

    if (step === VisualStep.INERTIA) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center animate-in fade-in duration-1000">
                <p className="text-sm font-mono text-slate-400 text-center max-w-xs leading-relaxed">
                    "La arquitectura actual imposibilita la retención de valor en ciclos de alta frecuencia."
                </p>
                <div className="mt-4 text-[10px] text-red-500 uppercase tracking-widest">
                    CONSECUENCIA: DEGRADACIÓN ACTIVA
                </div>
            </div>
        )
    }

    if (step === VisualStep.SENTENCE && diagnosis) {
        const decision = diagnosis.intervention_decision;
        const copy = getInterventionCopy(decision.recommended_intervention);

        return (
            <div className="w-full max-w-xl mx-auto bg-[#02040a] border-t-2 border-[#d4af37] p-8 space-y-8 animate-in slide-in-from-bottom-2 duration-700">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">SENTENCIA TÉCNICA FINAL</div>
                        <h1 className="text-3xl font-mono text-white tracking-tight uppercase leading-none">
                            {decision.recommended_intervention.replace(/_/g, " ")}
                        </h1>
                    </div>
                    {decision.complexity_level === 'critica' || decision.complexity_level === 'alta' ?
                        <AlertTriangle className="w-6 h-6 text-red-500" /> :
                        <Activity className="w-6 h-6 text-[#d4af37]" />
                    }
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900/30 p-6 border-l-2 border-white/20">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">ESTADO DEL ACTIVO</div>
                        <p className="text-sm font-mono text-white leading-relaxed">
                            {copy.status}
                        </p>
                    </div>

                    <div className="bg-[#d4af37]/5 p-6 border-l-2 border-[#d4af37]">
                        <div className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest mb-2">JUSTIFICACIÓN TÉCNICA</div>
                        <p className="text-xs font-mono text-slate-300 leading-relaxed text-justify">
                            {decision.rationale}
                        </p>
                    </div>

                    {/* RISK INDICATOR */}
                    <div className="flex items-center justify-between text-[10px] font-mono border-t border-white/5 pt-4">
                        <span className="text-slate-600">RIESGO DE INTERVENCIÓN</span>
                        <span className={`${decision.intervention_risk === 'alto' ? 'text-red-500' : 'text-slate-400'} uppercase`}>
                            {decision.intervention_risk}
                        </span>
                    </div>
                </div>

                <div className="pt-8 space-y-4">
                    <button
                        className="w-full bg-white text-black hover:bg-slate-200 py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all"
                        onClick={() => alert("PROTOCOLO_BLOQUEADO_24H")}
                    >
                        {copy.action}
                    </button>

                    <div className="text-center">
                        <span className="text-[10px] text-slate-600 uppercase tracking-widest">
                            ACTIVO EN ESTADO DE DIAGNÓSTICO. DATOS CONSOLIDADOS.
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
