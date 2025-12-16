"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Zap, Clock, Users, TrendingUp, Shield, ArrowRight } from "lucide-react"
import { LOCATIONS, INTERESTS, GENDERS } from "@/lib/el-faro/selectors"
import { allServices } from "@/lib/trend-up/packages"

import { useI18n } from "@/lib/i18n/context"

function ServiciosContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()

  const platform = searchParams.get("platform") || "instagram"
  const followers = parseInt(searchParams.get("followers") || "2000")
  const gender = searchParams.get("gender") || "any"
  const location = searchParams.get("location") || "us"
  const interest = searchParams.get("interest") || "fitness"

  // Find metadata
  const locationData = LOCATIONS.find(l => l.id === location)
  const interestData = INTERESTS.find(i => i.id === interest)
  const genderData = GENDERS.find(g => g.id === gender)

  // Pricing logic
  const normalPrice = Math.round((followers / 2000) * 15)
  const premiumPrice = Math.round(normalPrice * 1.8)


  const handleSelectPlan = (plan: "normal" | "premium") => {
    // Find the real package ID based on followers amount
    // Default to 'starter' if not found to avoid crash, but try to find match
    let realPackageId = "starter"

    // Type checking for platform to access allServices safely
    // Type checking for platform to access allServices safely
    const platformKey = platform as keyof typeof allServices
    const serviceData = allServices[platformKey]

    if (serviceData) {
      let packages: any[] = []
      // Check for followers or subscribers array safely
      if ('followers' in serviceData) {
        packages = (serviceData as any).followers
      } else if ('subscribers' in serviceData) {
        packages = (serviceData as any).subscribers
      }

      // Find package with closest follower count
      if (packages.length > 0) {
        const matched = packages.find((p: any) => p.followers === followers)
        if (matched) {
          realPackageId = matched.id
        }
      }
    }

    const price = plan === "premium" ? premiumPrice : normalPrice
    const params = new URLSearchParams({
      platform,
      service: "followers",
      package: realPackageId, // Use real ID (e.g., 'starter', 'growth')
      amount: followers.toString(),
      price: price.toString(),
      metadata: `Plan: ${plan}, Género: ${genderData?.name}, Ubicación: ${locationData?.name}, Interés: ${interestData?.name}`
    })
    router.push(`/checkout/service?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white flex items-center gap-2 mb-8">
          ← {t.plan?.back || "Back"}
        </button>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            {t.plan?.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{t.plan?.titleHighlight}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.plan?.subtitle} {interestData?.icon} {interestData?.name} · {locationData?.flag} {locationData?.name} · {genderData?.icon} {genderData?.name}
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">

          {/* NORMAL PLAN */}
          <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-slate-700 rounded-3xl p-8 relative">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{t.plan?.normal?.title}</h3>
              <p className="text-slate-400 text-sm">{t.plan?.normal?.subtitle}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">${normalPrice}</span>
                <span className="text-slate-500">USD</span>
              </div>
              <p className="text-slate-500 text-sm mt-2">{followers.toLocaleString()} {t.plan?.features?.realFollowers}</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: t.plan?.features?.delivery ? t.plan?.features?.delivery(t.plan?.features?.deliveryNormal) : "" }} />
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.features?.realFollowers}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.features?.supportEmail}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.features?.guarantee30}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.features?.engagementNormal}</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSelectPlan("normal")}
              variant="outline"
              className="w-full h-14 text-lg font-bold border-2 border-slate-600 hover:bg-slate-800"
            >
              {t.plan?.normal?.cta}
            </Button>
          </div>

          {/* PREMIUM PLAN */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl border-2 border-indigo-500 rounded-3xl p-8 relative shadow-2xl shadow-indigo-500/20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold">
              {t.plan?.premium?.badge}
            </div>

            <div className="mb-6 mt-4">
              <h3 className="text-2xl font-bold text-white mb-2">{t.plan?.premium?.title}</h3>
              <p className="text-indigo-300 text-sm">{t.plan?.premium?.subtitle}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">${premiumPrice}</span>
                <span className="text-indigo-300">USD</span>
              </div>
              <p className="text-indigo-400 text-sm mt-2">{followers.toLocaleString()} {t.plan?.features?.premiumFollowers} {t.plan?.premium?.bonus}</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-white">
                <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: (t.plan?.features?.delivery ? t.plan?.features?.delivery(t.plan?.features?.deliveryPremium) : "") + " " + (t.plan?.features?.deliverySpeedPremium || "") }} />
              </li>
              <li className="flex items-start gap-3 text-white">
                <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.features?.premiumFollowers}</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Users className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.premium?.bonus}</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Shield className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.features?.supportPriority}</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <TrendingUp className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.features?.engagementHigh}</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.features?.guarantee90}</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSelectPlan("premium")}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30"
            >
              {t.plan?.premium?.cta} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Growth Timeline Visualization */}
        <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">{t.plan?.visualization?.title}</h3>
          <p className="text-slate-400 text-center mb-8">{t.plan?.visualization?.subtitle}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-sm text-slate-500 mb-2">{t.plan?.visualization?.month} 1</div>
              <div className="text-2xl font-bold text-white">{(followers * 1.2).toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">+{Math.round((followers * 0.2) / 1000)}k</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-sm text-slate-500 mb-2">{t.plan?.visualization?.month} 2</div>
              <div className="text-2xl font-bold text-white">{(followers * 1.5).toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">+{Math.round((followers * 0.3) / 1000)}k</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-sm text-slate-500 mb-2">{t.plan?.visualization?.month} 3</div>
              <div className="text-2xl font-bold text-white">{(followers * 2).toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">+{Math.round((followers * 0.5) / 1000)}k</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-4 text-center border-2 border-indigo-500">
              <div className="text-sm text-indigo-300 mb-2">{t.plan?.visualization?.month} 6</div>
              <div className="text-2xl font-bold text-white">{(followers * 3.5).toLocaleString()}</div>
              <div className="text-xs text-yellow-400 mt-1 font-bold">+{Math.round((followers * 2.5) / 1000)}k 🚀</div>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center mt-6">
            {t.plan?.visualization?.disclaimer}
          </p>
        </div>

        {/* Trust Section */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>{t.plan?.trust?.secure}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span>{t.plan?.trust?.real}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>{t.plan?.trust?.noBots}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>{t.plan?.trust?.guarantee}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ServiciosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-white">Cargando...</div></div>}>
      <ServiciosContent />
    </Suspense>
  )
}
