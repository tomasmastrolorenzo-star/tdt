"use client";

import { useAnalyzer } from "./context";
import { Briefcase, Camera, Building, Trophy, TrendingUp, Stethoscope, Landmark } from "lucide-react";
import { useState } from "react";

export default function EliteNiche() {
    const { setPhase, setNiche, addLog } = useAnalyzer();
    const [active, setActive] = useState<string | null>(null);

    const niches = [
        { id: "investor", label: "Investor", icon: Briefcase },
        { id: "model", label: "Model / Figur", icon: Camera },
        { id: "ceo", label: "CEO & Founder", icon: Building },
        { id: "medical", label: "Medical Spec", icon: Stethoscope },
        { id: "athlete", label: "Pro Athlete", icon: Trophy },
        { id: "trader", label: "Fin / Trader", icon: TrendingUp },
        { id: "real_estate", label: "Real Estate", icon: Landmark },
    ];

    const handleSelect = (id: string, label: string) => {
        setActive(id);
        setNiche(label);
        addLog(`ANALIZANDO ENTORNO COMPETITIVO: ${label.toUpperCase()}...`);
        setTimeout(() => setPhase("HEALTH"), 800);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-[#E6E8EC]">Nicho de Élite</h3>
                <p className="text-[#9AA4B2] text-sm font-mono uppercase tracking-widest">
                    Seleccione su campo de operación
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {niches.map((n) => (
                    <button
                        key={n.id}
                        onClick={() => handleSelect(n.id, n.label)}
                        className={`
                            h-40 flex flex-col items-center justify-center gap-4 border transition-all duration-300 relative overflow-hidden group
                            ${active === n.id
                                ? 'bg-[#1F2533] border-[#C9A24D] shadow-[0_0_20px_rgba(201,162,77,0.15)]'
                                : 'bg-[#0B0D10] border-[#1F2533] hover:border-[#C9A24D]/40 hover:bg-[#131722]'
                            }
                        `}
                    >
                        <n.icon
                            strokeWidth={1.5}
                            className={`w-8 h-8 transition-colors duration-300 ${active === n.id ? 'text-[#C9A24D]' : 'text-[#9AA4B2] group-hover:text-[#E6E8EC]'}`}
                        />
                        <span className="text-xs font-mono uppercase tracking-widest text-[#E6E8EC]">
                            {n.label}
                        </span>

                        {/* Selected Feedback Text */}
                        {active === n.id && (
                            <div className="absolute inset-0 bg-[#0B0D10]/90 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
                                <span className="text-[10px] text-[#C9A24D] px-4 text-center">
                                    Evaluando entorno competitivo...
                                </span>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div className="text-center">
                <p className="text-[10px] text-[#9AA4B2]/40 font-mono uppercase tracking-widest animate-pulse">
                    Mi perfil no se analiza igual que el resto.
                </p>
            </div>
        </div>
    );
}
