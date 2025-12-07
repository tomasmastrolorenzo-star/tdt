"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, MapPin, Target, Users, Heart, MessageCircle, Sparkles, Loader2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import Link from "next/link"

// Steps:
// 1. Quantity (Slider)
// 2. Audience (Location, Age, Gender)
// 3. Current Stats (Likes, Comments)
// 4. Recommendation (AI Analysis -> Checkout)

export default function SmartGrowthConsultant() {
    const { t } = useI18n()
    const [step, setStep] = useState(1)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // Form Data
    const [followers, setFollowers] = useState([2000]) // Default 2k
    const [platform, setPlatform] = useState("instagram")
    const [niche, setNiche] = useState("")
    const [location, setLocation] = useState("")
    const [ageRange, setAgeRange] = useState("18-24")
    const [currentLikes, setCurrentLikes] = useState("")
    const [goalLikes, setGoalLikes] = useState("")

    // Pricing Logic (Simplified for Demo)
    const basePrice = 15 // Base for 2k
    const price = Math.round((followers[0] / 2000) * basePrice * 0.9) // Simple linear curve

    const handleNext = () => {
        if (step === 3) {
            analyzeAndRecommend()
        } else {
            setStep(step + 1)
        }
    }

    const analyzeAndRecommend = () => {
        setIsAnalyzing(true)
        // Fake AI delay
        setTimeout(() => {
            setIsAnalyzing(false)
            setStep(4)
        }, 2000)
    }

    const getRecommendationUrl = () => {
        // Construct URL with metadata
        const metadata = encodeURIComponent(`Nicho: ${niche}, Ubicación: ${location}, Edad: ${ageRange}, Meta Likes: ${goalLikes}`)
        return `/checkout/service?platform=${platform}&service=followers&amount=${followers[0]}&price=${price}&metadata=${metadata}`
    }

    return (
        <section id="consultant" className="py-20 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 z-0" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">

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
                            No te vendemos paquetes genéricos. Analizamos tu perfil y tus metas para recomendarte el plan exacto para tu crecimiento.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-center">

                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                                initial={{ width: "25%" }}
                                animate={{ width: `${step * 25}%` }}
                            />
                        </div>

                        <AnimatePresence mode="wait">

                            {/* STEP 1: QUANTITY */}
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

                            {/* STEP 2: AUDIENCE */}
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
                                        <p className="text-slate-400">Para segmentar, necesitamos saber a quién te diriges.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Tu Nicho / Profesión</label>
                                            <div className="relative">
                                                <Target className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    placeholder="Ej: Fotógrafo, Fitness, Moda..."
                                                    value={niche}
                                                    onChange={(e) => setNiche(e.target.value)}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-10 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Ubicación Objetivo</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    placeholder="Ej: Colorado, USA"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pl-10 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-slate-300">Rango de Edad de la Audiencia</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {["13-17", "18-24", "25-34", "35-44", "45+", "Todas"].map((age) => (
                                                    <button
                                                        key={age}
                                                        onClick={() => setAgeRange(age)}
                                                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${ageRange === age ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"}`}
                                                    >
                                                        {age}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white underline">Atrás</button>
                                        <Button onClick={handleNext} disabled={!niche || !location} className="bg-white text-slate-900 hover:bg-slate-200 text-lg px-8 py-6 rounded-xl font-bold shadow-lg shadow-white/10 disabled:opacity-50">
                                            Siguiente <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: STATS */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center text-white mb-4">
                                        <h3 className="text-2xl font-bold mb-2">3. Métricas de Engagement</h3>
                                        <p className="text-slate-400">Analicemos tu brecha de crecimiento.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
                                            <Heart className="w-8 h-8 text-pink-500 mx-auto mb-4" />
                                            <h4 className="text-white font-bold mb-4">Promedio Likes Actual</h4>
                                            <input
                                                type="number"
                                                placeholder="Ej: 50"
                                                value={currentLikes}
                                                onChange={(e) => setCurrentLikes(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 text-center text-white focus:ring-2 focus:ring-pink-500 outline-none text-xl font-bold"
                                            />
                                        </div>

                                        <div className="bg-indigo-900/20 p-6 rounded-2xl border border-indigo-500/30 text-center relative overflow-hidden">
                                            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">META</div>
                                            <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                                            <h4 className="text-white font-bold mb-4">Likes Deseados</h4>
                                            <input
                                                type="number"
                                                placeholder="Ej: 500"
                                                value={goalLikes}
                                                onChange={(e) => setGoalLikes(e.target.value)}
                                                className="w-full bg-slate-900 border border-indigo-500 rounded-xl p-3 text-center text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-8">
                                        <button onClick={() => setStep(2)} className="text-slate-400 hover:text-white underline">Atrás</button>
                                        <Button onClick={handleNext} disabled={!currentLikes || !goalLikes} className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-lg px-8 py-6 rounded-xl font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 w-full md:w-auto">
                                            Analizar Perfil <Sparkles className="ml-2 w-5 h-5 animate-pulse" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: LOADING / ANALYSIS */}
                            {isAnalyzing && (
                                <motion.div
                                    key="analyzing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white"
                                >
                                    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-6" />
                                    <h3 className="text-2xl font-bold mb-2">La IA está diseñando tu plan...</h3>
                                    <p className="text-slate-400">Analizando nicho: {niche}</p>
                                    <p className="text-slate-400">Optimizando para: {location}</p>
                                </motion.div>
                            )}

                            {/* STEP 5: RECOMMENDATION */}
                            {step === 4 && (
                                <motion.div
                                    key="recommendation"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-1 rounded-full font-bold mb-6 border border-green-500/20">
                                        <Check className="w-4 h-4" /> Plan Optimizado Exitosamente
                                    </div>

                                    <h3 className="text-3xl font-black text-white mb-2">Tu Estrategia {platform === "instagram" ? "Instagram" : "TikTok"} Pro</h3>
                                    <p className="text-slate-400 mb-8">Basado en tu objetivo de llegar a {parseInt(goalLikes).toLocaleString()} likes en {location}</p>

                                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-indigo-500/50 rounded-3xl p-8 max-w-sm mx-auto shadow-2xl shadow-indigo-500/10 mb-8 transform hover:scale-105 transition-all relative">
                                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500" />

                                        <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                                            <div className="text-left">
                                                <div className="text-slate-400 text-sm">Paquete</div>
                                                <div className="text-white font-bold text-xl">Crecimiento {niche}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-slate-400 text-sm">Cantidad</div>
                                                <div className="text-indigo-400 font-bold text-xl">{followers[0].toLocaleString()}</div>
                                            </div>
                                        </div>

                                        <ul className="space-y-3 text-left mb-8">
                                            <li className="flex items-center gap-3 text-slate-300">
                                                <MapPin className="w-5 h-5 text-indigo-400" /> Segmentación: {location}
                                            </li>
                                            <li className="flex items-center gap-3 text-slate-300">
                                                <Target className="w-5 h-5 text-indigo-400" /> Nicho: {niche}
                                            </li>
                                            <li className="flex items-center gap-3 text-slate-300">
                                                <Users className="w-5 h-5 text-indigo-400" /> Edad: {ageRange}
                                            </li>
                                            <li className="flex items-center gap-3 text-slate-300">
                                                <Sparkles className="w-5 h-5 text-yellow-400" /> Boost de Engagement Incluido
                                            </li>
                                        </ul>

                                        <Link href={getRecommendationUrl()}>
                                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 text-lg font-bold rounded-xl shadow-lg shadow-indigo-600/20">
                                                Activar Plan • ${price}
                                            </Button>
                                        </Link>
                                    </div>

                                    <button onClick={() => setStep(1)} className="text-slate-500 hover:text-white text-sm">Empezar de nuevo</button>
                                </motion.div>
                            )}

                        </AnimatePresence>

                    </div>

                    {/* Social Proof */}
                    <div className="mt-8 flex justify-center gap-8 opacity-60">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Check className="w-4 h-4 text-green-500" /> Datos Encriptados
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Check className="w-4 h-4 text-green-500" /> Sin Contraseñas
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Check className="w-4 h-4 text-green-500" /> Garantía Total
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
