"use client";

import { useEffect } from "react";
import { ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const scrollToAnalyzer = () => {
        const section = document.getElementById('analyzer-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center bg-[#050505] text-white overflow-hidden px-6 border-b border-white/5 pt-24 md:pt-32">

            {/* Header: Logo & Badge */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute top-0 w-full py-6 md:py-8 flex flex-col items-center gap-3 z-50"
            >
                <img src="/assets/tdt-logo-gold.png" alt="Trend Digital Trade" className="h-10 md:h-14 object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]" />
                <span className="text-[9px] md:text-[10px] font-mono text-[#C5A059] tracking-[0.3em] uppercase opacity-80">
                    Elite Authority Protocol
                </span>
            </motion.header>

            {/* Background Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#C5A059] opacity-[0.05] blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-white opacity-[0.02] blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto text-center space-y-10 flex flex-col items-center mt-8">

                {/* Badge: System Status */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
                        <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                        <span className="text-[9px] font-mono text-white/50 tracking-widest uppercase">
                            System v4.0 Online
                        </span>
                    </div>
                </motion.div>

                {/* Headline: Elegant Serif */}
                <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight leading-[1.0] max-w-5xl mx-auto">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="block text-white"
                        >
                            Ingeniería de
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E5D57B] to-[#C5A059] drop-shadow-[0_0_30px_rgba(197,160,89,0.2)]"
                        >
                            Estatus Digital
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="text-sm md:text-base font-sans font-light text-white/60 max-w-2xl mx-auto leading-relaxed tracking-wide"
                    >
                        Transformamos perfiles pasivos en activos de autoridad global. Sin contraseñas. Sin bots. Solo posicionamiento algorítmico de élite.
                    </motion.p>
                </div>

                {/* Primary Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="pt-2 w-full max-w-xs flex flex-col items-center gap-4"
                >
                    <button
                        onClick={scrollToAnalyzer}
                        className="w-full bg-gradient-to-br from-[#D4AF37] to-[#B38F2D] text-black h-14 text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(197,160,89,0.5)] hover:shadow-[0_0_40px_rgba(197,160,89,0.7)] transition-all duration-500 relative overflow-hidden group rounded-sm"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            INICIAR Auditoría Gratuita
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>

                    <div className="flex items-center space-x-2 text-[10px] text-white/30 font-mono uppercase tracking-widest">
                        <Lock className="w-3 h-3" />
                        <span>100% Secure Analysis</span>
                    </div>
                </motion.div>

            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20" />

        </section>
    );
}
