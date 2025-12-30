"use client"

import React, { useState, useEffect, useRef } from "react"
import { Globe, ShieldCheck, Lock, Terminal, ShieldAlert } from "lucide-react"

// --- TYPES ---

interface IntentDeclaration {
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
    IDLE = 'IDLE',          // Stage 0: Initial
    SCREENER = 'SCREENER',  // Stage 1: Input Handle
    PREVIEW = 'PREVIEW',    // Stage 2: Confirmation
    INGEST = 'INGEST',      // Stage 3: Execution (Active)
    BLACK_HOLE = 'BLACK_HOLE',
    VALIDATION = 'VALIDATION', // Logic check
    REVELATION = 'REVELATION',
    SENTENCE = 'SENTENCE',
    TERMINATED = 'TERMINATED'
}

// --- CONSTANTS ---

const LANG_TEXT = {
    EN: {
        // LANDING HERO
        l_hero_title: "DIGITAL VIABILITY\nFORENSIC DIAGNOSIS",
        l_hero_sub: "Technical evaluation of coherence, risk, and structural capacity of the professional asset.",

        // CONTEXT
        l_ctx: "In professional assets with high real authority, defective digital infrastructure generates systematic loss of trust, patients, and positioning.\n\nWithout technical diagnosis, any action on the asset is speculation.",

        // WHAT IS
        l_what_title: "WHAT IS TDT ANALYZER?",
        l_what_desc: "TDT Analyzer is a forensic analysis system that determines if a professional asset is viable, restricted, or incompatible for structural intervention.\n\nThe system does not recommend. ",
        l_what_strong: "It rules.",

        // PROCESS
        l_process_title: "PROCESS SCOPE",
        l_process_1: "Validating public asset signal",
        l_process_2: "Risk, coherence, and operational capacity analysis",
        l_process_3: "Irreversible technical verdict issuance",

        // VERDICTS
        l_verdict_title: "POSSIBLE OUTCOMES",
        l_v_auth: "INTERVENTION AUTHORIZED",
        l_v_rest: "INTERVENTION RESTRICTED",
        l_v_denied: "INTERVENTION DENIED",
        l_v_inc: "INCONCLUSIVE ANALYSIS",
        l_v_note: "The system may close the process without diagnosis if it detects risk or incompatibility.",

        // ANALYZER
        l_analyzer_title: "INITIATE FORENSIC DIAGNOSIS",
        l_input_handle: "ASSET ID (INSTAGRAM HANDLE)",
        l_input_email: "EMAIL",
        l_consent: "I confirm I am requesting a forensic technical diagnosis of my digital asset.",
        l_hold_btn: "INITIATE PROTOCOL",
        l_holding: "HOLDING...",
        l_screener_btn: "VERIFY ASSET",

        // FOOTER
        l_foot_1: "TDT Analyzer operates under irreversible closure protocols.",
        l_foot_2: "Not all assets are suitable for intervention.",

        // LEGACY / APP
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
        // LANDING HERO
        l_hero_title: "DIAGNÓSTICO FORENSE\nDE VIABILIDAD DIGITAL",
        l_hero_sub: "Evaluación técnica de coherencia, riesgo y capacidad estructural del activo profesional.",

        // CONTEXT
        l_ctx: "En activos profesionales con alta autoridad real, una infraestructura digital defectuosa genera pérdida sistemática de confianza, pacientes y posicionamiento.\n\nSin diagnóstico técnico, cualquier acción sobre el activo es especulación.",

        // WHAT IS
        l_what_title: "¿QUÉ ES EL TDT ANALYZER?",
        l_what_desc: "TDT Analyzer es un sistema de análisis forense que determina si un activo profesional es viable, restringido o incompatible para intervención estructural.\n\nEl sistema no recomienda. ",
        l_what_strong: "Dictamina.",

        // PROCESS
        l_process_title: "ALCANCE DEL PROCESO",
        l_process_1: "Validación de señal pública del activo",
        l_process_2: "Análisis de riesgo, coherencia y capacidad operativa",
        l_process_3: "Emisión de dictamen técnico irreversible",

        // VERDICTS
        l_verdict_title: "RESULTADOS POSIBLES",
        l_v_auth: "INTERVENCIÓN AUTORIZADA",
        l_v_rest: "INTERVENCIÓN RESTRINGIDA",
        l_v_denied: "INTERVENCIÓN DENEGADA",
        l_v_inc: "ANÁLISIS INCONCLUSIVO",
        l_v_note: "El sistema puede cerrar el proceso sin entregar diagnóstico si detecta riesgo o incompatibilidad.",

        // ANALYZER
        l_analyzer_title: "INICIAR DIAGNÓSTICO FORENSE",
        l_input_handle: "ASSET ID (INSTAGRAM HANDLE)",
        l_input_email: "EMAIL",
        l_consent: "Confirmo que solicito un diagnóstico técnico forense del meu activo digital.",
        l_hold_btn: "INICIAR PROTOCOLO",
        l_holding: "INICIANDO...",
        l_screener_btn: "VERIFICAR ACTIVO",

        // FOOTER
        l_foot_1: "TDT Analyzer opera bajo protocolos de cierre irreversible.",
        l_foot_2: "No todos los activos son aptos para intervención.",

        // LEGACY / APP
        ingest: "INGESTA DE SEÑALES",
        session_locked: "SESIÓN BLOQUEADA · ADQUIRIENDO SEÑALES PÚBLICAS",
        bio_fragment: "FRAGMENTO BIO DETECTADO",
        signal_confirmed: "SEÑAL CONFIRMADA · DATOS ASEGURADOS",
        deep_analysis: "ANÁLISIS PROFUNDO",
        cross_layer: "CORRELACIÓN ENTRE CAPAS EN PROGRESO",
        asymmetry: "ASIMETRÍA ESTRUCTURAL DETECTADA",
        inertia: "INERCIA CALCULADA",
        sentence_header: "SENTENCIA TÉCNICA",
        compliance: "CERTIFICACIÓN DE ORIGEM",
        public_data: "Análisis de Señales Públicas",
        meta_compliance: "Cumplimiento Plataforma Meta",
        cta_start: "INICIAR SECUENCIA",
        input_placeholder: "INGRESAR ID ACTIVO",
        risk: "RIESGO DE INTERVENCIÓN",
        detail: "DETALLE TÉCNICO"
    },
    PT: {
        // LANDING HERO
        l_hero_title: "DIAGNÓSTICO FORENSE\nDE VIABILIDADE DIGITAL",
        l_hero_sub: "Avaliação técnica de coerência, risco e capacidade estrutural do ativo profissional.",

        // CONTEXT
        l_ctx: "Em ativos profissionais com alta autoridade real, uma infraestrutura digital defeituosa gera perda sistemática de confiança, pacientes e posicionamento.\n\nSem diagnóstico técnico, qualquer ação sobre o ativo é especulação.",

        // WHAT IS
        l_what_title: "O QUE É O TDT ANALYZER?",
        l_what_desc: "TDT Analyzer é um sistema de análise forense que determina se um ativo profissional é viável, restrito ou incompatível para intervenção estrutural.\n\nO sistema não recomenda. ",
        l_what_strong: "Determina.",

        // PROCESS
        l_process_title: "ESCOPO DO PROCESSO",
        l_process_1: "Validação de sinal público do ativo",
        l_process_2: "Análise de risco, coerência e capacidade operacional",
        l_process_3: "Emissão de parecer técnico irreversível",

        // VERDICTS
        l_verdict_title: "RESULTADOS POSSÍVEIS",
        l_v_auth: "INTERVENÇÃO AUTORIZADA",
        l_v_rest: "INTERVENÇÃO RESTRITA",
        l_v_denied: "INTERVENÇÃO NEGADA",
        l_v_inc: "ANÁLISE INCONCLUSIVA",
        l_v_note: "O sistema pode encerrar o processo sem entregar diagnóstico se detectar risco ou incompatibilidade.",

        // ANALYZER
        l_analyzer_title: "INICIAR DIAGNÓSTICO FORENSE",
        l_input_handle: "ASSET ID (INSTAGRAM HANDLE)",
        l_input_email: "EMAIL",
        l_consent: "Confirmo que solicito um diagnóstico técnico forense do meu ativo digital.",
        l_hold_btn: "INICIAR PROTOCOLO",
        l_holding: "INICIANDO...",
        l_screener_btn: "VERIFICAR ATIVO",

        // FOOTER
        l_foot_1: "TDT Analyzer opera sob protocolos de encerramento irreversível.",
        l_foot_2: "Nem todos os ativos são aptos para intervenção.",

        // LEGACY / APP
        ingest: "INGESTÃO DE SINAIS",
        session_locked: "SESSÃO BLOQUEADA · ADQUIRINDO SINAIS PÚBLICOS",
        bio_fragment: "FRAGMENTO DE BIO DETECTADO",
        signal_confirmed: "SINAL CONFIRMADO · DADOS ASSEGURADOS",
        deep_analysis: "ANÁLISIS PROFUNDA",
        cross_layer: "CORRELAÇÃO ENTRE CAMADAS EM PROGRESSO",
        asymmetry: "ASSIMETRIA ESTRUTURAL DETECTADA",
        inertia: "INERCIA CALCULADA",
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

// --- HOLD BUTTON COMPONENT (Extracted) ---
const HoldButton = ({ onExecute, disabled, label, labelHolding }: { onExecute: () => void, disabled: boolean, label: string, labelHolding: string }) => {
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startHold = () => {
        if (disabled) return;
        let p = 0;
        intervalRef.current = setInterval(() => {
            p += (100 / (2000 / 16));
            if (p >= 100) {
                p = 100;
                clearInterval(intervalRef.current!);
                onExecute();
            }
            setProgress(p);
        }, 16);
    };

    const endHold = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setProgress(0);
    };

    return (
        <button
            type="button"
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            disabled={disabled}
            className="w-full bg-white hover:bg-[#CCCCCC] text-black py-4 text-xs font-mono font-bold tracking-[0.2em] uppercase disabled:opacity-30 disabled:cursor-not-allowed transition-none rounded-none border border-transparent relative overflow-hidden group select-none"
        >
            <div className="relative z-10 flex items-center justify-center gap-2">
                {progress > 0 && progress < 100 ? labelHolding : label}
            </div>
            <div
                className="absolute bottom-0 left-0 h-[1px] bg-black/80 transition-none"
                style={{ width: `${progress}%` }}
            />
        </button>
    )
}

// --- PHASE 67 RELIABILITY COMPONENT ---
const FinalBlackScreen = ({ text, subtext }: { text: string | null | undefined, subtext?: string }) => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center cursor-none select-none p-8 text-center text-white">
            <span className="font-mono text-base font-medium tracking-[0.2em] mb-4">
                {text || "PROCESO FINALIZADO"}
            </span>
            {subtext && (
                <span className="text-[#6B6B6B] font-mono text-xs tracking-[0.1em] uppercase max-w-lg mt-2">
                    {subtext}
                </span>
            )}
        </div>
    )
}


