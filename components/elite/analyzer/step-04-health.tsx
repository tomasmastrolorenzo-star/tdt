"use client";

import { useAnalyzer } from "./context";
import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

export default function AlgorithmicHealth() {
    const { setPhase, setHealthStatus, profileData } = useAnalyzer();
    const [rate, setRate] = useState(0);
    const [status, setStatus] = useState<"CRITICAL" | "RISK" | "OPTIMAL">("RISK");

    // Calculate real metrics on mount
    useEffect(() => {
        if (!profileData) return;

        let avgLikes = 0;
        if (profileData.posts && profileData.posts.length > 0) {
            avgLikes = profileData.posts.reduce((acc: any, p: any) => acc + (p.likesCount || p.likes || 0), 0) / profileData.posts.length;
        } else {
            // Fallback estimation if no posts data (e.g. 2% of followers)
            avgLikes = profileData.followersCount * 0.02;
        }

        const calculatedRate = (avgLikes / profileData.followersCount) * 100;
        setRate(calculatedRate);

        if (calculatedRate < 3) setStatus("CRITICAL");
        else if (calculatedRate < 8) setStatus("RISK");
        else setStatus("OPTIMAL");

        setHealthStatus(status);

    }, [profileData]);

    const getColor = () => {
        if (status === "CRITICAL") return "text-[#E74C3C] border-[#E74C3C] bg-[#E74C3C]";
        if (status === "RISK") return "text-[#F1C40F] border-[#F1C40F] bg-[#F1C40F]";
        return "text-[#2ECC71] border-[#2ECC71] bg-[#2ECC71]";
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-[#E6E8EC]">Salud Algorítmica</h3>
                <p className="text-[#9AA4B2] text-sm font-mono uppercase tracking-widest">
                    Diagnóstico de vitalidad actual
                </p>
            </div>

            {/* Gauge / Bar Visualization */}
            <div className="relative py-12">
                {/* Bar Container */}
                <div className="h-4 w-full bg-[#0B0D10] border border-[#1F2533] rounded-full overflow-hidden relative">
                    {/* Background Zones */}
                    <div className="absolute left-0 w-[30%] h-full bg-[#E74C3C]/20 border-r border-[#E74C3C]/50" />
                    <div className="absolute left-[30%] w-[50%] h-full bg-[#F1C40F]/20 border-r border-[#F1C40F]/50" />
                    <div className="absolute right-0 w-[20%] h-full bg-[#2ECC71]/20" />

                    {/* Indicator */}
                    <div
                        className={`absolute h-full w-2 rounded-full ${getColor().split(' ')[2]} shadow-[0_0_15px_currentColor] transition-all duration-1000 ease-out`}
                        style={{ left: `${Math.min(Math.max(rate * 10, 5), 95)}%` }} // Simple scaling logic (10% ER = 100% Bar)
                    />
                </div>

                {/* Labels */}
                <div className="flex justify-between text-[10px] font-mono mt-3 text-[#9AA4B2]/50 uppercase tracking-widest">
                    <span>Crítico</span>
                    <span>Riesgo</span>
                    <span>Óptimo</span>
                </div>
            </div>

            {/* Status Card */}
            <div className={`p-6 border border-l-4 bg-[#0B0D10] ${getColor().split(' ')[1]}`}>
                <div className="flex items-center gap-4">
                    <Activity className={`w-6 h-6 ${getColor().split(' ')[0]}`} />
                    <div>
                        <h4 className={`text-sm font-bold uppercase tracking-widest ${getColor().split(' ')[0]}`}>
                            Estado: {status === "CRITICAL" ? "Restringido" : status === "RISK" ? "Advertencia" : "Saludable"}
                        </h4>
                        <p className="text-xs text-[#9AA4B2] mt-1 font-mono">
                            Estimación basada en métricas públicas actuales ({rate.toFixed(2)}% ER)
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setPhase("AMBITION")}
                className="w-full px-10 py-5 bg-[#C9A24D] text-[#0B0D10] font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#b08d44] transition-all shadow-lg"
            >
                Continuar Análisis
            </button>
        </div>
    );
}
