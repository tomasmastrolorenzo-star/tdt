"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Check, Sparkles, Shield, CreditCard, Bitcoin, MessageCircle, Lock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

interface UpsellOption {
    id: string
    title: string
    description: string
    price: number
    icon: any
}

function CheckoutContent() {
    const searchParams = useSearchParams()
    const [selectedPlan, setSelectedPlan] = useState("turbo")
    const [billingCycle, setBillingCycle] = useState("annual")
    const [paymentMethod, setPaymentMethod] = useState<"crypto" | "manual">("crypto")

    // Upsells state
    const [autoLikes, setAutoLikes] = useState(false)
    const [autoViews, setAutoViews] = useState(false)

    // User data from previous step
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        goal: ""
    })

    useEffect(() => {
        setUserData({
            username: searchParams.get("username") || "",
            email: searchParams.get("email") || "",
            goal: searchParams.get("goal") || ""
        })
        setSelectedPlan(searchParams.get("plan") || "turbo")
        setBillingCycle(searchParams.get("billing") || "annual")
    }, [searchParams])

    // Pricing
    const basePrices = {
        standard: { monthly: 49842, annual: 24921 },
        turbo: { monthly: 120210, annual: 60105 }
    }

    const upsells: UpsellOption[] = [
        {
            id: "auto-likes",
            title: "Auto-Likes en tus próximos posts",
            description: "Recibe likes automáticos en cada publicación para impulsar el engagement",
            price: 15000,
            icon: "❤️"
        },
        {
            id: "auto-views",
            title: "Auto-Views para tus Reels",
            description: "Aumenta las visualizaciones de tus Reels automáticamente",
            price: 18000,
            icon: "👁️"
        }
    ]

    // Calculate total
    const basePrice = basePrices[selectedPlan as keyof typeof basePrices][billingCycle as keyof typeof basePrices.standard]
    const upsellTotal = (autoLikes ? upsells[0].price : 0) + (autoViews ? upsells[1].price : 0)
    const subtotal = basePrice + upsellTotal
    const cryptoDiscount = paymentMethod === "crypto" ? subtotal * 0.1 : 0
    const total = subtotal - cryptoDiscount

    const handleCheckout = () => {
        if (paymentMethod === "crypto") {
            // Redirect to Cryptomus payment
            console.log("Processing crypto payment:", { total, plan: selectedPlan, upsells: { autoLikes, autoViews } })
            // TODO: Integrate Cryptomus API
        } else {
            // Open WhatsApp
            const message = `Hola! Quiero contratar el plan ${selectedPlan.toUpperCase()} (${billingCycle}) por ARS $${total.toLocaleString()}. Usuario: @${userData.username}`
            window.open(`https://wa.me/5491234567890?text=${encodeURIComponent(message)}`, '_blank')
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-orange-500" />
                            <span className="font-bold text-xl">Trend Up</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span>Pago 100% Seguro</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                                ✓
                            </div>
                            <span className="text-sm font-medium text-slate-600">Perfil</span>
                        </div>
                        <div className="w-16 h-0.5 bg-green-500"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                                ✓
                            </div>
                            <span className="text-sm font-medium text-slate-600">Plan</span>
                        </div>
                        <div className="w-16 h-0.5 bg-orange-500"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                                3
                            </div>
                            <span className="text-sm font-medium text-slate-900">Pago</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left Column - Upsells */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    Potencia tu crecimiento
                                </h2>
                                <p className="text-slate-600">
                                    Agrega servicios adicionales para maximizar tus resultados
                                </p>
                            </div>

                            {/* Base Plan Summary */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Sparkles className="w-6 h-6 text-green-600" />
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            Plan {selectedPlan === "turbo" ? "Turbo AI" : "Standard"}
                                        </h3>
                                        <p className="text-sm text-slate-600">
                                            Facturación {billingCycle === "annual" ? "anual" : "mensual"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-slate-900">
                                        ARS ${basePrice.toLocaleString()}
                                    </span>
                                    <span className="text-slate-600">/mes</span>
                                </div>
                            </div>

                            {/* Upsell Toggles */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900">Servicios adicionales</h3>

                                {upsells.map((upsell, index) => (
                                    <div
                                        key={upsell.id}
                                        className={`border-2 rounded-2xl p-6 transition-all ${(index === 0 && autoLikes) || (index === 1 && autoViews)
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-slate-200 bg-white"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-2xl">{upsell.icon}</span>
                                                    <h4 className="font-bold text-slate-900">{upsell.title}</h4>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-3">
                                                    {upsell.description}
                                                </p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-xl font-bold text-orange-500">
                                                        +ARS ${upsell.price.toLocaleString()}
                                                    </span>
                                                    <span className="text-sm text-slate-500">/mes</span>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={index === 0 ? autoLikes : autoViews}
                                                onCheckedChange={index === 0 ? setAutoLikes : setAutoViews}
                                                className="data-[state=checked]:bg-orange-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Payment */}
                        <div className="lg:sticky lg:top-4 h-fit">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">
                                    Resumen del pedido
                                </h3>

                                {/* Order Summary */}
                                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">
                                            Plan {selectedPlan === "turbo" ? "Turbo AI" : "Standard"}
                                        </span>
                                        <span className="font-medium">ARS ${basePrice.toLocaleString()}</span>
                                    </div>

                                    {autoLikes && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Auto-Likes</span>
                                            <span className="font-medium">ARS ${upsells[0].price.toLocaleString()}</span>
                                        </div>
                                    )}

                                    {autoViews && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Auto-Views</span>
                                            <span className="font-medium">ARS ${upsells[1].price.toLocaleString()}</span>
                                        </div>
                                    )}

                                    {paymentMethod === "crypto" && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Descuento Crypto (10%)</span>
                                            <span className="font-medium">-ARS ${cryptoDiscount.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-baseline mb-8">
                                    <span className="text-lg font-bold text-slate-900">Total</span>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-slate-900">
                                            ARS ${total.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            por mes
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Selector */}
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-slate-900 mb-3">
                                        Método de pago
                                    </label>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <button
                                            onClick={() => setPaymentMethod("crypto")}
                                            className={`relative p-4 rounded-xl border-2 transition-all ${paymentMethod === "crypto"
                                                ? "border-green-500 bg-green-50"
                                                : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            {paymentMethod === "crypto" && (
                                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    -10%
                                                </div>
                                            )}
                                            <Bitcoin className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                                            <div className="text-xs font-bold text-slate-900">Crypto</div>
                                            <div className="text-xs text-slate-500">Automático</div>
                                        </button>

                                        <button
                                            onClick={() => setPaymentMethod("manual")}
                                            className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === "manual"
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                                            <div className="text-xs font-bold text-slate-900">Manual</div>
                                            <div className="text-xs text-slate-500">WhatsApp</div>
                                        </button>
                                    </div>

                                    {/* Payment Method Details */}
                                    {paymentMethod === "crypto" ? (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                            <div className="flex items-start gap-3">
                                                <Bitcoin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <div className="text-sm">
                                                    <p className="font-bold text-green-900 mb-1">
                                                        Pago con Criptomonedas
                                                    </p>
                                                    <p className="text-green-700 text-xs">
                                                        Procesamiento automático e instantáneo. Acepta BTC, ETH, USDT y más.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                            <div className="flex items-start gap-3">
                                                <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <div className="text-sm">
                                                    <p className="font-bold text-blue-900 mb-1">
                                                        Pago Manual
                                                    </p>
                                                    <p className="text-blue-700 text-xs">
                                                        Un agente te contactará por WhatsApp para coordinar el pago vía MercadoPago o transferencia.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <Button
                                    onClick={handleCheckout}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-6 rounded-xl text-lg shadow-lg mb-4"
                                >
                                    {paymentMethod === "crypto" ? (
                                        <>
                                            <Bitcoin className="w-5 h-5 mr-2" />
                                            Activar Crecimiento Ahora →
                                        </>
                                    ) : (
                                        <>
                                            <MessageCircle className="w-5 h-5 mr-2" />
                                            Contactar Agente →
                                        </>
                                    )}
                                </Button>

                                {/* Trust Badges */}
                                <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Lock className="w-4 h-4" />
                                        <span>SSL Secure</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <X className="w-4 h-4" />
                                        <span>Cancel Anytime</span>
                                    </div>
                                </div>

                                {/* Money Back Guarantee */}
                                <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                                    <div className="inline-flex items-center gap-2 text-sm text-green-600 font-medium">
                                        <Shield className="w-5 h-5" />
                                        <span>Garantía de reembolso de 14 días</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando checkout...</p>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    )
}
