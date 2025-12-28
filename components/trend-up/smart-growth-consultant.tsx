"use client"

import { useState, useEffect, useRef } from "react"
import { Globe, ShieldCheck, Lock, Terminal, ShieldAlert } from "lucide-react"
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

enum OperationalState {
    IDLE = 'IDLE',
    INGEST = 'INGEST',
    BLACK_HOLE = 'BLACK_HOLE',
    VALIDATION = 'VALIDATION',
    CALIBRATION = 'CALIBRATION',
    REVELATION = 'REVELATION',
    CAPTURE_EMAIL = 'CAPTURE_EMAIL',
    SENTENCE = 'SENTENCE',
    TERMINATED = 'TERMINATED'
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

import { IntentDeclaration } from "@/components/protocol-calibration";
import { OperatorContext } from "@/app/lib/forensic/intelligence";

export default function SmartGrowthConsultant({ initialHandle, initialIntent, initialLang, initialContext }: { initialHandle?: string, initialIntent?: IntentDeclaration, initialLang?: 'EN' | 'ES' | 'PT', initialContext?: OperatorContext }) {
    // If we have an initial handle, we skip IDLE and go straight to INGEST
    const [state, setState] = useState<OperationalState>(initialHandle ? OperationalState.INGEST : OperationalState.IDLE)
    const [handle, setHandle] = useState(initialHandle || "")
    const [lang, setLang] = useState<'EN' | 'ES' | 'PT'>(initialLang || 'EN')
    const [showAudit, setShowAudit] = useState(false)

    // Data
    const [profile, setProfile] = useState<{ username: string, img: string, bio: string } | null>(null)
    const [backendUX, setBackendUX] = useState<any | null>(null)
    const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null)

    // Audit Helpers
    const sessionId = useRef(`SESS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`).current;
    const timestamp = new Date().toISOString();



    // Timers & Logic
    const [revelationStep, setRevelationStep] = useState(0) // 0: Asymmetry, 1: Inertia
    const [calibrationStep, setCalibrationStep] = useState(0)
    const [intent, setIntent] = useState<any>(initialIntent || {})
    const [operatorContext, setOperatorContext] = useState<OperatorContext | undefined>(initialContext)

    const txt = LANG_TEXT[lang]

    // --- EFFECT: AUTO START ---
    useEffect(() => {
        if (initialHandle && state === OperationalState.INGEST) {
            // Wait a tick to ensure mount, then fire
            const t = setTimeout(() => initiateSequence(initialHandle), 100);
            return () => clearTimeout(t);
        }
    }, [initialHandle]);

    // --- ACTIONS ---


    // ... inside component ...

