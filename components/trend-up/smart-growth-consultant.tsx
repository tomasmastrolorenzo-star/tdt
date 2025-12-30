"use client"

import React, { useState, useEffect, useRef } from "react"
import {
    Globe,
    ShieldCheck,
    Lock,
    Terminal,
    ShieldAlert,
    BarChart2,
    Scan,
    Search,
    FileCheck,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    ArrowRight,
    Activity,
    Zap
} from "lucide-react"

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
// (Keeping existing logic constants)

const LANG_TEXT = {
    EN: {
        // LANDING HERO
        l_hero_title: "DOES YOUR PRESTIGE\nTRANSLATE TO RESULTS?",
        l_hero_sub: "Analyze your profile's capacity to convert professional authority into a full agenda.",
        l_hero_cta: "SCROLL TO ANALYZE",

        // ANALYZER
        l_analyzer_title: "SIGNAL DIAGNOSIS COCKPIT",
        l_input_label: "ENTER TARGET ASSET HANDLE",
        l_input_placeholder: "@username",
        l_screener_btn: "VERIFY SIGNAL INTEGRITY",
        l_hold_btn: "INITIATE DIAGNOSIS",
        l_holding: "ACQUIRING...",

        // WHY NOW
        l_why_title: "WHY NOW?",
        l_why_copy: "In a high-demand market, digital coherence is your best asset. If your profile doesn't reflect your level of excellence, you are losing patients daily to competitors with less capacity but better infrastructure.",

        // STEPS
        l_step_1: "Authority Signal Scanning",
        l_step_2: "Patient Leak Identification",
        l_step_3: "Technical Verdict Issuance",

        // RESULTS
        l_res_title: "POSSIBLE OUTCOMES",
        l_res_1: "AUTHORIZED",
        l_res_2: "RESTRICTED",
        l_res_3: "DENIED",

        // FOOTER
        l_foot: "TDT Analyzer operations are final.",

        // LEGACY STATES
        ingest: "INGESTING SIGNALS",
        session_locked: "SESSION LOCKED · ACQUIRING PUBLIC SIGNALS",
        asymmetry: "STRUCTURAL ASYMMETRY DETECTED",
        inertia: "INERTIA CALCULATED",
        l_input_email: "EMAIL ADDRESS",
        l_consent: "I confirm I am requesting a forensic technical diagnosis."
    },
    ES: {
        // LANDING HERO
        l_hero_title: "¿TU PRESTIGIO SE\nTRADUCE EN RESULTADOS?",
        l_hero_sub: "Analiza la capacidad de tu perfil para convertir tu autoridad profesional en una agenda llena.",
        l_hero_cta: "DESLIZA PARA ANALIZAR",

        // ANALYZER
        l_analyzer_title: "COCKPIT DE DIAGNÓSTICO",
        l_input_label: "INGRESA EL ACTIVO OBJETIVO",
        l_input_placeholder: "@usuario",
        l_screener_btn: "VERIFICAR INTEGRIDAD DE SEÑAL",
        l_hold_btn: "INICIAR DIAGNÓSTICO DE SEÑAL",
        l_holding: "ADQUIRIENDO...",

        // WHY NOW
        l_why_title: "¿POR QUÉ AHORA?",
        l_why_copy: "En un mercado de alta exigencia, la coherencia digital es tu mejor activo. Si tu perfil no refleja tu nivel de excelencia, estás perdiendo pacientes cada día ante competidores con menor capacidad pero mejor infraestructura.",

        // STEPS
        l_step_1: "Escaneo de señales de autoridad",
        l_step_2: "Identificación de fugas de pacientes",
        l_step_3: "Emisión de dictamen técnico",

        // RESULTS
        l_res_title: "RESULTADOS POSIBLES",
        l_res_1: "AUTORIZADO",
        l_res_2: "RESTRINGIDO",
        l_res_3: "DENEGADO",

        // FOOTER
        l_foot: "Las operaciones de TDT Analyzer son finales.",

        // LEGACY STATES
        ingest: "INGESTA DE SEÑALES",
        session_locked: "SESIÓN BLOQUEADA · ADQUIRIENDO SEÑALES PÚBLICAS",
        asymmetry: "ASIMETRÍA ESTRUCTURAL DETECTADA",
        inertia: "INERCIA CALCULADA",
        l_input_email: "CORREO ELECTRÓNICO",
        l_consent: "Confirmo que solicito un diagnóstico técnico forense."
    },
    PT: {
        // LANDING HERO
        l_hero_title: "SEU PRESTÍGIO SE\nTRADUZ EM RESULTADOS?",
        l_hero_sub: "Analise a capacidade do seu perfil de converter autoridade profissional em uma agenda cheia.",
        l_hero_cta: "ROLE PARA ANALISAR",

        // ANALYZER
        l_analyzer_title: "COCKPIT DE DIAGNÓSTICO",
        l_input_label: "INSIRA O ATIVO ALVO",
        l_input_placeholder: "@usuario",
        l_screener_btn: "VERIFICAR INTEGRIDADE DO SINAL",
        l_hold_btn: "INICIAR DIAGNÓSTICO DE SINAL",
        l_holding: "ADQUIRINDO...",

        // WHY NOW
        l_why_title: "POR QUE AGORA?",
        l_why_copy: "Num mercado de alta exigência, a coerência digital é o seu melhor ativo. Se o seu perfil não reflete o seu nível de excelência, você está perdendo pacientes todos os dias para concorrentes com menos capacidade, mas melhor infraestrutura.",

        // STEPS
        l_step_1: "Escaneamento de sinais de autoridade",
        l_step_2: "Identificação de fugas de pacientes",
        l_step_3: "Emissão de laudo técnico",

        // RESULTS
        l_res_title: "RESULTADOS POSSÍVEIS",
        l_res_1: "AUTORIZADO",
        l_res_2: "RESTRITO",
        l_res_3: "NEGADO",

        // FOOTER
        l_foot: "As operações do TDT Analyzer são finais.",

        // LEGACY STATES
        ingest: "INGESTÃO DE SINAIS",
        session_locked: "SESSÃO BLOQUEADA · ADQUIRINDO SINAIS PÚBLICOS",
        asymmetry: "ASSIMETRIA ESTRUTURAL DETECTADA",
        inertia: "INÉRCIA CALCULADA",
        l_input_email: "E-MAIL",
        l_consent: "Confirmo que solicito um diagnóstico técnico forense."
    }
}

