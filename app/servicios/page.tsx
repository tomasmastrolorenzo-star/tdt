"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Zap, Clock, Users, TrendingUp, Shield, ArrowRight } from "lucide-react"
import { LOCATIONS, INTERESTS, GENDERS } from "@/lib/el-faro/selectors"
import { allServices } from "@/lib/trend-up/packages"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useI18n } from "@/lib/i18n/context"

function ServiciosContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()

  const platform = searchParams.get("platform") || "instagram"
  const service = searchParams.get("service") || "followers" // 'followers', 'likes', 'views'
  const gender = searchParams.get("gender") || "any"
  const location = searchParams.get("location") || "us"
  const interest = searchParams.get("interest") || "fitness"

  // Find metadata
  const locationData = LOCATIONS.find(l => l.id === location)
  const interestData = INTERESTS.find(i => i.id === interest)
  const genderData = GENDERS.find(g => g.id === gender)

  // Get available packages based on platform and service
  const platformKey = platform as keyof typeof allServices
  const platformServices = allServices[platformKey]

  // Robustly find the specific service list (followers, likes, etc.)
  let availablePackages: any[] = []
  if (platformServices) {
    if (service === "followers" && "followers" in platformServices) {
      availablePackages = (platformServices as any).followers
    } else if (service === "likes" && "likes" in platformServices) {
      availablePackages = (platformServices as any).likes
    } else if (service === "views" && "views" in platformServices) {
      availablePackages = (platformServices as any).views
    } else if (service === "subscribers" && "subscribers" in platformServices) {
      availablePackages = (platformServices as any).subscribers
    }
  }

  // Fallback if no packages found (shouldn't happen with correct links)
  if (availablePackages.length === 0 && platformKey === 'instagram') {
    availablePackages = allServices.instagram.followers
  }

  // Initialize selected amount
  const initialAmount = parseInt(searchParams.get("amount") || searchParams.get("followers") || "2000")
  const [selectedAmount, setSelectedAmount] = useState(initialAmount)

  // Find the selected package data to get price
  const selectedPackage = availablePackages.find((p: any) => (p.followers || p.amount) === selectedAmount) || availablePackages[0] || { price: 15 }

  // Update state if URL params change, or default to first package if initial is invalid
  useEffect(() => {
    // Determine the amount field key (followers vs amount)
    const amountVal = selectedPackage?.followers || selectedPackage?.amount || 2000
    if (amountVal !== selectedAmount) {
      setSelectedAmount(amountVal)
    }
  }, [availablePackages])


  // Calculate prices
  // If we found a package, use its price. Otherwise fallback to formula.
  const basePrice = selectedPackage.price || Math.round((selectedAmount / 2000) * 15)

  // Normal Plan Price (The package price itself)
  const normalPrice = basePrice
  // Premium Plan Price (1.8x multiplier)
  const premiumPrice = parseFloat((basePrice * 1.8).toFixed(2))

  const handleAmountChange = (value: string) => {
    const newAmount = parseInt(value)
    setSelectedAmount(newAmount)

    // Optional: Update URL without refresh
    const params = new URLSearchParams(searchParams)
    if (service === "followers") {
      params.set("followers", value)
    } else {
      params.set("amount", value)
    }
    router.replace(`/servicios?${params.toString()}`, { scroll: false })
  }

  const handleSelectPlan = (plan: "normal" | "premium") => {
    const price = plan === "premium" ? premiumPrice : normalPrice

    // Find ID again to be sure
    const pkg = availablePackages.find((p: any) => (p.followers || p.amount) === selectedAmount)
    const packageId = pkg ? pkg.id : "starter"

    const params = new URLSearchParams({
      platform,
      service,
      package: packageId,
      amount: selectedAmount.toString(),
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
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 capitalize">
            {platform} {service}
            {/* {t.plan?.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{t.plan?.titleHighlight}</span> */}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Selecciona la cantidad que deseas recibir
            {/* {t.plan?.subtitle} {interestData?.icon} {interestData?.name} · {locationData?.flag} {locationData?.name} · {genderData?.icon} {genderData?.name} */}
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="max-w-xs mx-auto mb-12">
          <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl p-2 shadow-xl">
            <Select value={selectedAmount.toString()} onValueChange={handleAmountChange}>
              <SelectTrigger className="w-full text-lg h-12 bg-transparent border-none focus:ring-0 text-white font-bold text-center justify-center">
                <SelectValue placeholder="Seleccionar cantidad" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-[300px]">
                {availablePackages.map((pkg: any) => {
                  const val = pkg.followers || pkg.amount
                  return (
                    <SelectItem key={pkg.id} value={val.toString()} className="text-lg focus:bg-slate-800 focus:text-white">
                      {val.toLocaleString()} {service === 'followers' ? 'Seguidores' : service === 'likes' ? 'Likes' : service === 'views' ? 'Vistas' : 'Items'}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <p className="text-center text-slate-500 text-sm mt-3">
            {t.hero?.cta || "Entrega garantizada"} 🚀
          </p>
        </div>


        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">

          {/* NORMAL PLAN */}
          <div className="bg-slate-900/80 backdrop-blur-xl border-2 border-slate-700 rounded-3xl p-8 relative hover:border-slate-500 transition-colors">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{t.plan?.normal?.title || "Plan Normal"}</h3>
              <p className="text-slate-400 text-sm">{t.plan?.normal?.subtitle || "Crecimiento Estándar"}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">${normalPrice.toFixed(2)}</span>
                <span className="text-slate-500">USD</span>
              </div>
              <p className="text-slate-500 text-sm mt-2">{selectedAmount.toLocaleString()} {service === 'followers' ? t.plan?.features?.realFollowers : service}</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: t.plan?.features?.delivery ? t.plan?.features?.delivery(t.plan?.features?.deliveryNormal) : "Entrega rápida" }} />
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{selectedAmount.toLocaleString()} {service} reales</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.features?.supportEmail || "Soporte por email"}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.features?.guarantee30 || "Garantía 30 días"}</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSelectPlan("normal")}
              variant="outline"
              className="w-full h-14 text-lg font-bold border-2 border-slate-600 hover:bg-slate-800"
            >
              {t.plan?.normal?.cta || "Elegir Normal"}
            </Button>
          </div>

          {/* PREMIUM PLAN */}
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl border-2 border-indigo-500 rounded-3xl p-8 relative shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-transform duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              {t.plan?.premium?.badge || "MEJOR VALOR"}
            </div>

            <div className="mb-6 mt-4">
              <h3 className="text-2xl font-bold text-white mb-2">{t.plan?.premium?.title || "Plan Turbo IA"}</h3>
              <p className="text-indigo-300 text-sm">{t.plan?.premium?.subtitle || "Crecimiento Acelerado con IA"}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">${premiumPrice.toFixed(2)}</span>
                <span className="text-indigo-300">USD</span>
              </div>
              <p className="text-indigo-400 text-sm mt-2">{selectedAmount.toLocaleString()} {service} + {t.plan?.premium?.bonus || "Bonus"}</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-white">
                <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Entrega Prioritaria (Ultrasónica)</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>Calidad Premium (Alta Retención)</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Users className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.premium?.bonus || "Bonus Extra"}</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Shield className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.features?.supportPriority || "Soporte Prioritario 24/7"}</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <TrendingUp className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.features?.engagementHigh || "Alto Engagement"}</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>{t.plan?.features?.guarantee90 || "Garantía 90 días"}</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSelectPlan("premium")}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30"
            >
              {t.plan?.premium?.cta || "Elegir Turbo AI"} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Growth Timeline Visualization - Only show for followers logic if relevant, otherwise hide or adapt */}
        {service === 'followers' && (
          <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">{t.plan?.visualization?.title}</h3>
            <p className="text-slate-400 text-center mb-8">{t.plan?.visualization?.subtitle}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
                <div className="text-sm text-slate-500 mb-2">{t.plan?.visualization?.month} 1</div>
                <div className="text-2xl font-bold text-white">{(selectedAmount * 1.2).toLocaleString()}</div>
                <div className="text-xs text-green-400 mt-1">+{Math.round((selectedAmount * 0.2) / 1000)}k</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
                <div className="text-sm text-slate-500 mb-2">{t.plan?.visualization?.month} 2</div>
                <div className="text-2xl font-bold text-white">{(selectedAmount * 1.5).toLocaleString()}</div>
                <div className="text-xs text-green-400 mt-1">+{Math.round((selectedAmount * 0.3) / 1000)}k</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
                <div className="text-sm text-slate-500 mb-2">{t.plan?.visualization?.month} 3</div>
                <div className="text-2xl font-bold text-white">{(selectedAmount * 2).toLocaleString()}</div>
                <div className="text-xs text-green-400 mt-1">+{Math.round((selectedAmount * 0.5) / 1000)}k</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-4 text-center border-2 border-indigo-500">
                <div className="text-sm text-indigo-300 mb-2">{t.plan?.visualization?.month} 6</div>
                <div className="text-2xl font-bold text-white">{(selectedAmount * 3.5).toLocaleString()}</div>
                <div className="text-xs text-yellow-400 mt-1 font-bold">+{Math.round((selectedAmount * 2.5) / 1000)}k 🚀</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center mt-6">
              {t.plan?.visualization?.disclaimer}
            </p>
          </div>
        )}

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
