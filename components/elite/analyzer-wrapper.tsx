"use client"

import React, { useState, useEffect, useRef } from "react"
import { Activity, ArrowRight, BarChart2, Check, ChevronRight, FileCheck, Lock, Search, ShieldCheck, Terminal, XCircle, AlertTriangle, Zap, User, Loader2, Briefcase, Camera, Landmark, Building, Medal, TrendingUp, Info, Stethoscope, Globe, MapPin, Users } from "lucide-react"

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
    SEARCHING = 'SEARCHING',     // Fetching Data
    ASSET_FOUND = 'ASSET_FOUND', // Show Profile ("Screener")
    INPUT_VERIFICATION = 'INPUT_VERIFICATION', // Step 1
    INPUT_NICHE = 'INPUT_NICHE',               // Step 2
    INPUT_METRICS = 'INPUT_METRICS',           // Step 3 (Traffic Light)
    INPUT_AMBITION = 'INPUT_AMBITION',         // Step 4 (Growth Goal)
    INPUT_SEGMENTATION = 'INPUT_SEGMENTATION', // Step 5 (Optional)
    PROCESSING = 'PROCESSING',  // "Crunching Numbers"
    COMPLETE = 'COMPLETE',      // "Verdict"
    ERROR = 'ERROR'
}

// --- CONFIGURATION ---
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwKHz55cnRkdUc4vLpig4kFWe-eScWwJ40ub9oVvO1jNjTC4S3y8itep4y-VxlFoN5d5Q/exec";

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
    const [verificationStatus, setVerificationStatus] = useState("");
    const [niche, setNiche] = useState("");
    const [followersInput, setFollowersInput] = useState("");
    const [likesInput, setLikesInput] = useState("");
    const [engagementRate, setEngagementRate] = useState<number | null>(null);
    const [healthStatus, setHealthStatus] = useState<"CRITICAL" | "RISK" | "OPTIMAL" | null>(null);

    const [errorDescr, setErrorDescr] = useState("");
    const [showMonthlyModal, setShowMonthlyModal] = useState(false); // Education Hook

    // NEW SEGMENTATION DATA
    const [growthGoal, setGrowthGoal] = useState("");
    const [geo, setGeo] = useState("Global");
    const [gender, setGender] = useState("Mixto");
    const [age, setAge] = useState("25-45 (Prime Force)");

    // APP STATE
    const [state, setState] = useState<OperationalState>(OperationalState.IDLE);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [profileData, setProfileData] = useState<DiagnosisData | null>(null);
    const [finalScore, setFinalScore] = useState(0);
    const [diagnosis, setDiagnosis] = useState<any>(null);

    // LOGGING HELPER
    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-5), `${msg}`]);
    }

    // --- PHASE 1: SCREENER (Real Fetch) ---
    const startScreener = async () => {
        if (!handle) return;
        setState(OperationalState.SEARCHING);
        setLogs([]);
        addLog(`Iniciando evaluación de activo: ${handle.toUpperCase()}`);
        setProgress(10);

        try {
            const res = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ handle: handle.trim(), mode: 'preview' })
            });

            if (!res.ok) {
                if (res.status === 504) throw new Error("Tiempo de espera agotado (Vercel Timeout).");
                throw new Error(`Error del servidor: ${res.status}`);
            }

            setProgress(40);
            let data;
            try { data = await res.json(); } catch (jsonErr) { throw new Error("Respuesta del servidor corrupta."); }

            if (data.status === 'error') throw new Error(data.closure?.ux_controls?.message || "Recurso no accesible.");
            if (!data.profile) throw new Error("Estructura de datos incompleta.");

            setProfileData(data.profile);
            // Pre-fill metrics if available, otherwise keep empty for manual audit
            if (data.profile.followersCount) setFollowersInput(data.profile.followersCount.toString());

            addLog("Perfil identificado exitosamente.");
            setProgress(50);
            setTimeout(() => setState(OperationalState.ASSET_FOUND), 800);

        } catch (e: any) {
            console.error(e);
            setErrorDescr(e.message);
            setState(OperationalState.ERROR);
        }
    }

    // --- PHASE 2: SEGMENTATION FLOW ---

    // Step 1: Verification Hook
    const handleVerificationSelect = (status: string) => {
        if (status === 'monthly') {
            setShowMonthlyModal(true);
            return;
        }
        setVerificationStatus(status);
        setState(OperationalState.INPUT_NICHE);
    }

    const confirmPermanentSwitch = () => {
        setShowMonthlyModal(false);
        setVerificationStatus('permanent_interest'); // Captured the up-sell interest
        setState(OperationalState.INPUT_NICHE);
    }

    // Step 3: Metric Calculation (Real-time)
    useEffect(() => {
        if (followersInput && likesInput) {
            const f = parseInt(followersInput.replace(/,/g, ''));
            const l = parseInt(likesInput.replace(/,/g, ''));
            if (f > 0 && l >= 0) {
                const rate = (l / f) * 100;
                setEngagementRate(rate);

                if (rate < 3) setHealthStatus("CRITICAL");
                else if (rate >= 3 && rate < 8) setHealthStatus("RISK");
                else setHealthStatus("OPTIMAL");
            }
        }
    }, [followersInput, likesInput]);

    // --- PHASE 3: ANALYSIS & RESULT ---
    const runFinalAnalysis = async () => {
        setState(OperationalState.PROCESSING);
        addLog("Compilando matriz de salud algorítmica...");

        // 1. Determine Diagnosis based on Audit
        let score = 30;
        let diag = DIAGNOSIS_COPY.RISK;

        if (healthStatus === "OPTIMAL") {
            score = 88;
            diag = DIAGNOSIS_COPY.OPTIMIZATION;
        } else if (healthStatus === "RISK") {
            score = 55;
            diag = DIAGNOSIS_COPY.POTENTIAL;
        } else {
            score = 12; // Critical
            diag = DIAGNOSIS_COPY.RISK;
        }

        setFinalScore(score);
        setDiagnosis(diag);

        // 2. The Theatre
        const steps = [
            `Auditando nicho: ${niche.toUpperCase()}...`,
            `Validando estatus: ${verificationStatus === 'permanent' ? 'VERIFICADO' : 'NO OFICIAL'}...`,
            `Calculando tasa de retención (ER: ${engagementRate?.toFixed(2)}%)...`,
            "Generando reporte de viabilidad..."
        ];

        let p = 50;
        for (const step of steps) {
            await new Promise(r => setTimeout(r, 1000));
            addLog(step);
            p += 12;
            setProgress(p);
        }

        // 3. Webhook
        const payload = {
            username: handle,
            niche: niche,
            verification_type: verificationStatus,
            follower_count: followersInput,
            avg_likes: likesInput,
            engagement_rate: engagementRate?.toFixed(2),
            health_status: healthStatus,
            final_score: score,
            pain_point: diagnosis.title,
            growth_goal: growthGoal,
            geo_focus: geo,
            target_gender: gender,
            target_age: age
        };
        fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => console.error(err));

        setProgress(100);
        setState(OperationalState.COMPLETE);
    }

    // --- RENDERERS ---

    // 1. VERIFICATION STEP
    const renderVerificationStep = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-xl text-white font-serif mb-6 text-center">Estado de Verificación del Activo</h3>

            <button onClick={() => handleVerificationSelect('none')} className="w-full text-left px-6 py-5 border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all font-serif text-sm text-white/70 mb-3 flex items-center justify-between group">
                Sin Verificación
                <div className="w-4 h-4 rounded-full border border-white/20 group-hover:border-white" />
            </button>

            <button onClick={() => handleVerificationSelect('monthly')} className="w-full text-left px-6 py-5 border border-[#C5A059]/20 bg-[#C5A059]/5 hover:bg-[#C5A059]/10 transition-all font-serif text-sm text-[#C5A059] mb-3 flex items-center justify-between group relative overflow-hidden">
                Suscripción Mensual (Meta Verified)
                <div className="w-4 h-4 rounded-full border border-[#C5A059]/50" />
            </button>

            <button onClick={() => handleVerificationSelect('permanent')} className="w-full text-left px-6 py-5 border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all font-serif text-sm text-amber-500 mb-3 flex items-center justify-between group">
                Verificación Permanente (Legacy/Notable)
                <div className="w-4 h-4 rounded-full border border-amber-500/50" />
            </button>

            {/* Education Modal Overlay */}
            {showMonthlyModal && (
                <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 text-center animate-in fade-in duration-300">
                    <div className="space-y-6 max-w-sm">
                        <Info className="w-12 h-12 text-[#C5A059] mx-auto animate-bounce" />
                        <h4 className="text-xl font-serif text-white">Sabías que...</h4>
                        <p className="text-sm text-white/70 leading-relaxed font-light">
                            La suscripción mensual es una etiqueta temporal que no otorga autoridad real. Podemos gestionar su <span className="text-white font-bold">Verificación Permanente</span> en 10 días, eliminando pagos recurrentes y blindando su estatus.
                        </p>
                        <button onClick={confirmPermanentSwitch} className="w-full py-4 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#B08D4B]">
                            Entendido, aplicar a Permanente
                        </button>
                        <button onClick={() => { setShowMonthlyModal(false); setVerificationStatus('monthly'); setState(OperationalState.INPUT_NICHE); }} className="text-[10px] text-white/30 uppercase underline tracking-widest mt-4">
                            Continuar con perfil mensual
                        </button>
                    </div>
                </div>
            )}
        </div>
    )

    // 2. NICHE STEP
    const renderNicheStep = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-xl text-white font-serif mb-6 text-center">Selección de Nicho de Élite</h3>
            <div className="grid grid-cols-2 gap-4">
                {[
                    { id: 'investor', label: 'Investor', icon: Briefcase },
                    { id: 'model', label: 'Model/Public', icon: Camera },
                    { id: 'ceo', label: 'CEO & Founder', icon: Building },
                    { id: 'real_estate', label: 'Real Estate', icon: Landmark },
                    { id: 'athlete', label: 'Pro Athlete', icon: Medal },
                    { id: 'trader', label: 'Fin/Trader', icon: TrendingUp },
                    { id: 'medical', label: 'Medical Specialist', icon: Stethoscope },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => { setNiche(item.id); setState(OperationalState.INPUT_METRICS); }}
                        className="flex flex-col items-center justify-center p-6 border border-white/5 bg-white/[0.02] hover:bg-[#C5A059]/10 hover:border-[#C5A059]/30 transition-all group"
                    >
                        <item.icon strokeWidth={1} className="w-8 h-8 text-white/50 group-hover:text-[#C5A059] mb-3 transition-colors" />
                        <span className="text-xs font-serif text-white/70 group-hover:text-white uppercase tracking-widest">{item.label}</span>
                    </button>
                ))}
            </div>
            <p className="text-center text-[10px] text-white/30 font-mono mt-4 animate-pulse">
                Analizando nodos de competencia para el sector seleccionado...
            </p>
        </div>
    )

    // 3. METRICS STEP (Traffic Light)
    const renderMetricsStep = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-xl text-white font-serif mb-6 text-center">Auditoría de Salud Algorítmica</h3>

            <div className="space-y-4">
                <div>
                    <label className="text-[10px] text-[#C5A059] uppercase tracking-widest mb-2 block">Seguidores Totales</label>
                    <input
                        type="number"
                        value={followersInput}
                        onChange={e => setFollowersInput(e.target.value)}
                        placeholder="Ej: 15400"
                        className="w-full bg-transparent border-b border-white/20 py-3 text-xl font-mono text-white focus:border-[#C5A059] outline-none transition-colors"
                    />
                </div>
                <div>
                    <label className="text-[10px] text-[#C5A059] uppercase tracking-widest mb-2 block">Promedio de Likes (últimos 3 posts)</label>
                    <input
                        type="number"
                        value={likesInput}
                        onChange={e => setLikesInput(e.target.value)}
                        placeholder="Ej: 320"
                        className="w-full bg-transparent border-b border-white/20 py-3 text-xl font-mono text-white focus:border-[#C5A059] outline-none transition-colors"
                    />
                </div>
            </div>

            {/* THE TRAFFIC LIGHT FEEDBACK */}
            {healthStatus && (
                <div className={`p-4 rounded border animate-in zoom-in-95 duration-300 ${healthStatus === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30' :
                    healthStatus === 'RISK' ? 'bg-yellow-500/10 border-yellow-500/30' :
                        'bg-green-500/10 border-green-500/30'
                    }`}>
                    <div className="flex items-center gap-3 mb-2">
                        {healthStatus === 'CRITICAL' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                        {healthStatus === 'RISK' && <Activity className="w-5 h-5 text-yellow-500" />}
                        {healthStatus === 'OPTIMAL' && <Check className="w-5 h-5 text-green-500" />}

                        <span className={`font-bold text-xs uppercase tracking-widest ${healthStatus === 'CRITICAL' ? 'text-red-500' :
                            healthStatus === 'RISK' ? 'text-yellow-500' :
                                'text-green-500'
                            }`}>
                            {healthStatus === 'CRITICAL' ? 'ALERTA: PERFIL INVISIBLE' : healthStatus === 'RISK' ? 'RIESGO: ESTANCAMIENTO' : 'ÓPTIMO: AUTORIDAD'}
                        </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                        {healthStatus === 'CRITICAL' ? `Engagement Rate: ${engagementRate?.toFixed(1)}%. En 2026, menos del 3% es castigado por el algoritmo. Necesitas Re-indexación urgente.` :
                            healthStatus === 'RISK' ? `Engagement Rate: ${engagementRate?.toFixed(1)}%. Estás perdiendo el 60% de tu alcance potencial por fricción técnica.` :
                                `Engagement Rate: ${engagementRate?.toFixed(1)}%. Tu cuenta está lista para escalar a niveles de élite.`}
                    </p>
                </div>
            )}

            <button
                onClick={() => setState(OperationalState.INPUT_AMBITION)}
                disabled={!healthStatus}
                className="w-full bg-white text-black h-14 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#E6E8EB] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg mt-8"
            >
                Continuar a Proyección
            </button>
        </div>
    )

    // 4. AMBITION STEP
    const renderAmbitionStep = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-xl text-white font-serif mb-6 text-center">Definición de Escala y Ambición</h3>
            <div className="space-y-4">
                <button onClick={() => { setGrowthGoal('Niche Authority'); setState(OperationalState.INPUT_SEGMENTATION); }} className="w-full text-left p-6 border border-white/10 bg-white/5 hover:bg-[#C5A059]/10 hover:border-[#C5A059]/30 transition-all group">
                    <div className="flex items-center gap-4 mb-2">
                        <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
                        <span className="text-sm font-bold text-white uppercase tracking-widest">Autoridad de Nicho</span>
                    </div>
                    <p className="text-xs text-white/50 font-light pl-10">
                        Objetivo: 3k - 5k Audiencia de Alto Valor. <br />
                        Enfoque: Conversión de tickets altos y reputación especializada.
                    </p>
                </button>

                <button onClick={() => { setGrowthGoal('Global Dominance'); setState(OperationalState.INPUT_SEGMENTATION); }} className="w-full text-left p-6 border border-white/10 bg-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all group">
                    <div className="flex items-center gap-4 mb-2">
                        <Globe className="w-6 h-6 text-amber-500" />
                        <span className="text-sm font-bold text-white uppercase tracking-widest">Dominio Global</span>
                    </div>
                    <p className="text-xs text-white/50 font-light pl-10">
                        Objetivo: 100k+ Audiencia Masiva. <br />
                        Enfoque: Viralidad, conferencias internacionales y fama digital.
                    </p>
                </button>
            </div>
        </div>
    )

    // 5. SEGMENTATION STEP (Optional)
    const renderSegmentationStep = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-xl text-white font-serif mb-2 text-center">Segmentación de Audiencia</h3>
            <p className="text-center text-xs text-white/40 mb-8 font-mono">Configuración de Demografía Objetivo</p>

            <div className="space-y-6">
                <div>
                    <label className="text-[10px] text-[#C5A059] uppercase tracking-widest mb-2 block flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Foco Geográfico
                    </label>
                    <select value={geo} onChange={e => setGeo(e.target.value)} className="w-full bg-[#050505] border border-white/20 text-white text-sm py-3 px-4 outline-none focus:border-[#C5A059]">
                        {['Global (Sin Fronteras)', 'Miami / USA', 'Dubai / UAE', 'Madrid / Europa', 'Latam High-End', 'Local City'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] text-[#C5A059] uppercase tracking-widest mb-2 block flex items-center gap-2">
                        <Users className="w-3 h-3" /> Género Objetivo
                    </label>
                    <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-[#050505] border border-white/20 text-white text-sm py-3 px-4 outline-none focus:border-[#C5A059]">
                        {['Mixto (General)', 'Enfoque Masculino', 'Enfoque Femenino'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] text-[#C5A059] uppercase tracking-widest mb-2 block flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Rango de Edad
                    </label>
                    <select value={age} onChange={e => setAge(e.target.value)} className="w-full bg-[#050505] border border-white/20 text-white text-sm py-3 px-4 outline-none focus:border-[#C5A059]">
                        {['Prime Force (25-45 años)', 'Gen Z (18-24 años)', 'Senior Executive (45+)', 'All Ages'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
            </div>

            <button
                onClick={runFinalAnalysis}
                className="w-full bg-white text-black h-14 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#E6E8EB] transition-all shadow-lg mt-8"
            >
                Confirmar y Procesar
            </button>
        </div>
    )

    const renderInput = () => (
        <div className="space-y-12 animate-in fade-in duration-500 max-w-lg mx-auto">
            <div className="space-y-6">
                <label className="text-[10px] font-mono text-[#C5A059] tracking-[0.3em] uppercase flex items-center justify-center gap-3 opacity-80">
                    ID DE CUENTA PRIORITARIA
                    <img src="/assets/insta-3d.png" alt="IG" className="w-4 h-4 object-contain opacity-40 grayscale" />
                </label>
                <div className="flex items-center border-b border-white/20 focus-within:border-[#C5A059] focus-within:shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-all duration-300 py-4 group">
                    <span className="text-3xl text-white/20 mr-4 font-serif group-focus-within:text-[#C5A059] transition-colors">@</span>
                    <input
                        value={handle}
                        onChange={e => setHandle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handle && startScreener()}
                        placeholder="username"
                        className="bg-transparent border-none outline-none text-4xl md:text-5xl text-white font-serif placeholder:text-white/5 w-full text-center tracking-wide"
                        autoFocus
                    />
                </div>
            </div>
            <button
                onClick={startScreener}
                disabled={!handle}
                className="w-full bg-[#C5A059] text-white h-16 text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#B08D4B] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_10px_30px_rgba(197,160,89,0.2)] hover:shadow-[0_10px_40px_rgba(197,160,89,0.4)]"
            >
                {state === OperationalState.SEARCHING ? "Localizando Activo..." : "INICIAR ESCANEO DE ESTATUS"}
            </button>
        </div>
    )

    const renderAssetFound = () => profileData && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center">
            <div className="flex flex-col items-center gap-4 py-8">
                <div className="relative">
                    <img
                        src={`https://wsrv.nl/?url=${encodeURIComponent(profileData.profilePicUrl)}`}
                        className="w-32 h-32 rounded-full border-4 border-[#C5A059]/20 shadow-2xl"
                    />
                    {profileData.isVerified && (
                        <div className="absolute bottom-0 right-0 bg-[#C5A059] p-2 rounded-full border-4 border-black shadow-lg">
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
            <div className="bg-[#C5A059]/5 border border-[#C5A059]/10 p-4 rounded text-xs text-[#C5A059] tracking-widest uppercase mb-8">
                Activo Identificado. Iniciando protocolo...
            </div>
            <button
                onClick={() => setState(OperationalState.INPUT_VERIFICATION)}
                className="w-full bg-white text-black h-14 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#E6E8EB] transition-all shadow-lg"
            >
                Confirmar y Continuar
            </button>
        </div>
    )

    const renderProcessing = () => (
        <div className="space-y-8">
            <div className="w-full h-[1px] bg-white/10 overflow-hidden">
                <div className="h-full bg-[#C5A059] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <div className="h-48 flex flex-col justify-center items-center space-y-4 text-center">
                <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
                <div className="space-y-2">
                    {logs.slice(-1).map((log, i) => (
                        <p key={i} className="text-white/70 font-serif text-lg animate-pulse">{log}</p>
                    ))}
                </div>
            </div>
        </div>
    )

    const renderResult = () => profileData && diagnosis && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-1000">
            <div className="bg-[#050505] p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
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
                    <div className="inline-block p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm relative group">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                        <ShieldCheck className="w-12 h-12 text-[#C5A059] mx-auto mb-3" />
                        <div className="text-xs font-mono font-bold text-white uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
                            AUDITORÍA COMPLETADA: <br />
                            <span className="text-[#C5A059]">POTENCIAL DE POSICIONAMIENTO DETECTADO.</span> <br />
                            EL SISTEMA ESTÁ LISTO PARA SU ESCALABILIDAD.
                        </div>
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
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#C5A059]/40 bg-[#C5A059]/5 rounded-full text-[#C5A059] text-[9px] font-mono uppercase tracking-[0.2em] mb-4 backdrop-blur-sm">
                        <Lock className="w-3 h-3" />
                        ACCESO ENCRIPTADO
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight">Identificación de Activo de Élite</h2>
                    <p className="text-white/40 font-light text-lg max-w-2xl mx-auto leading-relaxed">
                        Iniciando diagnóstico forense de autoridad y viabilidad algorítmica. <br />
                        <span className="text-white/60">Ingrese el identificador para proceder.</span>
                    </p>
                </div>

                <div className="bg-[#0A0A0A] border border-white/10 rounded-sm shadow-2xl shadow-[#C5A059]/5 min-h-[500px] flex flex-col relative overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-black">
                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center max-w-2xl mx-auto w-full">
                        {state === OperationalState.IDLE && renderInput()}
                        {state === OperationalState.SEARCHING && renderProcessing()}
                        {state === OperationalState.ASSET_FOUND && renderAssetFound()}

                        {state === OperationalState.INPUT_VERIFICATION && renderVerificationStep()}
                        {state === OperationalState.INPUT_NICHE && renderNicheStep()}
                        {state === OperationalState.INPUT_METRICS && renderMetricsStep()}
                        {state === OperationalState.INPUT_AMBITION && renderAmbitionStep()}
                        {state === OperationalState.INPUT_SEGMENTATION && renderSegmentationStep()}

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
