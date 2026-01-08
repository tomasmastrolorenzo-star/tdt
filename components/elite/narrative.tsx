"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Activity, BarChart3, Lock, Zap } from "lucide-react";

export default function Narrative() {
    return (
        <section className="py-24 bg-[#050505] relative overflow-hidden">

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Section 1: The Gap (Problem) */}
                <div className="grid md:grid-cols-2 gap-16 items-center mb-32">

                    {/* Visual: Audit Interface (Laser Scan) */}
                    <div className="relative h-[400px] w-full bg-black border border-white/5 rounded-sm overflow-hidden group">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

                        {/* Target Profile */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-60">
                            <img src="/assets/insta-3d-glossy.png" alt="Profile" className="w-32 h-32 opacity-20 filter grayscale" />
                        </div>

                        {/* Scanning Laser */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#C5A059] shadow-[0_0_20px_#C5A059] animate-[scan_3s_linear_infinite]" />

                        {/* Micro-UI Overlay */}
                        <div className="absolute bottom-6 left-6 font-mono text-[10px] text-[#C5A059] space-y-1">
                            <p className="opacity-70">&gt;&gt; TARGET_LOCKED</p>
                            <p className="opacity-100 font-bold animate-pulse">&gt;&gt; ANALYZING_ENGAGEMENT_VECTORS...</p>
                            <p className="opacity-50">&gt;&gt; CROSS_REF_DB_441</p>
                        </div>

                        {/* Status Box */}
                        <div className="absolute top-6 right-6 bg-red-900/20 border border-red-500/30 px-3 py-1 rounded text-[10px] text-red-500 font-mono tracking-widest uppercase animate-pulse">
                            Algorithmic Friction Detected
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <div>
                            <span className="text-[#C5A059] font-mono text-xs tracking-widest uppercase">
                                Diagnóstico de Situación
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif text-white mt-4 leading-tight">
                                Su autoridad digital está <br />
                                <span className="text-white/40 italic">artificialmente restringida.</span>
                            </h2>
                        </div>
                        <p className="text-white/60 font-sans font-light leading-relaxed">
                            El algoritmo de 2026 penaliza perfiles estáticos. Sin una inyección calculada de <b className="text-white font-medium">validación externa de alto nivel</b>, su contenido permanece invisible para el 90% de su audiencia potencial.
                        </p>

                        {/* Comparison Chart */}
                        <div className="bg-white/5 p-6 rounded-sm border border-white/10 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs uppercase tracking-wider text-white/50">
                                    <span>Alcance Actual (Restringido)</span>
                                    <span className="text-red-500">12%</span>
                                </div>
                                <div className="h-1 w-full bg-white/10 overflow-hidden">
                                    <div className="h-full bg-red-500/50 w-[12%] animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs uppercase tracking-wider text-[#C5A059]">
                                    <span>Potencial de Autoridad</span>
                                    <span className="font-bold">94%</span>
                                </div>
                                <div className="h-1 w-full bg-white/10 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-[#C5A059] w-[94%] shadow-[0_0_20px_#C5A059]" />
                                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Section 2: The Solution (Protocol) */}
                <div className="relative">

                    {/* Header */}
                    <div className="text-center mb-20">
                        <h3 className="text-3xl font-serif text-white tracking-wide">
                            El Protocolo de Autoridad
                        </h3>
                        <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mt-4 opacity-50" />
                    </div>

                    {/* Connection Line (Gold Pulse) */}
                    <div className="hidden md:block absolute top-[180px] left-0 w-full h-[2px] bg-white/5 overflow-hidden z-0">
                        <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent animate-[shimmer_3s_infinite]" />
                    </div>

                    {/* 4 Phases Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">

                        {[
                            {
                                title: "Auditoría",
                                desc: "Escaneo forense de su huella digital actual.",
                                icon: <Activity className="w-8 h-8 text-[#C5A059]" />,
                                asset: null
                            },
                            {
                                title: "Reestructuración",
                                desc: "Inyección de seguidores reales filtrados por nicho.",
                                icon: null,
                                asset: "/assets/insta-3d-glossy.png"
                            },
                            {
                                title: "Escalabilidad",
                                desc: "Activación de engagement velocity > 4.5%.",
                                icon: null,
                                asset: "/assets/heart-dynamic.png"
                            },
                            {
                                title: "Blindaje",
                                desc: "Protección contra shadowban y validación permanente.",
                                icon: <ShieldCheck className="w-8 h-8 text-[#C5A059]" />,
                                asset: null
                            },
                        ].map((phase, i) => (
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
                                    Garantía de Privacidad Absoluta
                                </h4>
                                <p className="text-white/60 font-sans font-light text-sm max-w-2xl">
                                    Nuestro protocolo es 100% externo. No requerimos contraseñas ni acceso a su cuenta. Operamos a través de capas de inteligencia de datos certificada.
                                </p>
                            </div>
                            <button className="px-6 py-3 border border-white/10 text-xs font-mono uppercase text-white/70 hover:bg-white/5 transition-colors">
                                Ver Certificado SSL
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