// --- MAIN COMPONENT ---

export default function SmartGrowthConsultant({ initialHandle, initialIntent, initialLang }: { initialHandle?: string, initialIntent?: IntentDeclaration, initialLang?: 'EN' | 'ES' | 'PT' }) {
    // Stage Management
    const [state, setState] = useState<OperationalState>(initialHandle ? OperationalState.INGEST : OperationalState.IDLE)

    // Inputs
    const [handle, setHandle] = useState(initialHandle || "")
    const [email, setEmail] = useState("")
    const [consent, setConsent] = useState(false)
    const [lang, setLang] = useState<'EN' | 'ES' | 'PT'>(initialLang || 'EN')
    const [backendUX, setBackendUX] = useState<any | null>(null)
    const [profile, setProfile] = useState<any | null>(null)
    const [previewPosts, setPreviewPosts] = useState<any[]>([])

    // Audit Helpers
    const sessionId = useRef(`SESS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`).current;
    const timestamp = new Date().toISOString();

    // Timers & Logic
    const [revelationStep, setRevelationStep] = useState(0)
    const [intent] = useState<any>(initialIntent || {})

    const txt = LANG_TEXT[lang]

    // --- ACTIONS ---

    // STAGE 1: SCREENER (Verify Handle)
    const runScreener = async () => {
        if (!handle) return;

        // Temporary Loading
        const originalBtn = document.activeElement as HTMLButtonElement | null;
        if (originalBtn) originalBtn.innerText = "...";

        try {
            const res = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    handle: handle.trim(),
                    mode: 'preview' // CRITICAL: Ask for preview only
                })
            });
            const data = await res.json();

            if (data.status === 'error' || !data.profile) {
                // IMMEDIATE CLOSURE (PHASE 67 RULE)
                setBackendUX(data.closure || {
                    system_verdict: "INCONCLUSIVE",
                    ux_controls: {
                        status_label: "PERFIL NO ACCESIBLE PÚBLICAMENTE",
                        title: "ERROR DE LECTURA",
                        message: "No se pudo verificar el activo."
                    }
                });
                setState(OperationalState.SENTENCE);
                return;
            }

            // SUCCESS: Move to Confirmation
            setProfile(data.profile);
            setPreviewPosts(data.posts || []);
            setState(OperationalState.PREVIEW);

        } catch (e) {
            console.error(e);
            // IMMEDIATE FAILURE
            setBackendUX({
                system_verdict: "SYSTEM_ERROR",
                ux_controls: { status_label: "ERROR DE CONEXIÓN" }
            });
            setState(OperationalState.SENTENCE);
        }
    }

    // STAGE 3: EXECUTION (Full Analysis)
    const initiateSequence = async () => {
        if (!handle || !email || !consent) return;

        // Ensure we are in INGEST visual state
        setState(OperationalState.INGEST);

        try {
            const res = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    handle: handle.trim(), // Use handle from state
                    intent: intent
                })
            })
            const data = await res.json()

            // PHASE 67: STRICT CLOSURE HANDLING
            // We trust the backend's ClosurePayload implicitly.
            if (data.closure) {
                setBackendUX(data.closure);

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
                ux_controls: {
                    status_label: "Proceso finalizado.",
                    title: "CONEXION INTERRUMPIDA",
                    message: "No se pudo establecer conexión con el servidor.",
                    cta: ""
                }
            };
            setBackendUX(emergencyClosure);
            setState(OperationalState.SENTENCE);
        }
    }



    // --- REVELATION SEQUENCE LOGIC ---
    useEffect(() => {
        if (state === OperationalState.REVELATION) {
            const t1 = setTimeout(() => setRevelationStep(1), 4000);
            const t2 = setTimeout(() => setState(OperationalState.SENTENCE), 8000); // DIRECT SKIP CAPTURE
            return () => { clearTimeout(t1); clearTimeout(t2); };
        }
    }, [state]);

    // --- RENDERERS ---

    const Header = ({ status }: { status: string }) => (
        <div className="w-full border-b border-white/10 p-4 flex justify-between items-center bg-[#0B0E11] sticky top-0 z-50">
            <div className="flex flex-col">
                <span className="text-[10px] text-[#6B6B6B] font-mono tracking-widest">TDT ANALYZER</span>
                <span className="text-[10px] text-[#1877F2] font-mono tracking-widest uppercase animate-pulse">STATUS: {status}</span>
            </div>
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setLang(l => l === 'EN' ? 'ES' : l === 'ES' ? 'PT' : 'EN'); }}
                    className="flex items-center gap-2 text-[#6B6B6B] hover:text-white transition-colors"
                >
                    <Globe className="w-3 h-3" />
                    <span className="text-[10px] font-mono">{lang}</span>
                </button>
            </div>
        </div>
    )

    const Footer = ({ msg }: { msg: string }) => (
        <div className="w-full border-t border-white/10 p-4 bg-[#0B0E11] fixed bottom-0 left-0 flex justify-between items-center z-50">
            <span className="text-[10px] text-[#6B6B6B] font-mono tracking-widest uppercase flex items-center gap-2">
                <Lock className="w-3 h-3" /> {msg}
            </span>
            <div className="flex items-center gap-4 text-[10px] text-[#6B6B6B]">
                <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Instagram Public Graph</div>
            </div>
        </div>
    )

    // --- TERMINAL STATES (Phase 67) ---
    // Error states are allowed to be full screen (Black Screen).

    // Check for Error Verdicts to render as Black Screen Overlay
    if (state === OperationalState.SENTENCE || state === OperationalState.TERMINATED) {
        const activeUX = backendUX || { system_verdict: "SYSTEM_ERROR" };
        if (['BLOCKED', 'INCONCLUSIVE', 'SYSTEM_ERROR', 'TERMINATED'].includes(activeUX.system_verdict)) {
            // ERROR = Overlay (Hide Hero)
            const verdictText = activeUX.ux_controls?.status_label || activeUX.system_verdict;
            const subtext = activeUX.ux_controls?.message;
            return <FinalBlackScreen text={verdictText} subtext={subtext} />
        }
    }

    if (state === OperationalState.BLACK_HOLE) {
        return (
            <div className="min-h-screen bg-black flex flex-col cursor-none overflow-hidden select-none">
                <div className="flex-1 w-full h-full bg-black" />
            </div>
        )
    }

    // --- STANDARD LANDING LAYOUT (ALL OTHER STATES) ---
    return (
        <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-mono selection:bg-white selection:text-black relative">
            {/* LANG SWITCHER */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={() => setLang(l => l === 'EN' ? 'ES' : l === 'ES' ? 'PT' : 'EN')}
                    className="text-[10px] text-[#6B6B6B] hover:text-white uppercase tracking-widest border border-[#333] px-3 py-1 hover:border-white transition-colors"
                >
                    [{lang}]
                </button>
            </div>

            {/* BLOCK 1: HERO */}
            <section className="min-h-[60vh] flex flex-col justify-end px-6 pb-24 border-b border-[#FFFFFF]/10">
                <div className="max-w-4xl">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1] mb-8 text-[#FFFFFF] uppercase whitespace-pre-line">
                        {txt.l_hero_title}
                    </h1>
                    <p className="text-sm md:text-base text-[#6B6B6B] uppercase tracking-widest max-w-2xl leading-relaxed">
                        {txt.l_hero_sub}
                    </p>
                </div>
            </section>

            {/* BLOCK 6: THE ANALYZER (CONTAINED) */}
            <section className="px-6 py-32 flex flex-col items-center justify-center border-t border-[#FFFFFF]/10 bg-black/50 min-h-[500px]">
                <div className="w-full max-w-lg space-y-12">

                    {/* HEADER FOR BLOCK 6 - Only show if NOT in Verdict/Revelation to avoid clutter? Or keep it? keeping it for consistency except verdict */}
                    {(state !== OperationalState.SENTENCE && state !== OperationalState.REVELATION) && (
                        <div className="text-center space-y-4">
                            <Terminal className="w-6 h-6 text-[#FFFFFF] mx-auto" />
                            <h2 className="text-lg text-[#FFFFFF] tracking-[0.2em] uppercase font-bold">{txt.l_analyzer_title}</h2>
                        </div>
                    )}

                    {/* --- INLINE CONTENT --- */}

                    {/* STATE: IDLE */}
                    {state === OperationalState.IDLE && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <input
                                value={handle}
                                onChange={e => setHandle(e.target.value)}
                                placeholder={txt.l_input_handle}
                                onKeyDown={(e) => e.key === 'Enter' && !!handle && runScreener()}
                                className="w-full bg-black border-b border-[#FFFFFF]/30 text-center py-4 text-sm font-mono tracking-widest focus:border-[#FFFFFF] outline-none text-[#FFFFFF] placeholder-[#6B6B6B] uppercase rounded-none transition-none"
                            />
                            <button
                                onClick={runScreener}
                                disabled={!handle}
                                className="w-full bg-white hover:bg-[#CCCCCC] text-black py-4 text-xs font-mono font-bold tracking-[0.2em] uppercase disabled:opacity-30 disabled:cursor-not-allowed transition-none rounded-none"
                            >
                                {txt.l_screener_btn}
                            </button>
                        </div>
                    )}

                    {state === OperationalState.PREVIEW && profile && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
                            {/* PREVIEW CARD */}
                            <div className="border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black">
                                <div className="flex items-center gap-6 mb-6">
                                    <div className="w-16 h-16 rounded-full border border-white/20 p-1">
                                        <img src={`https://wsrv.nl/?url=${encodeURIComponent(profile.profilePicUrl)}`} className="w-full h-full rounded-full grayscale" />
                                    </div>
                                    <div>
                                        <h3 className="text-white text-lg tracking-widest uppercase">{profile.username}</h3>
                                        <div className="text-[#6B6B6B] text-[10px] tracking-wider uppercase mt-1 flex gap-4">
                                            <span>{profile.followersCount} Followers</span>
                                            <span>{profile.postsCount} Posts</span>
                                        </div>
                                    </div>
                                </div>
                                {profile.biography && (
                                    <p className="text-[#6B6B6B] text-xs italic border-l-2 border-white/20 pl-4 py-1 mb-6">
                                        "{profile.biography.slice(0, 100)}..."
                                    </p>
                                )}

                                {/* 6 POST GRID */}
                                <div className="grid grid-cols-3 gap-2 opacity-50">
                                    {previewPosts.map((post) => (
                                        <div key={post.id} className="aspect-square bg-white/5 relative group">
                                            <img src={`https://wsrv.nl/?url=${encodeURIComponent(post.url)}`} className="w-full h-full object-cover grayscale" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* EMAIL & CONSENT - ONLY VISIBLE NOW */}
                            <div className="space-y-6">
                                <input
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder={txt.l_input_email}
                                    className="w-full bg-black border-b border-[#FFFFFF]/30 text-center py-4 text-sm font-mono tracking-widest focus:border-[#FFFFFF] outline-none text-[#FFFFFF] placeholder-[#6B6B6B] uppercase rounded-none transition-none"
                                />

                                <div className="flex items-start justify-center gap-3 py-2 cursor-pointer group" onClick={() => setConsent(!consent)}>
                                    <div className={`mt-0.5 w-3 h-3 border border-[#FFFFFF]/50 flex items-center justify-center transition-none rounded-none ${consent ? 'bg-[#FFFFFF]' : 'bg-transparent'}`}>
                                    </div>
                                    <span className="text-[10px] text-[#6B6B6B] group-hover:text-[#FFFFFF] font-mono tracking-wider uppercase select-none transition-none text-left leading-relaxed">
                                        {txt.l_consent}
                                    </span>
                                </div>

                                <div className="pt-4">
                                    <HoldButton
                                        onExecute={initiateSequence}
                                        disabled={!email || !consent}
                                        label={txt.l_hold_btn}
                                        labelHolding={txt.l_holding}
                                    />
                                </div>
                            </div>

                            <div className="text-center">
                                <button onClick={() => setState(OperationalState.IDLE)} className="text-[10px] text-[#6B6B6B] uppercase underline hover:text-white">
                                    CANCEL OPERATION
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STATE: INGEST (Execution) */}
                    {state === OperationalState.INGEST && (
                        <div className="w-full border border-white/10 bg-white/5 p-8 text-center animate-pulse">
                            <span className="text-[10px] text-[#1877F2] font-mono tracking-widest uppercase">
                                {txt.ingest}
                            </span>
                            <div className="mt-4 h-[1px] w-full bg-[#1877F2]/30 overflow-hidden">
                                <div className="h-full bg-[#1877F2] animate-progress-indeterminate w-1/3" />
                            </div>
                            <span className="text-[10px] text-[#6B6B6B] font-mono tracking-widest uppercase mt-4 block">
                                {txt.session_locked}
                            </span>
                        </div>
                    )}

                    {/* STATE: REVELATION */}
                    {state === OperationalState.REVELATION && (
                        <div className="w-full border border-white/10 bg-white/5 p-8 text-center space-y-8">
                            <span className="text-[10px] text-[#1877F2] font-mono tracking-widest uppercase animate-pulse">
                                FORENSIC REVELATION
                            </span>
                            <div className="space-y-4 text-center">
                                <div className="flex items-center justify-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${revelationStep >= 0 ? 'bg-[#1877F2] animate-ping' : 'bg-white/10'}`} />
                                    <span className={`text-xs tracking-[0.2em] uppercase ${revelationStep >= 0 ? 'text-white' : 'text-[#6B6B6B]'}`}>
                                        {txt.asymmetry}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${revelationStep >= 1 ? 'bg-[#1877F2] animate-ping' : 'bg-white/10'}`} />
                                    <span className={`text-xs tracking-[0.2em] uppercase ${revelationStep >= 1 ? 'text-white' : 'text-[#6B6B6B]'}`}>
                                        {txt.inertia}
                                    </span>
                                </div>
                            </div>
                            <div className="h-1 w-32 bg-white/10 overflow-hidden rounded-full mx-auto">
                                <div className="h-full bg-[#1877F2] animate-progress-indeterminate" />
                            </div>
                        </div>
                    )}

                    {/* STATE: SENTENCE (APPROVED/DOWNGRADED - Success Case) */}
                    {(state === OperationalState.SENTENCE || state === OperationalState.TERMINATED) &&
                        (!['BLOCKED', 'INCONCLUSIVE', 'SYSTEM_ERROR', 'TERMINATED'].includes(backendUX?.system_verdict)) && (
                            <div className="w-full animate-in fade-in duration-1000">
                                <div className="border border-white/10 bg-white/5 p-8 text-left relative overflow-hidden">
                                    {/* DECORATION */}
                                    <div className="absolute top-0 right-0 p-4 opacity-20">
                                        <ShieldCheck className="w-12 h-12 text-[#1877F2]" />
                                    </div>

                                    <span className="text-[#1877F2] tracking-[0.2em] text-[10px] uppercase font-bold block mb-2">
                                        {backendUX?.verdict_code}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-medium tracking-tight leading-none text-white mb-6 uppercase">
                                        {backendUX?.ux_controls?.status_label || backendUX?.system_verdict}
                                    </h3>

                                    <div className="w-full h-[1px] bg-white/10 mb-6" />

                                    <h4 className="text-[#6B6B6B] text-[10px] tracking-[0.2em] uppercase mb-2">
                                        {backendUX?.ux_controls?.title}
                                    </h4>
                                    <p className="text-[#E6E8EB] text-xs md:text-sm leading-relaxed font-light whitespace-pre-line tracking-wide mb-8">
                                        {backendUX?.ux_controls?.message}
                                    </p>

                                    {backendUX?.ux_controls?.cta && (
                                        <button className="w-full bg-white text-black py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#CCCCCC] transition-colors rounded-none">
                                            {backendUX.ux_controls.cta}
                                        </button>
                                    )}
                                </div>
                                <div className="mt-4 text-center">
                                    <span className="text-[9px] text-[#6B6B6B] tracking-widest uppercase">
                                        SESS: {sessionId} // SIG: {timestamp.split('T')[1].split('.')[0]}
                                    </span>
                                </div>
                            </div>
                        )}

                </div>
            </section>

            {/* FOOTER */}
            <footer className="px-6 py-12 border-t border-[#FFFFFF]/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-[#6B6B6B] uppercase tracking-widest">
                <span>{txt.l_foot_1}</span>
                <span>{txt.l_foot_2}</span>
            </footer>
        </div>
    )
}
