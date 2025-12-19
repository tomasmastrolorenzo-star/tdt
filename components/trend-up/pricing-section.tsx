"use client"

import { useState } from "react"
import { Check, ShieldCheck, CreditCard, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export default function PricingSection() {
    const { t } = useI18n()
    const [isQuarterly, setIsQuarterly] = useState(false)

    // Helper to calculate price with 20% discount if quarterly
    const getPrice = (basePrice: number) => {
        if (isQuarterly) {
            return Math.floor(basePrice * 0.8)
        }
        return basePrice
    }

    const tiers = [
        {
            key: 'starter',
            price: 97,
            data: t.subscription_v2?.tiers?.starter,
            highlight: false,
            buttonVariant: "outline"
        },
        {
            key: 'pro',
            price: 249,
            data: t.subscription_v2?.tiers?.pro,
            highlight: true,
            buttonVariant: "default"
        },
        {
            key: 'celebrity',
            price: 497,
            data: t.subscription_v2?.tiers?.celebrity,
            highlight: false,
            buttonVariant: "outline" // Gold/Black handled in render
        }
    ]

    return (
        <section id="packages" className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        {t.subscription_v2?.title || "Your AI Growth Strategy is Ready."}
                    </h2>
                    <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                        {t.subscription_v2?.subtitle || "Select your monthly acceleration plan. Cancel anytime."}
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-bold ${!isQuarterly ? "text-slate-900" : "text-slate-500"}`}>
                            {t.subscription_v2?.monthly || "Monthly"}
                        </span>
                        <Switch
                            checked={isQuarterly}
                            onCheckedChange={setIsQuarterly}
                            className="data-[state=checked]:bg-orange-500"
                        />
                        <span className={`text-sm font-bold ${isQuarterly ? "text-slate-900" : "text-slate-500"}`}>
                            {t.subscription_v2?.quarterly || "Quarterly"}
                            <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                                {t.subscription_v2?.save20 || "Save 20%"}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
                    {tiers.map((tier) => {
                        const price = getPrice(tier.price)
                        // Fallback data if translation missing (Safety)
                        const name = tier.data?.name || (tier.key === 'starter' ? "INFLUENCER STARTER" : tier.key === 'pro' ? "PRO AUTHORITY" : "CELEBRITY STATUS")
                        const desc = tier.data?.description || "Loading..."
                        const features = tier.data?.features || []
                        const cta = tier.data?.cta || "Select Plan"

                        return (
                            <div
                                key={tier.key}
                                className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 flex flex-col
                                    ${tier.highlight
                                        ? "border-orange-500 shadow-2xl shadow-orange-500/10 md:-translate-y-4 md:scale-105 z-10"
                                        : "border-slate-200 shadow-xl hover:shadow-2xl hover:border-orange-200"
                                    }
                                `}
                            >
                                {/* Badge for Pro */}
                                {tier.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                                        {tier.data?.badge || "🔥 MOST POPULAR"}
                                    </div>
                                )}

                                {/* Header */}
                                <div className="mb-6 text-center">
                                    <h3 className="text-lg font-bold text-slate-500 mb-2 tracking-widest uppercase">{name}</h3>
                                    <div className="flex items-center justify-center gap-1 mb-2">
                                        <span className="text-sm font-medium text-slate-400 relative top-[-8px]">$</span>
                                        <span className="text-5xl font-black text-slate-900">{price}</span>
                                        <span className="text-slate-400 self-end mb-1">/mo</span>
                                    </div>
                                    <p className="text-slate-600 text-sm h-10 flex items-center justify-center">{desc}</p>
                                </div>

                                {/* Divider */}
                                <div className="w-full h-px bg-slate-100 mb-6" />

                                {/* Features */}
                                <ul className="space-y-4 mb-8 flex-1">
                                    {features.map((feature: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                            <div className="mt-0.5 min-w-[1.25rem]">
                                                <Check className={`w-5 h-5 ${tier.highlight ? "text-orange-500" : "text-green-500"}`} />
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Anchor for Pro */}
                                {tier.highlight && (
                                    <p className="text-xs text-center text-slate-400 mb-4 font-medium italic">
                                        {tier.data?.anchor || "Equivalent to a $2,000/mo Agency."}
                                    </p>
                                )}

                                {/* CTA Button */}
                                <div className="mt-auto">
                                    <Link href={`/checkout?plan=${tier.key}&billing=${isQuarterly ? 'quarterly' : 'monthly'}`} className="block">
                                        <Button
                                            className={`w-full py-6 text-lg font-bold rounded-xl transition-all
                                                ${tier.key === 'celebrity'
                                                    ? "bg-slate-900 text-amber-400 hover:bg-slate-800 border border-slate-800"
                                                    : tier.highlight
                                                        ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-500/25"
                                                        : "bg-white text-slate-900 border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-50"
                                                }
                                            `}
                                        >
                                            {cta}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Footer Guarantee */}
                <div className="mt-16 pt-8 border-t border-slate-200 max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-slate-400" />
                            <span>{t.subscription_v2?.guarantee?.secure || "Secure SSL Payment"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-slate-400" />
                            <span>{t.subscription_v2?.guarantee?.moneyBack || "14-Day Money-Back Guarantee"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Ban className="w-5 h-5 text-slate-400" />
                            <span>{t.subscription_v2?.guarantee?.cancel || "Cancel Anytime"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
