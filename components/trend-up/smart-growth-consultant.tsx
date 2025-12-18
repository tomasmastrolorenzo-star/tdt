"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Loader2, Users, User, Globe, MapPin, Map } from "lucide-react"
import { LOCATIONS, INTERESTS, GENDERS, type LocationId, type InterestId, type GenderId } from "@/lib/el-faro/selectors"
import { useI18n } from "@/lib/i18n/context"

const LoadingOverlay = ({ step, t, values }: { step: number, t: any, values: any }) => {
    const [msgIndex, setMsgIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setMsgIndex(prev => prev === 0 ? 1 : 0)
        }, 1500) // Change message halfway through total time if we want, or just static. 
        // User asked for sequence. Total wait is 1.5s? "implementar una pantalla de carga de máximo 1.5 segundos".
        // Actually, maybe show one then the other or just one.
        // "Analyzing [Niche] in [Loc]..." -> then maybe "Optimizing..."
        // I will do 1.5s total. 0-0.75s msg1, 0.75-1.5s msg2.

        const switchTimer = setTimeout(() => {
            setMsgIndex(1)
        }, 1000)

        return () => {
            clearInterval(timer)
            clearTimeout(switchTimer)
        }
    }, [])

    const nicheName = t.consultant?.selectors?.interests?.[values.interest] || values.interest
    const locName = t.consultant?.selectors?.locations?.[values.location] || values.location

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
        >
            <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-r-2 border-cyan-500 animate-spin-reverse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.h3
                    key={msgIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-2xl font-bold text-white mb-2"
                >
                    {msgIndex === 0
                        ? (t.consultant?.step1?.loading?.analyzing || "Analyzing...").replace("{niche}", nicheName).replace("{location}", locName)
                        : (t.consultant?.step1?.loading?.optimizing || "Optimizing strategy...")
                    }
                </motion.h3>
            </AnimatePresence>

            <p className="text-slate-400 text-sm animate-pulse">AI Power Processing</p>
        </motion.div>
    )
}

