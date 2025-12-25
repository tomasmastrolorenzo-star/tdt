"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Shield, Activity } from "lucide-react"
import { funnelTracker } from "@/lib/analytics/funnel"

// --- TYPES & ENUMS ---
enum AnalyzerStep {
    PRE_ENTRY = 0,
    CONNECTION = 1,
    DATA_STREAM = 2, // New: Sequential Reveal
    PATTERN_RECOGNITION = 3, // New: Micro-Validation
    DIAGNOSIS_REVEAL = 4, // Replaces VERDICT
    PROTOCOL_SELECTION = 5, // Replaces INVITATION
}

type NarrativeLevel = "RAPIDO_IMPACTO" | "CONSOLIDACION" | "TRANSFORMACION" | "ESCALA_ESTRATEGICA" | "REVISION_MANUAL";

interface AnalysisResult {
    username: string
    profilePicUrl?: string
    narrative_level: NarrativeLevel
    routing_target: "CHECKOUT" | "VSL" | "APPLICATION" | "WAITLIST" | "BLOCK"
    human_access: boolean
    sales_alert: boolean
    risk_flags: string[]
    ux: {
        title: string
        message: string
        roadmap: {
            gain: string
            foundation: string
            transformation: string
        }
        disclaimer: string
    }
    indicators: Record<string, { val: number, label: string, evidence: string }>
}

// --- VISUAL COMPONENTS ---

