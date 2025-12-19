"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Zap, Shield, ArrowRight, CheckCircle2 } from "lucide-react"
import { LOCATIONS, INTERESTS, GENDERS } from "@/lib/el-faro/selectors"
import { useI18n } from "@/lib/i18n/context"

function ServiciosContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()

  const platform = searchParams.get("platform") || "instagram"
  const gender = searchParams.get("gender") || "any"
  const location = searchParams.get("location") || "us"
  const interest = searchParams.get("interest") || "fitness"

  // Find metadata
  const locationData = LOCATIONS.find(l => l.id === location)
  const interestData = INTERESTS.find(i => i.id === interest)
  
  const tiers = [
      {
          key: 'starter',
          name: "GROWTH STARTER",
          price: 49,
          features: ["Safe Entry Protocol", "Basic Audience Expansion", "Organic Optimization", "24/7 Support Access"],
          badge: "Safe Entry",
          badgeColor: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
          highlight: false,
      },
      {
          key: 'pro',
          name: "VIRAL MOMENTUM",
          price: 99,
          features: ["Accelerated Growth Engine", "AI Viral Strategy", "Priority Optimization", "Content Calibration"],
          badge: "RECOMMENDED",
          badgeColor: "bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.3)]",
          highlight: true,
      },
      {
          key: 'dominance',
          name: "BRAND PARTNER",
          price: 249,
          features: ["Maximum Velocity", "Dedicated Account Manager", "Campaign Priority", "VIP Networking Access"],
          badge: "MAXIMUM ROI",
          badgeColor: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
          highlight: false,
      }
  ]

  const handleSelectPlan = (planKey: string) => {
    const params = new URLSearchParams({
      plan: planKey,
      billing: 'monthly',
      platform,
      interest,
      location
    })
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-slate-950 font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-white flex items-center gap-2 mb-10 transition-colors font-medium">
          ← Back to Configuration
        </button>

        {/* Title */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider animate-fade-in">
             <Sparkles className="w-3 h-3" /> Analysis Complete
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white capitalize space-y-2">
            <div>Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Growth Strategy</span></div>
            <div>is Ready 🚀</div>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
             Our AI has calibrated the perfect roadmap for your <span className="text-white">{interestData?.name || interest}</span> niche in <span className="text-white">{locationData?.name || "Global"}</span>.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20 items-center">
            {tiers.map((tier) => (
                <div 
                    key={tier.key}
                    className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col h-full ${
                        tier.highlight 
                        ? "bg-slate-900/80 border-2 border-orange-500/50 shadow-2xl shadow-orange-500/10 scale-105 z-10" 
                        : "bg-slate-900/40 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                >
                    {/* Badge */}
                    <div className="mb-6 flex justify-between items-start">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tier.badgeColor}`}>
                            {tier.badge}
                        </span>
                        {tier.highlight && <Zap className="w-5 h-5 text-orange-400 fill-orange-400/20 animate-pulse" />}
                    </div>

                    {/* Title & Price */}
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-white mb-2">{tier.name}</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl md:text-5xl font-black text-white">${tier.price}</span>
                            <span className="text-slate-500 font-bold">/mo</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Cancel anytime. No lock-in.</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8 flex-grow">
                        {tier.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-300">
                                <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${tier.highlight ? "text-orange-400" : "text-blue-400"}`} />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <Button
                        onClick={() => handleSelectPlan(tier.key)}
                        className={`w-full h-14 text-base font-bold rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95 ${
                            tier.highlight
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25"
                            : "bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
                        }`}
                    >
                        Activate Strategy <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            ))}
        </div>

        {/* Trust Footer */}
        <div className="max-w-3xl mx-auto text-center border-t border-slate-800/50 pt-10">
          <div className="flex flex-wrap justify-center gap-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>SSL Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Instant Activation</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Premium Tech</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default function ServiciosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-white font-mono animate-pulse">Initializing Growth Engine...</div></div>}>
      <ServiciosContent />
    </Suspense>
  )
}
