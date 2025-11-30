"use client"

import { ArrowRight, Users, Zap, Headphones, Star, Shield, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"

export default function HeroSection() {
  const { t } = useI18n()

  const scrollToPackages = () => {
    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-5 py-2 mb-8 shadow-lg shadow-amber-500/10">
          <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-sm text-white font-semibold">{t.hero.badge}</span>
          <div className="flex items-center gap-1 ml-2 bg-amber-500/30 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
            <span className="text-xs text-amber-100 font-bold">5.0</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight text-balance">
          {t.hero.title}
          <br />
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            {t.hero.titleHighlight}
          </span>
        </h1>

        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 border-2 border-slate-950"
              />
            ))}
          </div>
          <p className="text-slate-300 text-sm font-medium">{t.hero.trustLine}</p>
        </div>

        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 text-pretty font-medium">
          {t.hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <Button
            onClick={scrollToPackages}
            size="lg"
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 hover:from-pink-600 hover:via-purple-600 hover:to-red-600 text-white px-10 py-7 text-xl font-bold rounded-full shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 transition-all duration-300 hover:scale-105 group"
          >
            {t.hero.cta}
            <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={scrollToHowItWorks}
            variant="outline"
            size="lg"
            className="border-2 border-white/40 text-white hover:bg-white/20 px-10 py-7 text-xl font-semibold rounded-full backdrop-blur-sm bg-white/5"
          >
            {t.hero.ctaSecondary}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-16">
          <Shield className="w-4 h-4 text-green-400" />
          <span>{t.hero.guarantee}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:border-pink-500/50 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Users className="w-10 h-10 text-pink-400 mx-auto mb-4" />
            <div className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              50,000+
            </div>
            <div className="text-slate-300 font-medium">{t.hero.stats.clients}</div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <TrendingUp className="w-5 h-5 text-pink-400" />
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:border-purple-500/50 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <div className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
              1.2M+
            </div>
            <div className="text-slate-300 font-medium">{t.hero.stats.followers}</div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:border-red-500/50 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Headphones className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <div className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              24/7
            </div>
            <div className="text-slate-300 font-medium">{t.hero.stats.support}</div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
