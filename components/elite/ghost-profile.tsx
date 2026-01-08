"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';

interface GhostProfileProps {
    isScanning?: boolean;
}

const TERMINAL_LOGS = [
    "Mapeando Nodos de Autoridad...",
    "Identificando Fricción Algorítmica...",
    "Sincronizando Potencial de Escalabilidad 2026...",
    "Analizando Vectores de Retención...",
    "Calculando Coeficiente de Viralidad...",
    "Detectando Fugas de Audiencia...",
    "Verificando Integridad de Enlaces...",
    "Compilando Matriz de Oportunidad..."
];

export const GhostProfile = ({ isScanning = false }: GhostProfileProps) => {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        if (!isScanning) {
            setLogs([]);
            return;
        }

        let index = 0;
        const interval = setInterval(() => {
            if (index < TERMINAL_LOGS.length) {
                setLogs(prev => [...prev.slice(-4), TERMINAL_LOGS[index]]);
                index++;
            }
        }, 800);

        return () => clearInterval(interval);
    }, [isScanning]);

    return (
        <div className="relative w-full max-w-md mx-auto aspect-square bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-amber-900/10 group">

            {/* Efecto de Escaneo (Gold Line) */}
            <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[1px] bg-white z-10 box-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            />

            {/* Interfaz de Usuario Fantasma */}
            <div className={`p-6 transition-all duration-1000 ${isScanning ? 'opacity-30 blur-[1px]' : 'opacity-20 grayscale blur-[0px]'}`}>
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-white/10" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-white/10 rounded" />
                        <div className="h-3 w-20 bg-white/10 rounded" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="aspect-square bg-white/5 rounded-sm flex items-center justify-center">
                            {!isScanning && <Lock className="w-4 h-4 text-white/10" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Overlays */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key="scanning-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col justify-between p-6 bg-black/40 backdrop-blur-[1px]"
                >
                    {/* Top: Tech Header */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                                <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-[0.2em]">
                                    Audit Interface
                                </span>
                            </div>
                            <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest pl-3.5">
                                Protocol v4.0 Active
                            </div>
                        </div>
                        <Lock className="w-4 h-4 text-white/20" />
                    </div>

                    {/* Bottom: Logs */}
                    <div className="space-y-1 font-mono text-[9px]">
                        {logs.slice(-3).map((log, i) => (
                            <motion.div
                                key={`${i}-${log}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-white/60 flex items-center gap-2"
                            >
                                <span className="text-[#C5A059] text-[8px] opacity-70">➜</span>
                                {log}
                            </motion.div>
                        ))}
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-1.5 h-3 bg-[#C5A059] mt-1"
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
