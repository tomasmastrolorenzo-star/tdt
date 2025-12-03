"use client"

import { useState } from "react"
import { Check, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export default function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(true)

    return (
        <section id="packages" className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold mb-6">
                        Descuento limitado
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        ¿Listo para unirte al 1% de los <br />
                        creadores más influyentes?
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto mb-8">
                        ¡Sin seguidores falsos, sin bots, sin spam! <span className="font-bold">Garantía de reembolso</span> si no ves crecimiento. ¡No necesitas darnos tu contraseña de IG!
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-4">
                        <span className={`text-sm font-bold ${!isAnnual ? "text-slate-900" : "text-slate-500"}`}>Mensual</span>
                        <Switch checked={isAnnual} onCheckedChange={setIsAnnual} className="data-[state=checked]:bg-slate-900" />
                        <span className={`text-sm font-bold ${isAnnual ? "text-slate-900" : "text-slate-500"}`}>Anual</span>
                    </div>
                    {isAnnual && (
                        <div className="text-blue-500 text-sm font-handwriting transform -rotate-2">
                            Black Friday 50% de descuento ⤵
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Standard Plan */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-slate-100 px-4 py-1 rounded-bl-2xl text-xs font-bold text-slate-600">
                            Facturación {isAnnual ? "anual" : "mensual"}
                        </div>

                        <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full mb-6">
                            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                            <span className="font-bold text-slate-900">Standard Plan</span>
                        </div>

                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-sm text-slate-500 font-bold mb-4">ARS</span>
                            <span className="text-5xl font-black text-slate-900">{isAnnual ? "24,921" : "49,842"}</span>
                            <span className="text-slate-500 mb-4">/mes</span>
                        </div>

                        {isAnnual && (
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-slate-400 line-through text-sm">ARS:$51,309</span>
                                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">50% DE DESCUENTO</span>
                            </div>
                        )}

                        <p className="text-slate-600 mb-8">
                            Ideal para pequeñas cuentas de Instagram que necesitan nuevos seguidores rápidamente.
                        </p>

                        <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-6 rounded-xl mb-8 shadow-lg shadow-orange-500/20">
                            Pruebe Standard
                        </Button>

                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-900">Qué incluye:</h4>
                            {[
                                "Crecimiento De Entre 1500 Y 2500 Seguidores Orgánicos Al Mes.",
                                "Opciones De Segmentación Personalizadas;",
                                "Más Seguidores En 24 Horas;",
                                "Panel De Control Web Personalizado:",
                                "Análisis De Crecimiento En Tiempo Real;"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span className="text-slate-600 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-gradient-to-b from-green-400 to-green-500 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden text-white">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-6 py-1 rounded-b-xl text-sm font-bold shadow-sm">
                            ARS:$ 2,004 Por día
                        </div>

                        <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
                            <Flame className="w-4 h-4 text-white fill-white" />
                            <span className="font-bold">Premium Plan</span>
                        </div>

                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-sm text-white/80 font-bold mb-4">ARS</span>
                            <span className="text-5xl font-black">{isAnnual ? "60,105" : "120,210"}</span>
                            <span className="text-white/80 mb-4">/mes</span>
                        </div>

                        <p className="text-white/90 mb-8 font-medium">
                            Crecimiento más rápido y más funciones de IA, ideal para todos los usuarios que necesitan un impulso adicional.
                        </p>

                        <Button className="w-full bg-white text-green-600 hover:bg-slate-50 font-bold py-6 rounded-xl mb-8 shadow-lg">
                            Pruebe Premium
                        </Button>

                        <div className="space-y-4">
                            <h4 className="font-bold">Incluye el plan Standard y además:</h4>
                            {[
                                "2.500 - 3.500 Seguidores Orgánicos /Mes",
                                "Opciones De Segmentación Personalizadas;",
                                "Más Seguidores En 24 Horas;",
                                "Panel De Control Web Personalizado:",
                                "Análisis De Crecimiento En Tiempo Real;",
                                "Ventajas Adicionales De La Segmentación Por IA;",
                                "Acceso A Un Gestor Personal Para Tu Cuenta;",
                                "I.A.; Formación.",
                                "Desarrollado Por GPT-4o"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-white/90 text-sm">{item.replace("GPT-4o", "")} {item.includes("GPT-4o") && <span className="bg-slate-900/20 px-2 py-0.5 rounded text-xs font-bold">GPT-4o</span>}</span>
                                </div>
                            ))}
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
        </div>
        </section >
    )
}
