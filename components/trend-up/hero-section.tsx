"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Star, TrendingUp, Users, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export default function HeroSection() {
  const { t } = useI18n()

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-1.5 mb-8 hover:border-[#F8B229]/50 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-[#D42426] animate-pulse shadow-[0_0_10px_#D42426]" />
            <span className="text-sm text-slate-300 font-medium">{t.hero.badge} 🎄</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            {t.hero.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D42426] via-[#F8B229] to-[#D42426] animate-gradient-x bg-[length:200%_auto]">
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* Problem Statement */}
          <p className="text-xl md:text-2xl text-[#F8B229] font-semibold mb-4">
            {t.hero.problem}
          </p>

          {/* Solution */}
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.hero.solution} <span className="text-[#165B33] font-bold bg-green-900/20 px-1 rounded">{t.hero.solutionHighlight}</span>
          </p>

          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-[#165B33]/10 border border-[#165B33]/30 rounded-full px-4 py-2 mb-10">
            <CheckCircle2 className="w-5 h-5 text-[#F8B229]" />
            <span className="text-sm text-green-300 font-medium">{t.hero.trustBadge}</span>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces"
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-slate-950 object-cover"
                  />
                ))}
              </div>
              <span>{t.hero.trustLine}</span>
            </div>
            <div className="flex items-center gap-1 text-[#F8B229]">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold">4.9/5</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="#consultant" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#D42426] to-[#b91c1c] hover:from-[#b91c1c] hover:to-[#991b1b] text-white h-14 px-8 rounded-full text-lg font-bold shadow-[0_0_20px_rgba(212,36,38,0.4)] transition-all hover:scale-105 border border-white/10">
                {t.hero.cta} 🎅
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-14 px-8 rounded-full text-lg font-medium transition-all hover:border-[#F8B229]/50">
                {t.hero.ctaSecondary}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-slate-800 pt-10 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-slate-500">{t.hero.stats.clients}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">10M+</div>
              <div className="text-sm text-slate-500">{t.hero.stats.followers}</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-slate-500">{t.hero.stats.support}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
