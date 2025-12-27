"use client"

import { useState, useEffect, useRef } from "react"
import { Globe, ShieldCheck, Lock, Terminal } from "lucide-react"
import AuditTrace from "./audit-trace"

// --- TYPES ---

interface IntentData {
    nature?: string;
    market?: string;
    audience?: string;
    ambition?: string;
}

interface DiagnosisData {
    asset_classification: { subtype: string };
    problems: { critical: { code: string }[] };
    intervention_decision: any;
    intervention_risk: string;
}

// --- CONSTANTS ---

const LANG_TEXT = {
    EN: {
        ingest: "INGESTING SIGNALS",
        session_locked: "SESSION LOCKED · ACQUIRING PUBLIC SIGNALS",
        bio_fragment: "BIO FRAGMENT DETECTED",
        signal_confirmed: "SIGNAL CONFIRMED · DATA LOCKED",
        deep_analysis: "DEEP ANALYSIS",
        cross_layer: "CROSS-LAYER CORRELATION IN PROGRESS",
        asymmetry: "STRUCTURAL ASYMMETRY DETECTED",
        inertia: "INERTIA CALCULATED",
        sentence_header: "TECHNICAL SENTENCE",
        compliance: "DATA SOURCE CERTIFICATION",
        public_data: "Public Signal Analysis Only",
        meta_compliance: "Meta Platform Compliance",
        cta_start: "INITIATE SEQUENCE",
        input_placeholder: "ENTER ASSET ID",
        risk: "INTERVENTION RISK",
        detail: "TECHNICAL DETAIL"

    },
    ES: {
        ingest: "INGESTA DE SEÑALES",
        session_locked: "SESIÓN BLOQUEADA · ADQUIRIENDO SEÑALES PÚBLICAS",
        bio_fragment: "FRAGMENTO BIO DETECTADO",
        signal_confirmed: "SEÑAL CONFIRMADA · DATOS ASEGURADOS",
        deep_analysis: "ANÁLISIS PROFUNDO",
        cross_layer: "CORRELACIÓN ENTRE CAPAS EN PROGRESO",
        asymmetry: "ASIMETRÍA ESTRUCTURAL DETECTADA",
        inertia: "INERCIA CALCULADA",
        sentence_header: "SENTENCIA TÉCNICA",
        compliance: "CERTIFICACIÓN DE ORIGEN",
        public_data: "Análisis de Señales Públicas",
        meta_compliance: "Cumplimiento Plataforma Meta",
        cta_start: "INICIAR SECUENCIA",
        input_placeholder: "INGRESAR ID ACTIVO",
        risk: "RIESGO DE INTERVENCIÓN",
        detail: "DETALLE TÉCNICO"
    },
    PT: {
        ingest: "INGESTÃO DE SINAIS",
        session_locked: "SESSÃO BLOQUEADA · ADQUIRINDO SINAIS PÚBLICOS",
        bio_fragment: "FRAGMENTO DE BIO DETECTADO",
        signal_confirmed: "SINAL CONFIRMADO · DADOS ASSEGURADOS",
        deep_analysis: "ANÁLISE PROFUNDA",
        cross_layer: "CORRELAÇÃO ENTRE CAMADAS EM PROGRESSO",
        asymmetry: "ASSIMETRIA ESTRUTURAL DETECTADA",
        inertia: "INÉRCIA CALCULADA",
        sentence_header: "SENTENÇA TÉCNICA",
        compliance: "CERTIFICAÇÃO DE ORIGEM",
        public_data: "Análise de Sinais Públicos",
        meta_compliance: "Conformidade Plataforma Meta",
        cta_start: "INICIAR SEQUÊNCIA",
        input_placeholder: "INSERIR ID ATIVO",
        risk: "RISCO DE INTERVENÇÃO",
        detail: "DETALHE TÉCNICO"
    }
}

// --- STATES ---
enum OperationalState {
    IDLE = 0,
    INGEST = 1,          // 3-4s silence
    VALIDATION = 2,      // Real fragments
    CALIBRATION = 3,     // (Legacy Layer 0 - kept for flow logic but styled industrially)
    DEEP_ANALYSIS = 4,   // 8-12s silence
    REVELATION = 5,      // Asymmetry / Inertia
    SENTENCE = 6         // Final Phase 40 Output
}

import { IntentDeclaration } from "@/components/protocol-calibration";
import { OperatorContext } from "@/app/lib/forensic/intelligence";