// --- HOLD BUTTON COMPONENT (Enhanced for Laser Sweep) ---
const HoldButton = ({ onExecute, disabled, label, labelHolding }: { onExecute: () => void, disabled: boolean, label: string, labelHolding: string }) => {
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startHold = () => {
        if (disabled) return;
        let p = 0;
        // 2.0s Hold Time (2000ms)
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
            className="w-full h-20 bg-black/50 text-white text-base md:text-lg font-bold tracking-[0.15em] uppercase disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-lg relative overflow-hidden group select-none border border-white/10 hover:border-[#007AFF] shadow-[0_0_30px_rgba(0,122,255,0.1)] active:scale-[0.98]"
        >
            {/* LASER SWEEP EFFECT CONTAINER */}
            <div className="absolute inset-0 z-0">
                {/* Background Fill based on Progress */}
                <div
                    className="h-full bg-[#007AFF] transition-none absolute left-0 top-0 opacity-20"
                    style={{ width: `${progress}%` }}
                />

                {/* Laser Line */}
                {progress > 0 && (
                    <div
                        className="absolute top-0 w-2 h-full bg-[#00FFFF] shadow-[0_0_15px_#00FFFF] blur-[1px] z-10 transition-none"
                        style={{ left: `${progress}%` }}
                    />
                )}
            </div>

            <div className="relative z-20 flex items-center justify-center gap-3">
                {progress > 0 ? (
                    <>
                        <Activity className="w-5 h-5 text-[#00FFFF] animate-pulse" />
                        <span className="text-[#00FFFF] drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">{labelHolding}</span>
                    </>
                ) : (
                    <>
                        <Zap className="w-5 h-5 text-[#007AFF] group-hover:text-white transition-colors" />
                        <span className="group-hover:text-[#007AFF] transition-colors">{label}</span>
                    </>
                )}
            </div>
        </button>
    )
}

