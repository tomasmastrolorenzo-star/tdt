"use client"

import { useState } from "react"
import { Check, ShieldCheck, CreditCard, Ban, Sparkles, Zap, Crown, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export default function PricingSection() {
    const { t } = useI18n()
    const [isQuarterly, setIsQuarterly] = useState(false)

    // Fixed Pricing Logic (No decimals)
    const getPrice = (basePrice: number) => {
        if (isQuarterly) {
            // Simple logic: Quarterly gets approx 20% off monthly rate? 
            // Or usually basePrice IS the monthly rate.
            // User asked for "Stop calculating prices with random decimals".
            // Let's keep the monthly price clean.
            // If they toggle quarterly, maybe show the saving or a discounted monthly price.
            // Let's assume the input basePrice is the Monthly Price.
            // Discounted: floor(price * 0.8)
            return Math.floor(basePrice * 0.8)
        }
        return basePrice
    }

    const tiers = [
        {
            key: 'starter',
            name: "GROWTH STARTER",
            price: 49,
            features: ["2,500 Real Followers", "Auto-Likes", "Standard Delivery", "24/7 Support"],
            badge: "Good Start",
            badgeColor: "bg-blue-100 text-blue-700",
            highlight: false,
            cta: "Activate Plan"
        },
        {
            key: 'pro',
            name: "VIRAL MOMENTUM 🏆",
            price: 99,
            features: ["5,000 Real Followers", "Priority Delivery", "Warranty (Refill)", "Dedicated Manager", "AI Content Strategy"],
            badge: "MOST POPULAR",
            badgeColor: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/40",
            highlight: true,
            cta: "Activate Plan"
        },
        {
            key: 'dominance',
            name: "BRAND PARTNER",
            price: 249,
            features: ["15,000 Followers", "Dedicated Support", "Instant Velocity", "VIP Networking", "Money-Back Guarantee"],
            badge: "Best ROI",
            badgeColor: "bg-purple-100 text-purple-700",
            highlight: false,
            cta: "Activate Plan"
        }
    ]

    return (
        <section id="packages" className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        {t.subscription_v2?.title || "Choose Your Growth Velocity"}
                    </h2>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        {t.subscription_v2?.subtitle || "Premium AI-driven growth for serious brands. Cancel anytime."}
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 bg-white inline-flex p-2 rounded-full border border-slate-200 shadow-sm">
                        <span className={`text-sm font-bold px-4 py-2 rounded-full transition-colors ${!isQuarterly ? "bg-slate-900 text-white" : "text-slate-500"}`}>
                            Monthly
                        </span>
                        <Switch
                            checked={isQuarterly}
                            onCheckedChange={setIsQuarterly}
                            className="data-[state=checked]:bg-orange-500"
                        />
                        <span className={`text-sm font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${isQuarterly ? "bg-slate-900 text-white" : "text-slate-500"}`}>
                            Quarterly
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide">
                                Save 20%
                            </span>
                        </span>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                    {tiers.map((tier) => {
                        const price = getPrice(tier.price)

                        return (
                            <div
                                key={tier.key}
                                className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between group
                                    ${tier.highlight
                                        ? "border-orange-500/50 shadow-2xl shadow-orange-500/10 md:-translate-y-4 md:scale-105 z-10 ring-4 ring-orange-500/10"
                                        : "border-slate-200 shadow-xl hover:shadow-2xl hover:border-orange-200 hover:-translate-y-1"
                                    }
                                `}
                            >
                                {/* Badge */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${tier.badgeColor}`}>
                                        {tier.badge}
                                    </div>
                                </div>

                                <div>
                                    {/* Create Visual Hierarchy */}
                                    <div className="text-center mb-8 pt-4">
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide mb-4">{tier.name}</h3>
                                        <div className="flex items-center justify-center gap-0.5">
                                            <span className="text-2xl font-bold text-slate-400 relative top-[-8px]">$</span>
                                            <span className="text-6xl font-black text-slate-900 tracking-tighter">{price}</span>
                                            <span className="text-slate-400 font-medium self-end mb-2">/mo</span>
                                        </div>
                                        {isQuarterly && (
                                            <div className="text-xs text-green-600 font-bold mt-2">
                                                Billed ${price * 3} quarterly
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-slate-100 mb-8" />

                                    {/* Features */}
                                    <ul className="space-y-4 mb-8">
                                        {tier.features.map((feature, i) => {
                                            const cleanFeature = feature.replace(/^[✅✔✨•\s]+/, '').trim()
                                            return (
                                                <li key={i} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.6)] flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm font-medium text-slate-700">{cleanFeature}</span>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>

                                {/* CTA Button */}
                                <div>
                                    <Link href={`/checkout?plan=${tier.key}&billing=${isQuarterly ? 'quarterly' : 'monthly'}`} className="block">
                                        <Button
                                            className={`w-full py-6 text-lg font-bold rounded-xl transition-all shadow-lg
                                                ${tier.highlight
                                                    ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02]"
                                                    : "bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02]"
                                                }
                                            `}
                                        >
                                            {tier.cta}
                                        </Button>
                                    </Link>
                                    <p className="text-center text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-wider">
                                        {tier.highlight ? "⚡ Limited Availability" : "Risk-Free Trial"}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Footer Guarantee */}
                <div className="mt-20 pt-10 border-t border-slate-200 max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            <span>Secure SSL Payment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5" />
                            <span>14-Day Money-Back Guarantee</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Ban className="w-5 h-5" />
                            <span>Cancel Anytime</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
