"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Check, Sparkles, Zap, Shield, ArrowRight, CheckCircle2, Database, BarChart3, TrendingUp } from "lucide-react"
import { LOCATIONS, INTERESTS, GENDERS } from "@/lib/el-faro/selectors"
import { useI18n } from "@/lib/i18n/context"
import { funnelTracker } from "@/lib/analytics/funnel"
import { TICKER_PLANS } from "@/lib/constants/pricing"

function ServiciosContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = useState(true)

  const platform = searchParams.get("platform") || "instagram"
  const location = searchParams.get("location") || "us"
  const interest = searchParams.get("interest") || "fitness"

  // Find metadata
  const locationData = LOCATIONS.find(l => l.id === location)
  const interestData = INTERESTS.find(i => i.id === interest)

  const nicheName = interestData?.name || interest || "Growth"
  const locationName = locationData?.name || "Global"

  useEffect(() => {
    funnelTracker.track('STEP_2_PRICING_VIEW', { platform, interest, location })

    // Artificial delay for "Tech-Heavy" transition feel
    const timer = setTimeout(() => setIsPageLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const tiers = [
    {
      key: 'starter',
      name: "GROWTH STARTER",
      description: "Ideal for new accounts starting from zero authority.",
      monthlyPrice: 49,
      features: ["Foundation Build", "Basic Audience Expansion", "Organic Optimization", "24/7 Support Access"],
      badge: "Safe Entry",
      badgeColor: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      highlight: false
    },
    {
      key: 'pro',
      name: "VIRAL MOMENTUM",
      description: "Aggressive growth to trigger algorithm recommendations.",
      monthlyPrice: 99,
      features: [
        "Accelerated Growth Engine",
        "AI Viral Strategy",
        `Targeted ${nicheName} Community Outreach`,
        `${locationName} Specialized Traffic`,
        "Priority Optimization"
      ],
      badge: `🔥 BEST FOR ${nicheName.toUpperCase()}`,
      badgeColor: "bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.3)] animate-pulse",
      highlight: true
    },
    {
      key: 'dominance',
      name: "BRAND PARTNER",
      description: "Full-scale reputation management & authority building.",
      monthlyPrice: 249,
      features: ["Maximum Velocity", "Dedicated Account Manager", "Full-Scale Reputation Mgmt", "Authority Building", "VIP Support"],
      badge: "MAXIMUM ROI",
      badgeColor: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      highlight: false
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
    funnelTracker.track('STEP_3_CHECKOUT_ENTRY', { plan: planKey })
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
          <h1 className="text-4xl md:text-5xl font-black text-white capitalize space-y-2 leading-tight">
            {interestData ? (
              <>AI Strategy for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{nicheName}</span> in <span className="text-white">{locationName}</span> is Ready 🚀</>
            ) : (
              <>Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Growth Plan</span></>
            )}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Our AI has calibrated the perfect roadmap for your <span className="text-white">{nicheName}</span> niche in <span className="text-white">{locationName}</span>.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20 items-stretch">
          {isPageLoading ? (
            // Skeleton Loaders
            [1, 2, 3].map((i) => (
              <div key={i} className={`rounded-3xl p-8 bg-slate-900/40 border border-slate-800 h-[500px] animate-pulse ${i === 2 ? 'scale-110' : ''}`}>
                <div className="w-24 h-6 bg-slate-800 rounded-full mb-8"></div>
                <div className="w-3/4 h-8 bg-slate-800 rounded mb-4"></div>
                <div className="w-full h-12 bg-slate-800 rounded mb-8"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(j => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-slate-800"></div>
                      <div className="w-full h-4 bg-slate-800 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            tiers.map((tier) => (
              <div
                key={tier.key}
                className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col h-full ${tier.highlight
                  ? "bg-slate-900/80 border-2 border-orange-500/50 shadow-2xl shadow-orange-500/15 scale-110 z-20"
                  : "bg-slate-900/40 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 z-10"
                  }`}
              >
                {/* Badge */}
                <div className="mb-6 flex justify-between items-start">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tier.badgeColor}`}>
                    {tier.badge}
                  </span>
                  {tier.highlight && <Zap className="w-5 h-5 text-orange-400 fill-orange-400/20" />}
                </div>

                {/* Title & Price */}
                <div className="mb-6">
                  <h3 className="text-xl font-black text-white mb-2">{tier.name}</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed mb-4 min-h-[40px]">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl md:text-5xl font-black text-white">${tier.monthlyPrice}</span>
                    <span className="text-slate-500 font-bold">/mo</span>
                  </div>
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
                  className={`w-full h-14 text-base font-bold rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95 ${tier.highlight
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25"
                    : "bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
                    }`}
                >
                  Activate Strategy <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* NEW: AI Audit Details Section (CRO Boost) */}
        <div className="max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
            {/* Subtle light effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />

            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              Strategic Growth Audit: <span className="text-slate-400 font-mono text-lg">@{interest.toUpperCase()}_DISCOVERY</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Niche Saturation</div>
                    <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">CRITICAL</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "88%" }}
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                      />
                    </div>
                    <span className="text-sm font-black text-white w-8">88%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">The <strong>{nicheName}</strong> sector in <strong>{locationName}</strong> is hyper-competitive. Standard accounts are currently being suppressed by updated discovery algorithms.</p>
                </div>

                <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Viral Velocity Score</div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">OPTIMIZED</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "94%" }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500"
                      />
                    </div>
                    <span className="text-sm font-black text-white w-8">94%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">Analysis confirms high retention potential. Users in <strong>{locationName}</strong> are actively engaging with <strong>{nicheName}</strong> content formats.</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-slate-950 rounded-2xl p-8 border border-slate-800 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h4 className="font-black text-indigo-300 uppercase tracking-tighter">AI Deployment Recommendation</h4>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                    "To penetrate the <strong>{nicheName}</strong> algorithm barrier, our models recommend the <strong>VIRAL MOMENTUM</strong> bridge. This deployment injects high-retention signals that trigger the discovery loop in <strong>{locationName}</strong> within 24-48 hours."
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Audit ID: TDT-${interest.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}</span>
                    <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-emerald-500" /> Verified Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table Section */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white mb-2 underline decoration-indigo-500/50 underline-offset-8">Comparative Analysis</h3>
            <p className="text-slate-500 text-sm">Choose the tier that aligns with your authority goals.</p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/20 backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50">
                  <th className="py-5 px-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Feature Set</th>
                  <th className="py-5 px-6 text-slate-300 text-xs font-bold uppercase tracking-widest">Starter</th>
                  <th className="py-5 px-6 text-orange-400 text-xs font-black uppercase tracking-[0.2em] bg-orange-500/5">Momentum</th>
                  <th className="py-5 px-6 text-purple-400 text-xs font-bold uppercase tracking-widest">Partner</th>
                </tr>
              </thead>
              <tbody className="text-slate-400 text-sm">
                {[
                  { label: "Algorithm Authority", v1: "Level 1", v2: "Level 4 (Viral)", v3: "Level 10 (Authority)" },
                  { label: "AI Niche Clustering", v1: "Manual", v2: "Dynamic AI", v3: "Hyper-Precise" },
                  { label: "Delivery Speed", v1: "Standard", v2: "Priority (⚡)", v3: "Instant (🚀)" },
                  { label: "Success Guarantee", v1: "Standard", v2: "100% Guaranteed", v3: "Profit Verified" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-300">{row.label}</td>
                    <td className="py-4 px-6 text-slate-500">{row.v1}</td>
                    <td className="py-4 px-6 font-bold text-white bg-orange-500/5">{row.v2}</td>
                    <td className="py-4 px-6 text-purple-300/80">{row.v3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    </main >
  )
}

export default function ServiciosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-white font-mono animate-pulse">Initializing Growth Engine...</div></div>}>
      <ServiciosContent />
    </Suspense>
  )
}
