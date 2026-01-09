"use client";

import { useI18n } from "@/lib/i18n/context";
import { Database, Bot, ShieldCheck, Lock, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Trust() {
    const { t } = useI18n();

    // Icons mapping
    const features = [
        { icon: Database, label: t.authority?.badges?.dataDriven || "Data-driven" },
        { icon: Bot, label: t.authority?.badges?.aiAssisted || "AI-assisted" },
        { icon: ShieldCheck, label: t.authority?.badges?.algorithmSafe || "Algorithm-safe" },
        { icon: Lock, label: t.authority?.badges?.privacyFirst || "Privacy-first" },
        { icon: EyeOff, label: t.authority?.badges?.nonInvasive || "Non-invasive" },
    ];

    return (
        <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">

                {/* 1. Titular Centrado */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-white mb-6 tracking-tight leading-snug"
                >
                    {t.authority?.title || "Operamos bajo estándares utilizados por equipos digitales de alto nivel"}
                </motion.h2>

                {/* 2. Subtexto */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-sm md:text-base font-sans text-white/50 mb-16 max-w-2xl mx-auto leading-relaxed"
                >
                    {t.authority?.subtext || "Nuestros sistemas de análisis y optimización siguen criterios técnicos aplicados en entornos corporativos, agencias y marcas con alta exposición digital."}
                </motion.p>

                {/* 3. Bloque Visual - Grid Horizontal */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-16 items-center justify-center">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
                            className="flex flex-col items-center gap-3 group"
                        >
                            <div className="p-3 rounded-full bg-white/5 border border-white/5 group-hover:border-[#C5A059]/30 transition-colors duration-300">
                                <feature.icon className="w-5 h-5 text-white/70 group-hover:text-[#C5A059] transition-colors duration-300" strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors duration-300">
                                {feature.label}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* 4. Frase Final */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="relative inline-block"
                >
                    <span className="text-xs md:text-sm font-serif italic text-[#C5A059] opacity-80">
                        "{t.authority?.finalPhrase || "La autoridad digital no se construye con volumen, sino con criterio."}"
                    </span>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />
                </motion.div>

            </div>

            {/* Background Texture Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-[#C5A059] opacity-[0.03] blur-[100px] rounded-full" />
                <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-white opacity-[0.02] blur-[100px] rounded-full" />
            </div>

        </section>
    );
}
