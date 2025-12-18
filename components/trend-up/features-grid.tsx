"use client"

import { Heart, TrendingUp, ShieldCheck, CheckCircle2, Banknote, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function FeaturesGrid() {
    const { t } = useI18n()

    // Defensive & Type check
    if (!t?.features?.list) return null

    const featureList = t.features.list as any[]

    const icons = [
        Heart,          // No Spam Tactics
        TrendingUp,     // Consistent Growth
        ShieldCheck,    // Risk Free
        CheckCircle2,   // Engaged Following
        Banknote,       // Don't Waste Money
        Sparkles        // AI Models
    ]

    const colors = [
        "text-red-500 bg-red-100",
        "text-blue-500 bg-blue-100",
        "text-cyan-500 bg-cyan-100",
        "text-yellow-500 bg-yellow-100",
        "text-green-500 bg-green-100",
        "text-purple-500 bg-purple-100"
    ]

    return (
        <section className="py-24 bg-gradient-to-b from-[#0F172A] via-orange-50/50 to-white">
            <div className="container mx-auto px-4">

                {/* Header */}
                {/* Header with Equation */}
                <div className="text-center mb-20 max-w-4xl mx-auto">
                    <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-bold mb-8 animate-fade-in">
                        {t.features.badge}
                    </div>

                    {/* Equation */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-2xl md:text-3xl lg:text-4xl text-slate-500 font-medium mb-8 flex-wrap">
                        <span className="text-slate-400">{t.features.header?.main || "AI Tech + Marketing ="}</span>
                        <span className="font-black text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
                            {t.features.header?.highlight || "Growth 🚀"}
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight hidden">
                        {/* Hiding old title for now as Equation takes precedence, or keep as sub? User said Equation should be center. 
                            I'll hide the old title to avoid clutter, or maybe use it as a smaller subhead?
                            The old title was "No fake followers". 
                            I'll render the old subtitle still.
                        */}
                        {t.features.title}
                    </h2>
                    <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        {t.features.subtitle}
                    </p>
                </div>

                {/* Main Grid container with Card Effect */}
                <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {featureList.map((feature: any, i: number) => {
                            const Icon = icons[i] || Sparkles

                            // Specific card detection
                            const isNoSpam = i === 0;   // "No Spam/Bots" -> GPT-4o
                            const isRiskFree = i === 2; // "Risk Free" -> Lock Icon
                            const isDemographics = i === 5; // "AI Models" -> Pills (if applicable, though user mentioned "Target specific" which might be index 5)

                            // Color classes (Glassmorphism)
                            const colorClasses = [
                                "text-red-600 bg-gradient-to-br from-red-100 to-red-50 border-red-200",       // Heart
                                "text-blue-600 bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200",     // Trending
                                "text-emerald-600 bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-200", // Shield
                                "text-yellow-600 bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-200",   // Check
                                "text-green-600 bg-gradient-to-br from-green-100 to-green-50 border-green-200",     // Money
                                "text-purple-600 bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200"    // Sparkles
                            ]
                            const colorClass = colorClasses[i] || colorClasses[0]

                            return (
                                <div
                                    key={i}
                                    className={`group relative flex gap-6 items-start p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white/50 hover:bg-white border ${isRiskFree ? "border-emerald-400 shadow-emerald-100 ring-1 ring-emerald-400/30" : "border-transparent hover:border-slate-100"}`}
                                >
                                    {isRiskFree && (
                                        <div className="absolute -top-3 right-6 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-fade-in flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" /> VERIFIED SAFE
                                        </div>
                                    )}

                                    <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center border shadow-sm ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-900 transition-colors">
                                            {feature.title}
                                        </h3>

                                        <div className="text-slate-600 leading-relaxed text-[15px]">
                                            {isNoSpam ? (
                                                <div className="flex flex-col gap-2">
                                                    <span>{feature.description.split("GPT")[0]}</span>
                                                    <span className="inline-flex items-center gap-1.5 self-start bg-purple-100 border border-purple-200 text-purple-700 px-2 py-1 rounded-md text-sm font-bold shadow-sm">
                                                        <Sparkles className="w-3 h-3" /> TDT's GPT-4o Technology
                                                    </span>
                                                </div>
                                            ) : isRiskFree ? (
                                                <div className="flex flex-col gap-2">
                                                    <span>{feature.description.replace(/TDT never asks for your password.*/, "")}</span>
                                                    <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 w-fit">
                                                        <div className="bg-emerald-500 rounded-full p-1 text-white">
                                                            <Lock className="w-3 h-3" />
                                                        </div>
                                                        <span>No Password Required</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                feature.description
                                            )}
                                        </div>

                                        {/* Demographics Pills */}
                                        {(feature.title.includes("Target") || feature.title.includes("demogr")) && (
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {["Age", "Gender", "Location", "Hashtags"].map(tag => (
                                                    <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Support Online */}
                                        {(feature.title.includes("Support") || feature.title.includes("support")) && (
                                            <div className="flex items-center gap-2 mt-4">
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                                </span>
                                                <span className="text-xs font-medium text-green-600">Online Now</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </section >
    )
}
