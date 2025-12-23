"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2, Database, Zap, Shield, Activity, BarChart3, Lock, Cpu, AlertCircle } from "lucide-react"
import { LOCATIONS, INTERESTS } from "@/lib/el-faro/selectors"
import { useI18n } from "@/lib/i18n/context"
import { funnelTracker } from "@/lib/analytics/funnel"

function ServiciosContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [showNDA, setShowNDA] = useState<boolean>(false)
  const [selectedTier, setSelectedTier] = useState<string>("")

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

  // The Blur Protocol Logic
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ h: 71, m: 59, s: 59 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 }
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 }
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleNDASign = () => {
    setIsAuthenticated(true)
    setShowNDA(false)
    if (selectedTier) {
      if (selectedTier === 'elite') {
        // Redirect to Vortex WhatsApp for Elite Tier
        window.open("https://wa.me/15550123456?text=I_HAVE_SIGNED_THE_NDA_REQUESTING_ELITE_BRIEFING", "_blank")
      } else if (selectedTier === 'lazarus') {
        // Lazarus Flow
        window.open("https://wa.me/15550123456?text=LAZARUS_PROTOCOL_INITIATION_REQUEST_NDA_SIGNED", "_blank")
      }
    }
  }

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
    // 1. Standard / Pro -> Checkout
    if (['starter', 'pro', 'standard', 'professional'].includes(planKey)) {
      const params = new URLSearchParams({ plan: planKey, billing: 'monthly', platform, interest, location })
      funnelTracker.track('STEP_3_CHECKOUT_ENTRY', { plan: planKey })
      router.push(`/checkout?${params.toString()}`)
      return
    }

    // 2. Elite -> NDA -> WhatsApp
    if (planKey === 'elite' || planKey === 'professional-authority') { // Handling variations
      setSelectedTier('elite')
      setShowNDA(true)
      // Logic: Open NDA Modal if not signed, or directly if signed (assuming simulation for now)
      // For this flow we assume they must "Sign" via the modal we show.
      return
    }

    // 3. Lazarus -> Block -> NDA -> WhatsApp
    if (planKey === 'lazarus') {
      setSelectedTier('lazarus')
      setShowNDA(true)
      return
    }
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

          {!isAuthenticated && (
            <div className="flex justify-center mb-4">
              <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 flex items-center gap-3 rounded-none animate-pulse">
                <Lock className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">
                  SLOT LAZARUS RESERVED: {timeLeft.h}:{timeLeft.m.toString().padStart(2, '0')}:{timeLeft.s.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          )}

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

        {/* BLURRED CONTENT WRAPPER */}
        <div className={`transition-all duration-1000 ${!isAuthenticated ? 'blur-xl opacity-50 pointer-events-none select-none grayscale' : 'blur-0 opacity-100'}`}>

          {/* GOLDEN METRICS PANEL */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className={`bg-[#02040a]/80 border ${isLazarus ? 'border-red-500/30' : 'border-indigo-500/20'} rounded-none p-8 backdrop-blur-3xl relative overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,1)]`}>
              <div className="grid md:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
                    <Activity className="w-3 h-3 text-indigo-500" /> Latent Repulsion
                  </div>
                  <div className="text-3xl font-mono text-white">
                    {searchParams.get('auth_score') || (isLazarus ? "94.2" : "12.4")}<span className="text-indigo-500 text-lg">%</span>
                  </div>
                  <div className="h-1 bg-slate-900 w-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: isLazarus ? "94.2%" : `${searchParams.get('auth_score') || 12}%` }} className={`h-full ${isLazarus ? 'bg-red-600 shadow-[0_0_10px_red]' : 'bg-indigo-500'}`} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
                    <Cpu className="w-3 h-3 text-indigo-500" /> Compositional Entropy
                  </div>
                  <div className="text-3xl font-mono text-white">
                    {searchParams.get('entropy_score') || (isLazarus ? "0.02" : "0.89")}<span className="text-indigo-500 text-lg">σ</span>
                  </div>
                  <div className="h-1 bg-slate-900 w-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: isLazarus ? "5%" : `${(parseFloat(searchParams.get('entropy_score') || '0.89') * 100)}%` }} className={`h-full ${isLazarus ? 'bg-red-600 shadow-[0_0_10px_red]' : 'bg-indigo-500'}`} />
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

        </div>

        {/* NDA LOCK OVERLAY - THE BLUR */}
        {(!isAuthenticated || showNDA) && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#020205]/95 backdrop-blur-xl pt-[0px] fixed top-0 left-0 w-full h-full">
            {/* Changed positions to fixed full screen overlay for impact */}
            <div className="bg-[#020205] border border-[#d4af37]/50 p-10 max-w-lg text-center shadow-[0_0_100px_rgba(0,0,0,0.9)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-[#d4af37] animate-slide-x" />

              <Shield className="w-16 h-16 text-indigo-500 mx-auto mb-8 animate-pulse" />

              <h3 className="text-2xl font-verdict text-white mb-4 uppercase tracking-wide italic">
                {showNDA ? "Vortex Custody Agreement" : "Security Protocol Active"}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-10 leading-relaxed max-w-xs mx-auto">
                {showNDA
                  ? "The asset requires high-level clearance. By proceeding, you agree to the Non-Disclosure of our proprietary algorithmic injection methods."
                  : "The forensic data contained in this report reveals sensitive algorithmic vulnerabilities. Electronic signature required to decrypt results."
                }
              </p>

              <Button onClick={handleNDASign} className="w-full bg-white text-black hover:bg-[#d4af37] hover:text-black border border-transparent hover:border-[#d4af37] rounded-none text-xs font-mono uppercase tracking-[0.3em] h-14 transition-all">
                {showNDA ? "Sign & Request Briefing" : "Activar Custodia Confidencial vía NDA"}
              </Button>

              <div className="mt-8 flex justify-center gap-4 text-[8px] text-slate-600 font-mono uppercase tracking-widest">
                <span>IP: {Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
                <span>•</span>
                <span>SESSION: ENCRYPTED</span>
              </div>
            </div>
          </div>
        )}

        {/* COST OF INACTION ANCHOR */}
        <div className="mb-16 text-center">
          <div className="inline-block border border-red-900/50 bg-red-950/10 px-6 py-2 mb-4">
            <span className="text-[10px] text-red-500 font-mono uppercase tracking-widest">Financial Haemorrhage Detected</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-verdict text-white mb-2">
            ${new Intl.NumberFormat().format(parseInt(searchParams.get('coi') || '0'))} <span className="text-slate-600 text-2xl">/ Year</span>
          </h3>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Estimated Revenue Loss from Low Authority</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* TIER 1: STANDARD */}
          <div className="border border-indigo-500/20 bg-[#02040a] p-8 hover:border-indigo-500/50 transition-all opacity-50 hover:opacity-100">
            <h4 className="text-lg font-verdict text-white mb-2">Standard</h4>
            <div className="text-2xl font-mono text-indigo-400 mb-6">$150 <span className="text-xs text-slate-600">/ 10 Days</span></div>
            <p className="text-xs text-slate-500 font-mono leading-relaxed mb-6">Micro-correction for assets with slight erosion. Basic Exif realignment.</p>
            <Button className="w-full bg-transparent border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-none text-[10px] uppercase tracking-widest">
              Select Standard
            </Button>
          </div>

          {/* TIER 2: PROFESSIONAL */}
          <div className="border border-indigo-500/20 bg-[#02040a] p-8 hover:border-indigo-500/50 transition-all">
            <h4 className="text-lg font-verdict text-white mb-2">Professional</h4>
            <div className="text-2xl font-mono text-indigo-400 mb-6">$650 <span className="text-xs text-slate-600">/ 30 Days</span></div>
            <p className="text-xs text-slate-500 font-mono leading-relaxed mb-6">Momentum structure for niche leaders. Niche-specific metadata injection.</p>
            <Button className="w-full bg-indigo-900/20 border border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-none text-[10px] uppercase tracking-widest">
              Select Professional
            </Button>
          </div>

          {/* TIER 3: ELITE MGMT */}
          <div className="border border-indigo-500 bg-[#050510] p-8 relative shadow-[0_0_30px_rgba(99,102,241,0.1)]">
            <div className="absolute top-0 right-0 bg-indigo-500 text-black text-[9px] font-bold px-2 py-1 uppercase tracking-widest">Recommended</div>
            <h4 className="text-xl font-verdict text-white mb-2">Elite MGMT</h4>
            <div className="text-3xl font-mono text-white mb-6">$1,850 <span className="text-xs text-slate-500">/ 60 Days</span></div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed mb-6">Whale stabilization. Full algorithmic dominance and cluster repulsion.</p>
            <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-500 rounded-none text-[10px] uppercase tracking-widest h-12">
              Initialize Elite
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 relative">
          {isLazarus && (
            <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center border border-red-900/50">
              <AlertCircle className="w-12 h-12 text-red-600 mb-4 animate-pulse" />
              <h3 className="text-2xl font-verdict text-white mb-2">Lazarus Protocol Required</h3>
              <p className="text-xs text-red-400 font-mono uppercase tracking-widest mb-6 max-w-md text-center">
                Asset Integrity Critical. Standard intervention protocols suspended. Eligibility review required.
              </p>
              <Button onClick={() => handleSelectPlan('lazarus')} className="bg-red-900 border border-red-500 text-white hover:bg-red-800 rounded-none px-8 py-4 text-xs tracking-[0.2em] uppercase">
                Solicitar Evaluación de Elegibilidad
              </Button>
            </div>
          )}

          {/* TIER 4: SOVEREIGN */}
          <div className="border border-slate-800 p-8 opacity-75">
            <h4 className="text-lg font-verdict text-slate-400 mb-2">Sovereign Accel</h4>
            <div className="text-xl font-mono text-slate-500 mb-4">$5,500 <span className="text-[10px]">/ Quarter</span></div>
            <Button disabled className="w-full bg-slate-900 text-slate-600 border border-slate-800 rounded-none text-[10px] uppercase tracking-widest">
              Waitlist Only
            </Button>
          </div>

          {/* TIER 5: INSTITUTIONAL */}
          <div className="border border-slate-800 p-8 opacity-75">
            <h4 className="text-lg font-verdict text-slate-400 mb-2">Institutional</h4>
            <div className="text-xl font-mono text-slate-500 mb-4">$15,000 <span className="text-[10px]">/ Annual</span></div>
            <Button disabled className="w-full bg-slate-900 text-slate-600 border border-slate-800 rounded-none text-[10px] uppercase tracking-widest">
              Corporate Only
            </Button>
          </div>

          {/* TIER 6: LAZARUS FULL */}
          <div className="border border-red-900/30 bg-red-950/5 p-8 relative">
            <h4 className="text-lg font-verdict text-red-500 mb-2">Lazarus Full</h4>
            <div className="text-xl font-mono text-red-400/80 mb-4">$25,000+ <span className="text-[10px]">/ Resonance</span></div>
            <Button disabled className="w-full bg-transparent text-red-900 border border-red-900/50 rounded-none text-[10px] uppercase tracking-widest">
              By Invitation
            </Button>
          </div>
        </div>

        {/* STRATEGY ROADMAP REPLACE */}
        <div className="relative border border-slate-800 bg-[#02040a] p-12 overflow-hidden group mb-20 text-center">
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
    </main >
  )
}

export default function ServiciosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#02040a] flex items-center justify-center"><div className="text-indigo-500 font-mono text-xs tracking-widest animate-pulse">BOOTING_DIAGNOSTIC_BUREAU...</div></div>}>
      <ServiciosContent />
    </Suspense>
  )
}
