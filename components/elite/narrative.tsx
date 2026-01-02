import { BarChart3, Fingerprint, Lock, Shield } from "lucide-react";

export default function Narrative() {
    return (
        <section className="py-24 bg-[#050505] text-white">
            <div className="max-w-6xl mx-auto px-6 space-y-32">

                {/* THE PROBLEM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <span className="text-[#007AFF] font-mono tracking-[0.2em] uppercase text-xs">Diagnóstico de Situación</span>
                        <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                            Tu reputación offline es de 10.<br />
                            <span className="text-white/40">Tu perfil digital es de 4.</span>
                        </h2>
                        <div className="h-px w-24 bg-[#007AFF]" />
                        <p className="text-lg text-white/70 leading-relaxed font-light">
                            Estás perdiendo negocios, pacientes y contratos de alto valor no por falta de capacidad, sino por falta de <span className="text-white font-medium">credibilidad visual</span>.
                            En el mercado actual, si no pareces el líder, no eres el líder.
                        </p>
                        <ul className="space-y-4 pt-4">
                            <li className="flex items-center gap-4 text-white/60">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                Fugas de autoridad ante competidores inferiores.
                            </li>
                            <li className="flex items-center gap-4 text-white/60">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                Percepción de "amateur" a pesar de tu éxito real.
                            </li>
                        </ul>
                    </div>

                    {/* Visual Abstract for "The Gap" */}
                    <div className="relative h-[400px] border border-white/10 rounded-3xl bg-white/[0.02] p-8 flex items-center justify-center">
                        <div className="text-center space-y-2">
                            <div className="text-6xl font-serif text-white opacity-20">GAP</div>
                            <div className="text-xs font-mono text-white/40 uppercase tracking-widest">Brecha de Autoridad</div>
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#007AFF]/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 blur-3xl" />
                    </div>
                </div>

                {/* THE SOLUTION (4 Pillars) */}
                <div>
                    <div className="text-center mb-16 space-y-4">
                        <h3 className="text-3xl md:text-4xl font-serif">El Protocolo de Autoridad</h3>
                        <p className="text-white/50 max-w-2xl mx-auto">Nuestro sistema propietario para reestructurar tu presencia digital.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Fingerprint,
                                title: "Curaduría de Identidad",
                                desc: "Limpieza forense de tu huella digital. Eliminamos lo que resta, potenciamos lo que suma."
                            },
                            {
                                icon: Shield,
                                title: "Activos de Autoridad",
                                desc: "Gestión directa de verificación (Check Azul) y prensa de alto nivel."
                            },
                            {
                                icon: BarChart3,
                                title: "Crecimiento Estratégico",
                                desc: "Inyección de tráfico cualificado (no bots) para validar tu estatus social."
                            },
                            {
                                icon: Lock,
                                title: "Posicionamiento Elite",
                                desc: "Blindaje de tu marca personal para que sea incuestionable."
                            }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl transition-all duration-500 hover:border-[#007AFF]/30">
                                <div className="w-12 h-12 bg-[#007AFF]/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <item.icon className="w-6 h-6 text-[#007AFF]" />
                                </div>
                                <h4 className="text-lg font-bold mb-3 font-serif">{item.title}</h4>
                                <p className="text-sm text-white/50 leading-relaxed">
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
