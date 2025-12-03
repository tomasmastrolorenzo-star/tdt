"use client"

import { Check, X } from "lucide-react"

export default function ComparisonSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold mb-6">
                        ¿Cómo funciona?
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                        Cómo <span className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-lg text-2xl"><span className="text-orange-500">🔥</span> Trend Up</span> puede
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        impulsar tu promoción en Instagram
                    </h3>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Te ayudamos a hacer crecer tu cuenta IG para que puedas centrarte en crear grandes contenidos 🧡
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* With Trend Up */}
                    <div className="border-4 border-orange-500 rounded-[2.5rem] overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform">
                        <div className="h-64 bg-slate-200 relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                                alt="Growth Success"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                                <p className="text-white font-bold text-lg">Crecimiento Exponencial 🚀</p>
                            </div>
                        </div>
                        <div className="p-8 bg-white">
                            <h3 className="text-2xl font-bold text-orange-600 mb-8">Usted con Trend Up</h3>
                            <ul className="space-y-6">
                                {[
                                    "Amplías tu presencia de marca",
                                    "Encuentras clientes objetivo que interactúan con tu marca",
                                    "Orientación AI para tu nicho y contenido específicos",
                                    "Un crecimiento orgánico duradero",
                                    "Tienes acceso a nuestro equipo de atención al cliente las 24 horas del día, los 7 días de la semana"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <span className="text-slate-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Without Trend Up */}
                    <div className="border border-slate-200 rounded-[2.5rem] overflow-hidden bg-slate-50 hover:shadow-lg transition-shadow">
                        <div className="h-64 bg-slate-200 relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2370&auto=format&fit=crop"
                                alt="Struggle"
                                className="w-full h-full object-cover grayscale"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                                <p className="text-white font-bold text-lg">Estancamiento y Frustración 📉</p>
                            </div>
                        </div>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8">Usted sin Trend Up</h3>
                            <ul className="space-y-6">
                                {[
                                    "Dificultades con el conocimiento de la marca",
                                    "Menos ventas y conversiones",
                                    "Menos tiempo para crear nuevos contenidos",
                                    "Dificultades para destacar entre el resto de creadores",
                                    "Cuestionas tu estrategia"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                            <X className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <span className="text-slate-600 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
