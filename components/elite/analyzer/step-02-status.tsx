"use client";

import { useAnalyzer } from "./context";
import { Check, Star, ShieldCheck, Info } from "lucide-react";
import { useState } from "react";

export default function VerificationStatus() {
    const { setPhase, setVerificationStatus } = useAnalyzer();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string, label: string) => {
        setSelected(id);
        setVerificationStatus(label);
        // Auto-advance after small delay for effect
        setTimeout(() => setPhase("NICHE"), 600);
    };

    const cards = [
        {
            id: "none",
            title: "No Verificado",
            desc: "Cuenta estándar sin insignias de autoridad",
            icon: <div className="w-8 h-8 rounded-full border border-[#9AA4B2]/30" />
        },
        {
            id: "meta",
            title: "Meta Verified",
            desc: "Suscripción mensual activa (Blue Check)",
            icon: <Check className="w-8 h-8 text-[#007AFF]" />
        },
        {
            id: "permanent",
            title: "Permanente",
            desc: "Validación notoria o legado (Legacy)",
            icon: <Star className="w-8 h-8 text-[#C9A24D] fill-[#C9A24D]" />
        }
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-[#E6E8EC]">Estado de Verificación</h3>
                <p className="text-[#9AA4B2] text-sm font-mono uppercase tracking-widest">
                    Clasificación de estatus actual
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <button
                        key={card.id}
                        onClick={() => handleSelect(card.id, card.title)}
                        className={`
                            relative h-64 p-6 rounded-sm border transition-all duration-300 flex flex-col items-center justify-center text-center gap-6 group
                            ${selected === card.id
                                ? 'bg-[#1F2533] border-[#C9A24D] shadow-[0_0_20px_rgba(201,162,77,0.1)]'
                                : 'bg-[#0B0D10] border-[#1F2533] hover:border-[#C9A24D]/50 hover:bg-[#131722]'
                            }
                        `}
                    >
                        {selected === card.id && (
                            <div className="absolute top-4 right-4 text-[#C9A24D] animate-in zoom-in spin-in-90 duration-300">
                                <Check className="w-5 h-5" />
                            </div>
                        )}

                        <div className="scale-110 transition-transform group-hover:scale-125 duration-500">
                            {card.icon}
                        </div>

                        <div className="space-y-2">
                            <h4 className={`font-semibold ${selected === card.id ? 'text-[#C9A24D]' : 'text-[#E6E8EC]'}`}>
                                {card.title}
                            </h4>
                            <p className="text-xs text-[#9AA4B2] leading-relaxed max-w-[20ch] mx-auto">
                                {card.desc}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Technical Notice */}
            <div className="flex items-center justify-center gap-3 text-xs text-[#9AA4B2]/60 bg-[#0B0D10] py-3 px-6 rounded-full border border-[#1F2533] w-fit mx-auto">
                <Info className="w-4 h-4" />
                <span>Esto clasifica mi estatus, no me están vendiendo.</span>
            </div>
        </div>
    );
}
