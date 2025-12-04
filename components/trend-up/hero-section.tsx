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
          <div className="inline-flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-1.5 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-slate-300 font-medium">🎄 Navidad llegó a TDT</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            {t.hero.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-red-500 animate-gradient-x">
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

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
            <div className="flex items-center gap-1 text-green-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold">4.9/5</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="#pricing" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white h-14 px-8 rounded-full text-lg font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-105">
                {t.hero.cta}
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-14 px-8 rounded-full text-lg font-medium transition-all">
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
