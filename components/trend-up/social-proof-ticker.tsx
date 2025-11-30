"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

const recentPurchases = [
  { name: "Carlos M.", package: "PRO", platform: "Instagram", time: "2 min ago" },
  { name: "Ana R.", package: "VIRAL", platform: "TikTok", time: "5 min ago" },
  { name: "Luis G.", package: "STARTER", platform: "Instagram", time: "8 min ago" },
  { name: "Maria S.", package: "ELITE", platform: "YouTube", time: "12 min ago" },
  { name: "Pedro L.", package: "PRO", platform: "Instagram", time: "15 min ago" },
]

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
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const current = recentPurchases[currentIndex]

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm">
      <div
        className={`bg-white/95 backdrop-blur-lg border border-slate-200 shadow-xl rounded-xl p-4 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">{current.name}</p>
            <p className="text-xs text-slate-600">
              {t.socialProof.purchased} {current.package} - {current.platform}
            </p>
            <p className="text-xs text-slate-400 mt-1">{current.time}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
