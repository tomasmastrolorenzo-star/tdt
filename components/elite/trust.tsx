"use client";

import { motion } from "framer-motion";

export default function Trust() {
    return (
        <section className="py-20 bg-[#050505] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 overflow-hidden">

                {/* Header: Results Monitor (Centered) */}
                <div className="flex flex-col items-center justify-center text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A059]">
                            Monitor de Resultados
                        </span>
                    </div>

                    <p className="text-4xl md:text-5xl font-serif text-white mb-6 drop-shadow-xl shadow-gold/20">
                        <span className="text-[#C5A059] font-bold" style={{ textShadow: '0 0 20px rgba(197,160,89,0.3)' }}>538</span> Perfiles Posicionados
                    </p>
                    <p className="text-white/60 font-sans font-light max-w-lg mx-auto leading-relaxed text-sm tracking-wide">
                        La red de autoridad más exclusiva. Operando bajo estrictos protocolos de confidencialidad para líderes globales.
                    </p>
                </div>

                {/* Infinite Marquee of Logos */}
                <div className="relative w-full overflow-hidden mask-gradient-x py-8">
                    {/* Inner Track */}
                    <div className="flex w-[200%] animate-marquee hover:[animation-play-state:paused] items-center">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex justify-around items-center w-1/2 px-10 gap-16 md:gap-24">
                                {[
                                    { name: "Forbes", type: "text", font: "font-serif" },
                                    { name: "Bloomberg", type: "text", font: "font-sans font-bold tracking-tight" },
                                    { name: "Meta", type: "image", src: "/assets/meta-logo.png" },
                                    { name: "Google", type: "text", font: "font-sans font-bold" },
                                    { name: "TikTok", type: "text", font: "font-sans font-extrabold tracking-tighter" },
                                    { name: "Instagram", type: "image", src: "/assets/ig-logo.png" },
                                    { name: "Reuters", type: "text", font: "font-serif tracking-widest" },
                                ].map((logo, idx) => (
                                    <div key={idx} className="relative group flex-shrink-0 grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-500 cursor-default">
                                        {logo.type === 'image' ? (
                                            <img src={logo.src} alt={logo.name} className="h-8 md:h-10 object-contain" />
                                        ) : (
                                            <span className={`text-2xl md:text-3xl text-white ${logo.font}`}>
                                                {logo.name}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    {/* Gradient Fade Edges */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
                </div>

            </div>
        </section>
    );
}
