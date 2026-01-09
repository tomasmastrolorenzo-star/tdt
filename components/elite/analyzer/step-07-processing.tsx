"use client";

import { useAnalyzer } from "./context";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Processing() {
    const { setPhase, addLog } = useAnalyzer();
    const [step, setStep] = useState(0);

    const steps = [
        "Validando señales de autoridad...",
        "Compilando Blueprint de crecimiento...",
        "Calculando proyecciones 2026...",
        "Encriptando resultados...",
        "Preparando protocolo de entrega..."
    ];

    useEffect(() => {
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            setStep(currentStep);
            if (steps[currentStep]) addLog(steps[currentStep].toUpperCase());

            if (currentStep >= steps.length) {
                clearInterval(interval);
                addLog("PROTOCOLO LISTO PARA DESPACHO.");
                setTimeout(() => setPhase("GATE"), 1000);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8 animate-in fade-in duration-500">
            {/* Tech Loader */}
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-t-2 border-[#C9A24D] rounded-full animate-spin" />
                <div className="absolute inset-2 border-r-2 border-[#E6E8EC]/30 rounded-full animate-spin direction-reverse duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#C9A24D] rounded-full animate-pulse" />
                </div>
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-[#E6E8EC] uppercase tracking-widest animate-pulse">
                    {steps[Math.min(step, steps.length - 1)]}
                </h3>
                <p className="text-[#9AA4B2] text-xs font-mono">
                    Procesando {Math.min((step + 1) * 20, 99)}%
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-[#1F2533] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#C9A24D] transition-all duration-500 ease-out"
                    style={{ width: `${Math.min((step + 1) * 20, 100)}%` }}
                />
            </div>
        </div>
    );
}
