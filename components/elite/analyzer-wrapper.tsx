"use client"

import React, { useState, useEffect, useRef } from "react"
import { Activity, ArrowRight, BarChart2, Check, ChevronRight, FileCheck, Lock, Search, ShieldCheck, Terminal, XCircle, AlertTriangle, Zap, User, Loader2 } from "lucide-react"

// --- TYPES ---
interface DiagnosisData {
    username: string;
    profilePicUrl: string;
    followersCount: number;
    isVerified: boolean;
    isPrivate: boolean;
    biography: string;
}

enum OperationalState {
    IDLE = 'IDLE',
    SEARCHING = 'SEARCHING',     // Fetching Data (Real API)
    ASSET_FOUND = 'ASSET_FOUND', // Show Profile ("Screener")
    INPUT_NICHE = 'INPUT_NICHE',
    INPUT_GOAL = 'INPUT_GOAL',
    INPUT_INVEST = 'INPUT_INVEST',
    PROCESSING = 'PROCESSING',  // "Crunching Numbers" (Visuals)
    COMPLETE = 'COMPLETE',      // "Verdict"
    ERROR = 'ERROR'
}

// --- CONFIGURATION ---
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbywUSmt3SjhqlEFAN0QpOoh9SLclIveyccD8D7UTxDxUkU8tw17OrC5depNKUV5z1nuiQ/exec";

// --- COPYWRITING (The Oracle) ---
const DIAGNOSIS_COPY = {
    RISK: {
        title: "ALERTA DE INCOHERENCIA DIGITAL",
        body: "Tu trayectoria en el mundo real es de nivel 10, pero tu presencia digital actual proyecta un 3. Estás sufriendo una fuga de autoridad: potenciales clientes o aliados de alto nivel están juzgando tu capacidad profesional basados en una estética amateur. Sin señales de verificación ni una curaduría visual sólida, tu perfil es un obstáculo para tus objetivos de 2026.",
        hook: "Necesitas una intervención de activos digitales inmediata para que tu perfil deje de restar y empiece a multiplicar tu valor percibido.",
        cta: "Solicitar Rescate de Marca Personal",
        icon: AlertTriangle,
        color: "text-red-500",
        borderColor: "border-red-500"
    },
    POTENTIAL: {
        title: "POTENCIAL DE AUTORIDAD SIN EXPLOTAR",
        body: "Tienes una base sólida, pero te falta el 'Factor de Élite'. Tu perfil comunica profesionalismo, pero no exclusividad. En un mercado saturado, ser 'bueno' no es suficiente; necesitas ser la autoridad indiscutible. La ausencia de una verificación oficial y de una narrativa visual de alto impacto te mantiene en el mismo nivel que tu competencia directa.",
        hook: "Estamos a un paso de convertir tu perfil en un activo de cierre automático. Solo falta la validación institucional y el pulido de activos de autoridad.",
        cta: "Subir a Nivel Elite Professional",
        icon: Zap,
        color: "text-amber-500",
        borderColor: "border-amber-500"
    },
    OPTIMIZATION: {
        title: "ESTADO DE PRE-VERIFICACIÓN ALCANZADO",
        body: "Tu marca personal ya respira autoridad. Tienes los activos, la estética y la audiencia. Sin embargo, para un CEO de tu calibre, el Check Azul no es un lujo, es una herramienta de seguridad y estatus necesaria para proteger tu identidad y consolidar tu posición en el mercado global. Estás en el 5% superior, es hora de hacerlo oficial.",
        hook: "Tu perfil está listo para el proceso de verificación permanente. Solo falta el despliegue final de activos para asegurar tu lugar entre los verificados.",
        cta: "Finalizar Verificación Oficial",
        icon: ShieldCheck,
        color: "text-emerald-500",
        borderColor: "border-emerald-500"
    }
}

