"use client"

import { Camera, Utensils, Palette, Plane, Music, Dumbbell, Briefcase, Film, Home, Car, Cpu, Smile } from "lucide-react"

export default function NicheSelector() {
    const niches = [
        { name: "Fotografía", icon: Camera },
        { name: "Comida", icon: Utensils, active: true },
        { name: "Belleza", icon: Smile },
        { name: "Arte", icon: Palette },
        { name: "Viajes", icon: Plane },
        { name: "Mascotas", icon: Smile },
        { name: "Juegos", icon: Cpu },
        { name: "Moda", icon: Briefcase },
        { name: "Música", icon: Music },
        { name: "Deportes", icon: Dumbbell },
        { name: "Fitness", icon: Dumbbell },
        { name: "Memes/humor", icon: Smile },
        { name: "Trabajo", icon: Briefcase },
        { name: "Cine/TV", icon: Film },
        { name: "Bienestar", icon: Smile },
        { name: "Decoración", icon: Home },
        { name: "Coches", icon: Car },
        { name: "Tecnología", icon: Cpu },
    ]

    return (
        <section className="py-20 bg-slate-950">
            <div className="container mx-auto px-4 text-center">
                <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold mb-6">
                    Los números nunca mienten
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">
                    Cada cuenta es un <span className="text-yellow-400">buen partido</span> 😉.
                </h2>

                <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                    {niches.map((niche, index) => (
                        <button
                            key={index}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105 ${niche.active
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                                    : "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800"
                                }`}
                        >
                            <niche.icon className="w-4 h-4" />
                            {niche.name}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}