export default function SmartGrowthConsultant() {
    const { t } = useI18n()
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    // Form Data
    const [followers, setFollowers] = useState([2000])
    const [platform, setPlatform] = useState("instagram")
    const [gender, setGender] = useState<GenderId>("any")
    const [location, setLocation] = useState<LocationId>("us")
    const [interest, setInterest] = useState<InterestId>("fitness")

    // Haptics Helper
    const vibrate = (ms: number = 10) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(ms)
        }
    }

    const handleNext = async () => {
        vibrate(20) // Button click haptic

        if (step === 2) {
            setIsLoading(true)
            // Show "Revelation" Loading Screen for 2s (slightly more to read)
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Redirect
            const params = new URLSearchParams({
                platform,
                followers: followers[0].toString(),
                gender,
                location,
                interest,
            })
            router.push(`/servicios?${params.toString()}`)
            // Don't set isLoading false to keep overlay until Nav happens
        } else {
            setStep(step + 1)
        }
    }

    // Slider Logic with Haptics on Milestones
    const handleSliderChange = (vals: number[]) => {
        const val = vals[0]
        // Simple haptic check on milestones: 5k, 10k, 20k, 50k
        if ([5000, 10000, 20000, 50000].includes(val)) {
            vibrate(40)
        } else if (val % 1000 === 0) {
            // subtle tick
            vibrate(5)
        }
        setFollowers(vals)
    }

    // Dynamic Micro-Copy Logic
    const getRangeText = (val: number) => {
        const ranges = (t.consultant?.step1 as any)?.ranges
        if (!ranges) return ""
        if (val <= 2000) return ranges.foundation
        if (val <= 20000) return ranges.authority
        return ranges.dominance
    }

    // Odometer Effect Component (Simple implementation suitable for this context)
    const Odometer = ({ value }: { value: number }) => {
        return (
            <span className="tabular-nums tracking-tight">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-block"
                    >
                        {value.toLocaleString()}
                    </motion.span>
                </AnimatePresence>
            </span>
        )
    }

    return (
        <section id="consultant" className="py-20 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 z-0" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold mb-4 border border-indigo-500/30 animate-pulse">
                            {t.consultant?.badge || "✨ TDT Lighthouse"}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            {t.consultant?.title} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                {t.consultant?.titleHighlight}
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            {t.consultant?.subtitle}
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-0 shadow-2xl relative overflow-hidden min-h-[550px] flex flex-col">

                        {/* Loading Overlay (Revelation) */}
                        <AnimatePresence>
                            {isLoading && <LoadingOverlay step={3} t={t} values={{ interest, location }} />}
                        </AnatePresence>

                        {/* Progress Bar (Top) */}
                        <div className="w-full h-1.5 bg-slate-800">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(step / 2) * 100}%` }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            />
                        </div>

                        <div className="p-8 md:p-12 flex-grow flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                {/* STEP 1: PLATFORM & QUANTITY */}
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-10"
                                    >
                                        <div className="text-center text-white space-y-2">
                                            <h3 className="text-2xl font-bold">{t.consultant?.step1?.title}</h3>
                                            <p className="text-slate-400">{t.consultant?.step1?.subtitle}</p>
                                        </div>

                                        {/* Platform Selector */}
                                        <div className="flex justify-center gap-6">
                                            <button
                                                onClick={() => { setPlatform("instagram"); vibrate(); }}
                                                className={`group relative px-8 py-4 rounded-2xl font-bold transition-all duration-300 overflow-hidden ${platform === "instagram" ? "scale-105 shadow-xl shadow-purple-500/20 ring-2 ring-purple-500/50" : "bg-slate-800 text-slate-400 hover:bg-slate-750"}`}
                                            >
                                                {platform === "instagram" && <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-orange-500 opacity-100" />}
                                                <span className={`relative z-10 flex items-center gap-2 ${platform === "instagram" ? "text-white" : ""}`}>
                                                    <span className="text-xl">📸</span> Instagram
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => { setPlatform("tiktok"); vibrate(); }}
                                                className={`group relative px-8 py-4 rounded-2xl font-bold transition-all duration-300 overflow-hidden ${platform === "tiktok" ? "scale-105 shadow-xl shadow-pink-500/20 ring-2 ring-pink-500/50" : "bg-slate-800 text-slate-400 hover:bg-slate-750"}`}
                                            >
                                                {platform === "tiktok" && <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-teal-400 opacity-100" />}
                                                <span className={`relative z-10 flex items-center gap-2 ${platform === "tiktok" ? "text-white" : ""}`}>
                                                    <span className="text-xl">🎵</span> TikTok
                                                </span>
                                            </button>
                                        </div>

                                        {/* Slider / Reach Goal - Appears with Fade Up */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="px-6 py-8 bg-slate-800/40 rounded-3xl border border-slate-700/50"
                                        >
                                            <div className="text-center mb-10">
                                                <div className="flex items-center justify-center gap-2 text-5xl md:text-6xl font-black text-white mb-2">
                                                    <Odometer value={followers[0]} />
                                                </div>
                                                <div className="text-lg text-slate-400 font-medium mb-1">{t.consultant?.step1?.followers}</div>

                                                {/* Dynamic Micro-Copy */}
                                                <motion.div
                                                    key={followers[0]} // Re-animates on change
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-indigo-400 text-sm font-semibold h-5"
                                                >
                                                    {getRangeText(followers[0])}
                                                </motion.div>
                                            </div>

                                            <div className="px-4">
                                                <Slider
                                                    defaultValue={[2000]}
                                                    max={100000}
                                                    min={500}
                                                    step={500}
                                                    value={followers}
                                                    onValueChange={handleSliderChange} // Use wrapper for haptics
                                                    className="mb-6 cursor-pointer"
                                                />

                                                {/* Illuminated Status Labels */}
                                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest px-1">
                                                    <span className={`transition-colors duration-300 ${followers[0] <= 5000 ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-slate-600"}`}>
                                                        {t.consultant?.step1?.micro}
                                                    </span>
                                                    <span className={`transition-colors duration-300 ${followers[0] >= 50000 ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" : "text-slate-600"}`}>
                                                        {t.consultant?.step1?.influencer}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <div className="flex justify-end pt-2">
                                            <Button
                                                onClick={handleNext}
                                                disabled={isLoading}
                                                className="bg-white text-slate-900 hover:bg-slate-200 text-lg px-10 py-7 rounded-2xl font-bold shadow-lg shadow-white/10 hover:shadow-white/20 transition-all active:scale-95 disabled:opacity-80"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                                ) : (
                                                    <>
                                                        {t.consultant?.step1?.continue} <ArrowRight className="ml-2 w-5 h-5" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 2: AUDIENCE SELECTORS */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="text-center text-white mb-2">
                                            <h3 className="text-2xl font-bold mb-2">{t.consultant?.step2?.title}</h3>
                                            <p className="text-slate-400">{t.consultant?.step2?.subtitle}</p>
                                        </div>

                                        <div className="grid gap-8">
                                            {/* Gender Selector - Staggered */}
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">{t.consultant?.step2?.genderLabel}</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {GENDERS.map((g) => (
                                                        <button
                                                            key={g.id}
                                                            onClick={() => { setGender(g.id); vibrate(); }}
                                                            className={`p-4 rounded-xl border transition-all duration-200 ${gender === g.id ? "border-indigo-500 bg-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]" : "border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800"}`}
                                                        >
                                                            <div className="text-sm font-bold">
                                                                {t.consultant?.selectors?.genders?.[g.id as keyof typeof t.consultant.selectors.genders] || g.name}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>

                                            {/* Location Selector */}
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">{t.consultant?.step2?.locationLabel}</label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {LOCATIONS.map((loc) => (
                                                        <button
                                                            key={loc.id}
                                                            onClick={() => { setLocation(loc.id); vibrate(); }}
                                                            className={`p-3 rounded-xl border transition-all duration-200 ${location === loc.id ? "border-cyan-500 bg-cyan-500/20 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800"}`}
                                                        >
                                                            <div className="text-sm font-bold">
                                                                {t.consultant?.selectors?.locations?.[loc.id as keyof typeof t.consultant.selectors.locations] || loc.name}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>

                                            {/* Interest Selector + Pulse Effect */}
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">{t.consultant?.step2?.interestLabel}</label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {INTERESTS.slice(0, 8).map((int) => (
                                                        <button
                                                            key={int.id}
                                                            onClick={() => { setInterest(int.id); vibrate(); }}
                                                            className={`group p-3 rounded-xl border text-center transition-all duration-200 ${interest === int.id ? `border-purple-500 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]` : "border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800"}`}
                                                        >
                                                            <div className={`text-xl mb-1 transition-transform duration-300 ${interest === int.id ? "scale-125 animate-bounce-short" : "group-hover:scale-110"}`}>
                                                                {int.icon}
                                                            </div>
                                                            <div className="text-xs font-bold truncate">
                                                                {t.consultant?.selectors?.interests?.[int.id as keyof typeof t.consultant.selectors.interests] || int.name}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </div>

                                        <div className="flex justify-between items-center pt-6">
                                            <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white text-sm font-medium underline decoration-slate-600 underline-offset-4 transition-colors">{t.consultant?.step2?.back}</button>

                                            <Button
                                                onClick={handleNext}
                                                disabled={isLoading}
                                                className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-lg px-10 py-7 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-80"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                ) : (
                                                    <>
                                                        {t.consultant?.step2?.cta} <Sparkles className="ml-2 w-5 h-5 animate-pulse" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer: Trust Bar (Always Visible) */}
                        <div className="bg-slate-950/50 border-t border-slate-800 py-4 px-6 flex flex-wrap justify-center gap-x-8 gap-y-2 mt-auto">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> {t.consultant?.trust?.encrypted}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> {t.consultant?.trust?.noPassword}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> {t.consultant?.trust?.guarantee}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    )
}
