"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Loader2, Users, User, Globe, MapPin, Map, Check, Rocket, BarChart3, Database, Lock, Shield } from "lucide-react"
import { LOCATIONS, INTERESTS, GENDERS, type LocationId, type InterestId, type GenderId } from "@/lib/el-faro/selectors"
import { useI18n } from "@/lib/i18n/context"

const LoadingOverlay = ({ step, t, values }: { step: number, t: any, values: any }) => {
    const [msgIndex, setMsgIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setMsgIndex(prev => prev < 3 ? prev + 1 : prev)
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const nicheName = t.consultant?.selectors?.interests?.[values.interest] || values.interest

    const messages = [
        { icon: Globe, text: "Connecting to Global Database...", color: "text-blue-400" },
        { icon: BarChart3, text: `Analyzing ${nicheName} Competitors...`, color: "text-purple-400" },
        { icon: Rocket, text: "Calibrating Viral Algorithm...", color: "text-orange-400" },
        { icon: Check, text: "Strategy Generated.", color: "text-green-400" }
    ]

    const CurrentIcon = messages[msgIndex].icon

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#020617]/98 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
        >
            {/* Neural Background Effect (Subtle) */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            {/* HUD Circle */}
            <div className="relative w-32 h-32 mb-10">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-spin-slow"></div>
                {/* Inner Ring (Pulsing) */}
                <div className="absolute inset-2 rounded-full border-2 border-t-cyan-400 border-r-purple-500 border-b-transparent border-l-transparent animate-spin shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
                {/* Center Core */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <CurrentIcon className={`w-10 h-10 ${messages[msgIndex].color} animate-pulse transition-all duration-300`} />
                </div>
            </div>

            {/* Dynamic Text */}
            <div className="h-16 flex flex-col items-center justify-start">
                <AnimatePresence mode="wait">
                    <motion.h3
                        key={msgIndex}
                        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                        className="text-2xl font-bold text-white mb-2 tracking-wide font-mono"
                    >
                        {messages[msgIndex].text}
                    </motion.h3>
                </AnimatePresence>

                {/* Progress Bar Line */}
                <div className="w-48 h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((msgIndex + 1) / 4) * 100}%` }}
                        transition={{ duration: 1 }}
                    />
                </div>
            </div>
        </motion.div>
    )
}

export default function SmartGrowthConsultant() {
    const { t } = useI18n()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Form Data
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

        setIsLoading(true)
        // Show "Processing" Screen for 4s + buffer
        await new Promise(resolve => setTimeout(resolve, 4500))

        // Redirect
        const params = new URLSearchParams({
            platform,
            gender,
            location,
            interest,
        })
        router.push(`/servicios?${params.toString()}`)
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
                        </AnimatePresence>

                        {/* Progress Bar (Top) */}
                        <div className="w-full h-1.5 bg-slate-800">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${(1 / 2) * 100}%` }} // Adjusted to 100% for single step
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            />
                        </div>

                        <div className="p-8 md:p-12 flex-grow flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="text-center text-white space-y-2 mb-6">
                                    <h3 className="text-2xl font-bold">{t.consultant?.step1?.title || "Configure Your Growth Engine"}</h3>
                                    <p className="text-slate-400">{t.consultant?.step1?.subtitle || "Our AI will analyze your niche to build a custom strategy."}</p>
                                </div>

                                {/* 1. Platform Selector */}
                                <div className="flex justify-center gap-6">
                                    <button
                                        onClick={() => { setPlatform("instagram"); vibrate(); }}
                                        className={`group relative px-6 py-3 rounded-2xl font-bold transition-all duration-300 overflow-hidden ${platform === "instagram" ? "scale-105 shadow-xl shadow-purple-500/20 ring-2 ring-purple-500/50 bg-slate-800" : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"}`}
                                    >
                                        {platform === "instagram" && <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-orange-500/20 opacity-100" />}
                                        <span className={`relative z-10 flex items-center gap-2 ${platform === "instagram" ? "text-white" : ""}`}>
                                            <span className="text-xl">📸</span> Instagram
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => { setPlatform("tiktok"); vibrate(); }}
                                        className={`group relative px-6 py-3 rounded-2xl font-bold transition-all duration-300 overflow-hidden ${platform === "tiktok" ? "scale-105 shadow-xl shadow-pink-500/20 ring-2 ring-pink-500/50 bg-slate-800" : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"}`}
                                    >
                                        {platform === "tiktok" && <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-teal-400/20 opacity-100" />}
                                        <span className={`relative z-10 flex items-center gap-2 ${platform === "tiktok" ? "text-white" : ""}`}>
                                            <span className="text-xl">🎵</span> TikTok
                                        </span>
                                    </button>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* 2. Gender */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">{t.consultant?.step2?.genderLabel || "Target Audience"}</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {GENDERS.map((g) => (
                                                <button
                                                    key={g.id}
                                                    onClick={() => { setGender(g.id); vibrate(); }}
                                                    className={`relative p-3 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-1 ${gender === g.id ? "border-cyan-400 bg-cyan-950/30 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] ring-1 ring-cyan-400" : "border-slate-700 bg-slate-800/30 text-slate-400 hover:bg-slate-800"}`}
                                                >
                                                    <div className="text-xl">{g.id === 'female' ? '👩' : g.id === 'male' ? '👨' : '👥'}</div>
                                                    <div className="text-[10px] font-bold uppercase">{t.consultant?.selectors?.genders?.[g.id] || g.name}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 3. Location */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">{t.consultant?.step2?.locationLabel || "Target Region"}</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {LOCATIONS.slice(0, 4).map((loc) => (
                                                <button
                                                    key={loc.id}
                                                    onClick={() => { setLocation(loc.id); vibrate(); }}
                                                    className={`relative p-3 rounded-xl border transition-all duration-200 flex items-center gap-2 ${location === loc.id ? "border-emerald-400 bg-emerald-950/30 text-white shadow-[0_0_15px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400" : "border-slate-700 bg-slate-800/30 text-slate-400 hover:bg-slate-800"}`}
                                                >
                                                    <span className="text-lg">{loc.id === 'us' ? '🇺🇸' : loc.id === 'uk' ? '🇬🇧' : loc.id === 'eu' ? '🇪🇺' : '🌎'}</span>
                                                    <div className="text-[10px] font-bold uppercase truncate">{t.consultant?.selectors?.locations?.[loc.id] || loc.name}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Interest / Niche */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">{t.consultant?.step2?.interestLabel || "Niche / Industry"}</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {INTERESTS.slice(0, 8).map((int) => (
                                            <button
                                                key={int.id}
                                                onClick={() => { setInterest(int.id); vibrate(); }}
                                                className={`group relative p-2.5 rounded-xl border text-center transition-all duration-200 ${interest === int.id ? `border-purple-400 bg-purple-900/30 text-white shadow-[0_0_15px_rgba(192,132,252,0.3)] ring-1 ring-purple-400` : "border-slate-700 bg-slate-800/30 text-slate-400 hover:bg-slate-800"}`}
                                            >
                                                <div className={`text-lg mb-1 transition-transform duration-300 ${interest === int.id ? "scale-125 animate-bounce-short" : "group-hover:scale-110"}`}>
                                                    {int.icon}
                                                </div>
                                                <div className="text-[10px] font-bold uppercase truncate">
                                                    {t.consultant?.selectors?.interests?.[int.id] || int.name}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-center pt-4">
                                    <Button
                                        onClick={handleNext}
                                        disabled={isLoading}
                                        className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xl px-12 py-8 rounded-2xl font-black shadow-xl shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-80 flex items-center justify-center gap-3"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Analyze Audience 🤖
                                                <ArrowRight className="w-6 h-6" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Footer: Trust Bar (Always Visible) */}
                        <div className="bg-slate-950/50 border-t border-slate-800 py-4 px-6 flex flex-wrap justify-center gap-x-8 gap-y-2 mt-auto">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                                {t.consultant?.trust?.encrypted || "256-Bit Encrypted"}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                                <User className="w-3.5 h-3.5 text-blue-500" />
                                {t.consultant?.trust?.noPassword || "No Password Required"}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                                <Shield className="w-3.5 h-3.5 text-purple-500" />
                                {t.consultant?.trust?.guarantee || "Growth Guarantee"}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    )
}