// --- PHASE 67 RELIABILITY COMPONENT ---
const FinalBlackScreen = ({ text, subtext }: { text: string | null | undefined, subtext?: string }) => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center cursor-none select-none p-8 text-center text-white relative overflow-hidden">
            {/* Subtle Red Pulse Background */}
            <div className="absolute inset-0 bg-red-900/5 animate-pulse" />

            <span className="font-mono text-base font-medium tracking-[0.2em] mb-4 text-red-500 relative z-10 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                {text || "PROCESO FINALIZADO"}
            </span>
            {subtext && (
                <span className="text-[#6B6B6B] font-mono text-xs tracking-[0.1em] uppercase max-w-lg mt-2 relative z-10">
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

        setState(OperationalState.INGEST);

        try {
            const res = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    handle: handle.trim(),
                    intent: intent
                })
            })
            const data = await res.json()

            if (data.closure) {
                setBackendUX(data.closure);
                setState(OperationalState.BLACK_HOLE); // Use Black Hole transition
                const delay = Math.floor(Math.random() * (12000 - 8000 + 1) + 8000);

                setTimeout(() => {
                    setState(OperationalState.REVELATION)
                }, delay);

            } else {
                console.error("VIOLATION: NO CLOSURE PAYLOAD");
                setState(OperationalState.TERMINATED);
            }

        } catch (e) {
            console.error(e);
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
            const t2 = setTimeout(() => setState(OperationalState.SENTENCE), 8000);
            return () => { clearTimeout(t1); clearTimeout(t2); };
        }
    }, [state]);

    // --- TERMINAL STATES (Phase 67) ---
    if (state === OperationalState.SENTENCE || state === OperationalState.TERMINATED) {
        const activeUX = backendUX || { system_verdict: "SYSTEM_ERROR" };
        if (['BLOCKED', 'INCONCLUSIVE', 'SYSTEM_ERROR', 'TERMINATED'].includes(activeUX.system_verdict)) {
            const verdictText = activeUX.ux_controls?.status_label || activeUX.system_verdict;
            const subtext = activeUX.ux_controls?.message;
            return <FinalBlackScreen text={verdictText} subtext={subtext} />
        }
    }

    if (state === OperationalState.BLACK_HOLE) {
        return (
            <div className="min-h-screen bg-black flex flex-col cursor-none overflow-hidden select-none">
                <div className="flex-1 w-full h-full bg-black flex flex-col items-center justify-center space-y-4">
                    <div className="w-24 h-24 rounded-full border-4 border-[#007AFF] border-t-white animate-spin shadow-[0_0_50px_#007AFF]" />
                    <p className="text-[#007AFF] font-mono tracking-[0.3em] text-sm animate-pulse">SYSTEM CORRELATION ACTIVE</p>
                </div>
            </div>
        )
    }

    // --- MODERN CLINICAL PRESTIGE LAYOUT ---
    return (
        <div className="min-h-screen bg-[#000000] text-[#E6E8EB] font-sans selection:bg-[#007AFF] selection:text-white relative overflow-x-hidden">

            {/* 1. LIGHT & DEPTH (The Soul) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Hero Glow */}
                <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-[#007AFF] rounded-full blur-[150px] opacity-[0.15]" />
                {/* Analyzer Glow */}
                <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-[#007AFF] rounded-full blur-[180px] opacity-[0.10]" />
            </div>

            {/* LANG SWITCHER */}
            <div className="absolute top-8 right-8 z-50">
                <button
                    onClick={() => setLang(l => l === 'EN' ? 'ES' : l === 'ES' ? 'PT' : 'EN')}
                    className="text-[10px] text-[#007AFF] hover:text-white uppercase tracking-widest border border-[#007AFF]/30 px-4 py-2 hover:border-[#007AFF] transition-all rounded-full backdrop-blur-md hover:shadow-[0_0_15px_rgba(0,122,255,0.4)]"
                >
                    {lang}
                </button>
            </div>

            {/* BLOCK 1: HERO */}
            <section className="min-h-[85vh] flex flex-col justify-center items-center px-6 relative z-10">
                <div className="max-w-5xl text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05]">
                        {lang === 'ES' ? (
                            <>
                                ¿TU <span className="text-[#007AFF] drop-shadow-[0_0_25px_rgba(0,122,255,0.6)]">PRESTIGIO</span> SE<br />
                                TRADUCE EN <span className="text-[#007AFF] drop-shadow-[0_0_25px_rgba(0,122,255,0.6)]">RESULTADOS</span>?
                            </>
                        ) : txt.l_hero_title}
                    </h1>
                    <p className="text-xl md:text-2xl text-[#9CA3AF] max-w-3xl mx-auto leading-relaxed font-medium">
                        {txt.l_hero_sub}
                    </p>

                    {/* PULSE SCANNER VISUAL */}
                    <div className="relative h-24 w-full max-w-md mx-auto mt-12 flex items-center justify-center overflow-hidden">
                        <div className="absolute w-full h-0.5 bg-white/10" />
                        <div className="absolute w-32 h-32 bg-[#007AFF]/20 rounded-full blur-xl animate-pulse" />
                        <Activity className="w-16 h-16 text-[#007AFF] drop-shadow-[0_0_10px_#007AFF] animate-bounce" style={{ animationDuration: '3s' }} />
                    </div>
                </div>

                <div className="absolute bottom-12 animate-bounce text-[#007AFF] opacity-80">
                    <ArrowRight className="w-8 h-8 rotate-90" />
                </div>
            </section>

            {/* BLOCK 2: ANALYZER (Glassmorphism Cockpit) */}
            <section className="px-6 py-32 relative z-20" id="analyzer-block">
                <div className="max-w-3xl mx-auto">
                    {/* TRUE GLASSMORPHISM CONTAINER */}
                    <div className={`bg-white/[0.03] backdrop-blur-[15px] border border-white/10 rounded-[2.5rem] p-10 md:p-16 shadow-2xl transition-all duration-700 ${state === OperationalState.INGEST ? 'border-[#007AFF]/50 shadow-[0_0_50px_rgba(0,122,255,0.2)]' : 'hover:border-white/20'}`}>

                        {/* HEADER */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#007AFF]/10 mb-8 border border-[#007AFF]/20 shadow-[0_0_20px_rgba(0,122,255,0.15)]">
                                <Scan className="w-8 h-8 text-[#007AFF] drop-shadow-[0_0_5px_#007AFF]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-[0.2em] uppercase">{txt.l_analyzer_title}</h2>
                        </div>

                        {/* --- STATE: IDLE --- */}
                        {state === OperationalState.IDLE && (
                            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                <div className="space-y-4">
                                    <label className="text-xs text-[#007AFF] font-bold tracking-[0.25em] uppercase ml-2 block">
                                        {txt.l_input_label}
                                    </label>
                                    <div className="relative group">
                                        <input
                                            value={handle}
                                            onChange={e => setHandle(e.target.value)}
                                            placeholder={txt.l_input_placeholder}
                                            onKeyDown={(e) => e.key === 'Enter' && !!handle && runScreener()}
                                            className="w-full bg-[#050505] border border-white/10 rounded-2xl px-8 py-6 text-xl md:text-2xl text-white placeholder-[#333] focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] focus:shadow-[0_0_30px_rgba(0,122,255,0.2)] outline-none transition-all text-center font-mono tracking-wider"
                                        />
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#007AFF] to-[#00FFFF] opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity blur-md filter" />
                                    </div>
                                </div>
                                <button
                                    onClick={runScreener}
                                    disabled={!handle}
                                    className="w-full h-20 bg-white text-black hover:bg-[#E6E8EB] text-lg font-extrabold tracking-[0.15em] uppercase rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                                >
                                    {txt.l_screener_btn}
                                </button>
                            </div>
                        )}

                        {/* --- STATE: PREVIEW --- */}
                        {state === OperationalState.PREVIEW && profile && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Profile Summary - Glass Card */}
                                <div className="flex items-center gap-6 mb-10 bg-white/5 p-6 rounded-3xl border border-white/10">
                                    <div className="w-20 h-20 rounded-full border-2 border-[#007AFF] p-1 overflow-hidden shadow-[0_0_20px_rgba(0,122,255,0.3)]">
                                        <img src={`https://wsrv.nl/?url=${encodeURIComponent(profile.profilePicUrl)}`} className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-2xl tracking-tight">{profile.username}</h3>
                                        <div className="flex gap-4 text-sm text-[#9CA3AF] mt-2 font-mono">
                                            <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5"><span className="text-white font-bold">{profile.followersCount}</span> Followers</span>
                                            <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5"><span className="text-white font-bold">{profile.postsCount}</span> Posts</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Confirmation Fields */}
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-xs text-[#007AFF] font-bold tracking-[0.25em] uppercase ml-2 block">
                                            {txt.l_input_email}
                                        </label>
                                        <input
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full bg-[#050505] border border-white/10 rounded-2xl px-8 py-5 text-white placeholder-[#333] focus:border-[#007AFF] focus:shadow-[0_0_20px_rgba(0,122,255,0.2)] outline-none transition-all text-center font-mono"
                                        />
                                    </div>

                                    <div className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:border-[#007AFF]/50 transition-colors group" onClick={() => setConsent(!consent)}>
                                        <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center transition-all border ${consent ? 'bg-[#007AFF] border-[#007AFF] shadow-[0_0_10px_#007AFF]' : 'border-white/30 bg-transparent'}`}>
                                            {consent && <CheckCircle2 className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className="text-sm text-[#9CA3AF] leading-relaxed select-none group-hover:text-white transition-colors">
                                            {txt.l_consent}
                                        </span>
                                    </div>

                                    <HoldButton
                                        onExecute={initiateSequence}
                                        disabled={!email || !consent}
                                        label={txt.l_hold_btn}
                                        labelHolding={txt.l_holding}
                                    />

                                    <button onClick={() => setState(OperationalState.IDLE)} className="w-full text-xs text-[#9CA3AF] hover:text-white uppercase tracking-widest mt-6 hover:underline decoration-[#007AFF] underline-offset-4">
                                        Cancel Protocol
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- STATE: INGEST / REVELATION (Execution) --- */}
                        {(state === OperationalState.INGEST || state === OperationalState.REVELATION) && (
                            <div className="text-center py-12 space-y-10 animate-in fade-in duration-500">
                                <div className="relative w-32 h-32 mx-auto">
                                    <div className="absolute inset-0 rounded-full border-2 border-[#007AFF]/10" />
                                    <div className="absolute inset-0 rounded-full border-4 border-[#007AFF] border-t-transparent animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Terminal className="w-12 h-12 text-[#007AFF] animate-pulse drop-shadow-[0_0_10px_#007AFF]" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-white font-bold tracking-widest animate-pulse text-lg">
                                        {state === OperationalState.INGEST ? txt.ingest : "ANALYZING STRUCTURE"}
                                    </h3>
                                    <p className="text-[#007AFF] text-xs font-mono tracking-[0.3em]">
                                        PROCESSING_MATRIX_NODE_AF7
                                    </p>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden w-full max-w-sm mx-auto relative">
                                    <div className="absolute inset-0 bg-blue-500/20 blur-sm" />
                                    <div className="h-full bg-[#007AFF] animate-progress-indeterminate shadow-[0_0_10px_#007AFF]" />
                                </div>
                            </div>
                        )}

                        {/* --- STATE: SENTENCE (Verdict) --- */}
                        {state === OperationalState.SENTENCE && (activeUX => (
                            (!['BLOCKED', 'INCONCLUSIVE', 'SYSTEM_ERROR', 'TERMINATED'].includes(activeUX?.system_verdict)) &&
                            <div className="text-center animate-in fade-in zoom-in-95 duration-700">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#007AFF]/10 mb-8 border border-[#007AFF]/30 shadow-[0_0_30px_rgba(0,122,255,0.2)]">
                                    <ShieldCheck className="w-12 h-12 text-[#007AFF] drop-shadow-[0_0_10px_#007AFF]" />
                                </div>
                                <span className="block text-[#007AFF] font-bold tracking-[0.3em] text-xs mb-4 uppercase">{activeUX?.verdict_code}</span>
                                <h3 className="text-4xl text-white font-extrabold mb-8 drop-shadow-lg">{activeUX?.ux_controls?.status_label}</h3>
                                <p className="text-[#9CA3AF] text-lg leading-relaxed mb-10 border-t border-white/10 pt-8 font-light">
                                    {activeUX?.ux_controls?.message}
                                </p>
                                {activeUX?.ux_controls?.cta && (
                                    <button className="w-full bg-white text-black hover:bg-[#E6E8EB] py-5 rounded-2xl font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1">
                                        {activeUX.ux_controls.cta}
                                    </button>
                                )}
                            </div>
                        ))(backendUX)}

                    </div>
                </div>
            </section>

            {/* BLOCK 3: WHY NOW (Value Prop) */}
            <section className="px-6 py-32 border-t border-white/5 bg-black/50 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Glass Card for Value Prop */}
                    <div className="bg-white/[0.02] backdrop-blur-[10px] border border-white/10 p-12 md:p-20 rounded-[2rem] relative overflow-hidden group hover:border-[#007AFF]/30 transition-all duration-700">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#007AFF]/10 rounded-full blur-[100px] group-hover:bg-[#007AFF]/15 transition-all" />

                        <div className="relative z-10 flex flex-col md:flex-row gap-16 items-center">
                            <div className="flex-1 space-y-8">
                                <h3 className="text-3xl font-extrabold text-white uppercase tracking-wide">{txt.l_why_title}</h3>
                                <p className="text-[#B0B3B8] leading-relaxed text-xl font-light">
                                    {txt.l_why_copy}
                                </p>
                            </div>
                            <div className="w-full md:w-1/3 flex justify-center">
                                {/* Vibrant Warning Icon */}
                                <AlertTriangle className="w-32 h-32 text-amber-500 drop-shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-pulse" style={{ animationDuration: '4s' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 4: STEPS */}
            <section className="px-6 py-32 border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: Scan, title: txt.l_step_1, delay: 0 },
                            { icon: Search, title: txt.l_step_2, delay: 100 },
                            { icon: FileCheck, title: txt.l_step_3, delay: 200 }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center space-y-6 p-8 rounded-3xl hover:bg-white/[0.03] transition-colors group">
                                <div className="w-24 h-24 rounded-3xl bg-[#007AFF]/5 flex items-center justify-center text-[#007AFF] mb-4 border border-[#007AFF]/20 group-hover:border-[#007AFF]/50 group-hover:shadow-[0_0_30px_rgba(0,122,255,0.2)] transition-all duration-500">
                                    <step.icon className="w-10 h-10 drop-shadow-[0_0_8px_#007AFF]" />
                                </div>
                                <h4 className="text-white font-bold uppercase tracking-widest text-lg">{step.title}</h4>
                                <div className="h-1 w-16 bg-[#007AFF]/30 rounded-full group-hover:w-32 group-hover:bg-[#007AFF] transition-all duration-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BLOCK 5: RESULTS VISUAL */}
            <section className="px-6 py-32 border-t border-white/5 bg-black/80 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <h3 className="text-xl text-[#6B7280] mb-16 uppercase tracking-[0.3em] font-medium">{txt.l_res_title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="py-12 px-8 rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.02] backdrop-blur-sm grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                            <span className="text-emerald-500 font-extrabold tracking-[0.2em] uppercase text-lg">{txt.l_res_1}</span>
                        </div>
                        <div className="py-12 px-8 rounded-3xl border border-amber-500/10 bg-amber-500/[0.02] backdrop-blur-sm grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
                            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                            <span className="text-amber-500 font-extrabold tracking-[0.2em] uppercase text-lg">{txt.l_res_2}</span>
                        </div>
                        <div className="py-12 px-8 rounded-3xl border border-red-500/10 bg-red-500/[0.02] backdrop-blur-sm grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
                            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                            <span className="text-red-500 font-extrabold tracking-[0.2em] uppercase text-lg">{txt.l_res_3}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-16 text-center border-t border-white/5 relative z-10">
                <div className="flex justify-center items-center gap-2 text-[#4B5563] mb-4">
                    <Lock className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-[0.25em]">SECURE FORENSIC PROTOCOL</span>
                </div>
                <p className="text-[#333] text-[10px] uppercase tracking-[0.2em]">{txt.l_foot}</p>
            </footer>

        </div>
    )
}