export default function AnalyzerWrapper() {
    // FORM STATE
    const [handle, setHandle] = useState("");
    const [niche, setNiche] = useState("");
    const [goal, setGoal] = useState("");
    const [investment, setInvestment] = useState("");
    const [errorDescr, setErrorDescr] = useState("");

    // APP STATE
    const [state, setState] = useState<OperationalState>(OperationalState.IDLE);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [profileData, setProfileData] = useState<DiagnosisData | null>(null);
    const [finalScore, setFinalScore] = useState(0);
    const [diagnosis, setDiagnosis] = useState<any>(null);

    // LOGGING HELPER (Strategic Consultant Style)
    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-5), `${msg}`]); // Removed ">"
    }

    // --- PHASE 1: SCREENER (Real Fetch) ---
    const startScreener = async () => {
        if (!handle) return;
        setState(OperationalState.SEARCHING);
        setLogs([]);
        addLog(`Iniciando evaluación de activo: ${handle.toUpperCase()}`);
        setProgress(10);

        try {
            // Call API in PREVIEW mode (Faster/Standard)
            const res = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    handle: handle.trim(),
                    mode: 'preview' // Get data first, verify later
                })
            });

            // Handle HTTP Errors
            if (!res.ok) {
                if (res.status === 504) throw new Error("Tiempo de espera agotado (Vercel Timeout).");
                throw new Error(`Error del servidor: ${res.status}`);
            }

            setProgress(40);

            // Handle JSON Errors
            let data;
            try {
                data = await res.json();
            } catch (jsonErr) {
                console.error("JSON Parse Error:", jsonErr);
                throw new Error("Respuesta del servidor corrupta.");
            }

            console.log("API Payload:", data);

            if (data.status === 'error') {
                // Even if 'private', we might get some data, but usually error
                throw new Error(data.closure?.ux_controls?.message || "Recurso no accesible o privado.");
            }

            // Handle Missing Profile Logic (Prevent Blank Screen)
            if (!data.profile) {
                console.error("Critical: Missing profile in success response", data);
                throw new Error("Estructura de datos incompleta.");
            }

            // Success - Store Data
            setProfileData(data.profile);
            addLog("Perfil identificado exitosamente.");

            setProgress(50);
            // Artificial delay to let user read logs
            setTimeout(() => {
                setState(OperationalState.ASSET_FOUND);
            }, 800);

        } catch (e: any) {
            console.error(e);
            addLog(`Error Crítico: ${e.message}`);
            setErrorDescr(e.message);
            setState(OperationalState.ERROR);
        }
    }

    // --- PHASE 2: DATA COLLECTION ---
    const nextStep = (curr: OperationalState, val: string) => {
        switch (curr) {
            case OperationalState.ASSET_FOUND: setState(OperationalState.INPUT_NICHE); break; // Start Questions
            case OperationalState.INPUT_NICHE: setNiche(val); setState(OperationalState.INPUT_GOAL); break;
            case OperationalState.INPUT_GOAL: setGoal(val); setState(OperationalState.INPUT_INVEST); break;
            case OperationalState.INPUT_INVEST: setInvestment(val); runFinalAnalysis(val); break;
        }
    }

    // --- PHASE 3: ANALYSIS (Client-Side Simulation + Webhook) ---
    const runFinalAnalysis = async (finalInvestment: string) => {
        setState(OperationalState.PROCESSING);
        addLog("Compilando reporte de viabilidad...");

        // 1. Calculate Score (Local Logic)
        let score = 30;
        let diag = DIAGNOSIS_COPY.RISK;

        if (profileData) {
            const followers = profileData.followersCount || 0;
            const verified = profileData.isVerified;

            if (verified || followers > 50000) {
                score = Math.floor(Math.random() * (95 - 76) + 76);
                diag = DIAGNOSIS_COPY.OPTIMIZATION;
            } else if (followers > 5000) {
                score = Math.floor(Math.random() * (75 - 41) + 41);
                diag = DIAGNOSIS_COPY.POTENTIAL;
            } else {
                score = Math.floor(Math.random() * (40 - 15) + 15);
                diag = DIAGNOSIS_COPY.RISK;
            }
        }
        setFinalScore(score);
        setDiagnosis(diag);

        // 2. Visual Theatre (Consulting Terms)
        const steps = [
            "Analizando vectores de engagement...",
            "Auditando integridad de audiencia...",
            "Proyectando brecha de autoridad...",
            "Generando veredicto final..."
        ];

        let p = 50;
        for (const step of steps) {
            await new Promise(r => setTimeout(r, 1200));
            addLog(step);
            p += 10;
            setProgress(p);
        }

        // 3. Webhook Trigger (Fire & Forget)
        addLog("Sincronizando con base de datos central...");

        // Final payload construction
        const payload = {
            username: handle,
            niche: niche,
            goal: goal,
            investment: finalInvestment,
            score: score,
            pain_point: diag.title // Inferred, but passed as requested just in case
        };

        // Debug Log
        console.log("Sending Webhook Payload:", payload);

        fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(() => {
            console.log("Webhook dispatched successfully");
        }).catch(err => console.error("Webhook dispatch failed", err));

        setProgress(100);
        setState(OperationalState.COMPLETE);
    }

    // --- RENDERERS ---

    // 1. INPUT (Screener)
    const renderInput = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
                <label className="text-xs font-serif text-[#007AFF] tracking-widest uppercase">Target Asset Handle</label>
                <div className="flex items-center border-b border-white/20 focus-within:border-[#007AFF] transition-colors py-4">
                    <span className="text-2xl text-white/40 mr-2 font-serif">@</span>
                    <input
                        value={handle}
                        onChange={e => setHandle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handle && startScreener()}
                        placeholder="username"
                        className="bg-transparent border-none outline-none text-3xl md:text-4xl text-white font-serif placeholder:text-white/10 w-full"
                        autoFocus
                    />
                </div>
            </div>
            <button
                onClick={startScreener}
                disabled={!handle}
                className="w-full bg-[#007AFF] text-white h-14 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#0060C9] disabled:opacity-50 transition-all shadow-lg"
            >
                {state === OperationalState.SEARCHING ? "Localizando Activo..." : "Iniciar Evaluación"}
            </button>
        </div>
    )

    // 2. PROFILE FOUND (The "Screener" Result)
    const renderAssetFound = () => profileData && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center">
            <div className="flex flex-col items-center gap-4 py-8">
                <div className="relative">
                    <img
                        src={`https://wsrv.nl/?url=${encodeURIComponent(profileData.profilePicUrl)}`}
                        className="w-32 h-32 rounded-full border-4 border-[#007AFF]/20 shadow-2xl"
                    />
                    {profileData.isVerified && (
                        <div className="absolute bottom-0 right-0 bg-[#007AFF] p-2 rounded-full border-4 border-black shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-2xl font-serif text-white">@{profileData.username}</h3>
                    <div className="flex items-center justify-center gap-4 text-xs font-sans text-white/50 mt-2 upp">
                        <span>{profileData.followersCount.toLocaleString()} Followers</span>
                        <span>•</span>
                        <span>{profileData.isPrivate ? "PRIVATE" : "PUBLIC"}</span>
                    </div>
                </div>
            </div>
            <div className="bg-[#007AFF]/5 border border-[#007AFF]/10 p-4 rounded text-xs text-[#007AFF] tracking-widest uppercase mb-8">
                Activo Identificado. Iniciando protocolo...
            </div>
            <button
                onClick={() => nextStep(OperationalState.ASSET_FOUND, "")}
                className="w-full bg-white text-black h-14 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#E6E8EB] transition-all shadow-lg"
            >
                Confirmar y Continuar
            </button>
        </div>
    )

    // 3. QUESTIONS (Consulting Style)
    const SelectBtn = ({ label, onClick }: any) => (
        <button
            onClick={onClick}
            className={`w-full text-left px-6 py-5 border border-white/5 bg-white/[0.02] text-white/70 hover:border-[#007AFF]/50 hover:text-white hover:bg-[#007AFF]/5 transition-all font-serif text-sm mb-3 flex justify-between items-center group`}
        >
            {label}
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#007AFF]" />
        </button>
    )

    const renderQuestions = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            {state === OperationalState.INPUT_NICHE && (
                <>
                    <h3 className="text-xl text-white font-serif mb-6 text-center">Seleccione su Sector de Influencia</h3>
                    {['Medicina de Alta Especialidad', 'Perfil Atlético Profesional / Agente', 'Dirección Corporativa y Finanzas', 'Desarrollos y Real Estate Global'].map(opt => (
                        <SelectBtn key={opt} label={opt} onClick={() => nextStep(OperationalState.INPUT_NICHE, opt)} />
                    ))}
                </>
            )}
            {state === OperationalState.INPUT_GOAL && (
                <>
                    <h3 className="text-xl text-white font-serif mb-6 text-center">Objetivo Estratégico</h3>
                    {['Consolidar Liderazgo de Opinión', 'Optimización de Conversión de Activos', 'Blindaje y Protección de Reputación'].map(opt => (
                        <SelectBtn key={opt} label={opt} onClick={() => nextStep(OperationalState.INPUT_GOAL, opt)} />
                    ))}
                </>
            )}
            {state === OperationalState.INPUT_INVEST && (
                <>
                    <h3 className="text-xl text-white font-serif mb-6 text-center">Proyección de Alcance</h3>
                    {['Escala de Impacto: Regional', 'Escala de Impacto: Nacional', 'Escala de Impacto: Global / Industrial'].map(opt => (
                        <SelectBtn key={opt} label={opt} onClick={() => nextStep(OperationalState.INPUT_INVEST, opt)} />
                    ))}
                </>
            )}
        </div>
    )

    // 4. LOADING (Consulting Style)
    const renderProcessing = () => (
        <div className="space-y-8">
            {/* Minimalist Progress Bar */}
            <div className="w-full h-[1px] bg-white/10 overflow-hidden">
                <div
                    className="h-full bg-[#007AFF] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Logs Area (Clean) */}
            <div className="h-48 flex flex-col justify-center items-center space-y-4 text-center">
                <Loader2 className="w-8 h-8 text-[#007AFF] animate-spin" />
                <div className="space-y-2">
                    {logs.slice(-1).map((log, i) => (
                        <p key={i} className="text-white/70 font-serif text-lg animate-pulse">
                            {log}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    )

    // 5. RESULTS (Final Verdict)
    const renderResult = () => profileData && diagnosis && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-1000">
            <div className="bg-[#050505] p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
                {/* Result Header */}
                <div className="flex justify-between items-start border-b border-white/10 pb-6 relative z-10">
                    <div className="text-left">
                        <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1">ASSET</div>
                        <div className="text-xl text-white font-serif">@{profileData.username}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1">SCORE</div>
                        <div className={`text-3xl font-serif font-bold ${diagnosis.color}`}>{finalScore}/100</div>
                    </div>
                </div>

                <div className="py-4 space-y-6 relative z-10">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-2 ${diagnosis.borderColor} bg-white/5 mb-2 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                        <diagnosis.icon className={`w-10 h-10 ${diagnosis.color}`} />
                    </div>

                    <h3 className={`text-2xl md:text-3xl font-serif tracking-wide text-white uppercase`}>
                        {diagnosis.title}
                    </h3>

                    <div className="text-left bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                        <p className="text-white/80 leading-relaxed font-light text-sm md:text-base font-sans">
                            {diagnosis.body}
                        </p>
                        <div className="flex items-start gap-3 pt-2">
                            <div className={`w-1 h-12 ${diagnosis.color.replace('text-', 'bg-')} rounded-full opacity-50`} />
                            <p className="text-white font-medium italic text-sm font-serif">
                                "{diagnosis.hook}"
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => window.open('https://wa.me/your_number', '_blank')}
                    className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] hover:bg-[#E6E8EB] transition-all relative z-10 shadow-xl"
                >
                    {diagnosis.cta}
                </button>
            </div>
        </div>
    )

    return (
        <section id="analyzer-section" className="py-32 bg-black relative z-10 border-t border-white/10">
            <div className="max-w-3xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#007AFF]/30 rounded-full text-[#007AFF] text-[10px] font-mono uppercase tracking-widest mb-4">
                        <Activity className="w-3 h-3" />
                        Live Analysis
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif text-white">Protocolo de Evaluación de Activos Digitales</h2>
                    <p className="text-white/50 font-light">Análisis de viabilidad para el Programa de Verificación y Posicionamiento de Élite.</p>
                </div>

                {/* Main Window */}
                <div className="bg-[#0AA0A] border border-white/10 rounded-xl shadow-2xl shadow-[#007AFF]/5 min-h-[500px] flex flex-col relative overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-black">

                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center max-w-xl mx-auto w-full">
                        {state === OperationalState.IDLE && renderInput()}
                        {state === OperationalState.SEARCHING && renderProcessing()}
                        {state === OperationalState.ASSET_FOUND && renderAssetFound()}
                        {(state === OperationalState.INPUT_NICHE || state === OperationalState.INPUT_GOAL || state === OperationalState.INPUT_INVEST) && renderQuestions()}
                        {state === OperationalState.PROCESSING && renderProcessing()}
                        {state === OperationalState.COMPLETE && renderResult()}
                        {state === OperationalState.ERROR && (
                            <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                                <div className="space-y-2">
                                    <h3 className="text-xl text-white font-serif">Error de Análisis</h3>
                                    <p className="text-red-400 text-xs md:text-sm max-w-md mx-auto font-mono bg-red-500/10 p-3 rounded border border-red-500/20">
                                        {errorDescr || "Error desconocido del sistema."}
                                    </p>
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest">
                                        Soporte Técnico Notificado
                                    </p>
                                </div>
                                <button onClick={() => window.location.reload()} className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                                    Reiniciar Sistema
                                </button>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </section>
    )
}
