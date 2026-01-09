"use client";

import { useAnalyzer } from "./context";
import { useState } from "react";
import { MapPin, Users, Calendar } from "lucide-react";

export default function AudienceSegmentation() {
    const { setPhase, setGeo, setGender, setAge, addLog } = useAnalyzer();
    const [loading, setLoading] = useState(false);

    const handleConfirm = () => {
        setLoading(true);
        addLog("COMPILANDO MODELO DE AUDIENCIA...");
        setTimeout(() => setPhase("PROCESSING"), 1500);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-[#E6E8EC]">Segmentación de Audiencia</h3>
                <p className="text-[#9AA4B2] text-sm font-mono uppercase tracking-widest">
                    Configuración de objetivos demográficos
                </p>
            </div>

            <div className="space-y-6">
                {/* Region */}
                <div className="space-y-3">
                    <label className="text-xs text-[#C9A24D] font-mono uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Región Objetivo
                    </label>
                    <select
                        onChange={(e) => setGeo(e.target.value)}
                        className="w-full bg-[#0B0D10] border border-[#1F2533] text-[#E6E8EC] p-4 outline-none focus:border-[#C9A24D] transition-colors"
                    >
                        <option>Global (Sin Fronteras)</option>
                        <option>Latam High-End</option>
                        <option>Miami / USA</option>
                        <option>Madrid / Europa</option>
                    </select>
                </div>

                {/* Gender */}
                <div className="space-y-3">
                    <label className="text-xs text-[#C9A24D] font-mono uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-4 h-4" /> Género
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Mixto', 'Masculino', 'Femenino'].map(g => (
                            <button
                                key={g}
                                onClick={() => setGender(g)}
                                className="border border-[#1F2533] hover:border-[#C9A24D] hover:bg-[#131722] py-3 text-xs uppercase tracking-widest text-[#9AA4B2] hover:text-[#E6E8EC] transition-all bg-[#0B0D10] focus:ring-1 ring-[#C9A24D]"
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Age */}
                <div className="space-y-3">
                    <label className="text-xs text-[#C9A24D] font-mono uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Rango de Edad
                    </label>
                    <select
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-[#0B0D10] border border-[#1F2533] text-[#E6E8EC] p-4 outline-none focus:border-[#C9A24D] transition-colors"
                    >
                        <option>Prime Force (25-45 años)</option>
                        <option>Gen Z (18-24 años)</option>
                        <option>Senior Executive (45+)</option>
                    </select>
                </div>
            </div>

            <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full bg-[#E6E8EC] text-[#0B0D10] h-14 font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Compilando Modelo..." : "Confirmar Segmentación"}
            </button>
        </div>
    );
}
