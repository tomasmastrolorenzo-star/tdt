"use client";

import React from 'react';

const TESTIMONIALS = [
    {
        quote: "El diagnóstico forense detectó puntos de fricción técnica que mi agencia ignoraba. Logramos recuperar el estatus institucional.",
        name: "Dr. Lucas M.",
        location: "Miami, USA",
        role: "Medical Specialist"
    },
    {
        quote: "En mi sector, la percepción lo es todo. Trend Digital Trade no solo validó mi cuenta, rediseñó mi proyección de autoridad global.",
        name: "Sarah J.",
        location: "London, UK",
        role: "International Real Estate"
    },
    {
        quote: "Pasé años estancado en métricas vanidad. El protocolo de reestructuración desbloqueó mi alcance orgánico en cuestión de semanas.",
        name: "Marcus T.",
        location: "Dubai, UAE",
        role: "FinTech Founder"
    },
    {
        quote: "La privacidad del proceso fue impecable. Un servicio de inteligencia digital real, sin comprometer mis credenciales ni un segundo.",
        name: "Elena R.",
        location: "Madrid, ES",
        role: "Legal Consultant"
    },
    {
        quote: "La diferencia entre ser un experto y ser una autoridad es este protocolo. Mi conversión de high-ticket se duplicó tras la verificación.",
        name: "David K.",
        location: "New York, USA",
        role: "Wealth Manager"
    }
];

export const Testimonials = () => {
    return (
        <section className="py-24 bg-black border-t border-white/5 overflow-hidden relative">
            {/* Header */}
            <div className="text-center mb-16 relative z-10 px-6">
                <h3 className="text-2xl md:text-3xl font-serif text-white tracking-widest uppercase mb-2">
                    Voces de Autoridad
                </h3>
                <div className="w-12 h-[1px] bg-[#C5A059] mx-auto opacity-50"></div>
            </div>

            {/* Fade Edges */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            {/* Infinite Marquee */}
            <div className="relative flex w-full">
                <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((item, i) => (
                        <div key={i} className="mx-4 md:mx-6 w-[350px] md:w-[450px] flex-shrink-0 bg-black border border-[#C5A059]/30 p-8 md:p-10 rounded-sm hover:border-[#C5A059] transition-colors group">
                            <p className="text-white/80 font-serif italic text-sm md:text-lg leading-relaxed mb-6 whitespace-normal opacity-90 group-hover:opacity-100 transition-opacity">
                                "{item.quote}"
                            </p>
                            <div className="border-t border-[#C5A059]/10 pt-4 mt-auto">
                                <p className="text-[#C5A059] font-sans text-xs font-bold uppercase tracking-widest mb-1">
                                    {item.name}
                                </p>
                                <p className="text-white/40 font-mono text-[10px] uppercase tracking-wider">
                                    {item.location} | {item.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
