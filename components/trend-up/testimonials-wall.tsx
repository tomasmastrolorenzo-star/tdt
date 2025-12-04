"use client"

import { Star } from "lucide-react"

interface Testimonial {
    name: string
    initials: string
    rating: number
    text: string
    service: string
}

export default function TestimonialsWall() {
    const testimonials: Testimonial[] = [
        {
            name: "María G.",
            initials: "MG",
            rating: 5,
            text: "Increíble servicio! Pasé de 500 a 15,000 seguidores en 3 meses. Todo orgánico y real.",
            service: "Turbo AI Plan"
        },
        {
            name: "Paul Fischer",
            initials: "PF",
            rating: 5,
            text: "Best investment for my business. The AI targeting is incredibly accurate.",
            service: "Premium Plan"
        },
        {
            name: "Cassandra Morales",
            initials: "CM",
            rating: 5,
            text: "Los resultados superaron mis expectativas. Mi engagement subió 300% en el primer mes.",
            service: "Turbo AI Plan"
        },
        {
            name: "Mikey O'Connelly",
            initials: "MO",
            rating: 5,
            text: "Finally a service that actually works! No bots, no fake followers. Just real growth.",
            service: "Standard Plan"
        },
        {
            name: "Linda Morales",
            initials: "LM",
            rating: 5,
            text: "El dashboard es súper fácil de usar y el soporte responde al instante. 100% recomendado.",
            service: "Turbo AI Plan"
        },
        {
            name: "Jason Everett",
            initials: "JE",
            rating: 5,
            text: "I was skeptical at first, but the results speak for themselves. Worth every penny!",
            service: "Premium Plan"
        },
        {
            name: "Carlos M.",
            initials: "CM",
            rating: 5,
            text: "Probé otros servicios antes y ninguno funcionó. Con TDT vi resultados en 48 horas.",
            service: "Standard Plan"
        },
        {
            name: "Zarah Marcelo",
            initials: "ZM",
            rating: 5,
            text: "The AI targeting found my exact audience. My conversion rate doubled!",
            service: "Turbo AI Plan"
        },
        {
            name: "Ashley",
            initials: "A",
            rating: 5,
            text: "Excelente relación calidad-precio. El gestor personal del plan Turbo es un plus enorme.",
            service: "Turbo AI Plan"
        },
        {
            name: "Thania Burciaga",
            initials: "TB",
            rating: 5,
            text: "Mi cuenta creció de forma constante y natural. Ahora tengo colaboraciones con marcas!",
            service: "Premium Plan"
        },
        {
            name: "Scott Mays",
            initials: "SM",
            rating: 5,
            text: "Clean, professional service. No shady tactics. Just solid, organic growth.",
            service: "Standard Plan"
        },
        {
            name: "Thania Rosa",
            initials: "TR",
            rating: 5,
            text: "La formación en IA que incluye el plan Turbo me ayudó a optimizar todo mi contenido.",
            service: "Turbo AI Plan"
        }
    ]

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Nuestros clientes han obtenido resultados positivos
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Más de 80,000 Instagrammers, agencias y empresas confían en nosotros para hacer crecer sus cuentas de Instagram de forma orgánica y segura.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                                    {testimonial.initials}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                                    <div className="flex gap-0.5">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Review Text */}
                            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                "{testimonial.text}"
                            </p>

                            {/* Service Badge */}
                            <div className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                                {testimonial.service}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="text-4xl font-black text-orange-500 mb-2">80K+</div>
                        <div className="text-sm text-slate-600">Clientes Activos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-orange-500 mb-2">4.9/5</div>
                        <div className="text-sm text-slate-600">Rating Promedio</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-orange-500 mb-2">100%</div>
                        <div className="text-sm text-slate-600">Seguro y Orgánico</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-orange-500 mb-2">24/7</div>
                        <div className="text-sm text-slate-600">Soporte Premium</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
