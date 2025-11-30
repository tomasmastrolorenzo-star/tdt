"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"

export default function FinalCTA() {
  const { t } = useI18n()

  const scrollToPackages = () => {
    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-red-600" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" />
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-white rounded-full animate-ping delay-500" />
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-white rounded-full animate-ping delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-6" />

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t.finalCta.title}</h2>

        <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">{t.finalCta.subtitle}</p>

        <Button
          onClick={scrollToPackages}
          size="lg"
          className="bg-white text-purple-600 hover:bg-white/90 px-10 py-7 text-lg rounded-full font-bold shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105"
        >
          {t.finalCta.cta}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        <p className="text-white/60 text-sm mt-6">{t.finalCta.disclaimer}</p>
      </div>
    </section>
  )
}
