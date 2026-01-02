"use client";

import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {

    const scrollToAnalyzer = () => {
        const section = document.getElementById('analyzer-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-[95vh] flex flex-col pt-32 md:pt-48 items-center bg-[#050505] text-white overflow-hidden px-6 border-b border-white/5">

            {/* Background Texture (Deep Office / Noise) */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#007AFF] opacity-[0.05] blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-white opacity-[0.02] blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12 flex flex-col items-center">

                {/* Badge: Official Verification Partner */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
                >
                    <svg className="w-5 h-5 text-[#007AFF]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" opacity="0" />
                        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                    </svg>
                    <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/80">
                        Official Verification Partner
                    </span>
                </motion.div>

                {/* Headline: Vogue/Serif Style */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight leading-[1.05] max-w-4xl">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="block"
                    >
                        La Autoridad no se pide,
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="italic font-light text-[#007AFF] block"
                    >
                        se construye.
                    </motion.span>
                </h1>

                {/* Subheadline: Sans Clean */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed"
                >
                    Transformamos su trayectoria profesional en un activo digital verificado.
                    Posicionamiento de élite y curaduría de imagen para líderes de industria en menos de 30 días.
                </motion.p>

                {/* Primary Button with Micro-Shine */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6"
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
                            Iniciar Auditoría Forense
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                    <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">
                        Solo 5 cupos mensuales
                    </span>
                </motion.div>

            </div>

            {/* Visual: Abstract Phone with Glowing Blue Check */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1.2 }}
                className="relative mt-24 w-full max-w-[300px] md:max-w-[400px] aspect-[9/16] bg-[#0A0A0A] border-[8px] border-[#1A1A1A] rounded-[3rem] shadow-2xl mx-auto overflow-hidden hover:scale-[1.02] transition-transform cursor-default select-none"
            >
                {/* Screen Content */}
                <div className="relative h-full w-full bg-[#000] flex flex-col p-6">

                    {/* Status Bar */}
                    <div className="flex justify-between items-center text-[10px] text-white/50 mb-8">
                        <span>9:41</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 bg-white/20 rounded-sm" />
                            <div className="w-3 h-3 bg-white/20 rounded-sm" />
                        </div>
                    </div>

                    {/* Profile Header */}
                    <div className="flex flex-col items-center space-y-4 mb-8">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#111] to-[#222] border-2 border-[#007AFF] flex items-center justify-center relative shadow-[0_0_30px_rgba(0,122,255,0.2)]">
                            <span className="text-4xl">👑</span>
                            {/* Blue Check Badge */}
                            <div className="absolute bottom-1 right-1 bg-[#007AFF] text-white rounded-full p-1.5 border-4 border-black shadow-lg">
                                <Check className="w-3 h-3" strokeWidth={4} />
                            </div>
                        </div>
                        {/* Name & Bio */}
                        <div className="text-center space-y-1">
                            <div className="h-4 w-32 bg-white/10 rounded mx-auto" />
                            <div className="h-3 w-48 bg-white/5 rounded mx-auto" />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between px-4 border-y border-white/5 py-4 mb-8">
                        <div className="text-center space-y-1">
                            <div className="h-4 w-8 bg-white/10 rounded mx-auto" />
                            <div className="h-2 w-12 bg-white/5 rounded mx-auto" />
                        </div>
                        <div className="text-center space-y-1">
                            <div className="h-4 w-8 bg-white/10 rounded mx-auto" />
                            <div className="h-2 w-12 bg-white/5 rounded mx-auto" />
                        </div>
                        <div className="text-center space-y-1">
                            <div className="h-4 w-8 bg-white/10 rounded mx-auto" />
                            <div className="h-2 w-12 bg-white/5 rounded mx-auto" />
                        </div>
                    </div>

                    {/* Image Grid (Abstract) */}
                    <div className="grid grid-cols-3 gap-0.5 opacity-50">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                            <div key={i} className="aspect-square bg-white/5 hover:bg-white/10 transition-colors" />
                        ))}
                    </div>

                    {/* Reflection/Glare */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
                </div>
            </motion.div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20" />

        </section>
    );
}
