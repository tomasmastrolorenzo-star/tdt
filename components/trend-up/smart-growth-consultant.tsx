"use client"

import { useState, useEffect } from "react"
import { Terminal, AlertTriangle, Activity } from "lucide-react"

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

interface IntentData {
    nature?: string;
    market?: string;
    audience?: string;
    ambition?: string;
}

// --- SEQUENCER ---
enum VisualStep {
    IDLE = 0,           // Input
    PROCESSING_1 = 1,   // Lookup (Fast)
    IDENTITY = 2,       // Show Profile (Validator)
    CALIBRATION = 3,    // Layer 0 (Intent)
    PROCESSING_2 = 4,   // Deep Scan (Logic + Intent)
    VALIDATION = 5,     // Visual: Fragments
    ASYMMETRY = 6,      // Visual: Asymmetry
    MAPPING = 7,        // Visual: Mapping
    INERTIA = 8,        // Visual: Inertia
    PROCESSING_3 = 9,   // Silence
    SENTENCE = 10       // Final Decision
}

export default function SmartGrowthConsultant() {
    const [step, setStep] = useState<VisualStep>(VisualStep.IDLE)
    const [handle, setHandle] = useState("")
    const [error, setError] = useState("")

    // Data Containers
    const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null)
    const [backendUX, setBackendUX] = useState<{ title: string, message: string, cta: string } | null>(null)
    const [fragments, setFragments] = useState<{ url: string, caption?: string }[]>([])
    const [profile, setProfile] = useState<{ username: string, img: string } | null>(null)

    // Layer 0 State
    const [calibrationStep, setCalibrationStep] = useState<number>(0) // 0:Nature, 1:Market, 2:Audience, 3:Ambition
    const [intent, setIntent] = useState<IntentData>({})

    // --- ACTIONS ---

    // 1. LOOKUP (Screener)
    const performLookup = async () => {
        if (!handle) return
        let cleanHandle = handle.trim()
        if (!cleanHandle.startsWith('@')) cleanHandle = '@' + cleanHandle

        setStep(VisualStep.PROCESSING_1) // Loader

        try {
            // First pass: just valid existence check
            const res = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ handle: cleanHandle }) // No intent sent yet
            })

            if (!res.ok) throw new Error("Connection Refused")
            const data = await res.json()

            setProfile({ username: data.username, img: data.profilePicUrl })
            setStep(VisualStep.IDENTITY)

        } catch (e) {
            setStep(VisualStep.IDLE)
            setError("ERR: ACTIVO NO LOCALIZADO")
        }
    }

    // 2. DEEP SCAN (With Intent)
    const performDeepScan = async () => {
        setStep(VisualStep.PROCESSING_2) // "Deep" processing

        try {
            const res = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    handle,
                    intent // Sending the calibrated intent
                })
            })

            const data = await res.json()
            if (data._forensic_diagnosis) {
                setDiagnosis(data._forensic_diagnosis)
                setBackendUX(data.ux)
                setFragments(data.latest_posts || [])

                // Trigger Visual Sequence
                setTimeout(() => setStep(VisualStep.VALIDATION), 3000)
            } else {
                throw new Error("Invalid Diagnosis")
            }
        } catch (e) {
            setStep(VisualStep.IDLE) // Reset on fail
        }
    }

    // --- CALIBRATION LOGIC ---
    const handleCalibrationSelect = (key: keyof IntentData, value: string) => {
        const newIntent = { ...intent, [key]: value }
        setIntent(newIntent)

        if (calibrationStep < 3) {
            setCalibrationStep(prev => prev + 1)
        } else {
            // Finished Calibration
            setStep(VisualStep.PROCESSING_2)

            setTimeout(() => {
                fetch('/api/forensic/instagram', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ handle, intent: newIntent })
                }).then(res => res.json()).then(data => {
                    if (data._forensic_diagnosis) {
                        setDiagnosis(data._forensic_diagnosis)
                        setBackendUX(data.ux)
                        setFragments(data.latest_posts || [])
                        setTimeout(() => setStep(VisualStep.VALIDATION), 3000)
                    }
                }).catch(() => setStep(VisualStep.IDLE))
            }, 100)
        }
    }


    // --- VISUAL SEQUENCER (AUTO) ---
    useEffect(() => {
        if (step === VisualStep.VALIDATION) setTimeout(() => setStep(VisualStep.ASYMMETRY), 3000)
        if (step === VisualStep.ASYMMETRY) setTimeout(() => setStep(VisualStep.MAPPING), 2500)
        if (step === VisualStep.MAPPING) setTimeout(() => setStep(VisualStep.INERTIA), 2000)
        if (step === VisualStep.INERTIA) setTimeout(() => setStep(VisualStep.PROCESSING_3), 3000)
        if (step === VisualStep.PROCESSING_3) setTimeout(() => setStep(VisualStep.SENTENCE), 3000)
    }, [step])

    // --- VIEWS ---

    // 1. IDLE (Lookup)
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
                            onKeyDown={(e) => e.key === 'Enter' && performLookup()}
                        />
                    </div>
                </div>
                {error && <div className="text-[10px] text-red-500 bg-red-900/10 p-2 border border-red-900/20 text-center uppercase tracking-widest">{error}</div>}
                <button onClick={performLookup} disabled={!handle} className="w-full bg-[#d4af37] disabled:opacity-50 text-black py-4 text-xs uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors">
                    INICIAR SECUENCIA
                </button>
            </div>
        )
    }

    // 2. PROCESSING (Loaders)
    if (step === VisualStep.PROCESSING_1 || step === VisualStep.PROCESSING_2 || step === VisualStep.PROCESSING_3) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="w-1 h-1 bg-[#d4af37] animate-pulse" />
            </div>
        )
    }

    // 3. IDENTITY (Validator)
    if (step === VisualStep.IDENTITY && profile) {
        return (
            <div className="w-full max-w-sm mx-auto bg-black border border-white/10 p-6 space-y-6 animate-in zoom-in-95 duration-500 font-sans text-center">
                <div className="w-24 h-24 mx-auto rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                    <img src={`https://wsrv.nl/?url=${encodeURIComponent(profile.img)}`} className="w-full h-full rounded-full border-2 border-black object-cover" />
                </div>
                <div className="text-white font-bold text-xl">{profile.username}</div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">ACTIVO IDENTIFICADO</div>

                <button onClick={() => setStep(VisualStep.CALIBRATION)} className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-slate-200">
                    INICIAR CALIBRACIÓN
                </button>
            </div>
        )
    }

    // 4. CALIBRATION (Layer 0)
    if (step === VisualStep.CALIBRATION) {
        const STEPS = [
            {
                key: 'nature',
                label: 'NATURALEZA DEL ACTIVO',
                opts: ['MARCA_PERSONAL', 'MARCA_COMERCIAL', 'EVENTO_PROYECTO', 'ENTIDAD_INSTITUCIONAL', 'MEDIO_PUBLICACION']
            },
            {
                key: 'market',
                label: 'MERCADO OBJETIVO',
                opts: ['NORTEAMERICA', 'LATAM', 'EUROPA', 'ASIA_PACIFICO', 'MENA', 'GLOBAL']
            },
            {
                key: 'audience',
                label: 'AUDIENCIA OBJETIVO',
                opts: ['B2C', 'B2B', 'B2G', 'MIXTA']
            },
            {
                key: 'ambition',
                label: 'AMBICIÓN OPERATIVA',
                opts: ['SOBREVIVENCIA', 'COMPETENCIA', 'LIDERAZGO', 'EXPANSION']
            }
        ]

        const current = STEPS[calibrationStep] as any

        return (
            <div className="w-full max-w-md mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500 font-mono">
                <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest border-b border-white/10 pb-4">
                    <span>CALIBRACIÓN DE INTENCIÓN ({calibrationStep + 1}/4)</span>
                    <span className="text-[#d4af37]">REQ. OBLIGATORIO</span>
                </div>

                <div className="space-y-4">
                    <h2 className="text-white text-lg uppercase tracking-tight">{current.label}</h2>
                    <div className="grid grid-cols-1 gap-2">
                        {current.opts.map((opt: string) => (
                            <button
                                key={opt}
                                onClick={() => handleCalibrationSelect(current.key, opt)}
                                className="text-left px-4 py-3 border border-white/10 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-slate-400 hover:text-white transition-all text-xs uppercase tracking-widest"
                            >
                                {opt.replace(/_/g, " ")}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-[10px] text-slate-600 text-center pt-8 border-t border-white/5">
                    SELECCIÓN IRREVERSIBLE. PARÁMETRO ESTRUCTURAL.
                </div>
            </div>
        )
    }

    // 5. VISUAL REVELATION
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

    // 6. FINAL SENTENCE
    if (step === VisualStep.SENTENCE && diagnosis && backendUX) { // Require backendUX
        const decision = diagnosis.intervention_decision;

        return (
            <div className="w-full max-w-xl mx-auto bg-[#02040a] border-t-2 border-[#d4af37] p-8 space-y-8 animate-in slide-in-from-bottom-2 duration-700">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">SENTENCIA TÉCNICA FINAL</div>
                        <h1 className="text-xl font-mono text-white tracking-tight uppercase leading-snug">
                            {backendUX.title}
                        </h1>
                    </div>
                    {decision.complexity_level === 'critica' || decision.complexity_level === 'alta' ?
                        <AlertTriangle className="w-6 h-6 text-red-500" /> :
                        <Activity className="w-6 h-6 text-[#d4af37]" />
                    }
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900/30 p-6 border-l-2 border-white/20">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">DETALLE TÉCNICO</div>
                        <p className="text-xs font-mono text-white leading-relaxed whitespace-pre-line">{backendUX.message}</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono border-t border-white/5 pt-4">
                        <span className="text-slate-600">RIESGO DE INTERVENCIÓN</span>
                        <span className={`${decision.intervention_risk === 'alto' ? 'text-red-500' : 'text-slate-400'} uppercase`}>{decision.intervention_risk}</span>
                    </div>
                </div>

                <div className="pt-8 space-y-4">
                    <button className="w-full bg-white text-black hover:bg-slate-200 py-4 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all" onClick={() => alert("PROTOCOLO_BLOQUEADO_24H")}>
                        {backendUX.cta}
                    </button>
                    <div className="text-center">
                        <span className="text-[10px] text-slate-600 uppercase tracking-widest">ACTIVO EN ESTADO DE DIAGNÓSTICO. DATOS CONSOLIDADOS.</span>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
