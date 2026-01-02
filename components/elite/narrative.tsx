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

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] font-medium">
                            ¿Su éxito es real, <br />
                            <span className="text-white/40 italic">pero su perfil es invisible?</span>
                        </h2>

                        <div className="space-y-6 text-white/70 font-light leading-relaxed text-lg">
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded mb-4">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                                    Alerta: Invisibilidad Algorítmica Detectada
                                </span>
                            </div>

                            <p className="text-xl md:text-2xl text-white font-serif italic mb-6">
                                "Detectamos la fricción técnica que oculta su autoridad ante el mercado actual."
                            </p>
                            <p>
                                Usted ha construido una trayectoria sólida en el mundo real, pero su Instagram parece ignorarlo. Sigue las viejas normas: contenido profesional, constancia y seriedad.
                            </p>
                            <p>
                                El resultado: <span className="text-white border-b border-white/20">0 likes. 0 comentarios. 0 llegada.</span>
                            </p>
                            <p className="text-base text-white/50">
                                No es falta de valor, es un <span className="text-red-400">bloqueo del algoritmo de 2026</span> que lo ha marcado como irrelevante. Mientras usted cierra tratos en privado, el sistema lo mantiene oculto, diluyendo su prestigio ante las nuevas oportunidades de mercado.
                            </p>
                        </div>
                    </div>

                    {/* Visual: Ghost Profile & Gap Chart */}
                    <div className="space-y-12">
                        {/* Ghost Profile Component */}
                        <GhostProfile isScanning={false} />

                        {/* Gráfico de Diferencial de Potencial (Potential vs Reality) */}
                        <div className="flex items-end justify-center space-x-8 md:space-x-16 h-80 pt-12 border-t border-white/5 relative">

                            {/* Potential Bar */}
                            <div className="flex flex-col items-center group w-24">
                                <div className="text-[10px] font-mono text-[#C5A059] mb-3 uppercase tracking-widest text-center whitespace-nowrap">Alcance Potencial</div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: "16rem" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="w-full bg-gradient-to-t from-[#C5A059]/20 to-[#C5A059] relative rounded-t-sm shadow-[0_0_30px_rgba(197,160,89,0.2)]"
                                >
                                    <div className="absolute -top-8 w-full text-center text-[#C5A059] font-bold text-xs whitespace-nowrap">1.5M+ Impactos</div>
                                </motion.div>
                                <div className="mt-4 text-[10px] text-white/50 font-mono text-center uppercase tracking-widest">Estatus Real</div>
                            </div>

                            {/* Connectivity Line (Loss) */}
                            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center z-10 hidden md:block">
                                <ArrowRight className="w-6 h-6 text-red-500/50 rotate-45 mb-2 mx-auto" />
                                <span className="bg-red-950/40 text-red-400 text-[9px] px-2 py-1 rounded border border-red-500/30 uppercase tracking-widest block backdrop-blur-sm">
                                    Pérdida de Capital Digital
                                </span>
                            </div>

                            {/* Reality Bar */}
                            <div className="flex flex-col items-center group w-24">
                                <div className="text-[10px] font-mono text-red-500/70 mb-3 uppercase tracking-widest text-center whitespace-nowrap">Alcance Actual</div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: "1.5rem" }} // Very small
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    className="w-full bg-red-500/10 h-6 relative rounded-t-sm border-t border-red-500/40"
                                >
                                    <div className="absolute -top-8 w-full text-center text-red-500/80 font-bold text-xs whitespace-nowrap">&lt; 3%</div>
                                </motion.div>
                                <div className="mt-4 text-[10px] text-white/50 font-mono text-center uppercase tracking-widest">Restricted</div>
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
                                <p className="text-white/50 leading-relaxed">
                                    Ingeniería de estatus aplicada. Un proceso sistemático para alinear su proyección pública con su realidad profesional.
                                </p>
                            </div>
                            {/* Removed "System v2.5 Blueprint" Label */}
                        </div>

                        {/* Security Block (Luxury Privacy) */}
                        <div className="mb-12 bg-[#0A0A0A] border-l-2 border-[#C5A059] p-6 rounded-sm flex items-start md:items-center gap-6 relative overflow-hidden group shadow-[0_0_20px_rgba(197,160,89,0.05)]">
                            <ShieldCheck className="w-6 h-6 text-[#C5A059] flex-shrink-0 mt-1 md:mt-0" />
                            <div>
                                <h4 className="font-serif text-sm text-[#C5A059] uppercase tracking-[0.15em] mb-2">
                                    Garantía de Privacidad Absoluta
                                </h4>
                                <p className="text-xs md:text-sm text-white/60 font-light font-sans tracking-wide">
                                    100% No Invasivo. Sin Contraseñas. Análisis Perimetral Externo.
                                </p>
                            </div>
                            {/* Removed "SEC_PROTO_0X92" */}
                        </div>

                        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Connecting Line (Timeline) */}
                            <div className="absolute top-8 left-0 w-full h-[1px] bg-white/5 hidden md:block" />

                            {[
                                {
                                    icon: Diamond, // Diamond/Radar
                                    step: "01",
                                    title: "Diagnóstico Forense",
                                    desc: "Detección de fugas de autoridad. Nuestro escáner IA mapea las ineficiencias técnicas que el algoritmo castiga actualmente."
                                },
                                {
                                    icon: Network, // Connected Nodes
                                    step: "02",
                                    title: "Reestructuración Algorítmica",
                                    desc: "Corrección de penalizaciones. Si no es oficial, es invisible. Validamos su estatus ante la plataforma para recuperar alcance."
                                },
                                {
                                    icon: Crown, // Elite Status
                                    step: "03",
                                    title: "Escalabilidad de Élite",
                                    desc: "Resultados de alto impacto. Desbloqueo de alcance orgánico y engagement cualificado para su nivel profesional."
                                },
                                {
                                    icon: Landmark, // Vault/Fortress
                                    step: "04",
                                    title: "Blindaje de Activos",
                                    desc: "Mantenimiento perpetuo. Protección contra cambios de algoritmo y preservación de estatus a largo plazo."
                                }
                            ].map((item, i) => (
                                <div key={i} className="group relative bg-[#050505] p-6 border border-white/5 rounded-lg hover:border-[#C5A059]/30 transition-all duration-500 hover:-translate-y-1">
                                    <div className="absolute top-0 left-6 -mt-3 bg-[#050505] px-2 text-[#C5A059] font-mono text-xs uppercase opacity-40 group-hover:opacity-100 transition-opacity">
                                        PHASE {item.step}
                                    </div>
                                    <div className="mb-6 opacity-60 group-hover:opacity-100 group-hover:text-[#C5A059] transition-all duration-300">
                                        <item.icon strokeWidth={1} className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-serif mb-4 leading-tight group-hover:text-white transition-colors">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-white/40 leading-relaxed font-light font-sans group-hover:text-white/60 transition-colors">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Final CTA */}
                        <div className="mt-16 text-center">
                            <button
                                onClick={() => document.getElementById('analyzer-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#E6E8EB] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] overflow-hidden"
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
