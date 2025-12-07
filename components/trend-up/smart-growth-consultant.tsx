"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { LOCATIONS, INTERESTS, GENDERS, type LocationId, type InterestId, type GenderId } from "@/lib/el-faro/selectors"

export default function SmartGrowthConsultant() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // Form Data
    const [followers, setFollowers] = useState([2000])
    const [platform, setPlatform] = useState("instagram")
    const [gender, setGender] = useState<GenderId>("any")
    const [location, setLocation] = useState<LocationId>("us")
    const [interest, setInterest] = useState<InterestId>("fitness")

    const handleNext = () => {
        if (step === 2) {
            // After Phase 2, redirect to /servicios with metadata
            const params = new URLSearchParams({
                platform,
                followers: followers[0].toString(),
                gender,
                location,
                interest,
            })
            router.push(`/servicios?${params.toString()}`)
        } else {
            setStep(step + 1)
        }
    }

    return (
        <section id="consultant" className="py-20 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 z-0" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold mb-4 border border-indigo-500/30">
                            ✨ El Faro: Consultor de Crecimiento IA
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Diseña tu Estrategia <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                Personalizada
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Nuestra IA analiza tu perfil y diseña el plan perfecto para tu crecimiento. Solo selecciona tus preferencias.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-center">

                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                                initial={{ width: "50%" }}
                                animate={{ width: `${step * 50}%` }}
                            />
                        </div>

                        <AnimatePresence mode="wait">

                            {/* STEP 1: PLATFORM & QUANTITY */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center text-white mb-8">
                                        <h3 className="text-2xl font-bold mb-2">1. ¿Cuál es tu objetivo de alcance?</h3>
                                        <p className="text-slate-400">Selecciona cuántos seguidores nuevos quieres atraer.</p>
                                    </div>

                                    {/* Platform Selector */}
                                    <div className="flex justify-center gap-4 mb-8">
                                        <button
                                            onClick={() => setPlatform("instagram")}
                                            className={`px-6 py-3 rounded-xl font-bold transition-all ${platform === "instagram" ? "bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg scale-105" : "bg-slate-800 text-slate-400 border border-slate-700"}`}
                                        >
                                            Instagram
                                        </button>
                                        <button
                                            onClick={() => setPlatform("tiktok")}
                                            className={`px-6 py-3 rounded-xl font-bold transition-all ${platform === "tiktok" ? "bg-gradient-to-r from-pink-600 to-teal-400 text-white shadow-lg scale-105" : "bg-slate-800 text-slate-400 border border-slate-700"}`}
                                        >
                                            TikTok
                                        </button>
                                    </div>

                                    <div className="px-4 py-8 bg-slate-800/50 rounded-2xl border border-slate-700">
                                        <div className="text-center mb-12">
                                            <span className="text-6xl font-black text-white">{followers[0].toLocaleString()}</span>
                                            <span className="text-xl text-slate-400 ml-2">seguidores</span>
                                        </div>

                                        <Slider
                                            defaultValue={[2000]}
                                            max={100000}
                                            min={500}
                                            step={500}
                                            value={followers}
                                            onValueChange={setFollowers}
                                            className="mb-8"
                                        />

                                        <div className="flex justify-between text-slate-500 text-sm px-2">
                                            <span>Micro (500)</span>
                                            <span>Influencer (100k)</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button onClick={handleNext} className="bg-white text-slate-900 hover:bg-slate-200 text-lg px-8 py-6 rounded-xl font-bold shadow-lg shadow-white/10">
                                            Continuar <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: AUDIENCE SELECTORS (VISUAL) */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center text-white mb-4">
                                        <h3 className="text-2xl font-bold mb-2">2. Define tu Audiencia Ideal</h3>
                                        <p className="text-slate-400">Selecciona las características de tu público objetivo</p>
                                    </div>

                                    {/* Gender Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-3">Género del Público</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {GENDERS.map((g) => (
                                                <button
                                                    key={g.id}
                                                    onClick={() => setGender(g.id)}
                                                    className={`p-4 rounded-xl border-2 text-center transition-all ${gender === g.id ? "border-indigo-500 bg-indigo-500/20 text-white" : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
                                                >
                                                    <div className="text-3xl mb-2">{g.icon}</div>
                                                    <div className="text-sm font-medium">{g.name}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Location Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-3">Ubicación del Público</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {LOCATIONS.map((loc) => (
                                                <button
                                                    key={loc.id}
                                                    onClick={() => setLocation(loc.id)}
                                                    className={`p-4 rounded-xl border-2 text-center transition-all ${location === loc.id ? "border-cyan-500 bg-cyan-500/20 text-white" : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
                                                >
                                                    <div className="text-2xl mb-2">{loc.flag}</div>
                                                    <div className="text-sm font-medium">{loc.name}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interest Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-3">Nicho / Interés</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                                            {INTERESTS.map((int) => (
                                                <button
                                                    key={int.id}
                                                    onClick={() => setInterest(int.id)}
                                                    className={`p-3 rounded-xl border-2 text-center transition-all ${interest === int.id ? `border-purple-500 bg-gradient-to-br ${int.color} text-white` : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
                                                >
                                                    <div className="text-2xl mb-1">{int.icon}</div>
                                                    <div className="text-xs font-medium">{int.name}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white underline">Atrás</button>
                                        <Button onClick={handleNext} className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-lg px-8 py-6 rounded-xl font-bold shadow-lg shadow-indigo-500/20">
                                            Ver Opciones <Sparkles className="ml-2 w-5 h-5 animate-pulse" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>

                    </div>

                    {/* Social Proof */}
                    <div className="mt-8 flex justify-center gap-8 opacity-60">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Sparkles className="w-4 h-4 text-green-500" /> Datos Encriptados
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Sparkles className="w-4 h-4 text-green-500" /> Sin Contraseñas
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Sparkles className="w-4 h-4 text-green-500" /> Garantía Total
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