    const initiateSequence = async (overrideHandle?: string) => {
        const target = overrideHandle || handle;
        if (!target) return

        // Ensure we are in INGEST visual state
        if (state !== OperationalState.INGEST) setState(OperationalState.INGEST);

        // 1. Ingest (Real API Call)
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

            // PHASE 67: STRICT CLOSURE HANDLING
            // We trust the backend's ClosurePayload implicitly.
            if (data.closure) {
                if (data.username) {
                    setProfile({ username: data.username, img: data.profilePicUrl, bio: data.biography })
                }

                // DATA SOVEREIGNTY: Store strict payload
                setBackendUX(data.closure);

                // DIAGNOSIS: Only if permitted by Rule C (handled by backend, but safe double-check)
                if (data.closure.forensic_diagnosis) {
                    setDiagnosis(data.closure.forensic_diagnosis);
                }

                // PHASE 67: BLACK HOLE PROTOCOL
                setState(OperationalState.BLACK_HOLE);
                const delay = Math.floor(Math.random() * (12000 - 8000 + 1) + 8000); // 8-12s

                setTimeout(() => {
                    setState(OperationalState.REVELATION)
                }, delay);

            } else {
                // If backend violates contract -> Terminate to Emergency Fallback
                console.error("VIOLATION: NO CLOSURE PAYLOAD");
                setState(OperationalState.TERMINATED);
            }
        } catch (e) {
            console.error(e);
            // EMERGENCY CLOSURE INJECTION
            const emergencyClosure = {
                system_verdict: "SYSTEM_ERROR",
                verdict_code: "NETWORK_FAILURE",
                session_id: "EMERGENCY_SESSION",
                closed_at: new Date().toISOString(),
                closure_signature: "emergency_fallback",
                ux_controls: {
                    status_label: "Proceso finalizado.",
                    title: "CONEXION INTERRUMPIDA",
                    message: "No se pudo establecer conexión con el servidor.",
                    cta: ""
                }
            };
            setBackendUX(emergencyClosure); // Force payload
            setState(OperationalState.SENTENCE); // Go directly to Sentence
        }
    }

    // STUBS for legacy/unused states to prevent build errors
    const confirmValidation = () => setState(OperationalState.BLACK_HOLE);
    const handleCalibration = (k: string, v: string) => { };

    // --- REVELATION SEQUENCE LOGIC ---
    useEffect(() => {
        if (state === OperationalState.REVELATION) {
            const t1 = setTimeout(() => setRevelationStep(1), 4000);
            const t2 = setTimeout(() => setState(OperationalState.CAPTURE_EMAIL), 8000);
            return () => { clearTimeout(t1); clearTimeout(t2); };
        }
    }, [state]);

    // --- RENDERERS ---

    const Header = ({ status }: { status: string }) => (
        <div className="w-full border-b border-white/10 p-4 flex justify-between items-center bg-[#0B0E11] sticky top-0 z-50">
            <div className="flex flex-col">
                <span className="text-[10px] text-[#9AA0A6] font-mono tracking-widest">TDT ANALYZER</span>
                <span className="text-[10px] text-[#1877F2] font-mono tracking-widest uppercase animate-pulse">STATUS: {status}</span>
            </div>
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setLang(l => l === 'EN' ? 'ES' : l === 'ES' ? 'PT' : 'EN'); }}
                    className="flex items-center gap-2 text-[#9AA0A6] hover:text-white transition-colors"
                >
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
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setShowAudit(false); }}
                        className="absolute top-4 right-4 text-xs font-bold uppercase hover:bg-black hover:text-white px-4 py-2 border border-black transition-colors"
                    >
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
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                console.log("Manual Start Clicked with handle:", handle);
                                initiateSequence();
                            }}
                            disabled={!handle}
                            className="w-full bg-[#E6E8EB] hover:bg-white text-black py-4 text-xs font-mono font-bold tracking-[0.2em] uppercase disabled:opacity-50 transition-all active:scale-95"
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
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); confirmValidation(); }}
                            className="w-full mt-8 bg-[#1877F2] hover:bg-[#1866D1] text-white py-3 font-mono text-xs font-bold tracking-[0.2em] uppercase"
                        >
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
            { key: 'market', label: 'TARGET MARKET', opts: ['NORTEAMERICA', 'LATAM', 'EUROPA', 'ASIA_PACIFICO', 'MENA', 'AFRICA', 'GLOBAL'] },
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
                                <button
                                    type="button"
                                    key={opt}
                                    onClick={(e) => { e.preventDefault(); handleCalibration(curr.key, opt); }}
                                    className="text-left font-mono text-xs text-[#9AA0A6] hover:text-[#E6E8EB] hover:bg-white/5 p-4 border border-white/10 hover:border-[#1877F2] transition-all uppercase tracking-widest"
                                >
                                    [ {opt.replace(/_/g, " ")} ]
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (state === OperationalState.BLACK_HOLE) {
        return (
            <div className="min-h-screen bg-black flex flex-col cursor-none overflow-hidden select-none">
                {/* ABSOLUTE VOID - NO UI ELEMENTS PERMITTED */}
                <div className="flex-1 w-full h-full bg-black" />
            </div>
        )
    }

    if (state === OperationalState.TERMINATED) {
        return (
            <div className="min-h-screen bg-[#110000] flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-1000">
                <div className="flex flex-col items-center gap-4">
                    <ShieldAlert className="w-16 h-16 text-red-600" />
                    <h1 className="text-red-500 font-mono text-xl tracking-[0.5em] uppercase text-center">
                        SESSION TERMINATED
                    </h1>
                </div>
                <div className="text-red-900/50 font-mono text-[10px] tracking-widest text-center max-w-md">
                    PROTOCOL VIOLATION DETECTED OR ASSET INVALID.<br />
                    ACCESS PRIVILEGES REVOKED PERMANENTLY.
                </div>
            </div>
        )
    }

    // REVELATION (Forensic Output)
    if (state === OperationalState.REVELATION) {
        return (
            <div className="min-h-screen bg-[#0B0E11] flex flex-col items-center justify-center p-8 font-mono">
                <Header status="FORENSIC REVELATION" />
                <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                    <div className="space-y-4 text-center">
                        <div className="flex items-center justify-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${revelationStep >= 0 ? 'bg-[#1877F2] animate-ping' : 'bg-white/10'}`} />
                            <span className={`text-xs tracking-[0.2em] uppercase ${revelationStep >= 0 ? 'text-white' : 'text-[#5f6368]'}`}>
                                {txt.asymmetry}
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${revelationStep >= 1 ? 'bg-[#1877F2] animate-ping' : 'bg-white/10'}`} />
                            <span className={`text-xs tracking-[0.2em] uppercase ${revelationStep >= 1 ? 'text-white' : 'text-[#5f6368]'}`}>
                                {txt.inertia}
                            </span>
                        </div>
                    </div>
                    <div className="h-1 w-32 bg-white/10 overflow-hidden rounded-full">
                        <div className="h-full bg-[#1877F2] animate-progress-indeterminate" />
                    </div>
                </div>
                <Footer msg={txt.cross_layer} />
            </div>
        )
    }

    // CAPTURE EMAIL STATE (Pre-Sentence)
    if (state === OperationalState.CAPTURE_EMAIL) {
        return (
            <div className="min-h-screen bg-[#0B0E11] flex flex-col items-center justify-center p-8 space-y-8 font-mono">
                <h2 className="text-white text-sm tracking-widest uppercase">AUDIT COMPLETED</h2>
                <p className="text-gray-500 text-[10px] tracking-widest max-w-md text-center">
                    THE FINAL DIAGNOSIS IS SEALED. ENTER AUTHORIZED EMAIL TO RELEASE THE VERDICT.
                </p>
                <input type="email" placeholder="OFFICIAL_EMAIL" className="bg-transparent border-b border-white/20 text-center py-2 outline-none text-white w-full max-w-sm tracking-widest uppercase focus:border-[#1877F2] transition-colors caret-[#1877F2]"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.includes('@')) {
                            setRevelationStep(2); // Use step to transition visuals if needed
                            setTimeout(() => setState(OperationalState.SENTENCE), 500);
                        }
                    }} />
            </div>
        )
    }

    // PHASE 67: SENTENCE VISUALIZER (STRICT VERDICT CHECK)
    if (state === OperationalState.SENTENCE) {

        // 1. SAFETY FALLBACK: If backendUX is missing (should be impossible due to catch block, but safety first)
        const activeUX = backendUX || {
            system_verdict: "SYSTEM_ERROR",
            verdict_code: "NO_PAYLOAD",
            ux_controls: {
                status_label: "SYSTEM ERROR",
                title: "CRITICAL FAILURE",
                message: "No closure payload received.",
                cta: ""
            }
        };

        const systemVerdict = activeUX.system_verdict || "SYSTEM_ERROR";
        const minimalStates = ["BLOCKED", "SYSTEM_ERROR", "INCONCLUSIVE"];

        // 2. MINIMAL UI FOR BLOCKED/ERROR STATES (No Diagnosis Needed)
        if (minimalStates.includes(systemVerdict)) {
            return (
                <div className="min-h-screen bg-black flex flex-col items-center justify-center cursor-none select-none">
                    <span className="text-white/60 font-mono text-[10px] uppercase tracking-[0.3em]">
                        {systemVerdict}: {activeUX.verdict_code || "Proceso finalizado."}
                    </span>
                    {/* Optional: Show specific error code if debugging needed, otherwise keep silent */}
                </div>
            )
        }

        // 3. DETAILED UI (APPROVED/DOWNGRADED)
        const controls = activeUX.ux_controls || {
            status_label: "UNKNOWN STATE",
            title: "DATA CORRUPTION",
            message: "Verdict received but controls are missing.",
            cta: "CONTACT SUPPORT"
        };


        return (
            <div className="h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#050505]">

                {/* BACKGROUND GRID (Subtle) */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

                <div className="w-full max-w-2xl space-y-12 animate-in fade-in duration-1000 z-10">

                    <div className="space-y-4 border-l-4 pl-6 border-[#d4af37]">
                        <span className="block text-[10px] text-gray-500 tracking-[0.3em] uppercase">FINAL ASSET STATUS</span>
                        <h1 className="text-2xl md:text-5xl font-mono font-bold tracking-tight uppercase leading-tight text-white">
                            {controls.status_label}
                        </h1>
                    </div>

                    {/* BLOCK 2: PRIMARY DETERMINANT */}
                    <div className="space-y-2 pl-6 border-l border-white/10">
                        <span className="block text-[10px] text-[#1877F2] tracking-[0.3em] uppercase">PRIMARY DETERMINANT</span>
                        <p className="text-sm md:text-lg text-gray-300 font-mono uppercase tracking-wide leading-relaxed">
                            {controls.title}
                        </p>
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">
                        // {controls.message}
                        </p>
                    </div>

                    {/* BLOCK 3: OPERATIONAL CONSEQUENCE */}
                    <div className="space-y-2 pl-6 border-l border-white/10">
                        <span className="block text-[10px] text-gray-500 tracking-[0.3em] uppercase">OPERATIONAL CONSEQUENCE</span>
                        <p className="text-sm md:text-base text-gray-400 font-mono italic">
                            "{controls.message}"
                        </p>
                    </div>

                    {/* BLOCK 4: AVAILABLE ACTION */}
                    <div className="pt-8 space-y-6">
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); }}
                            className="w-full bg-white hover:bg-[#d4af37] hover:text-white text-black py-6 font-mono text-sm font-bold tracking-[0.3em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                        >
                            [ {controls.cta} ]
                        </button>

                        {/* BLOCK 5: AUDIT ACCESS */}
                        {diagnosis && (
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); setShowAudit(true); }}
                                    className="text-[#5f6368] hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 group"
                                >
                                    <Terminal className="w-3 h-3 group-hover:text-[#d4af37] transition-colors" />
                                    VIEW AUDIT TRACE
                                </button>
                            </div>
                        )}
                    </div>

                    {/* BLOCK 5: FINALITY SEAL */}
                    <div className="text-center pt-8 opacity-30 hover:opacity-100 transition-opacity duration-500">
                        <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em]">
                            THIS DIAGNOSIS IS FINAL FOR THE CURRENT SESSION.<br />
                            RE-EVALUATION LOCKED FOR 24 HOURS.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // --- FINAL FALLBACK: ANTI-FREEZE PROTOCOL ---
    // This is the ONLY return path if no state matches.
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center cursor-none select-none">
            <span className="text-white/60 font-mono text-[10px] uppercase tracking-[0.3em]">Proceso finalizado.</span>
        </div>
    )
}
