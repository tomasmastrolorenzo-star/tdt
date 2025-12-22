"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2, Database, Zap, Shield, Activity, BarChart3, Lock, Cpu } from "lucide-react"
import { LOCATIONS, INTERESTS } from "@/lib/el-faro/selectors"
import { useI18n } from "@/lib/i18n/context"
import { funnelTracker } from "@/lib/analytics/funnel"

function ServiciosContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = useState(true)

  const platform = searchParams.get("platform") || "instagram"
  const location = searchParams.get("location") || "us"
  const interest = searchParams.get("interest") || "fitness"
  const leadClass = searchParams.get("lead_class") || "STANDARD"
  const isWhale = leadClass === "WHALE"
  const isLazarus = leadClass === "LAZARUS"

  const interestData = INTERESTS.find(i => i.id === interest)
  const nicheName = interestData?.name || interest

  useEffect(() => {
    funnelTracker.track('STEP_2_PRICING_VIEW', { platform, interest, location })
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const tiers = (isWhale || isLazarus) ? [
    {
      key: 'professional',
      name: isLazarus ? "RESURRECTION PROTOCOL" : "PROFESSIONAL AUTHORITY",
      description: isLazarus ? "Emergency recovery for accounts in Latent Space Repulsion." : "Diagnostic-grade scaling for high-status accounts.",
      monthlyPrice: 499,
      features: isLazarus
        ? ["Ghost-Follower De-Indexing", "Engagement Loop Injection", "Neural Signature Reset", "Priority Algorithmic Support", "Identity Gap Repair"]
        : ["Neural Signature Calibration", "High-Ticket Lead Generation", "Visual Signature Protection", "Direct Engineering Support", "Vortex Safe Warmup"],
      badge: isLazarus ? "URGENT RESCUE" : "PROFESSIONAL GRADE",
      badgeColor: isLazarus ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      highlight: false
    },
    {
      key: 'elite',
      name: isLazarus ? "DOMINATION ASCENSION" : "ELITE EXECUTIVE",
      description: isLazarus ? "Full-spectrum bypass and total niche reconstruction." : "Complete authority takeover. 2025 Visual Recognition bypass.",
      monthlyPrice: 1499,
      features: [
        "Executive Authority Protocol",
        isLazarus ? "Lazarus Reconstruction" : "Visual Originality Enforcement",
        `Global ${nicheName.toUpperCase()} Market Dominance`,
        "Unlimited Neural Scaling",
        "Bypass Protection Active"
      ],
      badge: "ELITE STATUS",
      badgeColor: isLazarus ? "bg-red-600/20 text-red-400 border-red-500/40 animate-pulse" : "bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse",
      highlight: true
    }
  ] : [
    {
      key: 'starter',
      name: "GROWTH STARTER",
      description: "Ideal for new accounts starting from zero authority.",
      monthlyPrice: 49,
      features: ["Foundation Build", "Audience Expansion", "Organic Optimization", "24/7 Support Access"],
      badge: "Safe Entry",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      highlight: false
    },
    {
      key: 'pro',
      name: "VIRAL MOMENTUM",
      description: "Aggressive growth to trigger algorithm recommendations.",
      monthlyPrice: 99,
      features: ["Accelerated Growth Engine", "AI Viral Strategy", `Targeted Outreach`, `Specialized Traffic`, "Priority Optimization"],
      badge: `🔥 BEST FOR ${nicheName.toUpperCase()}`,
      badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/40 animate-pulse",
      highlight: true
    },
    {
      key: 'dominance',
      name: "BRAND PARTNER",
      description: "Full-scale reputation management & authority building.",
      monthlyPrice: 249,
      features: ["Maximum Velocity", "Dedicated Account Manager", "Authority Building", "Profit Verified Data"],
      badge: "MAXIMUM ROI",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      highlight: false
    }
  ]

  const handleSelectPlan = (planKey: string) => {
    const params = new URLSearchParams({ plan: planKey, billing: 'monthly', platform, interest, location })
    funnelTracker.track('STEP_3_CHECKOUT_ENTRY', { plan: planKey })
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <main className={`min-h-screen bg-[#02040a] font-mono relative overflow-hidden terminal-scanlines ${isLazarus ? 'crimson-flicker' : ''}`}>
      {/* Bureau Overlays */}
      {isLazarus && <div className="absolute inset-0 bg-red-950/20 pointer-events-none z-0" />}
      <div className={`absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b ${isLazarus ? 'from-red-900/40' : 'from-indigo-900/30'} to-transparent pointer-events-none z-0`} />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-white flex items-center gap-2 mb-12 transition-colors text-[10px] uppercase tracking-widest">
          ← Re-calibrate Diagnostic
        </button>

        {/* THE VERDICT */}
        <div className="text-center mb-20 space-y-6">
          <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full ${isLazarus ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'} text-[10px] font-black uppercase tracking-[0.4em] animate-fade-in`}>
            {isLazarus ? 'CRITICAL_LEAD_DETECTED' : 'ANALYSIS_SYNCHRONIZED'}
          </div>

          <h1 className="text-5xl md:text-7xl font-verdict text-white italic leading-tight">
            {isLazarus ? (
              <>The <span className="text-red-600">Lazarus</span> Verdict</>
            ) : isWhale ? (
              <>Bypass <span className="text-indigo-500">Authorized</span></>
            ) : (
              <>Final <span className="text-indigo-400">Diagnosis</span></>
            )}
          </h1>

          <p className="text-slate-500 text-xs uppercase tracking-[0.2em] max-w-xl mx-auto leading-relaxed">
            {isLazarus
              ? "NEURAL FLATLINE DETECTED. IMMEDIATE RESURRECTION PROTOCOL ENGAGED TO BYPASS LATENT SPACE REPULSION."
              : `BUREAU CLASSIFICATION: ${leadClass}. DEPLOYING ${nicheName.toUpperCase()}-SPECIFIC GROWTH SCHEMA.`}
          </p>
        </div>

        {/* GOLDEN METRICS PANEL */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className={`bg-[#02040a]/80 border ${isLazarus ? 'border-red-500/30' : 'border-indigo-500/20'} rounded-none p-8 backdrop-blur-3xl relative overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,1)]`}>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
                  <Activity className="w-3 h-3 text-indigo-500" /> Latent Repulsion
                </div>
                <div className="text-3xl font-mono text-white">
                  {isLazarus ? "94.2" : "12.4"}<span className="text-indigo-500 text-lg">%</span>
                </div>
                <div className="h-1 bg-slate-900 w-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: isLazarus ? "94.2%" : "12.4%" }} className={`h-full ${isLazarus ? 'bg-red-600 shadow-[0_0_10px_red]' : 'bg-indigo-500'}`} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
                  <Cpu className="w-3 h-3 text-indigo-500" /> Compositional Entropy
                </div>
                <div className="text-3xl font-mono text-white">
                  {isLazarus ? "0.02" : "0.89"}<span className="text-indigo-500 text-lg">σ</span>
                </div>
                <div className="h-1 bg-slate-900 w-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: isLazarus ? "5%" : "89%" }} className={`h-full ${isLazarus ? 'bg-red-600 shadow-[0_0_10px_red]' : 'bg-indigo-500'}`} />
                </div>
              </div>
              <div className="space-y-4 text-left">
                <div className="text-[10px] text-indigo-400 uppercase tracking-[0.3em] mb-2">Audit Status</div>
                <div className={`text-xs font-mono leading-relaxed ${isLazarus ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
                  {isLazarus
                    ? "> ENGAGEMENT MISMATCH DETECTED. GHOST-METADATA SUPPRESSION ACTIVE."
                    : "> SIGNALS CALIBRATED. NICHE AUTHORITY BYPASS ENGAED."}
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <BarChart3 className="w-24 h-24" />
            </div>
          </div>
        </div>

        {/* BUREAU TIERS */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20 items-stretch">
          {!isPageLoading && tiers.map((tier) => (
            <div key={tier.key} className={`relative rounded-none p-10 transition-all duration-300 flex flex-col h-full bg-[#02040a] border ${tier.highlight ? (isLazarus ? 'border-red-500 shadow-[0_0_40px_rgba(220,38,38,0.2)]' : 'border-indigo-500 shadow-[0_0_40px_rgba(79,70,229,0.15)]') : 'border-slate-800'}`}>
              <div className="mb-8">
                <span className={`inline-block px-3 py-1 rounded-none text-[8px] font-black uppercase tracking-[0.3em] ${tier.badgeColor}`}>
                  {tier.badge}
                </span>
              </div>
              <h3 className="text-2xl font-verdict text-white mb-4 italic">{tier.name}</h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-relaxed mb-6 h-12">
                {tier.description}
              </p>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-5xl font-mono text-white">${tier.monthlyPrice}</span>
                <span className="text-slate-700 font-mono text-xs">/BUREAU_FEE</span>
              </div>
              <ul className="space-y-4 mb-12 flex-grow">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${tier.highlight ? (isLazarus ? 'text-red-500' : 'text-indigo-400') : 'text-slate-600'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button onClick={() => handleSelectPlan(tier.key)} className={`w-full h-16 rounded-none text-xs font-mono uppercase tracking-[0.3em] transition-all ${tier.highlight ? (isLazarus ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-indigo-600 text-white hover:bg-indigo-700') : 'bg-white text-black hover:bg-slate-200'}`}>
                {isLazarus ? 'Initiate Rescue' : 'Authorize Deployment'}
              </Button>
            </div>
          ))}
        </div>

        {/* PDF PREVIEW (STYLIZED) */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="relative border border-slate-800 bg-[#02040a] p-12 overflow-hidden group">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl z-10 flex flex-col items-center justify-center text-center">
              <Lock className="w-12 h-12 text-indigo-500 mb-6 animate-pulse" />
              <h4 className="text-xl font-verdict text-white mb-2 italic">Strategy Roadmap: Restricted</h4>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.4em]">AUTHENTICATION REQUIRED TO DECRYPT 5-MONTH TIMELINE</p>
            </div>
            <div className="opacity-10 space-y-8 select-none grayscale">
              <div className="h-4 w-1/2 bg-slate-800" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-800" />)}
              </div>
              <div className="h-48 bg-slate-800" />
            </div>
          </div>
        </div>

        {/* BUREAU FOOTER */}
        <div className="max-w-3xl mx-auto text-center border-t border-indigo-500/10 pt-16">
          <div className="flex justify-center gap-12 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            <div className="flex items-center gap-2"><Shield className="w-3 h-3" /> SSL_ENCRYPTED</div>
            <div className="flex items-center gap-2"><Activity className="w-3 h-3" /> NEURAL_BYPASS_v6</div>
            <div className="flex items-center gap-2">AUDIT_ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default function ServiciosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#02040a] flex items-center justify-center"><div className="text-indigo-500 font-mono text-xs tracking-widest animate-pulse">BOOTING_DIAGNOSTIC_BUREAU...</div></div>}>
      <ServiciosContent />
    </Suspense>
  )
}
