"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Trust() {
    const [count, setCount] = useState(520); // Updated starting count

    // Counter effect
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly increment every few seconds to simulate live activity
            if (Math.random() > 0.8) {
                setCount(prev => prev + 1);
            }
        }, 8000); // Slower, more "boutique" pace
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-16 bg-black border-y border-white/5 relative z-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left: Verificator Counter */}
                <div className="flex items-center gap-6 justify-center md:justify-start">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-[#007AFF]/5 flex items-center justify-center border border-[#007AFF]/20">
                            <CheckCircle2 className="w-6 h-6 text-[#007AFF]" />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-serif text-white flex items-center gap-3">
                            {count}
                            <span className="text-[10px] text-[#007AFF] border border-[#007AFF]/30 px-2 py-0.5 rounded-full uppercase tracking-widest">Live Portfolio</span>
                        </div>
                        <p className="text-xs text-white/40 uppercase tracking-[0.2em] mt-2 font-mono">
                            Cartera de Autoridad: Casos Verificados en 2025
                        </p>
                    </div>
                </div>

                {/* Right: Platform Logos (Minimalist, Grayscale, Low Opacity) */}
                <div className="flex justify-center md:justify-end gap-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                    {/* Using text for Forbes/Bloomberg as requested style implies wordmarks */}
                    <span className="font-serif text-2xl text-white/80 tracking-tight">Forbes</span>
                    <span className="font-serif text-2xl text-white/80 tracking-tight">Bloomberg</span>
                    <span className="font-serif text-2xl text-white/80 tracking-tight">Business Insider</span>
                </div>

            </div>
        </section>
    );
}
