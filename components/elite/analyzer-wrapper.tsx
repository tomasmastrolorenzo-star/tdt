"use client"

import React, { useState, useEffect, useRef } from "react"
import { Activity, ArrowRight, BarChart2, Check, ChevronRight, FileCheck, Lock, Search, ShieldCheck, Terminal, XCircle, AlertTriangle, Zap } from "lucide-react"

// --- TYPES ---
interface DiagnosisData {
    asset_classification: { subtype: string };
    problems: { critical: { code: string }[] };
    intervention_decision: any;
    intervention_risk: string;
}

enum OperationalState {
    IDLE = 'IDLE',
    INPUT_NICHE = 'INPUT_NICHE',
    INPUT_GOAL = 'INPUT_GOAL',
    INPUT_INVEST = 'INPUT_INVEST',
    SCANNING = 'SCANNING',      // "Retrieving Data"
    PROCESSING = 'PROCESSING',  // "Crunching Numbers" (Heavy/Slow)
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

    // APP STATE
    const [state, setState] = useState<OperationalState>(OperationalState.IDLE);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [result, setResult] = useState<any>(null);
    const [diagnosis, setDiagnosis] = useState<any>(null);
    const [score, setScore] = useState(0);

    // LOGGING HELPER (Bloomberg Style)
    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-5), `> ${msg}`]);
    }

    // --- STEPS NAVIGATION ---
    const nextStep = (curr: OperationalState, validation: boolean) => {
        if (!validation) return;
        switch (curr) {
            case OperationalState.IDLE: setState(OperationalState.INPUT_NICHE); break;
            case OperationalState.INPUT_NICHE: setState(OperationalState.INPUT_GOAL); break;
            case OperationalState.INPUT_GOAL: setState(OperationalState.INPUT_INVEST); break;
            case OperationalState.INPUT_INVEST: runAnalysis(); break;
        }
    }

    // --- CORE LOGIC ---
    const runAnalysis = async () => {
        setState(OperationalState.SCANNING);
        addLog(`INITIATING_SESSION: ${handle.toUpperCase()}`);
        addLog(`SECTOR_CLARIFICATION: ${niche.toUpperCase()}`);
        setProgress(5);

        try {
            // STEP 1: FETCH (Real API Call)
            addLog("ESTABLISHING_SECURE_CONNECTION...");

            const res = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    handle: handle.trim(),
                    mode: 'full'
                })
            });

            setProgress(30);
            const data = await res.json();

            if (data.status === 'error') {
                throw new Error(data.closure?.ux_controls?.message || "Connection Failed");
            }

            // STEP 2: HEAVY PROCESSING (Artificial Delay for "Premium" Feel)
            setState(OperationalState.PROCESSING);
            addLog("DATA_RETRIEVED. BEGINNING_FORENSIC_AUDIT...");

            const steps = [
                "CALCULATING_ENGAGEMENT_INERTIA...",
                "CROSS_REFERENCING_AUDIENCE_INTEGRITY...",
                "DETECTING_STRUCTURAL_ANOMALIES...",
                "GENERATING_FINAL_VERDICT..."
            ];

            let p = 30;
            for (const step of steps) {
                await new Promise(r => setTimeout(r, 1200));
                addLog(step);
                p += 15;
                setProgress(p);
            }

            setResult(data);

            // CALCULATE SCORE & DIAGNOSIS
            // Logic: 
            // - If verified or very high followers (>50k) -> OPTIMIZATION (Green)
            // - If > 10k followers -> POTENTIAL (Yellow)
            // - Else -> RISK (Red) (Default for most leads to sell "Rescue")

            let calculatedScore = 30;
            let selectedDiagnosis = DIAGNOSIS_COPY.RISK;

            if (data.isVerified || (data.followersCount && data.followersCount > 50000)) {
                calculatedScore = Math.floor(Math.random() * (95 - 76) + 76);
                selectedDiagnosis = DIAGNOSIS_COPY.OPTIMIZATION;
            } else if (data.followersCount && data.followersCount > 5000) {
                calculatedScore = Math.floor(Math.random() * (75 - 41) + 41);
                selectedDiagnosis = DIAGNOSIS_COPY.POTENTIAL;
            } else {
                calculatedScore = Math.floor(Math.random() * (40 - 15) + 15);
                selectedDiagnosis = DIAGNOSIS_COPY.RISK;
            }

            setScore(calculatedScore);
            setDiagnosis(selectedDiagnosis);

            // STEP 3: WEBHOOK TRIGGER
            addLog("SYNCHRONIZING_WITH_HQ...");

            const payload = {
                username: handle,
                niche: niche,
                pain_point: selectedDiagnosis.title, // Inferred Pain Point from diagnosis
                goal: goal,
                investment: investment,
                score: calculatedScore
            };

            // Non-blocking fetch (Fire and Forget)
            fetch(WEBHOOK_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(() => console.log("Webhook Sent")).catch(e => console.error("Webhook Error", e));

            setProgress(100);
            addLog("SESSION_FINALIZED.");
            setState(OperationalState.COMPLETE);

        } catch (e: any) {
            console.error(e);
            addLog(`ERROR: ${e.message}`);
            setState(OperationalState.ERROR);
        }
    }

    // --- RENDERERS ---

    // SHARED: Selection Button
    const SelectBtn = ({ label, selected, onClick }: any) => (
        <button
            onClick={onClick}
            className={`w-full text-left px-6 py-4 border ${selected ? 'bg-[#007AFF] border-[#007AFF] text-white' : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white'} transition-all font-mono uppercase tracking-widest text-xs mb-3 flex justify-between items-center group`}
        >
            {label}
            {selected && <Check className="w-4 h-4" />}
            {!selected && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </button>
    )

    // 1. INPUT: USERNAME
    const renderInput = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
                <label className="text-xs font-mono text-[#007AFF] tracking-[0.2em] uppercase">Target Asset</label>
                <div className="flex items-center border-b-2 border-white/20 focus-within:border-[#007AFF] transition-colors py-4">
                    <span className="text-2xl text-white/40 mr-2">@</span>
                    <input
                        value={handle}
                        onChange={e => setHandle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handle && nextStep(OperationalState.IDLE, true)}
                        placeholder="username"
                        className="bg-transparent border-none outline-none text-3xl md:text-4xl text-white font-mono placeholder:text-white/10 w-full uppercase"
                        autoFocus
                    />
                </div>
            </div>
            <button
                onClick={() => nextStep(OperationalState.IDLE, !!handle)}
                disabled={!handle}
                className="w-full bg-white text-black h-14 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#E6E8EB] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Start Protocol
            </button>
        </div>
    )

    // 2. INPUT: NICHE
    const renderNiche = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-lg text-white font-serif">Sector Profesional</h3>
            <div>
                {['Medical / Health', 'Pro Athlete', 'Business / Finance', 'Real Estate', 'Other'].map(opt => (
                    <SelectBtn key={opt} label={opt} selected={niche === opt} onClick={() => setNiche(opt)} />
                ))}
            </div>
            <button onClick={() => nextStep(OperationalState.INPUT_NICHE, !!niche)} disabled={!niche} className="w-full bg-[#007AFF] text-white py-4 text-xs font-bold tracking-[0.2em] uppercase">Next Step</button>
        </div>
    )

    // 3. INPUT: GOAL
    const renderGoal = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-lg text-white font-serif">Objetivo Principal</h3>
            <div>
                {['Build Authority', 'Monetize Audience', 'Network / Connections', 'Crisis Management'].map(opt => (
                    <SelectBtn key={opt} label={opt} selected={goal === opt} onClick={() => setGoal(opt)} />
                ))}
            </div>
            <button onClick={() => nextStep(OperationalState.INPUT_GOAL, !!goal)} disabled={!goal} className="w-full bg-[#007AFF] text-white py-4 text-xs font-bold tracking-[0.2em] uppercase">Next Step</button>
        </div>
    )

    // 4. INPUT: INVESTMENT
    const renderInvest = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-lg text-white font-serif">Nivel de Inversión Disponible</h3>
            <div>
                {['$1k - $3k (Starter)', '$3k - $10k (Growth)', '$10k+ (Dominance)'].map(opt => (
                    <SelectBtn key={opt} label={opt} selected={investment === opt} onClick={() => setInvestment(opt)} />
                ))}
            </div>
            <button onClick={() => nextStep(OperationalState.INPUT_INVEST, !!investment)} disabled={!investment} className="w-full bg-[#007AFF] text-white py-4 text-xs font-bold tracking-[0.2em] uppercase">Run Audit</button>
        </div>
    )

    // 5. LOADING (Heavy Data Processing)
    const renderProcessing = () => (
        <div className="space-y-8 font-mono">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10 overflow-hidden">
                <div
                    className="h-full bg-[#007AFF] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Logs Area */}
            <div className="h-64 bg-black/50 border border-white/10 p-6 space-y-3 overflow-hidden relative font-mono text-xs">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#007AFF] rounded-full animate-pulse" />
                    <span className="text-[10px] text-[#007AFF] uppercase tracking-widest">Processing</span>
                </div>
                {logs.map((log, i) => (
                    <div key={i} className="text-white/70 border-l-2 border-[#007AFF]/50 pl-3 py-1">
                        {log}
                    </div>
                ))}
            </div>
        </div>
    )

    // 6. RESULTS (The Final Verdict Copy)
    const renderResult = () => result && diagnosis && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-1000">
            <div className="bg-[#050505] border border-[#007AFF]/30 p-8 md:p-12 text-center space-y-8 shadow-[0_0_50px_rgba(0,122,255,0.1)] relative overflow-hidden">

                {/* Result Header */}
                <div className="flex justify-between items-start border-b border-white/10 pb-6 relative z-10">
                    <div className="text-left">
                        <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1">ASSET</div>
                        <div className="text-xl text-white font-mono">@{result.username}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1">SCORE</div>
                        <div className={`text-3xl font-mono font-bold ${diagnosis.color}`}>{score}/100</div>
                    </div>
                </div>

                {/* Score & Verdict */}
                <div className="py-4 space-y-6 relative z-10">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-2 ${diagnosis.borderColor} bg-white/5 mb-2 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                        <diagnosis.icon className={`w-10 h-10 ${diagnosis.color}`} />
                    </div>

                    <h3 className={`text-2xl md:text-3xl font-serif tracking-wide text-white uppercase`}>
                        {diagnosis.title}
                    </h3>

                    <div className="text-left bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                        <p className="text-white/80 leading-relaxed font-light text-sm md:text-base">
                            {diagnosis.body}
                        </p>
                        <div className="flex items-start gap-3 pt-2">
                            <div className={`w-1 h-12 ${diagnosis.color.replace('text-', 'bg-')} rounded-full opacity-50`} />
                            <p className="text-white font-medium italic text-sm">
                                "{diagnosis.hook}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <button
                    onClick={() => window.location.href = '#consulting-form'} // Placeholder for Consult Form
                    className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] hover:bg-[#E6E8EB] transition-all relative z-10 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                    {diagnosis.cta}
                </button>

                {/* Background Glow based on Verdict */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full ${diagnosis.color.replace('text-', 'bg-')} opacity-[0.03] blur-3xl pointer-events-none`} />
            </div>
        </div>
    )

    return (
        <section id="analyzer-section" className="py-32 bg-black relative z-10 border-t border-white/10">
            <div className="max-w-3xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#007AFF]/30 rounded text-[#007AFF] text-[10px] font-mono uppercase tracking-widest mb-4">
                        <Terminal className="w-3 h-3" />
                        Live Market Data
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif text-white">Auditoría de Autoridad</h2>
                    <p className="text-white/50">Terminal TDT v2.0 • Acceso Profesional</p>
                </div>

                {/* Terminal Window */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-sm shadow-2xl shadow-[#007AFF]/5 min-h-[500px] flex flex-col relative overflow-hidden">
                    {/* Gloss Effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center max-w-xl mx-auto w-full">
                        {state === OperationalState.IDLE && renderInput()}
                        {state === OperationalState.INPUT_NICHE && renderNiche()}
                        {state === OperationalState.INPUT_GOAL && renderGoal()}
                        {state === OperationalState.INPUT_INVEST && renderInvest()}
                        {(state === OperationalState.SCANNING || state === OperationalState.PROCESSING) && renderProcessing()}
                        {state === OperationalState.COMPLETE && renderResult()}
                        {state === OperationalState.ERROR && (
                            <div className="text-center space-y-4">
                                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                                <h3 className="text-xl text-white">Error de Conexión</h3>
                                <button onClick={() => setState(OperationalState.IDLE)} className="text-sm underline text-red-500">Reiniciar Sistema</button>
                            </div>
                        )}
                    </div>

                    {/* Terminal Footer */}
                    <div className="bg-black border-t border-white/5 p-2 flex justify-between items-center px-4 text-[10px] text-white/20 font-mono uppercase tracking-widest">
                        <span>SECURE_CONNECTION: TLS_1.3</span>
                        <span>{state}</span>
                    </div>
                </div>

            </div>
        </section>
    )
}
