"use client";

import { useI18n } from "@/lib/i18n/context";
import { Activity, ShieldCheck, Lock } from "lucide-react";

export default function Protocol() {
    const { t } = useI18n();

    const phases = [
        {
            title: t.protocol?.phases?.phase1?.title || "Auditoría",
            desc: t.protocol?.phases?.phase1?.desc || "Análisis técnico de la estructura actual del perfil y detección de limitaciones.",
            icon: <Activity className="w-8 h-8 text-[#C5A059]" />,
            asset: null
        },
        {
            title: t.protocol?.phases?.phase2?.title || "Reestructuración",
            desc: t.protocol?.phases?.phase2?.desc || "Optimización de la base de seguidores y eliminación de fricción algorítmica.",
            icon: null,
            asset: "/assets/insta-3d-glossy.png"
        },
        {
            title: t.protocol?.phases?.phase3?.title || "Escalado",
            desc: t.protocol?.phases?.phase3?.desc || "Activación progresiva de interacciones para aumentar la relevancia del perfil.",
            icon: null,
            asset: "/assets/heart-dynamic.png"
        },
        {
            title: t.protocol?.phases?.phase4?.title || "Blindaje",
            desc: t.protocol?.phases?.phase4?.desc || "Monitoreo continuo para asegurar la estabilidad y seguridad de la cuenta.",
            icon: <ShieldCheck className="w-8 h-8 text-[#C5A059]" />,
            asset: null
        },
    ];

    return (
        <section className="py-24 bg-[#050505] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Section 2: The Solution (Protocol) */}
                <div className="relative">

                    {/* Header */}
                    <div className="text-center mb-20">
                        <h3 className="text-3xl font-serif text-white tracking-wide">
                            {t.protocol?.header || "El Protocolo de Autoridad"}
                        </h3>
                        <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mt-4 opacity-50" />
                    </div>

                    {/* Connection Line (Gold Pulse) */}
                    <div className="hidden md:block absolute top-[180px] left-0 w-full h-[2px] bg-white/5 overflow-hidden z-0">
                        <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent animate-[shimmer_3s_infinite]" />
                    </div>

                    {/* 4 Phases Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {phases.map((phase, i) => (
                            <div key={i} className="group relative bg-[#0A0A0A] border border-white/5 p-8 hover:border-[#C5A059] transition-all duration-500 hover:-translate-y-2">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#050505] px-2 text-[#C5A059] font-mono text-xs border border-[#C5A059]/30 rounded-full">
                                    PHASE 0{i + 1}
                                </div>
                                <div className="h-16 w-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    {phase.asset ? (
                                        <img src={phase.asset} alt={phase.title} className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]" />
                                    ) : (
                                        phase.icon
                                    )}
                                </div>
                                <h4 className="text-xl font-serif text-white mb-3 text-center group-hover:text-[#C5A059] transition-colors">
                                    {phase.title}
                                </h4>
                                <p className="text-white/50 text-xs text-center leading-relaxed font-sans">
                                    {phase.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Security Banner (Glassmorphism) */}
                    <div className="mt-24 p-1">
                        <div className="relative bg-white/[0.02] backdrop-blur-md border border-[#C5A059]/30 rounded-sm p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-[0_0_30px_rgba(197,160,89,0.05)] overflow-hidden">
                            {/* Shine */}
                            <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />

                            <div className="h-16 w-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center flex-shrink-0 border border-[#C5A059]/30">
                                <Lock className="w-8 h-8 text-[#C5A059]" />
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h4 className="text-lg font-serif text-white uppercase tracking-widest">
                                    {t.protocol?.privacy?.title || "Garantía de Privacidad Absoluta"}
                                </h4>
                                <p className="text-white/60 font-sans font-light text-sm max-w-2xl">
                                    {t.protocol?.privacy?.desc || "Nuestro protocolo opera de forma externa. No requerimos contraseñas ni acceso a su cuenta."}
                                </p>
                            </div>
                            <button className="px-6 py-3 border border-white/10 text-xs font-mono uppercase text-white/70 hover:bg-white/5 transition-colors">
                                {t.protocol?.privacy?.cta || "Ver Certificado SSL"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