export default function SmartGrowthConsultant({ initialHandle, initialIntent, initialLang, initialContext }: { initialHandle?: string, initialIntent?: IntentDeclaration, initialLang?: 'EN' | 'ES' | 'PT', initialContext?: OperatorContext }) {
    const [state, setState] = useState<OperationalState>(OperationalState.IDLE)
    const [handle, setHandle] = useState(initialHandle || "")
    const [lang, setLang] = useState<'EN' | 'ES' | 'PT'>(initialLang || 'EN')
    const [showAudit, setShowAudit] = useState(false)

    // Data
    const [profile, setProfile] = useState<{ username: string, img: string, bio: string } | null>(null)
    const [backendUX, setBackendUX] = useState<{ title: string, message: string, cta: string } | null>(null)
    const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null)



    // Timers & Logic
    const [revelationStep, setRevelationStep] = useState(0) // 0: Asymmetry, 1: Inertia
    const [calibrationStep, setCalibrationStep] = useState(0)
    const [intent, setIntent] = useState<any>(initialIntent || {})
    const [operatorContext, setOperatorContext] = useState<OperatorContext | undefined>(initialContext)

    const txt = LANG_TEXT[lang]

    // --- EFFECT: AUTO START ---
    useEffect(() => {
        if (initialHandle && state === OperationalState.IDLE) {
            initiateSequence(initialHandle);
        }
    }, [initialHandle]);

    // --- ACTIONS ---

    const initiateSequence = async (overrideHandle?: string) => {
        const target = overrideHandle || handle;
        if (!target) return

        setState(OperationalState.INGEST)

        // 1. Ingest (Simulated Silence 3.5s + Fetch)
        try {
            const res = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    handle: target.trim(),
                    intent: intent,
                    operatorContext: operatorContext
                })
            })
            const data = await res.json()
            if (data.status === 'success') {
                setProfile({ username: data.username, img: data.profilePicUrl, bio: data.biography })
                // Wait for visual timing
                setTimeout(() => setState(OperationalState.VALIDATION), 3500)
            } else {
                setState(OperationalState.IDLE)
            }
        } catch (e) {
            setState(OperationalState.IDLE)
        }
    }

    const runDeepAnalysis = async () => {
        setState(OperationalState.DEEP_ANALYSIS)

        fetch('/api/forensic/instagram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ handle, intent })
        }).then(res => res.json()).then(data => {
            if (data._forensic_diagnosis) {
                setDiagnosis(data._forensic_diagnosis)
                setBackendUX(data.ux)

                // Enforce 10s Deep Analysis Silence
                setTimeout(() => {
                    setState(OperationalState.REVELATION)
                    setTimeout(() => setRevelationStep(1), 5000)
                    setTimeout(() => setState(OperationalState.SENTENCE), 8000)
                }, 10000)
            }
        })
    }

    const confirmValidation = () => {
        if (initialIntent) {
            runDeepAnalysis()
        } else {
            setState(OperationalState.CALIBRATION)
        }
    }

    const handleCalibration = (key: string, val: string) => {
        const next = { ...intent, [key]: val }
        setIntent(next)
        if (calibrationStep < 3) {
            setCalibrationStep(prev => prev + 1)
        } else {
            runDeepAnalysis()
        }
    }

    // --- RENDERERS ---

    const Header = ({ status }: { status: string }) => (
        <div className="w-full border-b border-white/10 p-4 flex justify-between items-center bg-[#0B0E11] sticky top-0 z-50">
            <div className="flex flex-col">
                <span className="text-[10px] text-[#9AA0A6] font-mono tracking-widest">TDT ANALYZER</span>
                <span className="text-[10px] text-[#1877F2] font-mono tracking-widest uppercase animate-pulse">STATUS: {status}</span>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={() => setLang(l => l === 'EN' ? 'ES' : l === 'ES' ? 'PT' : 'EN')} className="flex items-center gap-2 text-[#9AA0A6] hover:text-white transition-colors">
                    <Globe className="w-3 h-3" />
                    <span className="text-[10px] font-mono">{lang}</span>
                </button>
            </div>
        </div>
    )

    const Footer = ({ msg }: { msg: string }) => (
        <div className="w-full border-t border-white/10 p-4 bg-[#0B0E11] fixed bottom-0 left-0 flex justify-between items-center z-50">
            <span className="text-[10px] text-[#9AA0A6] font-mono tracking-widest uppercase flex items-center gap-2">
                <Lock className="w-3 h-3" /> {msg}
            </span>
            <div className="flex items-center gap-4 text-[10px] text-[#9AA0A6]">
                <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Instagram Public Graph</div>
            </div>
        </div>
    )

    // --- VIEWS ---

    // AUDIT TRACE OVERLAY
    if (showAudit && diagnosis && intent && backendUX) {
        return (
            <div className="fixed inset-0 z-[100] bg-[#0B0E11] p-4 md:p-8 overflow-y-auto animate-in slide-in-from-bottom-10">
                <div className="max-w-3xl mx-auto bg-white text-black p-8 md:p-12 font-mono shadow-2xl relative">
                    <button onClick={() => setShowAudit(false)} className="absolute top-4 right-4 text-xs font-bold uppercase hover:bg-black hover:text-white px-4 py-2 border border-black transition-colors">
                        CLOSE AUDIT
                    </button>

                    {/* HEADER */}
                    <div className="border-b-2 border-black pb-8 mb-8 flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tighter">TECHNICAL AUDIT RECORD</h1>
                            <div className="text-xs uppercase mt-2 text-slate-600">
                                CLASSIFICATION REPORT // PHASE 46 EXPORT
                            </div>
                        </div>
                        <div className="text-right text-[10px] uppercase leading-relaxed">
                            SESSION: {sessionId}<br />
                            TIME: {timestamp}<br />
                            ENGINE: v43.1.0<br />
                            LANG: {lang}
                        </div>
                    </div>

                    {/* CONTEXT */}
                    <div className="grid grid-cols-2 gap-8 mb-8 text-xs border-b border-slate-200 pb-8">
                        <div>
                            <h3 className="font-bold uppercase mb-4 border-b border-black inline-block">DECLARED CONTEXT (L0)</h3>
                            <ul className="space-y-2">
                                <li className="flex justify-between border-b border-dashed border-slate-300 pb-1"><span>NATURE:</span> <span>{intent.nature}</span></li>
                                <li className="flex justify-between border-b border-dashed border-slate-300 pb-1"><span>MARKET:</span> <span>{intent.market}</span></li>
                                <li className="flex justify-between border-b border-dashed border-slate-300 pb-1"><span>AUDIENCE:</span> <span>{intent.audience}</span></li>
                                <li className="flex justify-between border-b border-dashed border-slate-300 pb-1"><span>AMBITION:</span> <span>{intent.ambition}</span></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold uppercase mb-4 border-b border-black inline-block">ASSET IDENTIFICATION</h3>
                            <ul className="space-y-2">
                                <li className="flex justify-between border-b border-dashed border-slate-300 pb-1"><span>HANDLE:</span> <span>{handle.toUpperCase()}</span></li>
                                <li className="flex justify-between border-b border-dashed border-slate-300 pb-1"><span>SUBTYPE:</span> <span>{diagnosis.asset_classification.subtype}</span></li>
                                <li className="flex justify-between border-b border-dashed border-slate-300 pb-1"><span>RISK FACTOR:</span> <span>{diagnosis.intervention_risk.toUpperCase()}</span></li>
                                <li className="flex justify-between border-b border-dashed border-slate-300 pb-1"><span>DECISION:</span> <span>{backendUX.title.split(':')[0]}</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* TECHNICAL FINDINGS */}
                    <div className="mb-12">
                        <h3 className="font-bold uppercase mb-4 border-b border-black inline-block">TECHNICAL DIAGNOSIS</h3>
                        <div className="bg-slate-50 p-6 border-l-4 border-black mb-4">
                            <p className="text-sm leading-relaxed whitespace-pre-line">
                                {backendUX.message}
                            </p>
                        </div>
                        <div className="text-[10px] uppercase text-slate-500">
                            CRITICAL FLAGS: {diagnosis.problems.critical.map(p => p.code).join(', ') || "NONE"}
                        </div>
                    </div>

                    {/* DISCLAIMER */}
                    <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-8 text-justify uppercase">
                        SCOPE NOTE: This document reflects a technical analysis based on public signals available at the time of ingestion.
                        It does not constitute a commercial recommendation, financial guarantee, or binding consulting agreement.
                        The "Decision" field indicates system eligibility only.
                    </div>
                </div>
            </div>
        )
    }

    if (state === OperationalState.IDLE) {
        return (
            <div className="min-h-screen bg-[#0B0E11] text-[#E6E8EB] font-sans flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-lg space-y-12">
                    <div className="space-y-2 text-center">
                        <div className="w-12 h-12 bg-[#1877F2]/10 rounded-none mx-auto flex items-center justify-center border border-[#1877F2]/30 mb-6">
                            <Terminal className="w-6 h-6 text-[#1877F2]" />
                        </div>
                        <h1 className="text-xl tracking-[0.2em] font-mono font-bold">TDT ANALYZER</h1>
                        <p className="text-[10px] text-[#9AA0A6] font-mono uppercase tracking-widest">INDUSTRIAL AUDIT PROTOCOL v3.0</p>
                    </div>

                    <div className="space-y-4">
                        <input
                            value={handle}
                            onChange={e => setHandle(e.target.value)}
                            placeholder={txt.input_placeholder}
                            className="w-full bg-[#111418] border border-white/10 text-center py-4 text-sm font-mono tracking-widest focus:border-[#1877F2] focus:ring-0 outline-none text-[#E6E8EB] placeholder-[#9AA0A6]/30 uppercase"
                        />
                        <button
                            onClick={initiateSequence}
                            disabled={!handle}
                            className="w-full bg-[#E6E8EB] hover:bg-white text-black py-4 text-xs font-mono font-bold tracking-[0.2em] uppercase disabled:opacity-50 transition-all"
                        >
                            {txt.cta_start}
                        </button>
                    </div>

                    <div className="border-t border-white/5 pt-8">
                        <p className="text-[10px] text-[#9AA0A6] font-mono uppercase tracking-widest mb-4">{txt.compliance}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-[10px] text-[#5f6368] font-mono">
                                <div className="w-3 h-3 border border-[#5f6368] rounded-sm" /> {txt.public_data}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-[#5f6368] font-mono">
                                <div className="w-3 h-3 border border-[#5f6368] rounded-full" /> {txt.meta_compliance}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (state === OperationalState.INGEST) {
        return (
            <div className="min-h-screen bg-[#0B0E11] flex flex-col">
                <Header status={txt.ingest} />
                <div className="flex-1" /> {/* Void */}
                <Footer msg={txt.session_locked} />
            </div>
        )
    }

    if (state === OperationalState.VALIDATION && profile) {
        return (
            <div className="min-h-screen bg-[#0B0E11] flex flex-col">
                <Header status="VALIDATION REQUIRED" />
                <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-1000">
                    <div className="w-24 h-24 rounded-full border-2 border-[#1877F2] p-1">
                        <img src={`https://wsrv.nl/?url=${encodeURIComponent(profile.img)}`} className="w-full h-full rounded-full grayscale hover:grayscale-0 transition-all" />
                    </div>
                    <div className="space-y-4 max-w-md w-full font-mono text-xs">
                        <div className="border-l-2 border-[#1877F2] pl-4 py-1">
                            <span className="text-[#1877F2] uppercase tracking-widest text-[10px] block mb-1">TARGET ID</span>
                            <span className="text-[#E6E8EB] tracking-widest text-lg">{profile.username}</span>
                        </div>
                        {profile.bio && (
                            <div className="border-l-2 border-white/20 pl-4 py-1 animate-in slide-in-from-left-4 duration-700 delay-300 fill-mode-forwards opacity-0" style={{ animationDelay: '0.3s' }}>
                                <span className="text-[#9AA0A6] uppercase tracking-widest text-[10px] block mb-1">{txt.bio_fragment}</span>
                                <span className="text-[#E6E8EB] italic">"{profile.bio.slice(0, 100)}..."</span>
                            </div>
                        )}
                        <button onClick={confirmValidation} className="w-full mt-8 bg-[#1877F2] hover:bg-[#1866D1] text-white py-3 font-mono text-xs font-bold tracking-[0.2em] uppercase">
                            CONFIRM IDENTITY
                        </button>
                    </div>
                </div>
                <Footer msg={txt.signal_confirmed} />
            </div>
        )
    }

    if (state === OperationalState.CALIBRATION) {
        const STEPS = [
            { key: 'nature', label: 'ASSET NATURE', opts: ['MARCA_PERSONAL', 'MARCA_COMERCIAL', 'EVENTO_PROYECTO', 'ENTIDAD'] },
            { key: 'market', label: 'TARGET MARKET', opts: ['NORTEAMERICA', 'LATAM', 'EUROPA', 'ASIA', 'GLOBAL'] },
            { key: 'audience', label: 'AUDIENCE TYPE', opts: ['B2C', 'B2B', 'B2G', 'MIXTA'] },
            { key: 'ambition', label: 'OPERATIONAL AMBITION', opts: ['SOBREVIVENCIA', 'COMPETENCIA', 'LIDERAZGO', 'EXPANSION'] }
        ]
        const curr = STEPS[calibrationStep]

        return (
            <div className="min-h-screen bg-[#0B0E11] flex flex-col">
                <Header status={`CALIBRATION ${calibrationStep + 1}/4`} />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-md space-y-8 animate-in fade-in">
                        <h2 className="text-[#E6E8EB] font-mono text-lg tracking-[0.1em] uppercase border-b border-white/10 pb-4">{curr.label}</h2>
                        <div className="grid gap-2">
                            {curr.opts.map(opt => (
                                <button key={opt} onClick={() => handleCalibration(curr.key, opt)} className="text-left font-mono text-xs text-[#9AA0A6] hover:text-[#E6E8EB] hover:bg-white/5 p-4 border border-white/10 hover:border-[#1877F2] transition-all uppercase tracking-widest">
                                    [ {opt.replace(/_/g, " ")} ]
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (state === OperationalState.DEEP_ANALYSIS) {
        return (
            <div className="min-h-screen bg-[#0B0E11] flex flex-col cursor-wait">
                <Header status={txt.deep_analysis} />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-[#1877F2] font-mono uppercase tracking-[0.3em] blink animate-pulse">
                        {txt.cross_layer}
                    </span>
                </div>
                <Footer msg="PROCESSING..." />
            </div>
        )
    }

    if (state === OperationalState.REVELATION) {
        return (
            <div className="min-h-screen bg-[#0B0E11] flex flex-col">
                <Header status="DIAGNOSIS COMPLETE" />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
                    {revelationStep === 0 && (
                        <h1 className="text-2xl md:text-4xl text-[#E6E8EB] font-mono tracking-tighter uppercase animate-in zoom-in-90 duration-500">
                            {txt.asymmetry}
                        </h1>
                    )}
                    {revelationStep === 1 && (
                        <h1 className="text-2xl md:text-4xl text-[#9AA0A6] font-mono tracking-tighter uppercase animate-in slide-in-from-bottom-8 duration-500">
                            {txt.inertia}
                        </h1>
                    )}
                </div>
            </div>
        )
    }

    if (state === OperationalState.SENTENCE && backendUX && diagnosis) {
        const closure = (backendUX as any)?.closure || {
            status_label: backendUX.title,
            determinant: "ANALYSIS COMPLETED",
            consequence: backendUX.message,
            action_label: backendUX.cta
        };

        return (
            <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="w-full max-w-2xl space-y-12 animate-in fade-in duration-1000">

                    {/* BLOCK 1: FINAL ASSET STATUS */}
                    <div className="space-y-4 border-l-2 border-[#d4af37] pl-6">
                        <span className="block text-[10px] text-gray-500 tracking-[0.3em] uppercase">FINAL ASSET STATUS</span>
                        <h1 className="text-2xl md:text-4xl text-white font-mono font-bold tracking-tight uppercase leading-tight">
                            {closure.status_label}
                        </h1>
                    </div>

                    {/* BLOCK 2: PRIMARY DETERMINANT */}
                    <div className="space-y-2 pl-6 border-l border-white/10">
                        <span className="block text-[10px] text-[#1877F2] tracking-[0.3em] uppercase">PRIMARY DETERMINANT</span>
                        <p className="text-sm md:text-base text-gray-300 font-mono uppercase tracking-wide">
                            {closure.determinant}
                        </p>
                    </div>

                    {/* BLOCK 3: OPERATIONAL CONSEQUENCE */}
                    <div className="space-y-2 pl-6 border-l border-white/10">
                        <span className="block text-[10px] text-red-500 tracking-[0.3em] uppercase">OPERATIONAL CONSEQUENCE</span>
                        <p className="text-sm md:text-base text-gray-400 font-mono italic">
                            "{closure.consequence}"
                        </p>
                    </div>

                    {/* BLOCK 4: AVAILABLE ACTION */}
                    <div className="pt-8 space-y-6">
                        <button className="w-full bg-white hover:bg-gray-200 text-black py-5 font-mono text-xs font-bold tracking-[0.25em] uppercase transition-all" onClick={() => { }}>
                            [ {closure.action_label} ]
                        </button>

                        {/* BLOCK 5: AUDIT ACCESS */}
                        <div className="flex justify-center">
                            <button onClick={() => setShowAudit(true)} className="text-[#5f6368] hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                <Terminal className="w-3 h-3" />
                                VIEW AUDIT TRACE
                            </button>
                        </div>
                    </div>

                    {/* BLOCK 5: FINALITY SEAL */}
                    <div className="text-center pt-8 opacity-40">
                        <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em]">
                            THIS DIAGNOSIS IS FINAL FOR THE CURRENT SESSION.<br />
                            RE-EVALUATION LOCKED FOR 24 HOURS.
                        </p>
                    </div>

                </div>
            </div>
        )
    }

    return (
        <>
            {showAudit && diagnosis && (
                <AuditTrace
                    data={diagnosis}
                    intent={intent}
                    onClose={() => setShowAudit(false)}
                />
            )}
        </>
    )
}
