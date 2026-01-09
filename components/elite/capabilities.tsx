"use client";

import { useI18n } from "@/lib/i18n/context";
import { BrainCircuit, Globe, Users, Target, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function Capabilities() {
    const { t } = useI18n();

    const capabilities = [
        {
            key: "segmentation",
            icon: BrainCircuit,
            title: t.capabilities?.blocks?.segmentation?.title || "Segmentación Algorítmica",
            desc: t.capabilities?.blocks?.segmentation?.desc || "El sistema identifica patrones geográficos y culturales relevantes para su perfil."
        },
        {
            key: "coherence",
            icon: Globe,
            title: t.capabilities?.blocks?.coherence?.title || "Coherencia Lingüística",
            desc: t.capabilities?.blocks?.coherence?.desc || "La interacción se alinea con el idioma y contexto real de su audiencia objetivo."
        },
        {
            key: "demographics",
            icon: Users,
            title: t.capabilities?.blocks?.demographics?.title || "Contexto Demográfico",
            desc: t.capabilities?.blocks?.demographics?.desc || "Los perfiles se optimizan según edad, intereses y comportamiento de consumo de contenido."
        },
        {
            key: "affinity",
            icon: Target,
            title: t.capabilities?.blocks?.affinity?.title || "Afinidad por Nicho",
            desc: t.capabilities?.blocks?.affinity?.desc || "La autoridad se construye conectando con audiencias alineadas a su temática."
        },
        {
            key: "supervision",
            icon: Activity,
            title: t.capabilities?.blocks?.supervision?.title || "Supervisión Estratégica",
            desc: t.capabilities?.blocks?.supervision?.desc || "Cada proceso opera bajo criterios de control y validación estratégica."
        }
    ];

    return (
        <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-20 max-w-4xl mx-auto space-y-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-serif text-white leading-tight"
                    >
                        {t.capabilities?.title || "Un sistema diseñado para analizar, optimizar y escalar perfiles digitales."}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 font-sans text-lg max-w-3xl mx-auto font-light leading-relaxed"
                    >
                        {t.capabilities?.subtext || "Trend Digital Trade combina inteligencia artificial, automação controlada e supervisão estratégica para melhorar o desempenho de perfis digitais."}
                    </motion.p>
                </div>

                {/* Capabilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {capabilities.map((cap, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-6 rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#C5A059]/30 transition-all duration-500"
                        >
                            <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5 group-hover:border-[#C5A059]/30">
                                <cap.icon className="w-6 h-6 text-white/50 group-hover:text-[#C5A059] transition-colors" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-serif text-white mb-3 group-hover:text-[#C5A059] transition-colors">
                                {cap.title}
                            </h3>
                            <p className="text-white/50 text-xs font-sans leading-relaxed">
                                {cap.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
