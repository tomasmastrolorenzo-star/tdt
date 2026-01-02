"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GhostProfileProps {
    isScanning?: boolean;
}

const TERMINAL_LOGS = [
    "Initializing forensic daemon...",
    "Bypassing cache layer...",
    "Extracting metadata vectors...",
    "Parsing engagement heuristics...",
    "Detecting follower anomalies...",
    "Analyzing semantic density...",
    "Triangulating authority signals...",
    "Compiling shadow profile...",
    "Verifying institutional links...",
    "Generating risk matrix..."
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
        <div className="relative w-full max-w-md mx-auto aspect-square bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 group">

            {/* Efecto de Escaneo */}
            <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />

            {/* Interfaz de Usuario Fantasma */}
            <div className={`p-6 transition-all duration-1000 ${isScanning ? 'opacity-20 blur-[2px]' : 'opacity-30 grayscale blur-[1px]'}`}>
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-white/10 rounded" />
                        <div className="h-3 w-20 bg-white/10 rounded" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="aspect-square bg-white/5 rounded-sm" />
                    ))}
                </div>
            </div>

            {/* Overlays: Scanning Logic vs Static Alerts */}
            <AnimatePresence mode='wait'>
                {isScanning ? (
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-start justify-end p-6 bg-black/40 font-mono text-xs"
                    >
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-green-500/80 mb-1"
                            >
                                {`> ${log}`}
                            </motion.div>
                        ))}
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-2 h-4 bg-green-500 mt-1"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="static"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center space-y-4"
                    >
                        <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-red-900/20 border border-red-500/50 px-4 py-2 rounded text-[10px] font-mono text-red-400 tracking-widest backdrop-blur-md"
                        >
                            ⚠️ VISIBILIDAD CRÍTICA: DILUCIÓN DETECTADA
                        </motion.div>
                        <div className="font-mono text-[8px] text-blue-400/60 uppercase tracking-tighter">
                            Scanning assets... 0x4F2A... Status: Non-Verified
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