const ScanLoader = ({ label }: { label: string }) => (
    <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-t-2 border-[#d4af37] rounded-full animate-spin" />
            <div className="absolute inset-2 border-r-2 border-[#d4af37]/30 rounded-full animate-spin-reverse" />
        </div>
        <p className="text-[10px] font-mono text-[#d4af37] animate-pulse uppercase tracking-widest">{label}</p>
    </div>
)

const IndicatorCard = ({ label, value, type }: { label: string, value: string, type: 'good' | 'neutral' | 'warn' }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 border ${type === 'good' ? 'border-green-900/50 bg-green-950/10' : type === 'warn' ? 'border-red-900/50 bg-red-950/10' : 'border-slate-800 bg-slate-900/20'} backdrop-blur-sm`}
    >
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">{label}</div>
        <div className={`text-sm font-mono ${type === 'good' ? 'text-green-400' : type === 'warn' ? 'text-red-400' : 'text-slate-300'}`}>
            {value}
        </div>
    </motion.div>
)

// --- MAIN COMPONENT ---

export default function SmartGrowthConsultant() {
    const router = useRouter()
    const [step, setStep] = useState<AnalyzerStep>(AnalyzerStep.PRE_ENTRY)

    // Data State
    const [handle, setHandle] = useState("")
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // Reveal State
    const [revealIndex, setRevealIndex] = useState(0)

    // --- ACTIONS ---

    const startAnalysis = async () => {
        if (!handle) return
        setIsAnalyzing(true)
        setStep(AnalyzerStep.CONNECTION)

        try {
            const response = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ handle })
            })
            const data = await response.json()

            // Backend Fallback is handled in API, data always matches structure (or fallback structure)
            if (data.status === 'restricted') {
                // Should use API's fallback manual review struct, but double check
                setAnalysis({
                    username: handle,
                    narrative_level: "REVISION_MANUAL",
                    routing_target: "WAITLIST",
                    human_access: false,
                    sales_alert: false,
                    risk_flags: [],
                    ux: {
                        title: "Análisis Protegido",
                        message: "Los protocolos de seguridad impidieron una lectura automática.",
                        roadmap: { gain: "Auditoría", foundation: "Diagnóstico", transformation: "Acceso" },
                        disclaimer: "Modo Seguro Activo"
                    },
                    indicators: {}
                })
            } else {
                setAnalysis(data)
            }

            // Start Sequence
            setTimeout(() => setStep(AnalyzerStep.DATA_STREAM), 2000)

        } catch (e) {
            console.error("Analysis Failed", e)
            setAnalysis({
                username: handle,
                narrative_level: "REVISION_MANUAL",
                routing_target: "WAITLIST",
                human_access: false,
                sales_alert: false,
                risk_flags: [],
                ux: {
                    title: "Error de Conexión",
                    message: "No se pudo establecer el puente de datos.",
                    roadmap: { gain: "Reintento", foundation: "Manual", transformation: "Soporte" },
                    disclaimer: "Error de Red"
                },
                indicators: {}
            })
            setTimeout(() => setStep(AnalyzerStep.DATA_STREAM), 2000)
        } finally {
            setIsAnalyzing(false)
        }
    }

    // Sequence Controller
    useEffect(() => {
        if (step === AnalyzerStep.DATA_STREAM && analysis) {
            // Reveal indicators one by one
            const interval = setInterval(() => {
                setRevealIndex(prev => {
                    if (prev >= 3) { // Show max 3 indicators
                        clearInterval(interval)
                        setTimeout(() => setStep(AnalyzerStep.PATTERN_RECOGNITION), 1500)
                        return prev
                    }
                    return prev + 1
                })
            }, 1500)
            return () => clearInterval(interval)
        }
    }, [step, analysis])

    const handleAction = () => {
        if (!analysis) return

        // Action Routing Logic
        const routeValues: any = {
            'CHECKOUT': { url: '/checkout?product=audit_protocol', label: 'ACCESO DIRECTO' },
            'VSL': { url: '/briefing/logic-v2', label: 'VER BRIEFING TÉCNICO' },
            'APPLICATION': { url: '/apply/consultant', label: 'INICIAR SOLICITUD' },
            'WAITLIST': { url: '/waitlist', label: 'UNIRSE A LISTA DE ESPERA' },
            'BLOCK': { url: '/resources/guide', label: 'DESCARGAR GUÍA' }
        }

        const action = routeValues[analysis.routing_target] || routeValues['BLOCK']

        // Track
        funnelTracker.track('ANALYSIS_COMPLETE', {
            segment: analysis.narrative_level,
            target: analysis.routing_target
        })

        // Execute
        router.push(action.url)
    }

    // --- RENDERERS ---

    if (step === AnalyzerStep.PRE_ENTRY) {
        return (
            <div className="min-h-[600px] flex flex-col items-center justify-center bg-[#02040a] border border-[#d4af37]/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />
                <div className="max-w-md w-full p-8 space-y-8 relative z-10 text-center">
                    <h2 className="text-2xl font-serif text-white italic">Protocolo Forense</h2>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest max-w-xs mx-auto">
                        Diagnóstica la estructura de autoridad de tu perfil de Instagram. <br /> Sin métricas de vanidad.
                    </p>

                    <div className="space-y-4 pt-4">
                        <input
                            value={handle}
                            onChange={e => setHandle(e.target.value)}
                            placeholder="@USUARIO"
                            className="w-full bg-slate-900/50 border border-slate-800 focus:border-[#d4af37] text-center text-white font-mono py-4 px-4 outline-none transition-colors uppercase tracking-widest"
                        />
                        <Button
                            onClick={startAnalysis}
                            disabled={!handle || isAnalyzing}
                            className="w-full bg-[#d4af37] text-black hover:bg-white rounded-none uppercase tracking-[0.2em] font-mono text-xs py-6"
                        >
                            {isAnalyzing ? "INICIANDO..." : "EJECUTAR DIAGNÓSTICO"}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (step === AnalyzerStep.CONNECTION) {
        return (
            <div className="min-h-[600px] flex items-center justify-center bg-[#02040a] border border-[#d4af37]/20">
                <ScanLoader label="ESTABLECIENDO ENLACE SEGURO" />
            </div>
        )
    }

    if (step === AnalyzerStep.DATA_STREAM && analysis) {
        return (
            <div className="min-h-[600px] flex flex-col items-center justify-center bg-[#02040a] border border-[#d4af37]/20 p-8">
                <div className="w-full max-w-lg space-y-8">
                    <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                        <div className="w-12 h-12 rounded-full border border-[#d4af37]/30 overflow-hidden">
                            {analysis.profilePicUrl ? (
                                <img src={`https://wsrv.nl/?url=${encodeURIComponent(analysis.profilePicUrl)}`} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                            ) : <div className="w-full h-full bg-slate-800" />}
                        </div>
                        <div>
                            <div className="text-xs font-mono text-[#d4af37]">@{analysis.username}</div>
                            <div className="text-[10px] font-mono text-slate-500 uppercase">Extracción de Vectores</div>
                        </div>
                    </div>

                    <div className="space-y-3 min-h-[200px]">
                        <AnimatePresence>
                            {revealIndex >= 1 && analysis.indicators.posicionamiento && (
                                <IndicatorCard
                                    label="CLARIDAD DE POSICIONAMIENTO"
                                    value={analysis.indicators.posicionamiento.label}
                                    type={analysis.indicators.posicionamiento.label === 'CLARO' ? 'good' : 'warn'}
                                />
                            )}
                            {revealIndex >= 2 && analysis.indicators.intencion_comercial && (
                                <IndicatorCard
                                    label="INTENCIÓN COMERCIAL DETECTADA"
                                    value={analysis.indicators.intencion_comercial.label}
                                    type={analysis.indicators.intencion_comercial.label === 'ALTA' ? 'good' : 'neutral'}
                                />
                            )}
                            {revealIndex >= 3 && analysis.indicators.brecha_aspiracional && (
                                <IndicatorCard
                                    label="BRECHA DE AUTORIDAD"
                                    value={analysis.indicators.brecha_aspiracional.label}
                                    type={analysis.indicators.brecha_aspiracional.label === 'ALINEADA' ? 'good' : 'warn'}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    <p className="text-[9px] text-center font-mono text-slate-600 animate-pulse">
                        ANALIZANDO CORRELACIONES ESTRUCTURALES...
                    </p>
                </div>
            </div>
        )
    }

    if (step === AnalyzerStep.PATTERN_RECOGNITION) {
        return (
            <div className="min-h-[600px] flex flex-col items-center justify-center bg-[#02040a] border border-[#d4af37]/20 p-12 text-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-md">
                    <Activity className="w-12 h-12 text-[#d4af37] mx-auto animate-pulse" />
                    <h3 className="text-xl font-verdict text-white italic">Patrón Identificado</h3>
                    <p className="text-xs font-mono text-slate-400 leading-relaxed">
                        El sistema ha detectado una configuración específica en tus activos digitales.
                        <br />
                        Estamos traduciendo los datos a un protocolo de acción.
                    </p>
                    <Button onClick={() => setStep(AnalyzerStep.DIAGNOSIS_REVEAL)} className="bg-transparent border border-white/20 text-white hover:border-[#d4af37] hover:text-[#d4af37] rounded-none uppercase tracking-[0.2em] font-mono text-[10px] py-4 px-8 mt-8">
                        VER DIAGNÓSTICO
                    </Button>
                </motion.div>
            </div>
        )
    }

    if (step === AnalyzerStep.DIAGNOSIS_REVEAL && analysis) {
        const isWarning = analysis.narrative_level === 'REVISION_MANUAL' || analysis.narrative_level === 'RAPIDO_IMPACTO';

        return (
            <div className="min-h-[600px] flex flex-col items-center justify-center bg-[#02040a] border border-[#d4af37]/20 p-8 relative">
                <div className="w-full max-w-2xl text-center space-y-10">

                    {/* Header */}
                    <div className="space-y-2">
                        <div className={`inline-block px-3 py-1 ${isWarning ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/30'} border text-[9px] font-bold font-mono uppercase tracking-widest`}>
                            DIAGNÓSTICO SISTÉMICO
                        </div>
                        <h2 className="text-3xl md:text-4xl font-verdict text-white italic">
                            {analysis.ux.title}
                        </h2>
                    </div>

                    {/* Message */}
                    <p className="text-sm font-mono text-slate-400 leading-relaxed max-w-lg mx-auto border-l-2 border-[#d4af37]/20 pl-6 italic">
                        "{analysis.ux.message}"
                    </p>

                    {/* Roadmap Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left border-t border-slate-800 pt-8 mt-4">
                        <div className="p-4 bg-slate-900/30 border border-slate-800 hover:border-[#d4af37]/30 transition-colors group">
                            <div className="text-[9px] text-[#d4af37] font-mono uppercase tracking-widest mb-2 group-hover:text-white">Fase 1: Ganancia</div>
                            <div className="text-xs text-slate-300 font-mono">{analysis.ux.roadmap.gain}</div>
                        </div>
                        <div className="p-4 bg-slate-900/30 border border-slate-800 hover:border-[#d4af37]/30 transition-colors group">
                            <div className="text-[9px] text-[#d4af37] font-mono uppercase tracking-widest mb-2 group-hover:text-white">Fase 2: Cimiento</div>
                            <div className="text-xs text-slate-300 font-mono">{analysis.ux.roadmap.foundation}</div>
                        </div>
                        <div className="p-4 bg-slate-900/30 border border-slate-800 hover:border-[#d4af37]/30 transition-colors group">
                            <div className="text-[9px] text-[#d4af37] font-mono uppercase tracking-widest mb-2 group-hover:text-white">Fase 3: Transformación</div>
                            <div className="text-xs text-slate-300 font-mono">{analysis.ux.roadmap.transformation}</div>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-[9px] text-slate-600 font-mono max-w-xs mx-auto pt-4">
                        {analysis.ux.disclaimer}
                    </p>

                    {/* CTA */}
                    <Button onClick={() => setStep(AnalyzerStep.PROTOCOL_SELECTION)} className="w-full md:w-auto px-16 bg-[#d4af37] text-black hover:bg-white rounded-none uppercase tracking-[0.2em] font-mono text-xs py-6 shadow-lg shadow-[#d4af37]/10">
                        SIGUIENTE PASO
                    </Button>
                </div>
            </div>
        )
    }

    if (step === AnalyzerStep.PROTOCOL_SELECTION && analysis) {
        // Here we map routing_target to the UI Flow
        const isBlock = analysis.routing_target === 'BLOCK' || analysis.routing_target === 'WAITLIST';

        return (
            <div className="min-h-[600px] flex flex-col items-center justify-center bg-[#02040a] border border-[#d4af37]/20 p-8 relative">
                <div className="w-full max-w-md text-center space-y-8">
                    <Shield className="w-16 h-16 text-[#d4af37] mx-auto opacity-80" />

                    <div className="space-y-4">
                        <h2 className="text-2xl font-serif text-white italic">Protocolo Recomendado</h2>
                        <p className="text-xs font-mono text-slate-400">
                            En base a su perfil de arquitectura de autoridad ({analysis.narrative_level}), se ha habilitado la siguiente ruta de acción.
                        </p>
                    </div>

                    <div className="p-8 border border-[#d4af37]/30 bg-[#d4af37]/5 space-y-6">
                        <div className="flex items-center justify-center gap-2 text-[#d4af37] font-mono text-xs uppercase tracking-widest">
                            <Lock className="w-3 h-3" /> Ruta Asignada
                        </div>
                        <Button onClick={handleAction} className="w-full bg-white text-black hover:bg-[#d4af37] transition-all rounded-none uppercase tracking-[0.2em] font-mono text-xs py-5">
                            {analysis.routing_target === 'CHECKOUT' && "ACCESO DIRECTO"}
                            {analysis.routing_target === 'VSL' && "VER VSL TÉCNICO"}
                            {analysis.routing_target === 'APPLICATION' && "INICIAR APLICACIÓN"}
                            {analysis.routing_target === 'WAITLIST' && "UNIRSE A LISTA"}
                            {analysis.routing_target === 'BLOCK' && "VER RECURSOS"}
                        </Button>
                        <p className="text-[9px] text-slate-500 font-mono uppercase">
                            {isBlock ? "Intervención humana no disponible temporalmente." : "Acceso limitado por tiempo de sesión."}
                        </p>
                    </div>

                    <button onClick={() => setStep(AnalyzerStep.PRE_ENTRY)} className="text-[9px] font-mono text-slate-600 underline decoration-slate-800 hover:text-slate-400">
                        Reiniciar Diagnóstico
                    </button>
                </div>
            </div>
        )
    }

    return null
}
