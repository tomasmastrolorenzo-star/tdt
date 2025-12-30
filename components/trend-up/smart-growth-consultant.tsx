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
    ArrowRight
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
        l_analyzer_title: "INITIATE AUTHORITY ANALYSIS",
        l_input_label: "ENTER INSTAGRAM HANDLE TO START",
        l_input_placeholder: "@username",
        l_screener_btn: "VERIFY ASSET",
        l_hold_btn: "INITIATE PROTOCOL",
        l_holding: "HOLDING...",

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
        l_analyzer_title: "INICIAR ANÁLISIS DE AUTORIDAD",
        l_input_label: "INGRESA TU USUARIO DE INSTAGRAM",
        l_input_placeholder: "@usuario",
        l_screener_btn: "VERIFICAR ACTIVO", // Requested as "INICIAR ANÁLISIS" but logically it's verify first
        l_hold_btn: "INICIAR PROTOCOLO",
        l_holding: "INICIANDO...",

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
        l_analyzer_title: "INICIAR ANÁLISE DE AUTORIDADE",
        l_input_label: "INSIRA SEU USUÁRIO DO INSTAGRAM",
        l_input_placeholder: "@usuario",
        l_screener_btn: "VERIFICAR ATIVO",
        l_hold_btn: "INICIAR PROTOCOLO",
        l_holding: "INICIANDO...",

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

// --- HOLD BUTTON COMPONENT ---
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
            className="w-full h-16 bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-sm md:text-base font-bold tracking-[0.15em] uppercase disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-lg relative overflow-hidden group select-none shadow-[0_0_20px_rgba(0,122,255,0.3)] border border-[#007AFF]/50"
        >
            <div className="relative z-10 flex items-center justify-center gap-2">
                {progress > 0 && progress < 100 ? labelHolding : label}
            </div>
            <div
                className="absolute bottom-0 left-0 h-full bg-white/20 transition-none"
                style={{ width: `${progress}%` }}
            />
        </button>
    )
}

