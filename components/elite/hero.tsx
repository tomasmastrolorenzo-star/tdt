"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {

    const scrollToAnalyzer = () => {
        const section = document.getElementById('analyzer-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center bg-[#050505] text-white overflow-hidden px-6 border-b border-white/5 pt-20">

            {/* Background Texture (Deep Office / Noise) */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#007AFF] opacity-[0.05] blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-white opacity-[0.02] blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto text-center space-y-12 flex flex-col items-center">

                {/* Badge: Official Verification Partner */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
                >
                    <img src="/assets/meta-3d.png" alt="Meta Protocol" className="w-5 h-5 object-contain" />
                    <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/80">
                        Official Verification Partner
                    </span>
                </motion.div>

                {/* Headline: Tech (Sans) vs Subhead: Elegance (Serif) */}
                <div className="space-y-8">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold tracking-[-0.05em] leading-[1.0] max-w-5xl mx-auto">
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
                        className="text-xl md:text-3xl font-serif font-light italic text-[#007AFF] max-w-4xl mx-auto leading-relaxed"
                    >
                        "Posicionamiento de alto impacto. Impulsamos su perfil, aumento y escalabilidad totalmente personalizado; detectamos el comportamiento del algoritmo para llevar su perfil al nivel más alto de engagement."
                    </motion.p>
                </div>

                {/* Primary Button with Micro-Shine */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="pt-8"
                >
                    <button
                        onClick={scrollToAnalyzer}
                        className="group relative px-10 py-5 bg-white text-black text-xs md:text-sm font-bold tracking-[0.2em] uppercase overflow-hidden hover:bg-[#E6E8EB] transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
                    >
                        {/* Shine Effect */}
                        <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "linear", delay: 1 }}
                            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-20deg] z-20 pointer-events-none"
                        />

                        <span className="relative z-10 flex items-center gap-3">
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
