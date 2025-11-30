"use client"

import { Flame, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { useI18n } from "@/lib/i18n/context"

export default function UrgencyBanner() {
  const { t } = useI18n()
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 py-3 px-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-center gap-3 text-white text-sm md:text-base font-semibold">
        <Flame className="w-5 h-5 animate-pulse" />
        <span className="animate-pulse">{t.urgency.banner}</span>
        <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
          <Clock className="w-4 h-4" />
          <span className="font-mono">
            {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  )
}
