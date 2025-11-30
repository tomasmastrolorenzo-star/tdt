"use client"

import { Check, Sparkles, Crown } from "lucide-react"
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
    <section id="packages" className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.packages.title}{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {getFollowerLabel(platform)}
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t.packages.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className={cn("relative group", pkg.popular && "lg:-mt-4 lg:mb-4")}>
              {/* Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    {t.packages.popular}
                  </div>
                </div>
              )}
              {pkg.bestValue && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                    <Crown className="w-4 h-4" />
                    {t.packages.bestValue}
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={cn(
                  "h-full bg-slate-900/50 backdrop-blur-lg border rounded-2xl p-6 transition-all duration-300 hover:scale-105",
                  pkg.popular
                    ? "border-pink-500/50 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30"
                    : pkg.bestValue
                      ? "border-amber-500/50 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                      : "border-slate-800 hover:border-slate-700",
                )}
              >
                {/* Package name */}
                <h3 className="text-lg font-bold text-white mb-2">{pkg.name}</h3>

                {/* Followers count */}
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-1">
                  {pkg.followers.toLocaleString()}
                </div>
                <div className="text-slate-400 text-sm mb-4">{getFollowerLabel(platform)}</div>

                <div className="text-3xl font-bold text-white mb-6">{formatPrice(pkg.price)}</div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-slate-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    {t.packages.delivery} {pkg.delivery}
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    {pkg.quality}
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    {t.packages.guarantee} {pkg.guarantee}
                  </li>
                  <li className="flex items-center text-slate-300 text-sm">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    {t.packages.support} {pkg.support}
                  </li>
                </ul>

                {/* CTA */}
                <Button
                  className={cn(
                    "w-full py-6 rounded-xl font-semibold transition-all duration-300",
                    pkg.popular
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40"
                      : pkg.bestValue
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20",
                  )}
                >
                  {t.packages.buyNow}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
