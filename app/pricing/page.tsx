"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Check, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import TestimonialsWall from "@/components/trend-up/testimonials-wall"
import FAQAccordion from "@/components/trend-up/faq-accordion"
import ProfessionalFooter from "@/components/trend-up/professional-footer"

function PricingContent() {
    const searchParams = useSearchParams()
    const [isAnnual, setIsAnnual] = useState(true)
    const [userData, setUserData] = useState({
        username: "",
        goal: "",
        followers: 0
    })

    useEffect(() => {
        setUserData({
            username: searchParams.get("username") || "",
            goal: searchParams.get("goal") || "",
            followers: parseInt(searchParams.get("followers") || "0")
        })
    }, [searchParams])

    const standardFeatures = [
        "1,500 - 2,500 Seguidores Orgánicos /Mes",
        "Segmentación Por Idioma, Demográfica Y De Ubicación",
        "Segmentación Específica De Nicho",
        "Segmentación Basada En IA",
        "Filtración De Influencers",
        "Panel De Control Web Personalizado",
        "Análisis De Crecimiento En Tiempo Real",
        "Optimización De Hashtags Personalizados",
        "Participación En Tiempo Real",
        "24 Vistas De Participación Completa",
        "Actividad 24/7"
    ]

    const premiumFeatures = [
        "2,500 - 3,500 Seguidores Orgánicos /Mes",
        "Segmentación Por Idioma, Demográfica Y De Ubicación",
        "Segmentación Específica De Nicho",
        "Segmentación Basada En IA",
        "Filtración De Influencers",
        "Panel De Control Web Personalizado",
        "Análisis De Crecimiento En Tiempo Real",
        "Optimización De Hashtags Personalizados",
        "Participación En Tiempo Real",
        "24 Vistas De Participación Completa",
        "Actividad 24/7",
        "Ventajas Adicionales De La Segmentación Por IA",
        "Acceso A Un Gestor Personal Para Tu Cuenta",
        "Formación En I.A."
    ]

    const standardPrice = isAnnual ? 24921 : 49842
    const premiumPrice = isAnnual ? 60105 : 120210
    const standardOriginal = 51309
    const premiumOriginal = 120210

    return (
        <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-orange-500" />
                            <span className="font-bold text-xl">Trend Up</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-600">
                                {userData.username && `@${userData.username}`}
                            </span>
                            <Button variant="outline" size="sm">
                                Cambiar Cuenta
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="py-16 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        <span className="text-orange-500">Affordable</span>,{" "}
                        <span className="text-blue-500">Accelerated</span>,{" "}
                        <span className="text-green-500">Organic</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L3.5 8.5v7c0 5.5 3.8 10.7 8.5 12 4.7-1.3 8.5-6.5 8.5-12v-7L12 2z" />
                            </svg>
                            <span className="text-sm font-bold">Instagram</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Growth.</h2>
                    </div>
                    <p className="text-slate-600 max-w-2xl mx-auto mb-8">
                        Sin Seguidores Falsos, ni bots, ni spam. <strong>Garantía de reembolso</strong> si no ves crecimiento.
                        ¡No necesitas darnos tu contraseña de IG!
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${!isAnnual ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            Mensual
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${isAnnual ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            Anual
                        </button>
                    </div>
                    {isAnnual && (
                        <div className="text-orange-500 font-bold text-sm">
                            💰 Ahorra 50% con facturación anual
                        </div>
                    )}
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="container mx-auto px-4 pb-20">
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Standard Plan */}
                    <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden">
                        <div className="p-8">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-6">
                                <Zap className="w-4 h-4" />
                                <span className="font-bold">Standard Plan</span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-sm text-slate-500 font-bold">ARS</span>
                                    <span className="text-5xl font-black text-slate-900">
                                        ${standardPrice.toLocaleString()}
                                    </span>
                                    <span className="text-slate-500">/mes</span>
                                </div>
                                {isAnnual && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 line-through text-sm">
                                            ARS ${standardOriginal.toLocaleString()}
                                        </span>
                                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            50% OFF
                                        </span>
                                    </div>
                                )}
                            </div>

                            <p className="text-slate-600 mb-8">
                                Ideal para pequeñas cuentas de Instagram que necesitan nuevos seguidores rápidamente.
                            </p>

                            {/* CTA Button */}
                            <Button
                                onClick={() => {
                                    const params = new URLSearchParams({
                                        plan: 'standard',
                                        billing: isAnnual ? 'annual' : 'monthly',
                                        username: userData.username,
                                        email: userData.username // Will be captured in profile analyzer
                                    })
                                    window.location.href = `/checkout?${params.toString()}`
                                }}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-6 rounded-xl mb-8 shadow-lg"
                            >
                                Prueba Standard →
                            </Button>

                            {/* Features */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-900 mb-4">Qué incluye:</h4>
                                {standardFeatures.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-0.5 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-orange-600" />
                                        </div>
                                        <span className="text-slate-600 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Premium Plan - TURBO AI */}
                    <div className="relative">
                        {/* Most Popular Badge */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                            ⭐ MÁS POPULAR
                        </div>

                        <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-3xl shadow-2xl overflow-hidden border-4 border-green-300 transform scale-105">
                            <div className="p-8 text-white">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 border border-white/30">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="font-bold">Turbo AI Plan</span>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-sm text-white/80 font-bold">ARS</span>
                                        <span className="text-5xl font-black">
                                            ${premiumPrice.toLocaleString()}
                                        </span>
                                        <span className="text-white/80">/mes</span>
                                    </div>
                                    {isAnnual && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-white/60 line-through text-sm">
                                                ARS ${premiumOriginal.toLocaleString()}
                                            </span>
                                            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded border border-white/30">
                                                50% OFF
                                            </span>
                                        </div>
                                    )}
                                    <div className="mt-2 text-white/90 text-sm font-medium">
                                        💎 Solo ARS ${Math.round(premiumPrice / 30).toLocaleString()} por día
                                    </div>
                                </div>

                                <p className="text-white/90 mb-8 font-medium">
                                    Crecimiento más rápido y más funciones de IA, ideal para todos los usuarios que necesitan un impulso adicional.
                                </p>

                                {/* CTA Button */}
                                <Button
                                    onClick={() => {
                                        const params = new URLSearchParams({
                                            plan: 'turbo',
                                            billing: isAnnual ? 'annual' : 'monthly',
                                            username: userData.username,
                                            email: userData.username
                                        })
                                        window.location.href = `/checkout?${params.toString()}`
                                    }}
                                    className="w-full bg-white text-green-600 hover:bg-slate-50 font-bold py-6 rounded-xl mb-8 shadow-xl"
                                >
                                    Prueba Turbo AI →
                                </Button>

                                {/* Features */}
                                <div className="space-y-4">
                                    <h4 className="font-bold mb-4">Incluye el plan Standard y además:</h4>
                                    {premiumFeatures.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="mt-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                            <span className="text-white/90 text-sm">{feature}</span>
                                        </div>
                                    ))}

                                    {/* AI Badge */}
                                    <div className="mt-6 pt-6 border-t border-white/20">
                                        <div className="inline-flex items-center gap-2 bg-slate-900/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="font-bold text-sm">Powered by TDT AI Engine</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Section */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-8 bg-white rounded-2xl shadow-lg px-8 py-6 border border-slate-200">
                        <div className="text-center">
                            <div className="text-3xl font-black text-slate-900">23,684+</div>
                            <div className="text-sm text-slate-600">Clientes Satisfechos</div>
                        </div>
                        <div className="w-px h-12 bg-slate-200"></div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-slate-900">4.9/5</div>
                            <div className="text-sm text-slate-600">Rating Promedio</div>
                        </div>
                        <div className="w-px h-12 bg-slate-200"></div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-slate-900">100%</div>
                            <div className="text-sm text-slate-600">Seguro y Orgánico</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Wall */}
            <TestimonialsWall />

            {/* FAQ Section */}
            <FAQAccordion />

            {/* Professional Footer */}
            <ProfessionalFooter />
        </main>
    )
}

export default function PricingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando precios...</p>
                </div>
            </div>
        }>
            <PricingContent />
        </Suspense>
    )
}
