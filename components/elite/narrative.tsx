"use client";

import { Component, Crown, Globe, Landmark, PenTool, Scale, Search, ShieldCheck, UserCheck, TrendingDown, ArrowRight, Diamond, Network } from "lucide-react";
import { motion } from "framer-motion";
import { GhostProfile } from "./ghost-profile";

export default function Narrative() {
    return (
        <section className="py-32 bg-[#050505] text-white overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-900/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 space-y-40 relative z-10">

                {/* THE DIAGNOSIS: High Stakes Urgency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <span className="text-[#C5A059] font-mono tracking-[0.2em] uppercase text-[10px] border border-[#C5A059]/30 px-3 py-1 rounded-full">
                            Análisis de Brecha de Mercado
                        </span>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] font-medium tracking-tight">
                            ¿Su éxito es real, <br />
                            <span className="text-white/40">pero su perfil es invisible?</span>
                        </h2>

                        <div className="space-y-6 text-white/70 font-light leading-relaxed text-lg font-sans">
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded mb-4">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                                    Alerta: Invisibilidad Algorítmica Detectada
                                </span>
                            </div>

                            <p className="text-xl md:text-2xl text-white font-serif mb-6 leading-tight">
                                Detectamos la fricción técnica que oculta su autoridad ante el mercado actual.
                            </p>
                            <p>
                                Usted ha construido una trayectoria sólida en el mundo real, pero su Instagram parece ignorarlo. Sigue las viejas normas: contenido profesional, constancia y seriedad.
                            </p>
                            <p>
                                El resultado: <span className="text-white border-b border-white/20">0 likes. 0 comentarios. 0 llegada.</span>
                            </p>
                            <p className="text-base text-white/50">
                                No es falta de valor, es un <b className="text-[#C5A059]">bloqueo del algoritmo de 2026</b> que lo ha marcado como irrelevante. Mientras usted cierra tratos en privado, el sistema lo mantiene oculto bajo una capa de <b className="text-[#C5A059]">invisibilidad algorítmica</b>, diluyendo su prestigio.
                            </p>
                        </div>
                    </div>

                    {/* Visual: Ghost Profile & Gap Chart */}
                    <div className="space-y-12">
                        {/* Ghost Profile Component */}
                        <GhostProfile isScanning={true} />

                        {/* Gráfico de Diferencial de Potencial (Potential vs Reality) */}
                        <div className="flex items-end justify-center space-x-8 md:space-x-16 h-80 pt-12 border-t border-white/5 relative">

                            {/* Potential Bar (Gold & Glowing) */}
                            <div className="flex flex-col items-center group w-24 relative">
                                <div className="text-[10px] font-mono text-[#C5A059] mb-3 uppercase tracking-widest text-center whitespace-nowrap">Alcance Potencial</div>
                                {/* 3D Heart Integration */}
                                <div className="absolute -top-16 z-20 animate-bounce-slow">
                                    <img src="/assets/heart-dynamic.png" alt="Engagement" className="w-16 h-16 drop-shadow-2xl" />
                                </div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: "16rem" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="w-full bg-gradient-to-t from-[#C5A059]/10 via-[#C5A059] to-[#F2C94C] relative rounded-t-sm shadow-[0_0_50px_rgba(197,160,89,0.3)] border-t border-white/20"
                                >
                                    <div className="absolute -top-8 w-full text-center text-[#F2C94C] font-bold text-xs whitespace-nowrap drop-shadow-lg">1.5M+ Impactos</div>
                                </motion.div>
                                <div className="mt-4 text-[10px] text-white/80 font-mono text-center uppercase tracking-widest font-bold">Estatus Real</div>
                            </div>

                            {/* Connectivity Line (Loss) */}
                            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center z-10 hidden md:block opacity-60">
                                <ArrowRight className="w-6 h-6 text-red-500/50 rotate-45 mb-2 mx-auto" />
                                <span className="bg-red-950/40 text-red-400 text-[9px] px-2 py-1 rounded border border-red-500/30 uppercase tracking-widest block backdrop-blur-sm">
                                    GAP CRÍTICO
                                </span>
                            </div>

                            {/* Reality Bar (Glitch & Small) */}
                            <div className="flex flex-col items-center group w-24">
                                <div className="text-[10px] font-mono text-red-500/70 mb-3 uppercase tracking-widest text-center whitespace-nowrap">Alcance Actual</div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: "2rem" }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    className="w-full bg-white/5 h-8 relative rounded-t-sm border border-red-500/20 overflow-hidden"
                                >
                                    {/* Glitch Effect */}
                                    <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
                                    <div className="absolute top-0 w-full h-[1px] bg-red-500/50" />

                                    <div className="absolute -top-8 w-full text-center text-red-500/60 font-bold text-xs whitespace-nowrap">&lt; 3%</div>
                                </motion.div>
                                <div className="mt-4 text-[10px] text-white/30 font-mono text-center uppercase tracking-widest">Restricted</div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* THE PROTOCOL: System v2.4 (Industrial Timeline) */}
                <div>
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
                            <div className="space-y-4 max-w-xl">
                                <h3 className="text-3xl md:text-5xl font-serif">El Protocolo de Autoridad</h3>
                                <p className="text-white/50 leading-relaxed font-sans font-light">
                                    Ingeniería de estatus aplicada. Un proceso sistemático para alinear su proyección pública con su realidad profesional.
                                </p>
                            </div>
                        </div>

                        {/* Security Block (Luxury Privacy - Glassmorphism) */}
                        <div className="mb-16 bg-white/[0.02] border border-white/5 backdrop-blur-md p-8 rounded-sm flex items-start md:items-center gap-8 relative overflow-hidden group shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/10 to-transparent opacity-20 group-hover:opacity-30 transition-opacity" />
                            <ShieldCheck className="w-8 h-8 text-[#C5A059] flex-shrink-0 relative z-10" />
                            <div className="relative z-10">
                                <h4 className="font-serif text-sm text-[#C5A059] uppercase tracking-[0.2em] mb-2 font-bold">
                                    Garantía de Privacidad Absoluta
                                </h4>
                                <p className="text-sm text-white/70 font-light font-sans tracking-wide">
                                    100% No Invasivo. Sin Contraseñas. Análisis Perimetral Externo.
                                </p>
                            </div>
                        </div>

                        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Connecting Pulse Line */}
                            <div className="absolute top-12 left-0 w-full h-[1px] bg-white/5 hidden md:block overflow-hidden">
                                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#C5A059] to-transparent absolute top-0 -left-full animate-[shimmer_3s_infinite]" />
                            </div>

                            {[
                                {
                                    type: "icon",
                                    icon: Search,
                                    label: "Eliminación de fricción técnica",
                                    step: "01",
                                    title: "Diagnóstico Forense"
                                },
                                {
                                    type: "image",
                                    src: "/assets/insta-3d-glossy.png",
                                    label: "Corrección de penalizaciones inv.",
                                    step: "02",
                                    title: "Reestructuración Algorítmica"
                                },
                                {
                                    type: "image",
                                    src: "/assets/heart-dynamic.png",
                                    label: "Engagement cualificado de alto nivel",
                                    step: "03",
                                    title: "Escalabilidad de Élite"
                                },
                                {
                                    type: "icon",
                                    icon: ShieldCheck,
                                    label: "Preservación de estatus a largo plazo",
                                    step: "04",
                                    title: "Blindaje de Activos"
                                }
                            ].map((item, i) => (
                                <div key={i} className="group relative bg-[#050505] p-8 pt-12 border border-white/5 rounded-sm hover:border-[#C5A059]/40 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.02]">

                                    {/* Step Label */}
                                    <div className="absolute top-6 left-8 text-[#C5A059] font-mono text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                                        PHASE {item.step}
                                    </div>

                                    {/* Icon / Asset */}
                                    <div className="mb-8 h-16 flex items-center">
                                        {item.type === 'image' ? (
                                            <img
                                                src={item.src}
                                                alt={item.title}
                                                className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(197,160,89,0.3)] group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <item.icon strokeWidth={1} className="w-10 h-10 text-white/40 group-hover:text-[#C5A059] transition-colors duration-300" />
                                        )}
                                    </div>

                                    <h4 className="text-xl font-serif mb-4 leading-tight text-white group-hover:text-[#C5A059] transition-colors">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-white/50 leading-relaxed font-sans group-hover:text-white/80 transition-colors border-t border-white/5 pt-4">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Final CTA */}
                        <div className="mt-20 text-center">
                            <button
                                onClick={() => document.getElementById('analyzer-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group relative px-10 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#E6E8EB] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] overflow-hidden"
                            >
                                <motion.div
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 1 }}
                                    className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-20deg] z-20 pointer-events-none"
                                />
                                Iniciar Auditoría Ahora
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
