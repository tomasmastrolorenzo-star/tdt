"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Zap, Clock, Users, TrendingUp, Shield, ArrowRight } from "lucide-react"
import { LOCATIONS, INTERESTS, GENDERS } from "@/lib/el-faro/selectors"
import { allServices } from "@/lib/trend-up/packages"

function ServiciosContent() {
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
    const platformKey = platform as keyof typeof allServices
    if (allServices[platformKey] && allServices[platformKey].followers) {
      const packages = allServices[platformKey].followers
      // Find package with closest follower count
      const matched = packages.find(p => p.followers === followers)
      if (matched) {
        realPackageId = matched.id
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
          ← Volver
        </button>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Tu Plan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Personalizado</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Basado en tu perfil: {interestData?.icon} {interestData?.name} · {locationData?.flag} {locationData?.name} · {genderData?.icon} {genderData?.name}
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">

          {/* NORMAL PLAN */}
          <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-slate-700 rounded-3xl p-8 relative">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Plan Normal</h3>
              <p className="text-slate-400 text-sm">Crecimiento constante y seguro</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">${normalPrice}</span>
                <span className="text-slate-500">USD</span>
              </div>
              <p className="text-slate-500 text-sm mt-2">{followers.toLocaleString()} seguidores</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Entrega en <strong>7-10 días</strong></span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Seguidores reales y activos</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Soporte por email (24-48h)</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Garantía de reposición 30 días</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Engagement moderado (2-5% likes)</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSelectPlan("normal")}
              variant="outline"
              className="w-full h-14 text-lg font-bold border-2 border-slate-600 hover:bg-slate-800"
            >
              Seleccionar Normal
            </Button>
          </div>

          {/* PREMIUM PLAN */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl border-2 border-indigo-500 rounded-3xl p-8 relative shadow-2xl shadow-indigo-500/20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold">
              ⚡ RECOMENDADO
            </div>

            <div className="mb-6 mt-4">
              <h3 className="text-2xl font-bold text-white mb-2">Plan Premium</h3>
              <p className="text-indigo-300 text-sm">Crecimiento acelerado con IA</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">${premiumPrice}</span>
                <span className="text-indigo-300">USD</span>
              </div>
              <p className="text-indigo-400 text-sm mt-2">{followers.toLocaleString()} seguidores + Bonus</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-white">
                <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Entrega en <strong>2-4 días</strong> (3x más rápido)</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Seguidores premium de alta calidad</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Users className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>+20% seguidores bonus gratis</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Shield className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Soporte prioritario 24/7 (WhatsApp)</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <TrendingUp className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Engagement alto (8-15% likes + comentarios)</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Garantía de reposición 90 días</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSelectPlan("premium")}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30"
            >
              Seleccionar Premium <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Growth Timeline Visualization */}
        <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">📈 Visualiza tu Crecimiento Mes a Mes</h3>
          <p className="text-slate-400 text-center mb-8">Proyección estimada con Plan Premium</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-sm text-slate-500 mb-2">Mes 1</div>
              <div className="text-2xl font-bold text-white">{(followers * 1.2).toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">+{Math.round((followers * 0.2) / 1000)}k</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-sm text-slate-500 mb-2">Mes 2</div>
              <div className="text-2xl font-bold text-white">{(followers * 1.5).toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">+{Math.round((followers * 0.3) / 1000)}k</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
              <div className="text-sm text-slate-500 mb-2">Mes 3</div>
              <div className="text-2xl font-bold text-white">{(followers * 2).toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">+{Math.round((followers * 0.5) / 1000)}k</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-4 text-center border-2 border-indigo-500">
              <div className="text-sm text-indigo-300 mb-2">Mes 6</div>
              <div className="text-2xl font-bold text-white">{(followers * 3.5).toLocaleString()}</div>
              <div className="text-xs text-yellow-400 mt-1 font-bold">+{Math.round((followers * 2.5) / 1000)}k 🚀</div>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center mt-6">
            * Proyección basada en crecimiento orgánico + servicios TDT. Resultados pueden variar según contenido y engagement.
          </p>
        </div>

        {/* Trust Section */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span>Seguidores Reales</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>Sin Bots</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Garantía Total</span>
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
