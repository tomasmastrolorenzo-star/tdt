"use client";

import React from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

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
        <section className="py-24 bg-black border-t border-white/5 overflow-hidden relative group/section">
            {/* Header */}
            <div className="text-center mb-20 relative z-10 px-6">
                <h3 className="text-2xl md:text-3xl font-serif text-white tracking-widest uppercase mb-4">
                    Voces de Autoridad
                </h3>
                <div className="w-12 h-[1px] bg-[#C5A059] mx-auto opacity-50"></div>
            </div>

            {/* Fade Edges */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

            {/* Infinite Marquee */}
            <div className="relative flex w-full overflow-hidden group/track">

                {/* Visual Navigation Arrows (Minimalist Gold) */}
                <button className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full border border-[#C5A059]/30 bg-black/50 backdrop-blur-sm text-[#C5A059] opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-[#C5A059] hover:text-black">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full border border-[#C5A059]/30 bg-black/50 backdrop-blur-sm text-[#C5A059] opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-[#C5A059] hover:text-black">
                    <ChevronRight className="w-6 h-6" />
                </button>

                <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap will-change-transform" style={{ animationDuration: '120s' }}>
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((item, i) => (
                        <div key={i} className="mx-4 md:mx-6 w-[350px] md:w-[450px] flex-shrink-0 bg-white/[0.02] backdrop-blur-md border border-[#C5A059]/20 p-8 md:p-10 rounded-sm hover:border-[#C5A059]/60 hover:shadow-[0_0_30px_rgba(197,160,89,0.1)] transition-all duration-500 group cursor-default">

                            {/* Quote */}
                            <p className="text-white/80 font-serif text-[15px] md:text-lg leading-loose mb-8 whitespace-normal opacity-80 group-hover:opacity-100 transition-opacity">
                                "{item.quote}"
                            </p>

                            {/* Identity Footer */}
                            <div className="flex items-center gap-4 border-t border-[#C5A059]/10 pt-6 mt-auto">
                                {/* Avatar Placeholder */}
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] font-serif font-bold text-sm shadow-[0_0_10px_rgba(197,160,89,0.1)]">
                                    {item.name.charAt(0)}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-white font-sans text-xs font-bold uppercase tracking-widest group-hover:text-[#C5A059] transition-colors">
                                            {item.name}
                                        </p>
                                        <CheckCircle2 className="w-3 h-3 text-[#C5A059]" />
                                    </div>
                                    <p className="text-white/30 font-mono text-[10px] uppercase tracking-wider">
                                        {item.location} | {item.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
