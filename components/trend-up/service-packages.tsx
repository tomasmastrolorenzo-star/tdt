"use client"

import type React from "react"

import {
  Check,
  Crown,
  Flame,
  Zap,
  Shield,
  Lock,
  Star,
  Gift,
  Eye,
  Heart,
  TrendingUp,
  Users,
  Award,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"
import type { PackageTier } from "@/lib/trend-up/packages"

interface ServicePackagesProps {
  packages: PackageTier[]
  platform: string
}

const benefitIcons: Record<string, React.ElementType> = {
  realFollowers: Users,
  premiumFollowers: Star,
  eliteFollowers: Award,
  vipFollowers: Crown,
  gradualDelivery: TrendingUp,
  emailSupport: Users,
  prioritySupport: Zap,
  dedicatedSupport: Star,
  vipSupport: Crown,
  freeGuide: Gift,
  accountProtection: Lock,
  aiStrategy: Zap,
  exploreBoost: TrendingUp,
  fypBoost: TrendingUp,
  watchTimeBoost: Eye,
  monetizationHelp: Gift,
  exclusivePerks: Crown,
}

export default function ServicePackages({ packages, platform }: ServicePackagesProps) {
  const { t, formatPrice, language } = useI18n()

  const getFollowerLabel = (platform: string) => {
    switch (platform) {
      case "youtube":
        return t.packages.subscribers
      default:
        return t.packages.followers
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString(language === "es" ? "es-ES" : language === "pt" ? "pt-BR" : "en-US")
  }

  const getBenefitText = (benefit: string): string => {
    const benefitTexts: Record<string, Record<string, string>> = {
      es: {
        realFollowers: "Real and active followers",
        premiumFollowers: "High-quality premium followers",
        eliteFollowers: "Verified elite followers",
        vipFollowers: "Exclusive VIP followers",
        gradualDelivery: "Gradual and natural delivery",
        emailSupport: "Email support",
        prioritySupport: "24/7 Priority support",
        dedicatedSupport: "Personal dedicated support",
        vipSupport: "Exclusive VIP support",
        freeGuide: "FREE Guide: 'Monetize Your Account'",
        accountProtection: "$100K Account Protection",
        aiStrategy: "AI-powered growth strategy",
        exploreBoost: "Explore page boost",
        fypBoost: "For You Page boost",
        watchTimeBoost: "Watch Time boost",
        monetizationHelp: "Monetization assistance",
        exclusivePerks: "Access to exclusive perks",
      },
      en: {
        realFollowers: "Real and active followers",
        premiumFollowers: "High-quality premium followers",
        eliteFollowers: "Verified elite followers",
        vipFollowers: "Exclusive VIP followers",
        gradualDelivery: "Gradual and natural delivery",
        emailSupport: "Email support",
        prioritySupport: "24/7 Priority support",
        dedicatedSupport: "Personal dedicated support",
        vipSupport: "Exclusive VIP support",
        freeGuide: "FREE Guide: 'Monetize Your Account'",
        accountProtection: "$100K Account Protection",
        aiStrategy: "AI-powered growth strategy",
        exploreBoost: "Explore page boost",
        fypBoost: "For You Page boost",
        watchTimeBoost: "Watch Time boost",
        monetizationHelp: "Monetization assistance",
        exclusivePerks: "Access to exclusive perks",
      },
      pt: {
        realFollowers: "Real and active followers",
        premiumFollowers: "High-quality premium followers",
        eliteFollowers: "Verified elite followers",
        vipFollowers: "Exclusive VIP followers",
        gradualDelivery: "Gradual and natural delivery",
        emailSupport: "Email support",
        prioritySupport: "24/7 Priority support",
        dedicatedSupport: "Personal dedicated support",
        vipSupport: "Exclusive VIP support",
        freeGuide: "FREE Guide: 'Monetize Your Account'",
        accountProtection: "$100K Account Protection",
        aiStrategy: "AI-powered growth strategy",
        exploreBoost: "Explore page boost",
        fypBoost: "For You Page boost",
        watchTimeBoost: "Watch Time boost",
        monetizationHelp: "Monetization assistance",
        exclusivePerks: "Access to exclusive perks",
      },
    }

    return benefitTexts[language][benefit] || benefit
  }

  const getEngagementText = (percent: number) => {
    const texts: Record<string, string> = {
      es: `+${percent}% Engagement included`,
      en: `+${percent}% Engagement included`,
      pt: `+${percent}% Engagement included`,
    }
    return texts[language] || texts.en
  }

  const getGuaranteeText = (days: number) => {
    const texts: Record<string, string> = {
      es: `${days}-day refill guarantee`,
      en: `${days}-day refill guarantee`,
      pt: `${days}-day refill guarantee`,
    }
    return texts[language] || texts.en
  }

  const getTierColor = (tier: string, isPopular: boolean, isBestValue: boolean) => {
    if (isPopular) return "from-amber-500 via-orange-500 to-amber-500"
    if (isBestValue) return "from-purple-500 via-pink-500 to-purple-500"
    if (tier === "vip") return "from-violet-500 via-purple-600 to-violet-500"
    if (tier === "pro") return "from-cyan-500 via-blue-500 to-cyan-500"
    return "from-slate-600 to-slate-700"
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
          {packages.map((pkg) => (
            <div key={pkg.id} className={cn("relative group", pkg.popular && "lg:-mt-6 lg:mb-6")}>
              {/* Badge */}
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

              {/* Card with gaming border */}
              <div
                className={cn(
                  "relative h-full rounded-3xl p-[2px] transition-all duration-500 hover:scale-105",
                  `bg-gradient-to-br ${getTierColor(pkg.tier, pkg.popular, pkg.bestValue)}`,
                )}
              >
                <div
                  className={cn(
                    "h-full bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-5 backdrop-blur-xl flex flex-col",
                    pkg.popular && "shadow-2xl shadow-amber-500/30",
                    pkg.bestValue && "shadow-2xl shadow-purple-500/30",
                    pkg.tier === "vip" && !pkg.popular && !pkg.bestValue && "shadow-2xl shadow-violet-500/20",
                  )}
                >
                  {/* Corner decorations */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/30 rounded-br-lg" />

                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-1">{pkg.emoji}</div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wide">{pkg.name}</h3>

                    <div className="text-4xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-red-400 bg-clip-text text-transparent mt-2">
                      {formatNumber(pkg.followers)}
                    </div>
                    <div className="text-slate-400 text-sm font-semibold">{getFollowerLabel(platform)}</div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-4">
                    <div className="text-slate-500 text-lg line-through">{formatPrice(pkg.originalPrice)}</div>
                    <div className="text-3xl font-black text-white">{formatPrice(pkg.price)}</div>
                    <div className="inline-flex items-center gap-1 bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-1 rounded-full text-xs font-bold mt-2">
                      <Zap className="w-3 h-3" />
                      50% OFF
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-2 mb-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-green-400 text-xs font-bold">
                      <Heart className="w-3 h-3" />
                      {getEngagementText(pkg.engagementPercent)}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-2 mb-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold">
                      <RefreshCw className="w-3 h-3" />
                      {getGuaranteeText(pkg.guaranteeDays)}
                    </div>
                  </div>

                  {/* Benefits list */}
                  <ul className="space-y-2 mb-4 flex-grow">
                    {pkg.benefits.map((benefit) => {
                      const Icon = benefitIcons[benefit] || Check
                      const isHighlight =
                        benefit.includes("Protection") ||
                        benefit.includes("Guide") ||
                        benefit.includes("Strategy") ||
                        benefit.includes("Perks")
                      return (
                        <li
                          key={benefit}
                          className={cn(
                            "flex items-start text-xs gap-2",
                            isHighlight ? "text-amber-400 font-semibold" : "text-slate-300",
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-4 h-4 flex-shrink-0 mt-0.5",
                              isHighlight ? "text-amber-400" : "text-green-400",
                            )}
                          />
                          <span>{getBenefitText(benefit)}</span>
                        </li>
                      )
                    })}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    className={cn(
                      "w-full py-5 rounded-xl font-black text-base transition-all duration-300 shadow-lg uppercase tracking-wide",
                      pkg.popular &&
                      "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/50",
                      pkg.bestValue &&
                      "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-500/50",
                      pkg.tier === "vip" &&
                      !pkg.popular &&
                      !pkg.bestValue &&
                      "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-violet-500/50",
                      pkg.tier === "pro" &&
                      !pkg.popular &&
                      !pkg.bestValue &&
                      "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-cyan-500/50",
                      pkg.tier === "basic" &&
                      !pkg.popular &&
                      !pkg.bestValue &&
                      "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white",
                    )}
                  >
                    {pkg.popular ? t.packages.getOffer : t.packages.buyNow}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee banner */}
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
