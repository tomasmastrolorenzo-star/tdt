"use client";

import { motion } from "framer-motion";

export default function Trust() {
    return (
        <section className="py-20 bg-[#050505] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header: Results Monitor */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#007AFF] animate-pulse" />
                            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#007AFF]">
                                Monitor de Resultados
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif text-white max-w-3xl leading-tight">
                            538 Perfiles Posicionados con <br className="hidden md:block" />
                            <span className="italic text-white/50">Éxito Algorítmico.</span>
                            <motion.img
                                src="/assets/heart-3d.png"
                                alt="Heart"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-12 h-12 inline-block ml-4 align-middle object-contain"
                            />
                        </h2>
                        <p className="text-white/40 max-w-2xl text-sm leading-relaxed font-light">
                            Casos verificados donde nuestra IA detectó el comportamiento del algoritmo y forzó el posicionamiento hacia el nivel más alto de engagement.
                        </p>
                    </div>
                </div>

                {/* Grid of Logos (Minimalist/Dark) */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Logos would go here, keeping placeholders for now */}
                    {['Forbes', 'Bloomberg', 'Reuters', 'Meta', 'TikTok', 'Google'].map((brand, i) => (
                        <div key={i} className="flex items-center justify-center text-xl font-serif text-white/50 hover:text-white transition-colors cursor-default">
                            {brand}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
