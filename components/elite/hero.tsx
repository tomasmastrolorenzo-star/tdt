"use client";


import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion" // Reduced imports
import { useI18n } from "@/lib/i18n/context"
// Removed lucide-react icons that are no longer needed, added Activity/BarChart if needed for visual
import { Activity, BarChart3, ShieldCheck, Zap } from "lucide-react"

import LanguageSelector from "@/components/trend-up/language-selector"

export default function Hero() {
    const { t } = useI18n()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const scrollToAnalyzer = () => {
        const section = document.getElementById('analyzer-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Animation variants for the console visual
    const barVariants = {
        initial: { width: "0%" },
        animate: (custom: number) => ({
            width: `${custom}%`,
            transition: { duration: 1.5, ease: "easeOut", delay: 0.5 }
        })
    }

    return (
        <section className="relative min-h-screen flex flex-col bg-[#050505] text-white overflow-hidden">
            <LanguageSelector />

            {/* 1. HEADER: Minimal, Logo Only */}
            <header className="w-full py-6 px-6 md:px-12 flex items-center justify-start z-50 absolute top-0 left-0 bg-transparent">
                <img src="/assets/tdt-logo-gold.png" alt="Trend Digital Trade" className="h-10 md:h-14 object-contain drop-shadow-[0_0_10px_rgba(197,160,89,0.2)]" />
            </header>

            {/* Actual implementation using Grid for precise placement */}
            <div className="flex-1 container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center pt-24 pb-12 relative z-10">

                {/* COL 1: TEXT PARTS */}
                <div className="flex flex-col space-y-6 md:space-y-8 justify-center">

                    {/* H1 */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] tracking-tight text-white md:max-w-2xl"
                    >
                        {t.hero.title}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-sm md:text-lg font-sans text-white/60 leading-relaxed md:max-w-xl"
                    >
                        {t.hero.subtitle}
                    </motion.p>

                    {/* MICRO-COPY (Diff) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className=""
                    >
                        <p className="text-xs md:text-sm font-mono text-[#C5A059] uppercase tracking-wider mb-2">
                            — {t.hero.microCopy}
                        </p>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col items-start gap-4"
                    >
                        <button
                            onClick={scrollToAnalyzer}
                            className="bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-black px-8 py-4 text-xs md:text-sm font-bold tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] transition-all duration-300 w-full md:w-auto rounded-sm"
                        >
                            {t.hero.cta}
                        </button>
                        <span className="text-[10px] text-white/40 font-sans tracking-wide">
                            {t.hero.ctaSub}
                        </span>
                    </motion.div>
                </div>

                {/* COL 2: VISUAL */}
                <motion.div
                    className="w-full flex justify-center md:justify-end"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {/* DASHBOARD MOCKUP */}
                    <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-lg p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                        {/* Header of Mockup */}
                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                            </div>
                            <div className="text-[10px] font-mono text-white/30 uppercase">
                                {t.hero.visual?.systemStatus || "SYSTEM_READY"}
                            </div>
                        </div>

                        {/* Profile Placeholder */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <span className="text-white/20 text-xs">IMG</span>
                            </div>
                            <div className="space-y-1.5 w-full">
                                <div className="h-2 w-24 bg-white/10 rounded animate-pulse" />
                                <div className="h-1.5 w-16 bg-white/5 rounded" />
                            </div>
                        </div>

                        {/* Analysis Bars */}
                        <div className="space-y-5">
                            {/* Visibility */}
                            <div>
                                <div className="flex justify-between text-[10px] uppercase tracking-wider text-white/50 mb-1.5">
                                    <span>{t.hero.visual?.visibility}</span>
                                    <span className="text-[#C5A059]">68%</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-white/20"
                                        variants={barVariants as any}
                                        custom={68}
                                        initial="initial"
                                        animate="animate"
                                    />
                                </div>
                            </div>

                            {/* Reach */}
                            <div>
                                <div className="flex justify-between text-[10px] uppercase tracking-wider text-white/50 mb-1.5">
                                    <span>{t.hero.visual?.reach}</span>
                                    <span className="text-[#C5A059]">74%</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-white/20 to-[#C5A059]/50"
                                        variants={barVariants as any}
                                        custom={74}
                                        initial="initial"
                                        animate="animate"
                                    />
                                </div>
                            </div>

                            {/* Performance */}
                            <div>
                                <div className="flex justify-between text-[10px] uppercase tracking-wider text-white/50 mb-1.5">
                                    <span>{t.hero.visual?.performance}</span>
                                    <span className="text-[#C5A059]">42%</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-white/20"
                                        variants={barVariants as any}
                                        custom={42}
                                        initial="initial"
                                        animate="animate"
                                    />
                                </div>
                            </div>

                            {/* Optimization */}
                            <div>
                                <div className="flex justify-between text-[10px] uppercase tracking-wider text-white/50 mb-1.5">
                                    <span>{t.hero.visual?.optimization}</span>
                                    <div className="flex items-center gap-1 text-[#C5A059]">
                                        <Activity className="w-3 h-3" />
                                        <span>LOW</span>
                                    </div>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-red-500/40"
                                        variants={barVariants as any}
                                        custom={30}
                                        initial="initial"
                                        animate="animate"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terminal Footer */}
                        <div className="mt-8 pt-4 border-t border-white/5 font-mono text-[9px] text-[#C5A059]/70 leading-relaxed">
                            &gt; {t.hero.visual?.analyzing || "INITIALIZING_SCAN..."}<span className="animate-pulse">_</span>
                        </div>

                        {/* Glass Overlay Check */}
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <ShieldCheck className="w-12 h-12 text-[#C5A059]" />
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* Bottom Fade for smooth transition */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />

        </section>
    );
}
