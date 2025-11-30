"use client"

import { Check, Crown, Flame, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"

interface Package {
  id: string
  name: string
  followers: number
  price: number
  currency: string
  delivery: string
  quality: string
  guarantee: string
  support: string
  popular: boolean
  bestValue: boolean
}

interface ServicePackagesProps {
  packages: Package[]
  platform: string
}

export default function ServicePackages({ packages, platform }: ServicePackagesProps) {
  const { t, formatPrice } = useI18n()

  const getFollowerLabel = (platform: string) => {
    switch (platform) {
      case "youtube":
        return t.packages.subscribers
      default:
        return t.packages.followers
    }
  }

  return (
    <section id="packages" className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            {t.packages.title}{" "}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
              {getFollowerLabel(platform)}
            </span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">{t.packages.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <div key={pkg.id} className={cn("relative group", pkg.popular && "lg:-mt-6 lg:mb-6")}>
              {pkg.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2 rounded-full text-sm font-black flex items-center gap-1.5 shadow-2xl shadow-amber-500/50 animate-pulse">
                    <Flame className="w-4 h-4" />
                    BEST SELLER
                  </div>
                </div>
              )}
              {pkg.bestValue && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-full text-sm font-black flex items-center gap-1.5 shadow-2xl shadow-purple-500/50">
                    <Crown className="w-4 h-4" />
                    BEST VALUE
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "relative h-full rounded-3xl p-[2px] transition-all duration-500 hover:scale-105",
                  pkg.popular && "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-500",
                  pkg.bestValue && "bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500",
                  !pkg.popular && !pkg.bestValue && "bg-gradient-to-br from-slate-700 to-slate-800",
                )}
              >
                <div
                  className={cn(
                    "h-full bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 backdrop-blur-xl",
                    pkg.popular && "shadow-2xl shadow-amber-500/30",
                    pkg.bestValue && "shadow-2xl shadow-purple-500/30",
                  )}
                >
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/30 rounded-br-lg" />

                  <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">{pkg.name}</h3>

                  <div className="text-5xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-red-400 bg-clip-text text-transparent mb-1">
                    {(pkg.followers / 1000).toFixed(0)}K
                  </div>
                  <div className="text-slate-400 text-sm mb-4 font-semibold">{getFollowerLabel(platform)}</div>

                  <div className="mb-6">
                    {pkg.popular && (
                      <div className="text-slate-500 text-lg line-through mb-1">{formatPrice(pkg.price * 2)}</div>
                    )}
                    <div className="text-4xl font-black text-white">{formatPrice(pkg.price)}</div>
                    {pkg.popular && (
                      <div className="inline-flex items-center gap-1 bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-1 rounded-full text-xs font-bold mt-2">
                        <Zap className="w-3 h-3" />
                        50% OFF TODAY
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-slate-300 text-sm">
                      <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                      {t.packages.delivery} {pkg.delivery}
                    </li>
                    <li className="flex items-center text-slate-300 text-sm">
                      <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                      {pkg.quality}
                    </li>
                    <li className="flex items-center text-slate-300 text-sm">
                      <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                      {t.packages.guarantee} {pkg.guarantee}
                    </li>
                    <li className="flex items-center text-slate-300 text-sm">
                      <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                      {t.packages.support} {pkg.support}
                    </li>
                  </ul>

                  <Button
                    className={cn(
                      "w-full py-6 rounded-xl font-black text-lg transition-all duration-300 shadow-lg uppercase tracking-wide",
                      pkg.popular &&
                        "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/50 hover:shadow-amber-500/70",
                      pkg.bestValue &&
                        "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-500/50 hover:shadow-purple-500/70",
                      !pkg.popular &&
                        !pkg.bestValue &&
                        "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white border-2 border-slate-600",
                    )}
                  >
                    {pkg.popular ? t.packages.getOffer : t.packages.buyNow}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-3 text-center">
              <Shield className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <div className="text-white font-bold text-lg mb-1">{t.packages.guaranteeTitle}</div>
                <div className="text-slate-300 text-sm">{t.packages.guaranteeText}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
