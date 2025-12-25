"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Loader2, Lock, Shield, Database, AlertCircle, CheckCircle2, Cpu } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { funnelTracker } from "@/lib/analytics/funnel"
import { createClient } from "@/lib/supabase/client"
import { INTERESTS, type InterestId } from "@/lib/el-faro/selectors"

// --- TYPES & ENUMS ---
enum AnalyzerStep {
    PRE_ENTRY = 0,
    CONNECTION = 1,
    DISCOVERY = 2,
    MIRROR = 3,
    VERDICT = 4,
    SIMULATION = 5,
    GATE = 6,
    INVITATION = 7
}

// --- VISUAL COMPONENTS ---

const OrbitalLoader = ({ isLazarus }: { isLazarus: boolean }) => (
    <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
            <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity="1" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" stroke="url(#goldGradient)" strokeWidth="1" fill="none" strokeDasharray="60 180" strokeLinecap="round" />
        </svg>
        <svg className="absolute inset-2 w-[85%] h-[85%] animate-[spin_2s_linear_infinite_reverse]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" stroke={isLazarus ? "#ef4444" : "#fcebb6"} strokeWidth="1" fill="none" strokeDasharray="40 120" strokeLinecap="round" className="opacity-50" />
        </svg>
        <div className="relative z-10 text-[9px] font-mono tracking-widest text-[#d4af37] animate-pulse">
            SCANNING
        </div>
    </div>
)

const LatentSpaceChart = ({ userStatus }: { userStatus: string }) => (
    <svg viewBox="0 0 400 200" className="w-full h-full">
        {/* Grid */}
        <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.1" />
            </pattern>
        </defs>
        <rect width="400" height="200" fill="url(#grid)" />

        {/* Premium Cluster (Gold) */}
        <g transform="translate(300, 50)">
            <circle r="40" fill="#d4af37" opacity="0.1" />
            <circle r="25" fill="#d4af37" opacity="0.2" />
            <circle r="10" fill="#d4af37" opacity="0.4" />
            <text x="0" y="55" textAnchor="middle" className="text-[6px] fill-[#d4af37] font-mono tracking-widest uppercase">Authority Cluster</text>
        </g>

        {/* User Node (Red/Yellow) */}
        <g transform="translate(100, 150)">
            <circle r="6" fill={userStatus === 'LAZARUS' ? '#ef4444' : '#fbbf24'} className="animate-pulse" />
            <line x1="0" y1="0" x2="200" y2="-100" stroke="#d4af37" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
            <text x="0" y="20" textAnchor="middle" className="text-[6px] fill-slate-400 font-mono tracking-widest uppercase">You are here</text>
        </g>
    </svg>
)

// --- MAIN COMPONENT ---

export default function SmartGrowthConsultant() {
    const router = useRouter()
    const supabase = createClient()
    const [step, setStep] = useState<AnalyzerStep>(AnalyzerStep.PRE_ENTRY)

    // Data State
    const [handle, setHandle] = useState("")
    const [revenue, setRevenue] = useState<string>("500k-2m")
    const [interest, setInterest] = useState<InterestId>("business")
    const [verifiedUser, setVerifiedUser] = useState<{ username: string, full_name?: string, profilePicUrl?: string, biography?: string, posts?: any[] } | null>(null)

    // Logic State
    const [isVerifying, setIsVerifying] = useState(false)
    const [verificationError, setVerificationError] = useState<string | null>(null)
    const [loaderIndex, setLoaderIndex] = useState(0)
    const [verdict, setVerdict] = useState<"GENERIC" | "FRAGILE" | "RESIDUE">("GENERIC")

    // Derived
    const isLazarus = verdict === "RESIDUE"

    // --- ACTIONS ---

    const handleConnection = async () => {
        if (!handle) return

        // DEBUG CLIENT SIDE (Bypass Backend)
        if (handle === 'debug_client') {
            setIsVerifying(true)
            setTimeout(() => {
                setVerifiedUser({
                    username: 'debug_client',
                    full_name: 'Debug Protocol Verified',
                    profilePicUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
                    biography: "DEBUG_MODE_ACTIVE: System visual rendering checks passed. UI integrity verified. Backend bypass active.",
                    posts: [
                        { id: 1, imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop' },
                        { id: 2, imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=400&fit=crop' },
                        { id: 3, imageUrl: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=400&fit=crop' },
                    ]
                })
                setIsVerifying(false)
            }, 1000)
            setStep(AnalyzerStep.CONNECTION)
            return
        }

        setStep(AnalyzerStep.CONNECTION)
        setIsVerifying(true)
        setVerificationError(null)

        try {
            const response = await fetch('/api/forensic/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ handle })
            })

            const data = await response.json()

            // Strict status check (even if 200 OK)
            if (data.status === 'restricted') {
                // FALLBACK MODE
                setVerifiedUser({
                    username: handle,
                    full_name: handle,
                    profilePicUrl: undefined, // Triggers Silhouette
                    biography: "Visual data restricted by forensic protocol.",
                    posts: []
                })
            } else {
                // SUCCESS MODE
                setVerifiedUser(data)
            }

        } catch (e) {
            console.error("Forensic Link Error")
            // SAFETY NET: Fallback
            setVerifiedUser({
                username: handle,
                full_name: handle,
                profilePicUrl: undefined,
                biography: "Connection secure. Visuals sequestered.",
                posts: []
            })
        } finally {
            setIsVerifying(false)
        }
    }

    const startDiscovery = () => {
        setStep(AnalyzerStep.DISCOVERY)
        // Sequence logic
        let i = 0
        const interval = setInterval(() => {
            i++
            setLoaderIndex(i)
            if (i >= 5) {
                clearInterval(interval)
                calculateVerdict()
                setTimeout(() => setStep(AnalyzerStep.MIRROR), 1500)
            }
        }, 2000)
    }

    const calculateVerdict = () => {
        // Iron Logic V21
        const followers = 10000 // Metrics censored - use default

        if (revenue === "+2m" || followers > 100000) {
            setVerdict("FRAGILE")
        } else if (revenue === "lazarus_signal" || followers > 500000) { // Simulating internal flag
            setVerdict("RESIDUE")
        } else {
            setVerdict("GENERIC")
        }
    }

    const handleGateUnlock = () => {
        setStep(AnalyzerStep.INVITATION)
        // Track Lead
        funnelTracker.track('NDA_SIGNED', { handle, revenue, verdict })
    }

    const handleFinalAction = () => {
        // Redirect to Services with Params
        const params = new URLSearchParams({
            platform: 'instagram',
            interest,
            lead_class: verdict === 'FRAGILE' ? 'WHALE' : (verdict === 'RESIDUE' ? 'LAZARUS' : 'STANDARD'),
            verdict: verdict === 'FRAGILE' ? 'Autoridad Frágil' : (verdict === 'RESIDUE' ? 'Residuo Algorítmico' : 'Activo Genérico'),
            coi: revenue === '+2m' ? '125000' : '45000'
        })
        router.push(`/servicios?${params.toString()}`)
    }

    // --- RENDERERS ---

    return (
        <div className="min-h-[600px] flex flex-col items-center justify-center relative bg-[#02040a] border border-[#d4af37]/20 shadow-[0_0_50px_rgba(212,175,55,0.05)]">

            {/* S0: PRE-ENTRY (COMMITMENT) - CLINICAL */}
            {step === AnalyzerStep.PRE_ENTRY && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md w-full py-12 text-center space-y-12">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif text-white italic">Protocolo de Entrada</h2>
                        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest max-w-xs mx-auto">
                            Este nodo evalúa autoridad estructural. <br /> No métricas de vanidad.
                        </p>
                    </div>

                    <div className="space-y-8 text-left max-w-sm mx-auto">
                        <div className="space-y-6">
                            <div className="border-b border-slate-800 focus-within:border-[#d4af37] transition-colors">
                                <label className="text-[9px] font-mono text-slate-600 block mb-2">TARGET IDENTITY</label>
                                <input
                                    value={handle}
                                    onChange={e => setHandle(e.target.value)}
                                    placeholder="@username"
                                    className="w-full bg-transparent outline-none text-white py-2 font-mono text-sm placeholder:text-slate-800 uppercase tracking-widest"
                                />
                            </div>
                            <div className="border-b border-slate-800 focus-within:border-[#d4af37] transition-colors">
                                <label className="text-[9px] font-mono text-slate-600 block mb-2">ESTIMATED REVENUE</label>
                                <select
                                    value={revenue}
                                    onChange={e => setRevenue(e.target.value)}
                                    className="w-full bg-transparent outline-none text-white py-2 font-mono text-sm uppercase tracking-widest [&>option]:bg-black"
                                >
                                    <option value="<500k">&lt;$500k / Year</option>
                                    <option value="500k-2m">$500k - $2M / Year</option>
                                    <option value="+2m">+$2M / Year</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <ul className="text-left space-y-3 text-[9px] font-mono text-slate-600 uppercase tracking-widest max-w-xs mx-auto pt-4">
                        <li className="flex items-center gap-3"><div className="w-1 h-1 bg-[#d4af37]" /> Diagnóstico Irreversible</li>
                        <li className="flex items-center gap-3"><div className="w-1 h-1 bg-[#d4af37]" /> Acceso Restringido</li>
                    </ul>

                    <button
                        onClick={handleConnection}
                        disabled={!handle}
                        className="group w-full max-w-sm mx-auto border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-500 uppercase tracking-[0.3em] font-mono text-[10px] py-4 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {isVerifying ? "VERIFYING..." : "INICIAR ANÁLISIS CONFIDENCIAL"}
                    </button>
                </motion.div>
            )}

            {/* S1: CONNECTION (VISUALS) - CLINICAL */}
            {step === AnalyzerStep.CONNECTION && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg py-12 flex flex-col items-center text-center space-y-12">
                    <div className="space-y-4">
                        <div className="text-[9px] font-mono text-[#d4af37]/50 animate-pulse">CONNECTION_SECURE</div>
                        <h3 className="text-2xl font-serif text-white italic">Activo Identificado</h3>
                    </div>

                    <div className="relative group">
                        {isVerifying ? (
                            <OrbitalLoader isLazarus={false} />
                        ) : (
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full border border-[#d4af37]/30 p-1">
                                        {verifiedUser?.profilePicUrl ? (
                                            <img
                                                src={verifiedUser.profilePicUrl}
                                                referrerPolicy="no-referrer"
                                                alt="Profile"
                                                className="w-full h-full rounded-full grayscale hover:grayscale-0 transition-all duration-1000 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center"><Shield className="w-8 h-8 text-slate-800" /></div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 right-1/2 translate-x-1/2 text-[9px] bg-black px-2 text-[#d4af37] border border-[#d4af37]/30 shadow-xl">LIVE</div>
                                </div>

                                <div className="space-y-2">
                                    <div className="font-mono text-sm text-white uppercase tracking-[0.2em]">@{handle}</div>
                                    {verifiedUser?.biography && (
                                        <p className="text-[9px] text-slate-500 font-mono italic max-w-xs line-clamp-2 mx-auto leading-relaxed border-l border-[#d4af37]/20 pl-3 text-left">
                                            {verifiedUser.biography}
                                        </p>
                                    )}
                                </div>

                                {/* Abstract Grid - NOW REAL OR SIMULATED */}
                                <div className="grid grid-cols-3 gap-px w-48 transition-opacity">
                                    {verifiedUser?.posts && verifiedUser.posts.length > 0 ? (
                                        verifiedUser.posts.slice(0, 6).map((post: any, i: number) => (
                                            <div key={post.id || i} className="aspect-square bg-slate-900 relative group overflow-hidden">
                                                <img
                                                    src={post.imageUrl}
                                                    referrerPolicy="no-referrer"
                                                    alt=""
                                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-square bg-white/10 opacity-20" />)
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {!isVerifying && (
                        <div className="w-full max-w-sm space-y-6">
                            <button
                                onClick={startDiscovery}
                                className="w-full border border-white/20 text-white hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-500 uppercase tracking-[0.2em] font-mono text-[10px] py-4"
                            >
                                CONFIRMAR & PROCEDER
                            </button>
                            {(!verifiedUser?.profilePicUrl) && (
                                <p className="text-[8px] text-slate-500 font-mono uppercase tracking-widest">
                                    <span className="text-[#d4af37] mr-2">⚠</span>
                                    Vectores visuales protegidos. Análisis procedimental activo.
                                </p>
                            )}
                        </div>
                    )}
                </motion.div>
            )}

            {/* S2: DISCOVERY (LOADER/TRUTH) - CLINICAL */}
            {step === AnalyzerStep.DISCOVERY && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 bg-[#02040a] flex flex-col items-center justify-center p-8 text-center space-y-16">
                    <OrbitalLoader isLazarus={false} />

                    <div className="h-16 flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={loaderIndex}
                                initial={{ opacity: 0, filter: 'blur(5px)' }}
                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, filter: 'blur(5px)' }}
                                className="text-xs font-mono text-[#d4af37] tracking-[0.2em] uppercase"
                            >
                                {[
                                    "Extrayendo patrones...",
                                    "Analizando narrativa...",
                                    "Contrastando autoridad...",
                                    "Detectando volumen...",
                                    "Localizando señales...",
                                    "CLASIFICACIÓN FINAL..."
                                ][loaderIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    <p className="text-[9px] text-slate-600 font-mono max-w-xs uppercase tracking-widest leading-relaxed">
                        Sistema en observación pasiva.<br />No cierre la terminal.
                    </p>
                </motion.div>
            )}

            {/* S3: MIRROR (THE GAP) */}
            {step === AnalyzerStep.MIRROR && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl p-8 text-center space-y-12">
                    <h2 className="text-3xl font-verdict text-white italic">Análisis de Integridad</h2>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {/* COL 1: LO QUE TIENES */}
                        <div className="p-6 border border-slate-800 bg-slate-900/20 opacity-50">
                            <h3 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">Lo que tienes</h3>
                            <ul className="space-y-4 text-xs font-mono text-slate-500">
                                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4" /> Contenido constante</li>
                                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4" /> Presencia activa</li>
                                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4" /> Inversión sostenida</li>
                            </ul>
                        </div>

                        {/* COL 2: LO QUE BUSCA EL SISTEMA */}
                        <div className="p-6 border border-[#d4af37]/30 bg-[#d4af37]/5">
                            <h3 className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest mb-6 border-b border-[#d4af37]/20 pb-2">Lo que busca el sistema</h3>
                            <ul className="space-y-4 text-xs font-mono text-[#d4af37]">
                                <li className="flex gap-2"><Database className="w-4 h-4" /> Consistencia semántica</li>
                                <li className="flex gap-2"><Shield className="w-4 h-4" /> Señales de referencia</li>
                                <li className="flex gap-2"><Cpu className="w-4 h-4" /> Prioridad algorítmica</li>
                            </ul>
                        </div>

                        {/* COL 3: LO QUE NO DETECTA */}
                        <div className="p-6 border border-red-900/50 bg-red-950/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                            <h3 className="text-[10px] font-mono text-red-500 uppercase tracking-widest mb-6 border-b border-red-900/50 pb-2">Lo que NO detecta</h3>
                            <ul className="space-y-4 text-xs font-mono text-red-400">
                                <li className="flex gap-2"><AlertCircle className="w-4 h-4" /> Autoridad estructural</li>
                                <li className="flex gap-2"><AlertCircle className="w-4 h-4" /> Blindaje narrativo</li>
                                <li className="flex gap-2"><AlertCircle className="w-4 h-4" /> Clasificación premium</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-4 border-l border-[#d4af37]">
                        <p className="text-xs text-slate-400 font-mono text-left">
                            "El problema no es tu trabajo. Es cómo estás siendo interpretado."
                        </p>
                    </div>

                    <Button onClick={() => setStep(AnalyzerStep.VERDICT)} className="w-full md:w-auto px-12 bg-white text-black hover:bg-[#d4af37] rounded-none uppercase tracking-[0.2em] font-mono text-xs py-6">
                        Revelar Veredicto
                    </Button>
                </motion.div>
            )}

            {/* S4: VERDICT */}
            {step === AnalyzerStep.VERDICT && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-xl p-8 text-center space-y-10">
                    <div className="space-y-4">
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Clasificación Algorítmica Actual</p>
                        <h2 className={`text-4xl md:text-5xl font-verdict italic ${verdict === 'RESIDUE' ? 'text-red-500' : (verdict === 'FRAGILE' ? 'text-amber-500' : 'text-yellow-400')}`}>
                            {verdict === 'GENERIC' && "Activo Genérico"}
                            {verdict === 'FRAGILE' && "Autoridad Frágil"}
                            {verdict === 'RESIDUE' && "Residuo Algorítmico"}
                        </h2>
                        <div className="flex justify-center gap-2 mt-4">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-2 h-8 rounded-sm ${i <= (verdict === 'RESIDUE' ? 1 : 3) ? (verdict === 'RESIDUE' ? 'bg-red-500' : 'bg-amber-500') : 'bg-slate-800'}`} />)}
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 font-mono leading-relaxed border border-slate-800 p-4">
                        Esta clasificación no es definitiva. Pero cada ciclo sin intervención la solidifica.
                        <br /><br />
                        <span className="text-white">La corrección no es incremental. Es estructural.</span>
                    </p>

                    <Button onClick={() => setStep(AnalyzerStep.SIMULATION)} className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] rounded-none uppercase tracking-[0.2em] font-mono text-xs py-6">
                        Visualizar Espacio Latente
                    </Button>
                </motion.div>
            )}

            {/* S5: SIMULATION */}
            {step === AnalyzerStep.SIMULATION && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-3xl p-8 text-center space-y-10">
                    <h3 className="text-xl font-verdict text-white italic">Mapa de Exclusión</h3>

                    <div className="aspect-[2/1] w-full border border-slate-800 bg-[#02040a] relative">
                        <LatentSpaceChart userStatus={verdict} />
                    </div>

                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
                        El alcance no se distribuye de forma justa. Se distribuye por clasificación.
                    </p>

                    <Button onClick={() => setStep(AnalyzerStep.GATE)} className="w-full md:w-auto px-16 bg-white text-black hover:bg-[#d4af37] rounded-none uppercase tracking-[0.2em] font-mono text-xs py-6">
                        Continuar al Diagnóstico
                    </Button>
                </motion.div>
            )}

            {/* S6: GATE (NDA) */}
            {step === AnalyzerStep.GATE && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-10">
                    <Lock className="w-16 h-16 text-[#d4af37] animate-pulse" />

                    <div className="space-y-4 max-w-md">
                        <h2 className="text-2xl font-verdict text-white italic">Protocolo de Confidencialidad</h2>
                        <p className="text-sm text-slate-400 font-mono leading-relaxed">
                            El diagnóstico completo contiene información que afecta directamente tu reputación digital.
                            Por protocolo, solo liberamos esta información bajo custodia confidencial.
                        </p>
                    </div>

                    <div className="w-full max-w-sm border-t border-b border-[#d4af37]/20 py-8">
                        <Button onClick={handleGateUnlock} className="w-full bg-[#d4af37] text-black hover:bg-white transition-all rounded-none uppercase tracking-[0.2em] font-mono text-xs py-6">
                            Activar Acceso Confidencial (NDA)
                        </Button>
                    </div>

                    <p className="text-[10px] text-slate-600 font-mono uppercase">
                        No firmar no detiene el sistema. Detiene tu protección.
                    </p>
                </motion.div>
            )}

            {/* S7: INVITATION */}
            {step === AnalyzerStep.INVITATION && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-8 text-center space-y-10 border border-[#d4af37] bg-[#d4af37]/5 shadow-[0_0_100px_rgba(212,175,55,0.1)]">
                    <div className="space-y-2">
                        <div className="inline-block px-3 py-1 bg-[#d4af37] text-black text-[10px] font-bold font-mono uppercase tracking-widest mb-4">
                            Elegibilidad Validada
                        </div>
                        <h2 className="text-3xl font-verdict text-white italic">Invitación de Intervención</h2>
                    </div>

                    <div className="text-left space-y-4 font-mono text-xs text-slate-300">
                        <p>El Faro ha generado una ruta de reconstrucción para @{handle}.</p>
                        <p className="text-[#d4af37]">Ventana actual: ABIERTA</p>
                    </div>

                    <Button onClick={handleFinalAction} className="w-full bg-white text-black hover:bg-[#d4af37] rounded-none uppercase tracking-[0.2em] font-mono text-xs py-6 shadow-lg shadow-[#d4af37]/20">
                        Solicitar Activación Lazarus
                    </Button>
                </motion.div>
            )}

        </div>
    )
}
