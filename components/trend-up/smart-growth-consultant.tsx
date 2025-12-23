"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Loader2, User, Globe, Rocket, BarChart3, Database, Lock, Shield, Cpu, Activity, Zap } from "lucide-react"
import { LOCATIONS, INTERESTS, GENDERS, type LocationId, type InterestId, type GenderId } from "@/lib/el-faro/selectors"
import { useI18n } from "@/lib/i18n/context"
import { funnelTracker } from "@/lib/analytics/funnel"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const NeuralAuthentication = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[60] bg-[#02040a] flex flex-col items-center justify-center p-8 text-center terminal-scanlines"
    >
        <div className="relative">
            <Cpu className="w-16 h-16 text-indigo-500 animate-pulse mb-6" />
            <div className="absolute inset-0 border border-indigo-500/20 rounded-full animate-ping" />
        </div>
        <h3 className="text-xl font-mono text-white mb-2 uppercase tracking-[0.3em]">Neural Authentication</h3>
        <p className="text-indigo-400 font-mono text-[10px] animate-pulse">SCANNING AUTHORITY DNA... [SIGNALS DETECTED]</p>
    </motion.div>
)

const LoadingOverlay = ({ t, values, isLazarus }: { t: any, values: any, isLazarus: boolean }) => {
    const [msgIndex, setMsgIndex] = useState(0)
    const [growthHeight, setGrowthHeight] = useState(10)

    useEffect(() => {
        const timer = setInterval(() => {
            setMsgIndex(prev => prev < 5 ? prev + 1 : prev)
        }, 1500) // Slower for effect
        setTimeout(() => setGrowthHeight(85), 500) // Animate Growth Bar
        return () => clearInterval(timer)
    }, [])

    const nicheName = values.interest
    const messages = [
        { text: "MAPPING_CURRENT_TRAJECTORY... [FLATLINE]", color: "text-slate-400" },
        { text: "SIMULATING_V7_AUTHORITY_INJECTION...", color: "text-indigo-400" },
        { text: "PROJECTING_REVENUE_RECOVERY...", color: "text-emerald-400" },
        { text: "CALCULATING_DOMINANCE_INDEX...", color: "text-indigo-400" },
        { text: isLazarus ? "FATAL_ERROR: HUMAN_ENTROPY_CRITICAL" : "FORENSIC_BIOPSIA_COMPLETE", color: isLazarus ? "text-red-500" : "text-emerald-400" },
        { text: "GENERATING_SOVEREIGNTY_ROADMAP...", color: "text-white" }
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-50 ${isLazarus ? 'bg-red-950/90 crimson-flicker' : 'bg-[#02040a]/95'} backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center terminal-scanlines`}
        >
            {/* FUTURE PROJECTION GRAPH */}
            <div className="flex items-end gap-8 mb-12 h-40 border-b border-white/10 pb-2 px-8">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 bg-slate-800/50 border border-slate-700 h-16 rounded-t-sm" />
                    <span className="text-[9px] text-slate-500 font-mono tracking-widest">CURRENT</span>
                </div>
                <div className="flex flex-col items-center gap-2 group">
                    <div className="relative w-16">
                        <motion.div
                            initial={{ height: 16 }}
                            animate={{ height: 140 }}
                            transition={{ duration: 3, ease: "circOut" }}
                            className={`w-full ${isLazarus ? 'bg-red-500' : 'bg-[#d4af37]'} border ${isLazarus ? 'border-red-400' : 'border-[#fcebb6]'} rounded-t-sm shadow-[0_0_30px_rgba(212,175,55,0.3)]`}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[#d4af37] text-xs font-bold font-mono">+420%</div>
                    </div>
                    <span className={`text-[10px] ${isLazarus ? 'text-red-400' : 'text-[#d4af37]'} font-mono tracking-widest font-bold`}>PROJECTED</span>
                </div>
            </div>

            <div className={`w-full max-w-md space-y-4 text-center font-mono text-[10px] ${isLazarus ? 'text-red-400' : 'text-indigo-500'} mb-10`}>
                <p>TARGET: {nicheName.toUpperCase()}_CLUSTER</p>
                <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full ${isLazarus ? 'bg-red-500' : 'bg-[#d4af37]'}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 8 }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.p
                    key={msgIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`text-sm font-bold font-mono tracking-widest ${messages[Math.min(msgIndex, 5)].color}`}
                >
                    {">"} {messages[Math.min(msgIndex, 5)].text}
                </motion.p>
            </AnimatePresence>
        </motion.div>
    )
}

export default function SmartGrowthConsultant() {
    const { t } = useI18n()
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticating, setIsAuthenticating] = useState(false)

    // Form Data
    const [handle, setHandle] = useState("")
    const [platform, setPlatform] = useState("instagram")
    const [gender, setGender] = useState<GenderId>("any")
    const [location, setLocation] = useState<LocationId>("us")
    const [interest, setInterest] = useState<InterestId>("business")
    const [objective, setObjective] = useState<string>("dominion") // New V7 Input
    const [diagnosis, setDiagnosis] = useState<string>("")
    const [currentStep, setCurrentStep] = useState(0) // 0: Config, 1: Objectives, 2: Scan

    // Lazarus State
    const [followers, setFollowers] = useState<string>("")
    const [avgLikes, setAvgLikes] = useState<string>("")

    const [isLazarusDetected, setIsLazarusDetected] = useState(false)

    useEffect(() => {
        const insights: Record<string, string> = {
            real_estate: "CRITICAL: EXIF Metadata Stripping Syndrome detected. Meta is classifying your luxury listings as 'Duplicate/Low-Value' due to missing digital signatures.",
            medical: "WARNING: SAM-3 Manipulation Artifacts found. Algorithm is flagging your before/after content as 'Synthetic/Edited', suppressing reach by 65%.",
            finance: "ALERT: Vanilla Insight Vector Collapse. Your content lacks the 'Polarizing Hook' metadata required to break into the High-Net-Worth allocator cluster.",
            business: "Market authority logic. Corporate accounts are facing 40% less reach without pattern interrupt.",
            trading: "Compliance filter active. Financial niches require immediate neural warmup.",
            fitness: "Visual static detected. 90% of fitness accounts are indistinguishable by the AI.",
            default: "Niche recognized. High-ticket growth requires an immediate visual signature calibration."
        }
        setDiagnosis(insights[interest] || insights.default)
    }, [interest])

    const handleNext = async () => {
        setIsAuthenticating(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsAuthenticating(false)

        if (currentStep === 0) {
            setCurrentStep(1)
            return
        }
        if (currentStep === 1) {
            // New Objective Step Validation
            setCurrentStep(2)
            return
        }

        // Sovereignty Engine V7.0 (The Deity Logic)
        const fCount = parseInt(followers) || 0
        const lCount = parseInt(avgLikes) || 0

        // 1. Deterministic Heuristics (Simulation of Grok Analysis)
        const pseudoHash = (str: string) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash);
        }

        const handleSeed = pseudoHash(handle)

        // Human Entropy (H.E.)
        // Formula: (avg_comments_length / 10) * (unique_words_ratio) * (heuristic_variance)
        // Deterministic Simulation: Use seed % 100 to generate consistent variance [0.1 - 0.9]
        const variance = (handleSeed % 30) / 100
        const baseEntropy = 0.45 // Assumed base without scraper
        let humanEntropy = Math.min(0.98, Math.max(0.1, baseEntropy + variance))

        // Trusted Multiplier (T.M.)
        // Formula: (avg_likes + (avg_comments * 2)) / followers
        // Note: We lack avg_comments in input, so we simulate it as 2% of likes deterministically
        const simulatedComments = lCount * 0.02
        let trustedMultiplier = (lCount + (simulatedComments * 2)) / fCount

        // Lazarus Logic: IF (T.M. < 0.01 && followers > 100000) THEN is_lazarus = true
        const isLazarus = (trustedMultiplier < 0.01 && fCount > 100000)
        setIsLazarusDetected(isLazarus)

        // Sovereignty Engine V7.0 Financial Logic
        // 1. Niche Complexity Multiplier
        let nicheMultiplier = 1.0
        let avgTicket = 150 // Default low ticket
        if (['real_estate', 'luxury'].includes(interest)) { nicheMultiplier = 1.5; avgTicket = 2500 }
        else if (['medical', 'legal'].includes(interest)) { nicheMultiplier = 1.4; avgTicket = 1200 }
        else if (['business', 'finance'].includes(interest)) { nicheMultiplier = 1.3; avgTicket = 500 }

        // 2. Erosion Factor: (Peak - Current) / Peak
        // Simulated Peak: Current * (1 + (Variance 0.1 to 0.5))
        const peakVariance = 1.0 + ((handleSeed % 50) / 100)
        const peakFollowers = Math.floor(fCount * peakVariance)
        const erosionFactor = (peakFollowers - fCount) / peakFollowers

        // 3. Cost of Inaction (Lucro Cesante)
        // Formula: Followers * ConversionRate (0.5%) * Ticket * 12 months
        // Adjusted by Niche Multiplier
        const conversionRate = 0.005
        const costOfInaction = fCount * conversionRate * avgTicket * nicheMultiplier

        let nicheTier = 'SILVER'
        if (isLazarus) nicheTier = 'LAZARUS'
        else if (fCount > 500000) nicheTier = 'BLACK'
        else if (fCount > 50000) nicheTier = 'GOLD'

        // 2. The Artifact (Forensic Report JSON)
        // "Biopsia de Metadatos", "Blacklist de Clúster", "Roadmap de 21 Días"
        const forensicReport = {
            protocol: "FAT-V6_ELITE",
            timestamp: new Date().toISOString(),
            status: "ASSET_UNDER_CUSTODY",
            asset_identity: {
                handle: handle,
                niche_cluster: interest.toUpperCase(),
                authority_tier: nicheTier
            },
            analysis: {
                exif_integrity: {
                    score: (humanEntropy * 0.8).toFixed(2),
                    verdict: humanEntropy < 0.5 ? "CRITICAL_LOSS" : "OPTIMAL",
                    detail: humanEntropy < 0.5 ? "82% de las imágenes carecen de firma de origen nativa. Meta clasifica como contenido duplicado." : "Firma digital robusta detectada."
                },
                cluster_repulsion: {
                    offset: `+${(1 - trustedMultiplier).toFixed(2)}`,
                    zone: trustedMultiplier < 0.01 ? "SPAM_GENERIC_LUXURY" : "AUTHORITY_CLUSTER",
                    recommendation: "Inyectar metadatos de ubicación crudos en los próximos 3 posts."
                }
            },
            recovery_roadmap: {
                day_1_to_7: "Detox: Eliminación de 15 posts de baja entropía. Desactivación de herramientas de terceros.",
                day_8_to_14: "Injection: Publicación de 3 videos de alta varianza tonal (Sin filtros de Meta).",
                day_15_to_21: "Sovereignty: Activación del booster de señales de autoridad en círculos cerrados."
            },
            financial_projection: {
                annual_loss_recovery: fCount > 100000 ? "$1,200,000" : "$145,000",
                conversion_lift: "420%"
            }
        }

        // 3. Persistence (The Audit Trail)
        // Note: In a real deploy we would await this, but for UX speed we fire & forget or use optimistic UI
        // We'll console log for verification if Supabase env var is missing in dev
        console.log("Saving Asset:", forensicReport)

        // 3. Persistence (The Audit Trail)
        console.log("Saving Asset:", forensicReport)

        await supabase.from('digital_assets').insert({
            handle: handle,
            niche_id: interest,
            followers: fCount,
            human_entropy_score: humanEntropy,
            trusted_multiplier: trustedMultiplier,
            is_lazarus: isLazarus,
            tier: nicheTier,
            forensic_report_json: forensicReport,
            payment_status: 'PENDING'
        })

        const isWhale = fCount > 50000 || ['business', 'trading', 'tech', 'medical', 'real_estate'].includes(interest)
        const leadClassification = isLazarus ? 'LAZARUS' : (isWhale ? 'WHALE' : 'STANDARD')


        funnelTracker.track('lead_attempt', { platform, interest, lead_classification: leadClassification })
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 10000))

        const params = new URLSearchParams({
            platform, gender, location, interest,
            lead_class: leadClassification,
            auth_score: (trustedMultiplier * 100).toFixed(2), // Scale for UI % display
            entropy_score: humanEntropy.toFixed(2),
            coi: costOfInaction.toFixed(0),
            erosion: (erosionFactor * 100).toFixed(1),
            f_count: fCount.toString(),
            l_count: lCount.toString()
        })
        router.push(`/servicios?${params.toString()}`)
    }

    return (
        <div className="relative">
            {/* Bureau Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono uppercase tracking-[0.4em] mb-6">
                    <Sparkles className="w-3 h-3 animate-pulse" /> Estatus Superior Confirmado
                </div>
                <h2 className="text-4xl md:text-6xl font-verdict text-white mb-4 italic">
                    Domina el <span className="text-indigo-500">Escenario Global</span>.
                </h2>
                <p className="text-slate-500 font-mono text-xs uppercase tracking-widest max-w-xl mx-auto">
                    VISTAS AUMENTANDO. ALCANCE IMPARABLE. ACTIVA EL MÉTODO ELITE USADO EN DUBAI Y MIAMI.
                </p>
            </div>

            <div className="bg-[#02040a] border border-indigo-500/20 rounded-2xl p-0 relative overflow-hidden min-h-[500px] flex flex-col terminal-scanlines shadow-[0_0_50px_rgba(79,70,229,0.05)]">

                <AnimatePresence>
                    {isAuthenticating && <NeuralAuthentication />}
                    {isLoading && <LoadingOverlay t={t} values={{ interest }} isLazarus={isLazarusDetected} />}
                </AnimatePresence>

                {/* Status Bar */}
                <div className="px-6 py-2 bg-indigo-500/5 border-b border-indigo-500/10 flex justify-between items-center bg-slate-900/40">
                    <div className="flex gap-1.5 font-mono text-[9px] text-indigo-400/60 uppercase">
                        <span>SESSION: 0x{Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
                        <span className="text-indigo-500/20">|</span>
                        <span>STATUS: OP_READY</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="p-8 md:p-12 flex-grow flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-10">
                                    {/* Platform & Niche */}
                                    <div className="space-y-6">
                                        {/* Handle Input */}
                                        <div>
                                            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Username (@Handle)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-sm">@</span>
                                                <input
                                                    type="text"
                                                    value={handle}
                                                    onChange={(e) => setHandle(e.target.value)}
                                                    className="w-full bg-[#02040a] border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-white font-mono text-xs focus:border-indigo-500 outline-none uppercase"
                                                    placeholder="USERNAME"
                                                />
                                            </div>
                                        </div>

                                        {/* Region & Gender */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Region</label>
                                                <select value={location} onChange={(e) => setLocation(e.target.value as LocationId)} className="w-full bg-[#02040a] border border-slate-800 rounded-lg py-3 px-4 text-white font-mono text-xs focus:border-indigo-500 outline-none">
                                                    {LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name.toUpperCase()}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Gender Target</label>
                                                <select value={gender} onChange={(e) => setGender(e.target.value as GenderId)} className="w-full bg-[#02040a] border border-slate-800 rounded-lg py-3 px-4 text-white font-mono text-xs focus:border-indigo-500 outline-none">
                                                    {GENDERS.map(g => <option key={g.id} value={g.id}>{g.name.toUpperCase()}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Strategic Niche</label>
                                            <select value={interest} onChange={(e) => setInterest(e.target.value as InterestId)} className="w-full bg-[#02040a] border border-slate-800 rounded-lg py-3 px-4 text-white font-mono text-xs focus:border-indigo-500 outline-none">
                                                {INTERESTS.map(i => <option key={i.id} value={i.id}>{i.name.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Insight Panel */}
                                    <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-6 flex flex-col">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Zap className="w-4 h-4 text-indigo-400" />
                                            <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest">Niche Audit</span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed font-mono animate-fade-in" key={interest}>
                                            {">"} {diagnosis}
                                        </p>
                                        <div className="mt-auto pt-6 flex justify-between items-end border-t border-indigo-500/10">
                                            <div className="space-y-1">
                                                <div className="text-[8px] text-slate-600 uppercase font-mono tracking-tighter">Algorithm Drift</div>
                                                <div className="text-indigo-400 font-mono text-sm leading-none">-{15 + (interest.length % 5)}% traction</div>
                                            </div>
                                            <Shield className="w-4 h-4 text-indigo-500 opacity-20" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center pt-8">
                                    <Button onClick={handleNext} className="w-full md:w-auto bg-white text-black hover:bg-slate-200 text-xs font-mono uppercase tracking-[0.2em] py-8 px-16 rounded-none shadow-[4px_4px_0px_#4f46e5]">
                                        Execute Authentication <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 max-w-2xl mx-auto text-center">
                                <h3 className="text-2xl font-verdict text-white italic mb-8">Define Your Mandate</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                    {['DOMINION', 'REVENUE', 'LEGACY'].map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setObjective(m.toLowerCase())}
                                            className={`p-6 border ${objective === m.toLowerCase() ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-slate-800 bg-slate-900/50'} hover:border-[#d4af37]/50 transition-all group`}
                                        >
                                            <div className={`w-2 h-2 rounded-full mb-4 mx-auto ${objective === m.toLowerCase() ? 'bg-[#d4af37]' : 'bg-slate-700'}`} />
                                            <div className="text-xs font-mono text-white tracking-widest">{m}</div>
                                        </button>
                                    ))}
                                </div>

                                <h3 className="text-2xl font-verdict text-white italic mb-8">Deployment Velocity</h3>
                                <div className="bg-slate-900/50 border border-slate-800 p-8 mb-8">
                                    <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-4">
                                        <span>Standard</span>
                                        <span className="text-[#d4af37]">Sovereign Speed</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-800 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#d4af37] rounded-full shadow-[0_0_10px_#d4af37]" />
                                    </div>
                                </div>

                                <Button onClick={handleNext} className="w-full md:w-auto bg-[#d4af37] text-black hover:bg-[#b5952f] text-xs font-mono uppercase tracking-[0.2em] py-8 px-16 rounded-none">
                                    Confirm Mandate <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                                <div className="text-center font-mono space-y-2">
                                    <h3 className="text-white text-sm uppercase tracking-[0.5em]">Lazarus Calibration</h3>
                                    <p className="text-slate-600 text-[10px] animate-pulse">EXTRACTING METADATA FROM SOURCE...</p>
                                    <div className="flex gap-4 justify-center mt-2 text-[9px] font-mono text-indigo-400">
                                        <span>TRUSTED_MULTIPLIER: LOW</span>
                                        <span>|</span>
                                        <span>HUMAN_ENTROPY: DEFICIENT</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1">Magnitude (Followers)</label>
                                        <input type="number" value={followers} onChange={(e) => setFollowers(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-5 px-6 text-white font-mono text-xl focus:border-indigo-500 outline-none" placeholder="0" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1">Entropy (Avg Likes)</label>
                                        <input type="number" value={avgLikes} onChange={(e) => setAvgLikes(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-5 px-6 text-white font-mono text-xl focus:border-indigo-500 outline-none" placeholder="0" />
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-900/40 border-l border-indigo-500 flex items-start gap-4">
                                    <div className="space-y-2">
                                        <div className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest">Diagnostic Note</div>
                                        <p className="text-xs text-slate-500 font-mono leading-relaxed">Cross-referencing entropy markers against Dec-25 benchmark. Detecting potential Latent Space Repulsion...</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row justify-center items-center gap-6 pt-4">
                                    <button onClick={() => setCurrentStep(0)} className="text-slate-600 hover:text-indigo-400 font-mono text-[10px] uppercase tracking-widest">
                                        Retry Configuration
                                    </button>
                                    <Button onClick={handleNext} disabled={!followers || !avgLikes} className="w-full md:w-auto bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-mono uppercase tracking-[0.2em] py-8 px-20 rounded-none shadow-[4px_4px_0px_white]">
                                        Initiate Final Scan <Rocket className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Trust Bar */}
                <div className="bg-indigo-500/5 px-8 py-4 border-t border-indigo-500/10 flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        <Database className="w-3 h-3" /> Encrypted Audit
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        <Lock className="w-3.5 h-3.5" /> No Password
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        <Shield className="w-3.5 h-3.5" /> Bureau Verified
                    </div>
                </div>

            </div>
        </div>
    )
}