// --- PHASE 67 RELIABILITY COMPONENT ---
const FinalBlackScreen = ({ text, subtext }: { text: string | null | undefined, subtext?: string }) => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center cursor-none select-none p-8 text-center text-white">
            <span className="font-mono text-base font-medium tracking-[0.2em] mb-4 text-red-500">
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

    // --- VISUAL BLOCKS ---

    // BLOCK 5: VERDICT BADGE
    const VerdictBadge = ({ type, label, icon: Icon, color }: any) => (
        <div className={`flex flex-col items-center justify-center p-6 border border-white/5 rounded-xl bg-white/5 backdrop-blur-sm`}>
            <div className={`p-3 rounded-full bg-${color}-500/10 mb-4`}>
                <Icon className={`w-8 h-8 text-${color}-500`} />
            </div>
            <span className={`text-[10px] tracking-[0.2em] font-bold uppercase text-${color}-500`}>{label}</span>
        </div>
    )

    // --- TERMINAL STATES (Phase 67) ---
    // Error states are allowed to be full screen (Black Screen).

    // Check for Error Verdicts to render as Black Screen Overlay
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
                <div className="flex-1 w-full h-full bg-black/90 flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-full border-2 border-[#007AFF] border-t-transparent animate-spin" />
                </div>
            </div>
        )
    }

    // --- CLEAN TECH BLUE LANDING LAYOUT ---
    return (
        <div className="min-h-screen bg-[#0A0F1E] text-[#E6E8EB] font-sans selection:bg-[#007AFF] selection:text-white relative overflow-x-hidden">

            {/* LANG SWITCHER */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={() => setLang(l => l === 'EN' ? 'ES' : l === 'ES' ? 'PT' : 'EN')}
                    className="text-[10px] text-[#007AFF] hover:text-white uppercase tracking-widest border border-[#007AFF]/30 px-3 py-1 hover:border-[#007AFF] transition-colors rounded-full backdrop-blur-md"
                >
                    {lang}
                </button>
            </div>

            {/* BLOCK 1: HERO */}
            <section className="min-h-[80vh] flex flex-col justify-center items-center px-6 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#007AFF]/10 blur-[100px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#007AFF]/5 blur-[120px] rounded-full" />
                </div>

                <div className="max-w-4xl text-center z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                        {lang === 'ES' ? (
                            <>
                                ¿TU <span className="text-[#007AFF]">PRESTIGIO</span> SE<br />
                                TRADUCE EN <span className="text-[#007AFF]">RESULTADOS</span>?
                            </>
                        ) : txt.l_hero_title}
                    </h1>
                    <p className="text-lg md:text-xl text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
                        {txt.l_hero_sub}
                    </p>

                    {/* Visual Bar Chart */}
                    <div className="flex items-end justify-center gap-2 h-16 mt-8 opacity-80">
                        <div className="w-2 bg-[#007AFF]/20 h-full rounded-t animate-pulse" style={{ height: '30%' }} />
                        <div className="w-2 bg-[#007AFF]/40 h-full rounded-t animate-pulse" style={{ height: '50%', animationDelay: '0.1s' }} />
                        <div className="w-2 bg-[#007AFF]/60 h-full rounded-t animate-pulse" style={{ height: '75%', animationDelay: '0.2s' }} />
                        <div className="w-2 bg-[#007AFF] h-full rounded-t animate-pulse" style={{ height: '100%', animationDelay: '0.3s' }} />
                    </div>
                </div>

                <div className="absolute bottom-10 animate-bounce text-[#007AFF]/50">
                    <ArrowRight className="w-6 h-6 rotate-90" />
                </div>
            </section>

            {/* BLOCK 2: ANALYZER (Glassmorphism Card) */}
            <section className="px-6 py-24 relative z-20" id="analyzer-block">
                <div className="max-w-xl mx-auto">
                    <div className={`bg-[#0F1629]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl shadow-[#007AFF]/10 transition-all duration-500 ${state === OperationalState.INGEST || state === OperationalState.REVELATION ? 'border-[#007AFF]/50' : ''}`}>

                        {/* HEADER */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#007AFF]/10 mb-6">
                                <Scan className="w-6 h-6 text-[#007AFF]" />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-wider uppercase">{txt.l_analyzer_title}</h2>
                        </div>

                        {/* --- STATE: IDLE --- */}
                        {state === OperationalState.IDLE && (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-[#9CA3AF] font-bold tracking-[0.2em] uppercase ml-1">
                                        {txt.l_input_label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            value={handle}
                                            onChange={e => setHandle(e.target.value)}
                                            placeholder={txt.l_input_placeholder}
                                            onKeyDown={(e) => e.key === 'Enter' && !!handle && runScreener()}
                                            className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-6 py-5 text-lg text-white placeholder-[#4B5563] focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] outline-none transition-all text-center font-medium"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={runScreener}
                                    disabled={!handle}
                                    className="w-full h-16 bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-base font-bold tracking-[0.15em] uppercase rounded-xl shadow-[0_4px_20px_rgba(0,122,255,0.4)] hover:shadow-[0_4px_30px_rgba(0,122,255,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                                >
                                    {txt.l_screener_btn}
                                </button>
                            </div>
                        )}

                        {/* --- STATE: PREVIEW --- */}
                        {state === OperationalState.PREVIEW && profile && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Profile Summary */}
                                <div className="flex items-center gap-4 mb-8 bg-[#0A0F1E] p-4 rounded-2xl border border-white/5">
                                    <div className="w-16 h-16 rounded-full border-2 border-[#007AFF] p-0.5 overflow-hidden">
                                        <img src={`https://wsrv.nl/?url=${encodeURIComponent(profile.profilePicUrl)}`} className="w-full h-full rounded-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{profile.username}</h3>
                                        <div className="flex gap-3 text-xs text-[#9CA3AF] mt-1">
                                            <span><span className="text-white font-bold">{profile.followersCount}</span> Followers</span>
                                            <span><span className="text-white font-bold">{profile.postsCount}</span> Posts</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Confirmation Fields */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-[#9CA3AF] font-bold tracking-[0.2em] uppercase ml-1">
                                            {txt.l_input_email}
                                        </label>
                                        <input
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-6 py-4 text-white placeholder-[#4B5563] focus:border-[#007AFF] outline-none transition-all text-center"
                                        />
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-[#0A0F1E]/50 rounded-xl border border-white/5 cursor-pointer hover:border-[#007AFF]/30 transition-colors" onClick={() => setConsent(!consent)}>
                                        <div className={`mt-0.5 w-5 h-5 rounded border border-[#007AFF] flex items-center justify-center transition-all ${consent ? 'bg-[#007AFF]' : 'bg-transparent'}`}>
                                            {consent && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className="text-xs text-[#9CA3AF] leading-relaxed select-none">
                                            {txt.l_consent}
                                        </span>
                                    </div>

                                    <HoldButton
                                        onExecute={initiateSequence}
                                        disabled={!email || !consent}
                                        label={txt.l_hold_btn}
                                        labelHolding={txt.l_holding}
                                    />

                                    <button onClick={() => setState(OperationalState.IDLE)} className="w-full text-xs text-[#9CA3AF] hover:text-white uppercase tracking-widest mt-4">
                                        Cancel Protocol
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- STATE: INGEST / REVELATION (Execution) --- */}
                        {(state === OperationalState.INGEST || state === OperationalState.REVELATION) && (
                            <div className="text-center py-10 space-y-8 animate-in fade-in duration-500">
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="absolute inset-0 rounded-full border-4 border-[#007AFF]/20" />
                                    <div className="absolute inset-0 rounded-full border-4 border-[#007AFF] border-t-transparent animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Terminal className="w-8 h-8 text-[#007AFF] animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-white font-bold tracking-wider animate-pulse">
                                        {state === OperationalState.INGEST ? txt.ingest : "ANALYZING STRUCTURE"}
                                    </h3>
                                    <p className="text-[#007AFF] text-xs font-mono tracking-widest">
                                        {state === OperationalState.INGEST ? "LOCKED" : "CORRELATING"} // {timestamp.split('T')[1].split('.')[0]}
                                    </p>
                                </div>
                                <div className="h-1 bg-[#0A0F1E] rounded-full overflow-hidden w-full max-w-xs mx-auto">
                                    <div className="h-full bg-[#007AFF] animate-progress-indeterminate" />
                                </div>
                            </div>
                        )}

                        {/* --- STATE: SENTENCE (Verdict) --- */}
                        {state === OperationalState.SENTENCE && (activeUX => (
                            (!['BLOCKED', 'INCONCLUSIVE', 'SYSTEM_ERROR', 'TERMINATED'].includes(activeUX?.system_verdict)) &&
                            <div className="text-center animate-in fade-in zoom-in-95 duration-700">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#007AFF]/10 mb-6">
                                    <ShieldCheck className="w-10 h-10 text-[#007AFF]" />
                                </div>
                                <span className="block text-[#007AFF] font-bold tracking-[0.2em] text-sm mb-2">{activeUX?.verdict_code}</span>
                                <h3 className="text-3xl text-white font-bold mb-6">{activeUX?.ux_controls?.status_label}</h3>
                                <p className="text-[#9CA3AF] text-sm leading-relaxed mb-8 border-t border-white/5 pt-6">
                                    {activeUX?.ux_controls?.message}
                                </p>
                                {activeUX?.ux_controls?.cta && (
                                    <button className="w-full bg-white text-[#0A0F1E] hover:bg-[#E6E8EB] py-4 rounded-xl font-bold tracking-wider uppercase transition-colors">
                                        {activeUX.ux_controls.cta}
                                    </button>
                                )}
                            </div>
                        ))(backendUX)}

                    </div>
                </div>
            </section>

            {/* BLOCK 3: WHY NOW (Value Prop) */}
            <section className="px-6 py-24 border-t border-white/5 bg-[#0A0F1E]">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-[#0F1629] to-[#0A0F1E] border border-white/5 p-10 md:p-16 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#007AFF]/5 rounded-full blur-[80px]" />

                        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <h3 className="text-2xl font-bold text-white uppercase tracking-wide">{txt.l_why_title}</h3>
                                <p className="text-[#9CA3AF] leading-relaxed text-lg">
                                    {txt.l_why_copy}
                                </p>
                            </div>
                            <div className="w-full md:w-1/3 flex justify-center">
                                <AlertTriangle className="w-24 h-24 text-[#007AFF]/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 4: STEPS */}
            <section className="px-6 py-24 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center space-y-4 p-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF] mb-4">
                                <Scan className="w-8 h-8" />
                            </div>
                            <h4 className="text-white font-bold uppercase tracking-wider">{txt.l_step_1}</h4>
                            <div className="h-1 w-12 bg-[#007AFF]/30 rounded-full" />
                        </div>
                        <div className="flex flex-col items-center text-center space-y-4 p-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF] mb-4">
                                <Search className="w-8 h-8" />
                            </div>
                            <h4 className="text-white font-bold uppercase tracking-wider">{txt.l_step_2}</h4>
                            <div className="h-1 w-12 bg-[#007AFF]/30 rounded-full" />
                        </div>
                        <div className="flex flex-col items-center text-center space-y-4 p-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF] mb-4">
                                <FileCheck className="w-8 h-8" />
                            </div>
                            <h4 className="text-white font-bold uppercase tracking-wider">{txt.l_step_3}</h4>
                            <div className="h-1 w-12 bg-[#007AFF]/30 rounded-full" />
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 5: RESULTS VISUAL */}
            <section className="px-6 py-24 border-t border-white/5 bg-[#0F1629]/50">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-xl text-[#9CA3AF] mb-12 uppercase tracking-[0.2em]">{txt.l_res_title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                            <span className="text-emerald-500 font-bold tracking-widest uppercase">{txt.l_res_1}</span>
                        </div>
                        <div className="p-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm">
                            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                            <span className="text-amber-500 font-bold tracking-widest uppercase">{txt.l_res_2}</span>
                        </div>
                        <div className="p-8 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm">
                            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                            <span className="text-red-500 font-bold tracking-widest uppercase">{txt.l_res_3}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 text-center border-t border-white/5">
                <p className="text-[#4B5563] text-xs uppercase tracking-[0.2em]">{txt.l_foot}</p>
            </footer>

        </div>
    )
}
