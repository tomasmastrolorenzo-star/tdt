"use client"

import { useState } from "react"
import { Check, Flame, Zap, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"

export default function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(true)
    const [followersIndex, setFollowersIndex] = useState(0)

    const quantities = [2000, 5000, 10000, 25000, 50000, 100000]
    const quantityLabels = ["2k", "5k", "10k", "25k", "50k", "100k"]

    // Base prices in ARS for monthly
    const basePrices = {
        standard: [24921, 59900, 109900, 249900, 449900, 849900],
        premium: [49842, 119900, 219900, 499900, 899900, 1699900]
    }

    const currentQuantity = quantities[followersIndex]
    const currentLabel = quantityLabels[followersIndex]

    const getPrice = (type: 'standard' | 'premium') => {
        let price = basePrices[type][followersIndex]
        if (isAnnual) {
            price = price * 0.5 // 50% discount
        }
        return price.toLocaleString('es-AR')
    }

    return (
        <section id="packages" className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold mb-6">
                        Descuento limitado
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        Elige tu crecimiento <br />
                        <span className="text-orange-500">sin límites</span>
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto mb-8">
                        Sin bots. Sin riesgos. Crecimiento real garantizado.
                    </p>

                    {/* Controls */}
                    <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl shadow-lg border border-slate-100 mb-12">
                        {/* Selector de Cantidad */}
                        <div className="mb-8">
                            <label className="block text-slate-700 font-bold mb-4 text-lg">
                                Quiero conseguir <span className="text-orange-500 text-2xl">{currentLabel}</span> seguidores reales
                            </label>
                            <div className="px-4">
                                <Slider
                                    defaultValue={[0]}
                                    max={5}
                                    step={1}
                                    value={[followersIndex]}
                                    onValueChange={(val) => setFollowersIndex(val[0])}
                                    className="py-4"
                                />
                                <div className="flex justify-between text-xs text-slate-400 font-medium mt-2">
                                    {quantityLabels.map((lbl, i) => (
                                        <span key={i} className={i === followersIndex ? "text-orange-600 font-bold" : ""}>{lbl}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Switch Anual/Mensual */}
                        <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100">
                            <span className={`text-sm font-bold ${!isAnnual ? "text-slate-900" : "text-slate-500"}`}>Mensual</span>
                            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} className="data-[state=checked]:bg-green-500" />
                            <span className={`text-sm font-bold ${isAnnual ? "text-slate-900" : "text-slate-500"}`}>
                                Anual <span className="text-green-500 ml-1">(-50%)</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Standard Plan */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden flex flex-col">
                        <div className="mb-6">
                            <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full mb-4">
                                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                                <span className="font-bold text-slate-900">Standard Growth</span>
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 mb-2">
                                ${getPrice('standard')}
                                <span className="text-lg font-medium text-slate-500 ml-2">/mes</span>
                            </h3>
                            <p className="text-slate-500 text-sm">Ideal para comenzar a crecer de forma constante.</p>
                        </div>

                        <div className="space-y-4 flex-1 mb-8">
                            {[
                                `${currentLabel} Seguidores Reales`,
                                "Velocidad de entrega natural",
                                "Inicio en 24-48hs",
                                "Garantía de reposición 30 días",
                                "Soporte por Email"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-slate-600" />
                                    </div>
                                    <span className="text-slate-600 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Link href={`/checkout?plan=standard&followers=${currentQuantity}&billing=${isAnnual ? 'annual' : 'monthly'}`} className="w-full block mt-auto">
                            <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-6 rounded-xl">
                                Elegir Standard
                            </Button>
                        </Link>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-1 shadow-2xl relative overflow-hidden flex flex-col transform lg:-translate-y-4 lg:scale-105 transition-transform">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-1 rounded-b-xl text-xs font-bold shadow-lg z-10">
                            RECOMENDADO POR IA
                        </div>

                        <div className="bg-slate-900 rounded-[2.3rem] p-8 h-full flex flex-col relative z-0">
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                            <div className="mb-6 relative">
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 rounded-full mb-4">
                                    <Zap className="w-4 h-4 text-white fill-white" />
                                    <span className="font-bold text-white">Turbo AI Growth</span>
                                </div>
                                <h3 className="text-4xl font-black text-white mb-2">
                                    ${getPrice('premium')}
                                    <span className="text-lg font-medium text-slate-400 ml-2">/mes</span>
                                </h3>
                                <p className="text-slate-400 text-sm">Máxima velocidad y calidad con Inteligencia Artificial.</p>
                            </div>

                            <div className="space-y-4 flex-1 mb-8 relative">
                                {[
                                    `${currentLabel} Seguidores Premium (+Bonus)`,
                                    "Velocidad Turbo (Prioridad Alta)",
                                    "Inicio Instantáneo (<1h)",
                                    "Garantía de por vida",
                                    "Soporte VIP Prioritario 24/7",
                                    "Segmentación por IA (GPT-4o)",
                                    "Asesor de cuenta dedicado"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-0.5 w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-slate-200 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href={`/checkout?plan=premium&followers=${currentQuantity}&billing=${isAnnual ? 'annual' : 'monthly'}`} className="w-full block mt-auto relative">
                                <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-orange-500/20">
                                    Elegir Premium ⭐
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center">
                <p className="text-slate-600 mb-4">¿Buscas algo más específico?</p>
                <Link href="/servicios" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors border-b-2 border-orange-200 hover:border-orange-600 pb-1">
                    Ver todos los servicios y paquetes disponibles
                    <span className="text-xl">→</span>
                </Link>
            </div>

        </section >
    )
}
