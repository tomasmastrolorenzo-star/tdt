"use client"

import { useEffect, useState } from "react"
import { Rocket, Crown, Zap, Star, TrendingUp } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

const recentPurchases = [
  { name: "Juan M.", action: "analyzed", niche: "Personal Brand", country: "US", flag: "🇺🇸", time: 2 },
  { name: "Sofia R.", action: "requested", niche: "Fashion", country: "MX", flag: "🇲🇽", time: 5 },
  { name: "Pedro L.", action: "analyzed", niche: "Fitness", country: "ES", flag: "🇪🇸", time: 12 },
  { name: "Ana K.", action: "requested", niche: "Business", country: "CO", flag: "🇨🇴", time: 18 },
  { name: "Lucas S.", action: "analyzed", niche: "Gaming", country: "AR", flag: "🇦🇷", time: 25 },
  { name: "Emma W.", action: "requested", niche: "Lifestyle", country: "UK", flag: "🇬🇧", time: 32 },
  { name: "David B.", action: "analyzed", niche: "Music", country: "BR", flag: "🇧🇷", time: 41 },
]

const packageIcons: Record<string, { icon: typeof Rocket; color: string }> = {
  STARTER: { icon: Rocket, color: "text-slate-400" },
  GROWTH: { icon: TrendingUp, color: "text-amber-500" },
  VIRAL: { icon: Zap, color: "text-purple-500" },
  INFLUENCER: { icon: Star, color: "text-cyan-500" },
  CELEBRITY: { icon: Crown, color: "text-violet-500" },
}

export default function SocialProofTicker() {
  const { t } = useI18n()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % recentPurchases.length)
        setIsVisible(true)
      }, 500)
    }, 15000) // 15 segundos entre notificaciones

    return () => clearInterval(interval)
  }, [])

  const current = recentPurchases[currentIndex]

  const getActionText = (action: string) => {
    return action === "analyzed" ? "analizó su perfil 🔍" : "solicitó estrategia 📈"
  }

  const getTimeText = (minutes: number) => {
    if (minutes < 60) {
      return `hace ${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    return `hace ${hours}h ${minutes % 60}min`
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:bottom-6 md:left-6 z-40 max-w-sm mx-auto md:mx-0">
      <div
        className={`bg-slate-900/95 backdrop-blur-lg border border-slate-700 shadow-xl rounded-xl p-3 md:p-4 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-purple-500`}
            >
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">{current.flag}</span>
              <span className="text-xs md:text-sm font-semibold text-white">{current.name}</span>
            </div>
            <p className="text-[10px] md:text-xs text-slate-300 mt-0.5 md:mt-1">
              {getActionText(current.action)} <span className="text-amber-400 font-semibold">• {current.niche}</span>
            </p>
            <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 md:mt-1">{getTimeText(current.time)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
