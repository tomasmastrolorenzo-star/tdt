"use client"

import { Star } from "lucide-react"

export default function TestimonialsSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold mb-6">
                        Los clientes nos adoran
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        A los clientes les encanta nuestra <br />
                        herramienta de crecimiento en <br />
                        redes sociales.
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Descubre por qué los influencers y las marcas confían en Crowd Ignite con su crecimiento y éxito en las redes sociales
                    </p>
                </div>

                <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                            <img src="https://i.pravatar.cc/150?img=33" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-slate-900">@foodi_escircle44</div>
                    </div>

                    <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ))}
                    </div>

                    <h3 className="font-bold text-xl text-slate-900 mb-4">
                        Sin duda, mi servicio de crecimiento de IG favorito
                    </h3>

                    <p className="text-slate-600 leading-relaxed">
                        Crowd Ignite es imprescindible si te gusta la gastronomía y quieres ampliar tu alcance en Instagram. He probado varias plataformas, pero Crowd Ignite's La innovadora tecnología me ha ayudado a duplicar mi número de seguidores en semanas. Ha sido una forma estupenda...
                    </p>
                </div>
            </div>
        </section>
    )
}
