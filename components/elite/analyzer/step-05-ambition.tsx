"use client";

import { useAnalyzer } from "./context";
import { Target, Globe } from "lucide-react";
import { useState } from "react";

export default function ScaleAmbition() {
    const { setPhase, setGrowthGoal } = useAnalyzer();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string, label: string) => {
        setSelected(id);
        setGrowthGoal(label);
        setTimeout(() => setPhase("SEGMENTATION"), 600);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-[#E6E8EC]">Escala y Ambición</h3>
                <p className="text-[#9AA4B2] text-sm font-mono uppercase tracking-widest">
                    Declaración de objetivos de crecimiento
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Option 1: Niche Authority */}
                <button
                    onClick={() => handleSelect('niche', 'Autoridad de Nicho')}
                    className={`
                        p-8 border transition-all duration-300 text-left space-y-6 group
                        ${selected === 'niche'
                            ? 'bg-[#1F2533] border-[#C9A24D] shadow-[0_0_30px_rgba(201,162,77,0.1)]'
                            : 'bg-[#0B0D10] border-[#1F2533] hover:border-[#C9A24D]/30 hover:bg-[#131722]'
                        }
                    `}
                >
                    <div className="flex justify-between items-start">
                        <Target className={`w-10 h-10 ${selected === 'niche' ? 'text-[#C9A24D]' : 'text-[#9AA4B2] group-hover:text-[#E6E8EC]'}`} />
                        {selected === 'niche' && <div className="text-[#C9A24D] text-xs font-mono">SELECTED</div>}
                    </div>

                    <div>
                        <h4 className="text-xl font-bold text-[#E6E8EC] mb-2 uppercase tracking-wide">Autoridad de Nicho</h4>
                        <p className="text-sm text-[#9AA4B2] font-light leading-relaxed">
                            Enfoque en relevancia, alta conversión y posicionamiento selectivo dentro de su sector específico.
                        </p>
                    </div>
                </button>

                {/* Option 2: Global Dominance */}
                <button
                    onClick={() => handleSelect('global', 'Dominio Global')}
                    className={`
                        p-8 border transition-all duration-300 text-left space-y-6 group
                        ${selected === 'global'
                            ? 'bg-[#1F2533] border-[#C9A24D] shadow-[0_0_30px_rgba(201,162,77,0.1)]'
                            : 'bg-[#0B0D10] border-[#1F2533] hover:border-[#C9A24D]/30 hover:bg-[#131722]'
                        }
                    `}
                >
                    <div className="flex justify-between items-start">
                        <Globe className={`w-10 h-10 ${selected === 'global' ? 'text-[#C9A24D]' : 'text-[#9AA4B2] group-hover:text-[#E6E8EC]'}`} />
                        {selected === 'global' && <div className="text-[#C9A24D] text-xs font-mono">SELECTED</div>}
                    </div>

                    <div>
                        <h4 className="text-xl font-bold text-[#E6E8EC] mb-2 uppercase tracking-wide">Dominio Global</h4>
                        <p className="text-sm text-[#9AA4B2] font-light leading-relaxed">
                            Estrategia de expansión masiva, visibilidad internacional y exposición a audiencias generales.
                        </p>
                    </div>
                </button>
            </div>

            <div className="text-center">
                <p className="text-[10px] text-[#9AA4B2]/40 font-mono uppercase tracking-widest">
                    Estoy declarando visión, no pidiendo likes.
                </p>
            </div>
        </div>
    );
}
