"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Shield, Lock, Fingerprint, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { funnelTracker } from "@/lib/analytics/funnel"

// --- TYPES & ENUMS ---
enum SystemStep {
    PRE_ENTRY = 0,
    STATIC_ANALYSIS = 1,
    PANORAMA = 2,
    BUDGET_ASSESSMENT = 3,
    PROTOCOL_SELECTION = 4
}

// Fixed static outcome for v1.1 (Frontend Driven for now or consuming mocked backend)
// For v1.1, we keep consuming the API but we render it differently.
interface AnalysisResult {
    username: string
    ux: {
        title: string
        message: string
        roadmap: { gain: string, foundation: string, transformation: string }
        disclaimer: string
    }
    narrative_level: string
    routing_target: string
    indicators: Record<string, { val: number, label: string }>
}

export default function SmartGrowthConsultant() {
    const router = useRouter()

    // State
    const [step, setStep] = useState<SystemStep>(SystemStep.PRE_ENTRY)
    const [handle, setHandle] = useState("")
    const [consent, setConsent] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("Iniciando entorno...")
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
    const [budgetResponse, setBudgetResponse] = useState<string | null>(null)

    // --- ACTIONS ---

    const startSystem = async () => {
        if (!handle || !consent) return
        setStep(SystemStep.STATIC_ANALYSIS)

        // Parallel Process: Fetch Data & Show Static Messages
        const fetchPromise = fetch('/api/forensic/instagram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ handle })
        }).then(res => res.json())

        // Static Delays (Artificial 4-6s)
        const messages = [
            "Verificando accesibilidad del activo...",
            "Aislando patrones de emisión...",
            "Calculando asimetría estructural...",
            "Preparando visualización..."
        ]

        let ms = 0
        messages.forEach((msg, i) => {
            ms += 1500 // 1.5s per message -> 6s total
            setTimeout(() => setLoadingMessage(msg), ms)
        })

        try {
            const data = await fetchPromise
            setAnalysis(data) // Store data but don't show yet

            setTimeout(() => {
                setStep(SystemStep.PANORAMA)
            }, ms + 1000) // Ensure full delay
        } catch (e) {
            console.error(e)
            // Error handling could go here, for now silent fail to Panorama (mock or retry)
        }
    }

    const handleBudgetSelection = (selection: string) => {
        setBudgetResponse(selection)
        setStep(SystemStep.PROTOCOL_SELECTION)
    }

    const handleFinalAction = () => {
        if (!analysis) return

        // Routing Logic (Same as before but hidden labels)
        const routeValues: any = {
            'CHECKOUT': '/checkout?product=audit_protocol',
            'VSL': '/briefing/logic-v2',
            'APPLICATION': '/apply/consultant',
            'WAITLIST': '/waitlist',
            'BLOCK': '/resources/guide'
        }
        const url = routeValues[analysis.routing_target] || routeValues['BLOCK']
        router.push(url)
    }


    // --- RENDERERS ---

    // 1. PRE-ENTRY (Terminal Input + Consent)
    if (step === SystemStep.PRE_ENTRY) {
        return (
            <div className="w-full max-w-md mx-auto space-y-12 animate-in fade-in duration-700">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-white/5 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-[#02040a] border border-white/10 p-1 flex items-center gap-4 rounded-lg">
                        <span className="pl-4 text-slate-500 font-mono">@</span>
                        <input
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            placeholder="usuario"
                            className="bg-transparent border-none text-white font-mono text-lg py-4 w-full focus:ring-0 placeholder:text-slate-700 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 border mt-1 flex items-center justify-center transition-colors ${consent ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'border-slate-700 group-hover:border-slate-500'}`}>
                            {consent && <Check className="w-3 h-3" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={consent} onChange={e => setConsent(e.target.checked)} />
                        <span className="text-[10px] text-slate-500 font-mono uppercase leading-relaxed select-none">
                            Autorizo el análisis forense de la infraestructura pública de este activo digital bajo los protocolos de privacidad TDT.
                        </span>
                    </label>

                    <button
                        onClick={startSystem}
                        disabled={!handle || !consent}
                        className="w-full text-[#0A2540] bg-white hover:bg-slate-200 transition-colors py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        INICIAR DIAGNÓSTICO
                    </button>

                    <div className="flex justify-center gap-4 opacity-30">
                        <Shield className="w-3 h-3 text-slate-500" />
                        <Lock className="w-3 h-3 text-slate-500" />
                    </div>
                </div>
            </div>
        )
    }

    // 2. STATIC ANALYSIS (Text Only, No Animations)
    if (step === SystemStep.STATIC_ANALYSIS) {
        return (
            <div className="w-full max-w-lg mx-auto text-center space-y-6 min-h-[300px] flex flex-col items-center justify-center">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">
                    {loadingMessage}
                </p>
                {/* No Progress Bars. Just stillness. */}
            </div>
        )
    }

    // 3. THE PANORAMA (Asymmetry Visualization)
    if (step === SystemStep.PANORAMA && analysis) {
        return (
            <div className="w-full max-w-3xl mx-auto bg-[#02040a] border border-white/10 p-8 md:p-12 relative overflow-hidden animate-in fade-in zoom-in duration-1000">

                {/* Header */}
                <div className="flex justify-between items-start mb-12 border-b border-white/5 pb-6">
                    <div>
                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2">Activo Analizado</div>
                        <div className="text-xl text-white font-mono">@{analysis.username}</div>
                    </div>
                    <div>
                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-2 text-right">Estado</div>
                        <div className="text-xs text-[#d4af37] font-mono border border-[#d4af37]/30 px-2 py-1 bg-[#d4af37]/5">PRELIMINAR</div>
                    </div>
                </div>

                {/* The Visualization: Asymmetry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">

                    {/* Visual Void Chart */}
                    <div className="relative aspect-square max-w-[200px] mx-auto">
                        {/* Circle 1: Projection (Outward) */}
                        <div className="absolute inset-0 border border-slate-700/50 rounded-full flex items-center justify-center">
                            <span className="text-[9px] text-slate-600 font-mono uppercase -mt-24 bg-[#02040a] px-2">Proyección</span>
                        </div>

                        {/* Circle 2: Absorption (Actual) - Smaller to show gap */}
                        <div className="absolute inset-8 border-2 border-white rounded-full flex items-center justify-center bg-white/5">
                            <span className="text-[9px] text-white font-mono uppercase bg-[#02040a] px-2">Absorción</span>
                        </div>

                        {/* The Gap (Lucro Cesante) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-red-900/40 rotate-45" />
                        <div className="absolute top-0 right-0 p-2 text-right">
                            <div className="text-[9px] text-red-500/70 font-mono uppercase">Vasto Estructural</div>
                        </div>
                    </div>

                    {/* Clinical Copy */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-serif italic text-slate-200">
                            Asimetría Detectada
                        </h3>
                        <p className="text-xs font-mono text-slate-400 leading-relaxed text-justify">
                            El sistema detecta una disparidad entre la capacidad de emisión de autoridad de la cuenta y su infraestructura de conversión actual. Existe un volumen de capital reputacional no capitalizado ("Lucro Cesante") visible en la brecha estructural.
                        </p>

                        <div className="pt-4">
                            <button
                                onClick={() => setStep(SystemStep.BUDGET_ASSESSMENT)}
                                className="flex items-center gap-4 text-xs font-mono text-[#d4af37] hover:text-white transition-colors group"
                            >
                                <span className="border-b border-[#d4af37]/30 group-hover:border-white">VALIDAR CRITERIO TÉCNICO</span>
                                <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // 4. BUDGET (Optional)
    if (step === SystemStep.BUDGET_ASSESSMENT) {
        return (
            <div className="w-full max-w-lg mx-auto bg-[#02040a] border border-white/10 p-8 animate-in slide-in-from-right duration-500">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-8 text-center">
                    Parámetro de Viabilidad
                </h3>
                <p className="text-sm font-serif italic text-white text-center mb-12">
                    Para asignar el protocolo correcto, ¿cuál es el rango de inversión mensual disponible para corrección estructural?
                </p>

                <div className="space-y-3">
                    {[
                        "< $1,000 / mes (Inicial)",
                        "$1,000 - $3,000 / mes (Consolidación)",
                        "> $5,000 / mes (Escala)",
                        "Prefiero no responder"
                    ].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleBudgetSelection(opt)}
                            className="w-full text-left p-4 border border-white/5 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5 transition-all text-xs font-mono text-slate-300"
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <span className="text-[9px] text-slate-600 font-mono uppercase">Pregunta opcional para calibración de ruta.</span>
                </div>
            </div>
        )
    }

    // 5. PROTOCOL (Routing)
    if (step === SystemStep.PROTOCOL_SELECTION && analysis) {
        const isClosed = analysis.routing_target === 'WAITLIST' || analysis.routing_target === 'BLOCK';

        return (
            <div className="w-full max-w-2xl mx-auto bg-[#02040a] border border-white/10 p-10 relative animate-in fade-in duration-700">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                    <Shield className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        Protocolo Asignado: {analysis.ux.title}
                    </span>
                </div>

                {/* Core Narrative */}
                <div className="space-y-6 mb-12">
                    <p className="text-sm font-serif text-slate-200 italic leading-loose">
                        "{analysis.ux.message}"
                    </p>
                    <div className="p-4 bg-slate-900/30 border-l-2 border-[#d4af37]">
                        <p className="text-xs font-mono text-slate-400">
                            Ruta sugerida: <span className="text-white">{analysis.ux.roadmap.foundation}</span>
                        </p>
                    </div>
                </div>

                {/* Human Signature */}
                <div className="flex items-end justify-between mb-12">
                    <div className="space-y-1">
                        <div className="text-xs font-bold text-white font-mono">Vortex</div>
                        <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Chief Intelligence Officer</div>
                    </div>
                    <Fingerprint className="w-8 h-8 text-white/10" />
                </div>

                {/* Primary Action */}
                <Button
                    onClick={handleFinalAction}
                    className="w-full bg-[#d4af37] text-black hover:bg-white rounded-none uppercase tracking-[0.2em] font-mono text-xs py-6 mb-6"
                >
                    {analysis.routing_target === 'APPLICATION' ? "INICIAR SOLICITUD DE ACCESO" : "ACCEDER A PROTOCOLO"}
                </Button>

                {/* Disclaimer */}
                <div className="text-center space-y-2">
                    <p className="text-[9px] text-slate-600 font-mono uppercase">
                        Este análisis preliminar será revisado personalmente por el equipo de inteligencia.
                    </p>
                    <p className="text-[9px] text-slate-700 font-mono uppercase">
                        Slots operativos: 5/5 (Limitado)
                    </p>
                </div>

            </div>
        )
    }

    return null
}
