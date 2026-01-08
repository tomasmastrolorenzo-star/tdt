"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {

    const scrollToAnalyzer = () => {
        const section = document.getElementById('analyzer-section');
        // If the element exists, scroll to it
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center bg-[#050505] text-white overflow-hidden px-6 border-b border-white/5 pt-20">

            {/* Background Texture (Deep Office / Noise) */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#C5A059] opacity-[0.05] blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-white opacity-[0.02] blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto text-center space-y-12 flex flex-col items-center">

                {/* Badge: Institutional Authority Protocol */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-1000">
                        <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                        <span className="text-[10px] font-mono text-[#C5A059] tracking-[0.2em] uppercase font-medium">
                            ELITE AUTHORITY PROTOCOL
                        </span>
                    </div>
                </motion.div>

                {/* Headline: Tech (Sans) vs Subhead: Elegance (Serif) */}
                <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-semibold tracking-[-0.05em] leading-[1.0] max-w-5xl mx-auto">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="block"
                        >
                            La Nueva Era del Crecimiento.
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="block text-white/40"
                        >
                            Detección Algorítmica con IA.
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="text-base md:text-lg font-sans font-light text-[#C5A059] max-w-3xl mx-auto leading-relaxed tracking-wide"
                    >
                        Posicionamiento de alto impacto. Impulsamos su perfil, aumento y escalabilidad totalmente personalizado; detectamos el comportamiento del algoritmo para llevar su perfil al nivel más alto de engagement.
                    </motion.p>
                </div>

                {/* Primary Button with Micro-Shine */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="pt-4 w-full max-w-xs"
                >
                    <button
                        onClick={scrollToAnalyzer}
                        className="w-full bg-[#D4AF37] text-white h-14 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#F2C94C] transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] relative overflow-hidden group rounded-sm"
                    >
                        {/* Shine Effect */}
                        <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 1 }}
                            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-20deg] z-20 pointer-events-none"
                        />

                        <span className="relative z-10 flex items-center justify-center gap-3">
                            INICIAR análisis gratis
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </motion.div>

            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20" />

        </section>
    );
}
