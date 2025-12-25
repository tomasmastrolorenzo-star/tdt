"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Activity, Database, Check } from "lucide-react"

// --- MACHINE STATES ---
enum MachineStep {
    IDLE = 0,         // Input State
    SCANNING = 1,     // "Cartografiando..." (0-2s)
    FINDING = 2,      // The Core Finding (2-8s)
    DYNAMICS = 3,     // Explanation
    DECISION = 4,     // Option A / B
    CAPTURE = 5       // Email
}

// --- VISUALIZATION DATA ---
// We will eventually populate this from API
interface AnalysisData {
    username: string
    finding_title: string
    finding_value: string
    finding_evidence: string
    dynamics_text: string
}

export default function SmartGrowthConsultant() {
    const router = useRouter()

    // State
    const [step, setStep] = useState<MachineStep>(MachineStep.IDLE)
    const [handle, setHandle] = useState("")
    const [error, setError] = useState("")
    const [loadingMsg, setLoadingMsg] = useState("")
    const [data, setData] = useState<AnalysisData | null>(null)
    const [decision, setDecision] = useState<"A" | "B" | null>(null)
    const [email, setEmail] = useState("")

    // --- ACTIONS ---

    const initiateScan = async () => {
        // 1. Validate
        if (!handle.startsWith('@')) {
            setError("ERR: FORMATO_INVALIDO // REQUIERE @")
            return
        }
        if (handle.length < 3) {
            setError("ERR: CADENA_INSUFICIENTE")
            return
        }
        setError("")

        // 2. Transition (Fade Out Landing done via parent layout usually, but here we just switch state)
        setStep(MachineStep.SCANNING)
        setLoadingMsg("Cartografiando capas de la arquitectura pública...")

        // 3. Scan Sequence
        // 0-2s: Cartography
        // Parallel: Start Fetch
        const startTime = Date.now()

        try {
            const response = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ handle })
            })

            const result = await response.json()
            // We'll need to adapt `route.ts` to give us specific "Findings" later.
            // For now, let's map what we have or generic fallback.

            // Mocking the "Finding" structure based on current API response or Fallback
            // (Phase 4 requirement: Finding in <10s)

            const findingData: AnalysisData = {
                username: result.username || handle,
                finding_title: "PATRÓN DE EMISIÓN DETECTADO",
                finding_value: result.indicators?.intencion_comercial?.val > 6 ? "ALTA SATURACIÓN DE CTA" : "BAJA FRECUENCIA DE IMPACTO",
                finding_evidence: `Métrica de densidad: ${result.indicators?.intencion_comercial?.val || 5}/10`,
                dynamics_text: "Esta configuración genera ventanas de fricción que reducen la eficiencia de la captura de valor en capas frías."
            }

            // Ensure min 2s delay for "Cartografiando"
            const elapsed = Date.now() - startTime
            const remaining = Math.max(0, 2000 - elapsed)

            setTimeout(() => {
                setData(findingData)
                setStep(MachineStep.FINDING)
            }, remaining)

        } catch (e) {
            console.error(e)
            // Fallback
            setTimeout(() => {
                setData({
                    username: handle,
                    finding_title: "ANOMALÍA DE LECTURA",
                    finding_value: "ARQUITECTURA PRIVADA / RESTRINGIDA",
                    finding_evidence: "No se detectaron nodos públicos",
                    dynamics_text: "La opacidad de la cuenta impide el cálculo de eficiencia de distribución."
                })
                setStep(MachineStep.FINDING)
            }, 2000)
        }
    }

    const nextToDynamics = () => {
        // Auto-transition or manual? 
        // "Phase 5 & 6: Dynamics & Decision"
        // Let's transition after a viewing duration or click? 
        // User said "Mostrar una segunda capa: Relación...". 
        // Let's make it interactive "VER IMPACTO"
        setStep(MachineStep.DYNAMICS)
    }

    const toDecision = () => setStep(MachineStep.DECISION)

    const handleOption = (opt: "A" | "B") => {
        setDecision(opt)
        setStep(MachineStep.CAPTURE)
    }

    // --- RENDERERS ---

    // 1. INPUT (ACTIVATOR)
    if (step === MachineStep.IDLE) {
        return (
            <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d4af37] to-slate-600 rounded-sm blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative bg-[#02040a] border border-white/10 p-2 flex items-center gap-4 rounded-sm">
                        <input
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            placeholder="@usuario"
                            className="bg-transparent border-none text-white font-mono text-xl py-4 w-full focus:ring-0 placeholder:text-slate-800 outline-none text-center tracking-wider"
                            onKeyDown={(e) => e.key === 'Enter' && initiateScan()}
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-[10px] text-red-500 font-mono text-center tracking-widest uppercase animate-pulse">
                        {error}
                    </p>
                )}

                <button
                    onClick={initiateScan}
                    className="w-full bg-[#d4af37] hover:bg-white text-black transition-all duration-300 py-4 font-mono text-xs uppercase tracking-[0.25em] font-bold border border-transparent hover:border-[#d4af37] active:scale-[0.99]"
                >
                    INICIAR DIAGNÓSTICO
                </button>

                <p className="text-[9px] text-slate-600 font-mono text-center uppercase tracking-widest">
                    Acceso al núcleo de inteligencia v1.4
                </p>
            </div>
        )
    }

    // 2. SCANNING (TRANSITION)
    if (step === MachineStep.SCANNING) {
        return (
            <div className="w-full max-w-md mx-auto text-center space-y-6 pt-12">
                <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-t-2 border-[#d4af37] rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-r-2 border-slate-700 rounded-full animate-spin-slow"></div>
                </div>
                <p className="text-xs text-[#d4af37] font-mono uppercase tracking-widest animate-pulse">
                    {loadingMsg}
                </p>
            </div>
        )
    }

    // 3. FINDING (THE CORE)
    if (step === MachineStep.FINDING && data) {
        return (
            <div className="w-full max-w-xl mx-auto bg-[#02040a] border border-white/10 p-8 space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                {/* Header */}
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        Hallazgo Técnico
                    </div>
                    <div className="text-[10px] font-mono text-white uppercase tracking-widest">
                        {data.username}
                    </div>
                </div>

                {/* The Finding */}
                <div className="space-y-2">
                    <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest">{data.finding_title}</h3>
                    <div className="text-2xl md:text-3xl font-serif text-white italic">
                        {data.finding_value}
                    </div>
                    <div className="inline-block bg-slate-900 border border-white/10 px-3 py-1 mt-2">
                        <span className="text-[10px] font-mono text-[#d4af37] uppercase">{data.finding_evidence}</span>
                    </div>
                </div>

                {/* Continue CTA */}
                <div className="pt-4 flex justify-end">
                    <button
                        onClick={nextToDynamics}
                        className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white transition-colors uppercase tracking-widest group"
                    >
                        Analizar Impacto
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        )
    }

    // 4. DYNAMICS (CONSEQUENCE)
    if (step === MachineStep.DYNAMICS && data) {
        return (
            <div className="w-full max-w-xl mx-auto bg-[#02040a] border border-white/10 p-8 space-y-8 animate-in fade-in duration-700 text-left">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">
                    Dinámica Estructural
                </div>

                <p className="text-lg font-serif text-slate-200 leading-relaxed italic">
                    "{data.dynamics_text}"
                </p>

                <div className="pt-8">
                    <button
                        onClick={toDecision}
                        className="w-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black py-4 font-mono text-xs uppercase tracking-[0.2em] transition-all font-bold"
                    >
                        VER OPCIONES TÉCNICAS
                    </button>
                </div>
            </div>
        )
    }

    // 5. DECISION
    if (step === MachineStep.DECISION) {
        return (
            <div className="w-full max-w-xl mx-auto bg-[#02040a] border border-white/10 p-8 space-y-8 animate-in fade-in duration-700">
                <div className="text-center space-y-2">
                    <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Protocolo de Intervención</h3>
                    <p className="text-white font-serif italic text-lg">Seleccione vector de corrección:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => handleOption("A")}
                        className="p-6 border border-white/5 hover:border-[#d4af37] bg-white/5 hover:bg-[#d4af37]/10 transition-all text-left space-y-4 group"
                    >
                        <div className="text-[10px] font-mono text-slate-500 group-hover:text-[#d4af37]">OPCIÓN A</div>
                        <div className="text-sm font-bold text-slate-200 uppercase tracking-wider">Modificar Dinámica</div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">Alterar los patrones de emisión para reducir fricción estructural.</p>
                    </button>

                    <button
                        onClick={() => handleOption("B")}
                        className="p-6 border border-white/5 hover:border-[#d4af37] bg-white/5 hover:bg-[#d4af37]/10 transition-all text-left space-y-4 group"
                    >
                        <div className="text-[10px] font-mono text-slate-500 group-hover:text-[#d4af37]">OPCIÓN B</div>
                        <div className="text-sm font-bold text-slate-200 uppercase tracking-wider">Intensificar Patrón</div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">Maximizar la saturación actual para forzar ruptura de alcance.</p>
                    </button>
                </div>
            </div>
        )
    }

    // 6. CAPTURE
    if (step === MachineStep.CAPTURE) {
        return (
            <div className="w-full max-w-md mx-auto bg-[#02040a] border border-white/10 p-8 space-y-8 animate-in fade-in">
                <div className="text-center space-y-4">
                    <Database className="w-8 h-8 text-[#d4af37] mx-auto opacity-80" />
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Simulación de Impacto</h3>
                    <p className="text-sm border-l-2 border-[#d4af37] pl-4 text-left text-slate-300 font-serif italic">
                        Para procesar la simulación de la {decision === 'A' ? 'Opción A' : 'Opción B'}, se requiere un punto de entrega seguro.
                    </p>
                </div>

                <div className="space-y-4">
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="correo_corporativo@dominio.com"
                        className="w-full bg-slate-900/50 border border-white/10 text-white font-mono text-sm py-4 px-4 focus:border-[#d4af37] outline-none"
                    />
                    <button
                        className="w-full bg-white text-black hover:bg-slate-200 py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-colors"
                        onClick={() => alert("Simulacion enviada (Mock)")}
                    >
                        ENVIAR REPORTE TÉCNICO
                    </button>
                </div>
            </div>
        )
    }

    return null
}
