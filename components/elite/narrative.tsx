import { Component, Crown, Globe, Landmark, PenTool, SCALE, ShieldCheck, UserCheck } from "lucide-react";

export default function Narrative() {
    return (
        <section className="py-32 bg-[#050505] text-white">
            <div className="max-w-6xl mx-auto px-6 space-y-40">

                {/* THE DIAGNOSIS: Boutique Consulting Tone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <span className="text-[#007AFF] font-mono tracking-[0.2em] uppercase text-[10px] border border-[#007AFF]/30 px-3 py-1 rounded-full">
                            Diagnóstico Corporativo
                        </span>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] font-medium">
                            El Desfase de <br />
                            <span className="text-white/40 italic">Percepción.</span>
                        </h2>

                        <div className="space-y-6 text-white/70 font-light leading-relaxed text-lg">
                            <p>
                                Hemos detectado un patrón crítico en líderes de alto rendimiento: <span className="text-white">Cuando su éxito real supera su huella digital.</span>
                            </p>
                            <p>
                                Esta asimetría provoca una <span className="text-white border-b border-white/20 pb-0.5">Dilución de Marca</span>. Mientras usted cierra tratos de alto nivel en privado, su infraestructura de autoridad pública permanece desactualizada, generando fricción innecesaria en nuevos mercados.
                            </p>
                        </div>

                        <div className="pl-6 border-l w-[1px] border-white/20 bg-gradient-to-b from-white/20 to-transparent">
                            <p className="text-sm font-mono text-white/50 uppercase tracking-widest leading-loose">
                                "La invisibilidad digital es el costo oculto <br /> más alto para el talento de élite."
                            </p>
                        </div>
                    </div>

                    {/* Visual: The Gap (Abstract/Clean) */}
                    <div className="relative h-[500px] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-12 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="text-sm font-mono text-white/30 uppercase tracking-widest">Estado Actual</div>
                            <div className="h-[1px] w-full bg-white/10" />
                        </div>

                        <div className="relative flex-1 flex items-center justify-center">
                            {/* Graphic representation of Real vs Digital */}
                            <div className="flex gap-8 items-end">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-64 bg-white/10 rounded-t-sm relative overflow-hidden group">
                                        <div className="absolute bottom-0 w-full h-[30%] bg-[#007AFF]/20 group-hover:h-[40%] transition-all duration-1000" />
                                    </div>
                                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest rotate-180 [writing-mode:vertical-lr]">Digital</span>
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-64 bg-white/90 rounded-t-sm shadow-[0_0_50px_rgba(255,255,255,0.1)]" />
                                    <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest rotate-180 [writing-mode:vertical-lr]">Real</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-4xl font-serif text-white/20">GAP</div>
                        </div>
                    </div>
                </div>

                {/* THE PROTOCOL: Architectural/Rigorous */}
                <div>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-white/10 pb-8">
                        <div className="space-y-4 max-w-xl">
                            <h3 className="text-3xl md:text-5xl font-serif">El Protocolo de Autoridad</h3>
                            <p className="text-white/50 leading-relaxed">
                                Ingeniería de estatus aplicada. Un proceso sistemático para alinear su proyección pública con su realidad profesional.
                            </p>
                        </div>
                        <div className="font-mono text-xs text-[#007AFF] uppercase tracking-widest mt-8 md:mt-0">
                            System v2.4
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: PenTool,
                                step: "01",
                                title: "Arquitectura de Identidad",
                                desc: "Reconstrucción narrativa. Definimos los pilares discursivos que lo posicionan como líder de categoría, no como participante."
                            },
                            {
                                icon: Landmark, // Validation
                                step: "02",
                                title: "Validación Institucional",
                                desc: "Gestión de credenciales de plataforma (Check Azul) y vinculación con entidades de prestigio."
                            },
                            {
                                icon: Globe,
                                step: "03",
                                title: "Expansión de Influencia",
                                desc: "Amplificación estratégica del mensaje hacia audiencias cualificadas. Cero métricas vanidad."
                            },
                            {
                                icon: Crown,
                                step: "04",
                                title: "Consolidación de Estatus",
                                desc: "Blindaje de reputación y mantenimiento de activos digitales a largo plazo."
                            }
                        ].map((item, i) => (
                            <div key={i} className="group border-t border-white/20 pt-8 hover:border-[#007AFF] transition-colors duration-700">
                                <div className="text-[#007AFF] font-mono text-xs mb-6 opacity-50 group-hover:opacity-100 transition-opacity">
                                    PHASE {item.step}
                                </div>
                                <div className="mb-8 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 origin-left">
                                    <item.icon strokeWidth={1} className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-xl font-serif mb-4 leading-tight">
                                    {item.title}
                                </h4>
                                <p className="text-sm text-white/50 leading-relaxed font-light font-sans pr-4">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
