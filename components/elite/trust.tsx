"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Trust() {
    const [count, setCount] = useState(142); // Starting count

    // Counter effect
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly increment every few seconds to simulate live activity
            if (Math.random() > 0.7) {
                setCount(prev => prev + 1);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-12 bg-black border-y border-white/5 relative z-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left: Verificator Counter */}
                <div className="flex items-center gap-6 justify-center md:justify-start">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-[#007AFF]/10 flex items-center justify-center border border-[#007AFF]/30 animate-pulse">
                            <CheckCircle2 className="w-8 h-8 text-[#007AFF]" />
                        </div>
                        <div className="absolute inset-0 border border-[#007AFF]/20 rounded-full scale-150 opacity-20" />
                    </div>
                    <div>
                        <div className="text-3xl font-mono font-bold text-white flex items-center gap-2">
                            {count}
                            <span className="text-xs text-[#007AFF] bg-[#007AFF]/10 px-2 py-0.5 rounded uppercase tracking-widest">Live</span>
                        </div>
                        <p className="text-xs text-white/50 uppercase tracking-[0.2em] mt-1">
                            Marcas Personales Verificadas en 2025
                        </p>
                    </div>
                </div>

                {/* Right: Platform Logos (Minimalist) */}
                <div className="flex justify-center md:justify-end gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Replaced real SVGs with Lucide for simplicity in this artifact, but normally would use real SVGs */}
                    <div className="flex flex-col items-center gap-2 group">
                        <Instagram className="w-8 h-8 text-white group-hover:text-[#E1306C] transition-colors" />
                    </div>
                    <div className="flex flex-col items-center gap-2 group">
                        <Linkedin className="w-8 h-8 text-white group-hover:text-[#0077b5] transition-colors" />
                    </div>
                    <div className="flex flex-col items-center gap-2 group">
                        <Twitter className="w-8 h-8 text-white group-hover:text-[#1DA1F2] transition-colors" />
                    </div>
                    <div className="h-8 w-[1px] bg-white/20" />
                    <span className="font-serif text-xl italic text-white/80">Forbes</span>
                    <span className="font-serif text-xl italic text-white/80">Bloomberg</span>
                </div>

            </div>
        </section>
    );
}
