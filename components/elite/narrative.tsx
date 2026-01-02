"use client";

import { Component, Crown, Globe, Landmark, PenTool, Scale, Search, ShieldCheck, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { GhostProfile } from "./ghost-profile";

export default function Narrative() {
    return (
        <section className="py-32 bg-[#050505] text-white overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 space-y-40 relative z-10">

                {/* THE DIAGNOSIS: Boutique Consulting Tone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <span className="text-[#007AFF] font-mono tracking-[0.2em] uppercase text-[10px] border border-[#007AFF]/30 px-3 py-1 rounded-full">
                            Diagnóstico Corporativo
                        </span>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] font-medium">
                            ¿Su éxito es real, <br />
                            <span className="text-white/40 italic">pero su perfil es invisible?</span>
                        </h2>

                        <div className="space-y-6 text-white/70 font-light leading-relaxed text-lg">
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

                        {/* Gráfico de Diferencial de Potencial */}
                        <div className="flex items-end justify-center space-x-12 h-64 pt-8 border-t border-white/5">
                            <div className="flex flex-col items-center group">
                                <div className="text-[10px] font-mono text-white/40 mb-2 uppercase tracking-widest group-hover:text-red-400 transition-colors">Digital Value</div>
                                <motion.div
                                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="w-16 bg-white/5 border border-dashed border-white/30 h-24 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            </div>

                            <div className="relative flex flex-col items-center">
                                <div className="absolute -top-12 text-[#007AFF] font-mono text-[10px] animate-pulse bg-[#007AFF]/10 px-2 py-1 rounded">VALOR NO CAPTURADO</div>
                                <div className="w-[1px] h-full bg-gradient-to-b from-[#007AFF] to-transparent absolute -left-6" />
                                <div className="text-[10px] font-mono text-white mb-2 uppercase tracking-widest text-[#007AFF] drop-shadow-[0_0_5px_rgba(0,122,255,0.5)]">Real Value</div>
                                <motion.div
                                    animate={{ boxShadow: ["0 0 20px rgba(255,255,255,0.1)", "0 0 40px rgba(255,255,255,0.3)", "0 0 20px rgba(255,255,255,0.1)"] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="w-16 bg-white h-56 relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-white" />
                                </motion.div>
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
                            <div className="font-mono text-xs text-[#007AFF] uppercase tracking-widest mt-8 md:mt-0 flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#007AFF] rounded-full animate-pulse" />
                                System v2.5 Blueprint
                            </div>
                        </div>

                        {/* Security Block (Industrial) */}
                        <div className="mb-12 bg-[#0A0A0A] border border-[#007AFF]/20 p-4 md:p-6 rounded-sm flex items-start md:items-center gap-4 relative overflow-hidden group">
                            <div className="absolute left-0 top-0 h-full w-1 bg-[#007AFF]" />
                            <ShieldCheck className="w-6 h-6 text-[#007AFF] flex-shrink-0 mt-1 md:mt-0" />
                            <div>
                                <h4 className="font-mono text-xs md:text-sm text-[#007AFF] uppercase tracking-widest font-bold mb-1">
                                    SEGURIDAD CORPORATIVA
                                </h4>
                                <p className="text-xs md:text-sm text-white/80 font-mono">
                                    100% NO INVASIVO. SIN CONTRASEÑAS. ANÁLISIS PERIMETRAL EXTERNO.
                                </p>
                            </div>
                            <div className="absolute right-4 top-4 hidden md:block">
                                <div className="text-[10px] text-white/20 font-mono">SEC_PROTO_0X92</div>
                            </div>
                        </div>

                        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Connecting Line (Timeline) */}
                            <div className="absolute top-8 left-0 w-full h-[1px] bg-white/10 hidden md:block" />

                            {[
                                {
                                    icon: Search,
                                    step: "01",
                                    title: "Diagnóstico Forense",
                                    desc: "Detección de fugas de autoridad. Nuestro escáner IA mapea las ineficiencias técnicas que el algoritmo castiga actualmente."
                                },
                                {
                                    icon: Component, // Algo restructuring
                                    step: "02",
                                    title: "Reestructuración Algorítmica",
                                    desc: "Corrección de penalizaciones. Si no es oficial, es invisible. Validamos su estatus ante la plataforma para recuperar alcance."
                                },
                                {
                                    icon: Scale, // Scalability
                                    step: "03",
                                    title: "Escalabilidad de Élite",
                                    desc: "Resultados de alto impacto. Desbloqueo de alcance orgánico y engagement cualificado para su nivel profesional."
                                },
                                {
                                    icon: ShieldCheck, // Shield
                                    step: "04",
                                    title: "Blindaje de Activos",
                                    desc: "Mantenimiento perpetuo. Protección contra cambios de algoritmo y preservación de estatus a largo plazo."
                                }
                            ].map((item, i) => (
                                <div key={i} className="group relative bg-[#050505] p-6 border border-white/10 rounded-lg hover:border-[#007AFF] transition-all duration-500 hover:-translate-y-1">
                                    <div className="absolute top-0 left-6 -mt-3 bg-[#050505] px-2 text-[#007AFF] font-mono text-xs uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                                        PHASE {item.step}
                                    </div>
                                    <div className="mb-6 opacity-60 group-hover:opacity-100 group-hover:text-[#007AFF] transition-all duration-300">
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
        </section>
    );
}
