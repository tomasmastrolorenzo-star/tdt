"use client"

import { useEffect, useState } from "react"
import { Rocket, Crown, Zap, Star, TrendingUp } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

const recentPurchases = [
  { name: "Carlos M.", package: "STARTER", platform: "Instagram", country: "MX", flag: "🇲🇽", time: 3 },
  { name: "Emma S.", package: "VIRAL", platform: "TikTok", country: "US", flag: "🇺🇸", time: 8 },
  { name: "Ahmed K.", package: "CELEBRITY", platform: "Instagram", country: "AE", flag: "🇦🇪", time: 15 },
  { name: "Sophie L.", package: "GROWTH", platform: "Instagram", country: "FR", flag: "🇫🇷", time: 22 },
  { name: "João P.", package: "INFLUENCER", platform: "TikTok", country: "BR", flag: "🇧🇷", time: 31 },
  { name: "Michael R.", package: "VIRAL", platform: "YouTube", country: "US", flag: "🇺🇸", time: 45 },
  { name: "Hans M.", package: "CELEBRITY", platform: "Instagram", country: "DE", flag: "🇩🇪", time: 52 },
  { name: "Maria G.", package: "STARTER", platform: "TikTok", country: "ES", flag: "🇪🇸", time: 67 },
  { name: "James W.", package: "INFLUENCER", platform: "Instagram", country: "GB", flag: "🇬🇧", time: 78 },
  { name: "Lucia F.", package: "GROWTH", platform: "YouTube", country: "IT", flag: "🇮🇹", time: 89 },
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
  const PackageIcon = packageIcons[current.package]?.icon || Rocket
  const iconColor = packageIcons[current.package]?.color || "text-slate-400"

  const getTimeText = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}min`
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm">
      <div
        className={`bg-slate-900/95 backdrop-blur-lg border border-slate-700 shadow-xl rounded-xl p-4 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center ${iconColor}`}
            >
              <PackageIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{current.flag}</span>
              <span className="text-sm font-semibold text-white">{current.name}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {t.socialProof.purchased} <span className="text-amber-400 font-semibold">{current.package}</span> -{" "}
              {current.platform}
            </p>
            <p className="text-xs text-slate-500 mt-1">{getTimeText(current.time)} ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}
