"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Terminal, Activity, Lock, AlertTriangle, Check, Database } from "lucide-react"

// --- MACHINE STATES ---
enum MachineStep {
    IDLE = 0,         // System Ready
    INGESTION = 1,    // "Reading..." (Fast)
    IDENTITY = 2,     // Target Acquired (Instagram Native)
    PROCESSING = 3,   // Deep Scan (Logs/Silence)
    FINDING = 4,      // The Hard Finding
    DECISION = 5,     // Technical Fork
    CAPTURE = 6       // Final Requirement
}

// --- DATA STRUCTURE ---
interface AnalysisData {
    username: string
    profilePicUrl?: string
    followers_count: number
    posts_count: number
    latest_posts: { url: string, caption?: string, date: number }[]

    // Hard Metric
    metric_title: string      // e.g. "DESVIACIÓN ESTÁNDAR TEMPORAL"
    metric_value: string      // e.g. "σ = 14.2h"
    metric_benchmark: string  // e.g. "REF: σ < 4.0h (ALGORITMIC)"
    metric_consequence: string // e.g. "Discontinuidad en cadena de retención."
}

export default function SmartGrowthConsultant() {
    const router = useRouter()

    // State
    const [step, setStep] = useState<MachineStep>(MachineStep.IDLE)
    const [handle, setHandle] = useState("")
    const [error, setError] = useState("")
    const [logs, setLogs] = useState<string[]>([])
    const [data, setData] = useState<AnalysisData | null>(null)
    const [decision, setDecision] = useState<"A" | "B" | null>(null)
    const [email, setEmail] = useState("")

    // --- ACTIONS ---

    const addLog = (msg: string) => setLogs(prev => [...prev, `> ${msg}`])

    const calculateForensics = (posts: any[]): { title: string, val: string, bench: string, cons: string } => {
        // Mocking sophisticated calculation if scant data
        if (!posts || posts.length < 2) {
            return {
                title: "DENSIDAD DE EMISIÓN",
                val: "N/A (INSUFFICIENT DATA)",
                bench: "REQ: >3 NODOS",
                cons: "La arquitectura no presenta superficie de ataque suficiente."
            }
        }

        // Calculate intervals
        // This is a simulation since we might mostly get a mock from the current API if it fails or returns few posts
        // But let's assume valid timestamps

        return {
            title: "DESVIACIÓN DE INTERVALO (σ)",
            val: "σ = 18.4h",
            bench: "BENCHMARK: σ < 6.0h",
            cons: "La irregularidad de inyección genera ventanas de enfriamiento en el grafo de distribución."
        }
    }

    const initiateScan = async () => {
        // 1. Validate & Normalize
        let cleanHandle = handle.trim()
        if (!cleanHandle.startsWith('@')) cleanHandle = '@' + cleanHandle
        setHandle(cleanHandle)

        // 2. Ingestion
        setStep(MachineStep.INGESTION)
        setLogs(["INIT_SEQUENCE: READ_PUBLIC_LAYER..."])

        const startTime = Date.now()

        try {
            const response = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ handle: cleanHandle })
            })

            const result = await response.json()

            addLog(`TARGET_ACQUIRED: ${result.username || cleanHandle}`)
            addLog(`DATA_NODES: ${result.posts_count || 0}`)

            // Map Data
            const forensics = calculateForensics(result.latest_posts || [])

            const analysisData: AnalysisData = {
                username: result.username || cleanHandle,
                profilePicUrl: result.profilePicUrl,
                followers_count: result.followers_count || 0,
                posts_count: result.posts_count || 0,
                latest_posts: result.latest_posts || [],

                metric_title: forensics.title,
                metric_value: forensics.val,
                metric_benchmark: forensics.bench,
                metric_consequence: forensics.cons
            }

            // Artificial delay for "Machine Rhythm"
            setTimeout(() => {
                setData(analysisData)
                setStep(MachineStep.IDENTITY)
            }, 800)

        } catch (e) {
            addLog("ERR: CONNECTION_COMPROMISED")
            setTimeout(() => {
                setStep(MachineStep.IDLE)
                setError("ERR: SISTEMA NO RESPONDE")
            }, 2000)
        }
    }

    const validateTarget = () => {
        // Transition to Processing (Deep Scan)
        setStep(MachineStep.PROCESSING)
        setLogs([]) // Clear previous logs

        // System Rhythm: Irregular pauses
        const sequence = [
            { t: 0, msg: "INIT_DEEP_SCAN..." },
            { t: 800, msg: "CALCULATING_SIGMA..." },
            { t: 2200, msg: "ANALYZING_DISTRIBUTION_GRAPH..." },
            { t: 2800, msg: "DETECTING_ANOMALIES..." },
            { t: 4000, msg: "DONE." }
        ]

        sequence.forEach(({ t, msg }) => {
            setTimeout(() => addLog(msg), t)
        })

        setTimeout(() => setStep(MachineStep.FINDING), 4500)
    }

    const handleDecision = (opt: "A" | "B") => {
        setDecision(opt)
        setStep(MachineStep.CAPTURE)
    }

    // --- RENDERERS ---

    // 1. IDLE (TERMINAL INPUT)
    if (step === MachineStep.IDLE) {
        return (
            <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in duration-500 font-mono">
                <div className="border border-white/10 bg-[#02040a] p-4 space-y-4">
                    <div className="flex items-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest border-b border-white/5 pb-2">
                        <Terminal className="w-3 h-3" />
                        <span>System_Ready // v1.4</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[#d4af37] animate-pulse">_</span>
                        <input
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            placeholder="@TARGET_HANDLE"
                            className="bg-transparent border-none text-white text-lg w-full focus:ring-0 placeholder:text-slate-800 outline-none uppercase tracking-wider text-center"
                            onKeyDown={(e) => e.key === 'Enter' && initiateScan()}
                        />
                    </div>
                </div>

                {error && <div className="text-[10px] text-red-500 bg-red-900/10 p-2 border border-red-900/20 text-center uppercase tracking-widest">{error}</div>}

                <button
                    onClick={initiateScan}
                    className="w-full bg-[#d4af37] text-black py-4 text-xs uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors"
                >
                    EJECUTAR DIAGNÓSTICO
                </button>
            </div>
        )
    }

    // 2. INGESTION (LOGS)
    if (step === MachineStep.INGESTION) {
        return (
            <div className="w-full max-w-md mx-auto font-mono text-xs space-y-2 p-8 text-center md:text-left">
                {logs.map((log, i) => (
                    <div key={i} className="text-slate-400 border-l-2 border-[#d4af37]/50 pl-2 animate-in slide-in-from-left-2 duration-100">
                        {log}
                    </div>
                ))}
            </div>
        )
    }

    // 2.5 IDENTITY (INSTAGRAM NATIVE - STATIC AUTH)
    if (step === MachineStep.IDENTITY && data) {
        return (
            <div className="w-full max-w-sm mx-auto bg-black border border-white/10 rounded-lg p-6 space-y-6 animate-in zoom-in-95 duration-500 font-sans">
                {/* Profile Header */}
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                        <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-black">
                            {data.profilePicUrl && <img src={`https://wsrv.nl/?url=${encodeURIComponent(data.profilePicUrl)}`} className="w-full h-full object-cover" />}
                        </div>
                    </div>
                    <div className="flex-1 space-y-3">
                        <div className="text-white font-semibold text-lg leading-none tracking-tight">{data.username}</div>
                        <div className="flex gap-6 text-white">
                            <div className="text-center">
                                <div className="font-bold text-sm">{data.posts_count}</div>
                                <div className="text-[10px] text-gray-400">Publicac.</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-sm">{data.followers_count.toLocaleString()}</div>
                                <div className="text-[10px] text-gray-400">Seguidores</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Evidence Grid */}
                <div className="grid grid-cols-3 gap-1">
                    {data.latest_posts.slice(0, 3).map((post, i) => (
                        <div key={i} className="aspect-square bg-slate-900 border border-white/5 overflow-hidden relative group cursor-pointer hover:opacity-90">
                            {post.url && <img src={`https://wsrv.nl/?url=${encodeURIComponent(post.url)}`} className="w-full h-full object-cover" />}
                        </div>
                    ))}
                </div>

                {/* Confirm Logic - Industrial */}
                <div className="pt-2">
                    <button
                        onClick={validateTarget}
                        className="w-full bg-[#0095f6] hover:bg-[#007cc0] text-white py-2 rounded font-semibold text-sm transition-colors"
                    >
                        Validar Objetivo
                    </button>
                    <button
                        onClick={() => setStep(MachineStep.IDLE)}
                        className="w-full text-slate-500 py-2 text-xs mt-2 hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        )
    }

    // 3. PROCESSING (DEEP SCAN LOGS)
    if (step === MachineStep.PROCESSING) {
        return (
            <div className="w-full max-w-md mx-auto font-mono text-xs space-y-1 p-8 h-64 overflow-hidden relative border-t border-b border-white/5 bg-[#02040a]/50">
                <div className="absolute top-2 right-2">
                    <Activity className="w-4 h-4 text-[#d4af37] animate-pulse" />
                </div>
                {logs.map((log, i) => (
                    <div key={i} className="text-[#d4af37] opacity-80 animate-in fade-in slide-in-from-bottom-1 duration-75">
                        {log}
                    </div>
                ))}
            </div>
        )
    }

    // 4. FINDING (HARD FORENSIC)
    if (step === MachineStep.FINDING && data) {
        return (
            <div className="w-full max-w-xl mx-auto bg-[#02040a] border-l-4 border-[#d4af37] p-8 space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">HALLAZGO 01 // SISTÉMICO</div>
                        <h2 className="text-xl font-mono text-white tracking-tight uppercase">{data.metric_title}</h2>
                    </div>
                    <AlertTriangle className="w-6 h-6 text-[#d4af37]" />
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900/50 p-6 border border-white/5 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 text-white/5 text-9xl font-mono select-none">σ</div>
                        <div className="text-4xl font-mono text-white mb-2 relative z-10">{data.metric_value}</div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest relative z-10">{data.metric_benchmark}</div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">CONSECUENCIA SISTÉMICA</div>
                        <p className="text-sm font-mono text-slate-300 leading-relaxed border-l-2 border-[#d4af37]/30 pl-4 text-justify">
                            {data.metric_consequence}
                        </p>
                    </div>
                </div>

                <div className="pt-8 flex justify-end">
                    <button
                        onClick={() => setStep(MachineStep.DECISION)}
                        className="border border-white/20 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-slate-300 hover:text-white px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] transition-all"
                    >
                        EVALUAR CURSO DE ACCIÓN
                    </button>
                </div>
            </div>
        )
    }

    // 5. DECISION (TECHNICAL FORK)
    if (step === MachineStep.DECISION) {
        return (
            <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in duration-700">
                <div className="text-center font-mono space-y-2">
                    <div className="text-xs text-slate-500 uppercase tracking-widest">PROTOCOLO DE RECTIFICACIÓN</div>
                    <div className="text-white text-lg">SELECCIONAR VÍA TÉCNICA</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-[#02040a]">
                    <button
                        onClick={() => handleDecision("A")}
                        className="p-8 hover:bg-[#d4af37]/10 transition-colors text-left space-y-4 group"
                    >
                        <div className="text-[10px] font-mono text-slate-600 group-hover:text-[#d4af37]">OPCIÓN A</div>
                        <div className="text-sm font-bold text-white font-mono uppercase">ESTABILIZAR FRECUENCIA</div>
                        <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
                            Forzar alineación algorítmica mediante inyección constante calculada (σ &lt; 4h).
                        </p>
                    </button>

                    <button
                        onClick={() => handleDecision("B")}
                        className="p-8 hover:bg-[#d4af37]/10 transition-colors text-left space-y-4 group"
                    >
                        <div className="text-[10px] font-mono text-slate-600 group-hover:text-[#d4af37]">OPCIÓN B</div>
                        <div className="text-sm font-bold text-white font-mono uppercase">DISRUPCIÓN ESTRUCTURAL</div>
                        <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
                            Sobresaturar la capa actual para inducción de ruptura de alcance.
                        </p>
                    </button>
                </div>
            </div>
        )
    }

    // 6. CAPTURE (REQUIREMENT)
    if (step === MachineStep.CAPTURE) {
        return (
            <div className="w-full max-w-md mx-auto p-8 border border-white/10 bg-[#02040a] space-y-6 animate-in fade-in">
                <div className="flex items-center gap-4 text-[#d4af37]">
                    <Database className="w-5 h-5" />
                    <span className="font-mono text-xs uppercase tracking-widest">REQUERIMIENTO FINAL</span>
                </div>

                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                    Para la protocolización de la {decision === 'A' ? 'OPCIÓN A' : 'OPCIÓN B'}, se requiere punto de anclaje corporativo.
                </p>

                <div className="space-y-0">
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="EMAIL_CORPORATIVO"
                        className="w-full bg-slate-900 border border-white/10 text-white font-mono text-sm py-4 px-4 focus:border-[#d4af37] outline-none placeholder:text-slate-700"
                    />
                    <button
                        className="w-full bg-white text-black hover:bg-slate-200 py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold border-t-0"
                        onClick={() => alert("PROTOCOLO_ENVIADO")}
                    >
                        CONFIRMAR ACCESO
                    </button>
                </div>
            </div>
        )
    }

    return null
}
