"use client";

import { motion } from "framer-motion";

export default function GapAnalysis() {
    return (
        <section className="py-24 bg-[#050505] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">

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
            </div>
        </section>
    );
}
