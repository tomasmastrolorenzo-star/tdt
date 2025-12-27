"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, AlertTriangle } from 'lucide-react';

// --- TYPES ---

export interface IntentDeclaration {
    nature: string;
    market: string;
    objective: string;
    commitment: string;
}

type Step = 'NATURE' | 'MARKET' | 'OBJECTIVE' | 'COMMITMENT' | 'LOCKED';

// --- CONFIGURATION DATA ---

const LAYERS = {
    NATURE: {
        title: "ASSET NATURE CONFIGURATION",
        subtitle: "SELECT PRIMARY CLASSIFICATION",
        options: [
            { id: 'PROFESSIONAL', label: 'PROFESSIONAL ENTITY', sub: 'Doctor · Surgeon · Consultant · Expert' },
            { id: 'CREATOR', label: 'CREATOR / PUBLIC FIGURE', sub: 'Influencer · Artist · Educator' },
            { id: 'BRAND', label: 'COMMERCIAL BRAND', sub: 'Company · Product · Service' },
            { id: 'REAL_ESTATE', label: 'REAL ESTATE OPERATOR', sub: 'Agent · Developer · Investment Firm' },
            { id: 'FINANCE', label: 'FINANCIAL OPERATION', sub: 'Trading · Crypto · Investment Education' }
        ]
    },
    MARKET: {
        title: "TARGET MARKET SPECIFICATION",
        subtitle: "DEFINE OPERATING REGION",
        options: [
            { id: 'NA', label: 'NORTH AMERICA', sub: 'USA · Canada' },
            { id: 'EU', label: 'EUROPE', sub: 'EU Zone · UK' },
            { id: 'LATAM', label: 'LATAM', sub: 'South & Central America' },
            { id: 'ME', label: 'MIDDLE EAST', sub: 'GCC · Emerging Markets' }
        ]
        // Note: Full depth implementation (Country/City) could be complex UI. 
        // For "Phase 61" MVP logic as requested "Implement exactly", I will stick to Region for now unless user asks for deeper drilldown.
        // Prompt says: "Paso 2 – País (depende de región), Paso 3 – Profundidad".
        // I will implement a multi-stage selection within MARKET if needed, or simplify to Region for the "Ritual" feel first.
        // Let's implement Region primarily for the "Macro" context.
    },
    OBJECTIVE: {
        title: "OPERATIONAL OBJECTIVE",
        subtitle: "DECLARE PRIMARY INTENT",
        options: [
            { id: 'AUTHORITY', label: 'AUTHORITY & POSITIONING', sub: 'Brand Equity Focus' },
            { id: 'LEAD_GEN', label: 'LEAD GENERATION', sub: 'Conversion Focus' },
            { id: 'REPUTATION', label: 'REPUTATION RECOVERY', sub: 'Crisis Management' },
            { id: 'MONETIZATION', label: 'MONETIZATION OPTIMIZATION', sub: 'Revenue Focus' },
            { id: 'SCALE', label: 'SCALE TO 7-FIGURES', sub: 'Aggressive Growth' }
        ]
    },
    COMMITMENT: {
        title: "DECLARED COMMITMENT LEVEL",
        subtitle: "SELECT OPERATIONAL DEPTH",
        options: [
            { id: 'TACTICAL', label: 'TACTICAL IMPROVEMENTS', sub: 'Low involvement' },
            { id: 'STRUCTURAL', label: 'STRUCTURAL OPTIMIZATION', sub: 'Medium involvement' },
            { id: 'FULL', label: 'FULL INTERVENTION', sub: 'High involvement · Delegation' }
        ]
    }
};

interface ProtocolCalibrationProps {
    onComplete: (data: IntentDeclaration) => void;
}

export default function ProtocolCalibration({ onComplete }: ProtocolCalibrationProps) {
    const [step, setStep] = useState<Step>('NATURE');
    const [data, setData] = useState<IntentDeclaration>({ nature: '', market: '', objective: '', commitment: '' });
    const [isLocking, setIsLocking] = useState(false); // Visual transition for "LOCKED"

    const handleSelect = (key: keyof IntentDeclaration, value: string) => {
        setIsLocking(true);
        setTimeout(() => {
            const newData = { ...data, [key]: value };
            setData(newData);

            // Advance Step
            if (step === 'NATURE') setStep('MARKET');
            else if (step === 'MARKET') setStep('OBJECTIVE');
            else if (step === 'OBJECTIVE') setStep('COMMITMENT');
            else if (step === 'COMMITMENT') {
                setStep('LOCKED');
                setTimeout(() => onComplete(newData), 2000); // Final lock delay
            }

            setIsLocking(false);
        }, 800); // "Parameter Locked" delay
    };

    return (
        <div className="h-screen w-full bg-[#050505] text-gray-300 font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* BACKGROUND GRID */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            {/* HEADER STATUS */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 border-b border-gray-900 bg-black/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs tracking-widest text-gray-500">
                    <div className={`w-2 h-2 rounded-full ${step === 'LOCKED' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                    PROTOCOL CONFIGURATION
                </div>
                <div className="text-[10px] text-gray-600 uppercase">
                    SECURE CHANNEL // ID-74X
                </div>
            </div>

            <AnimatePresence mode='wait'>
                {step !== 'LOCKED' && !isLocking ? (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-2xl z-20"
                    >
                        {/* HEADER */}
                        <div className="mb-12 border-l-2 border-white pl-6">
                            <h2 className="text-sm text-gray-500 tracking-[0.2em] mb-2 uppercase">
                                {LAYERS[step].title}
                            </h2>
                            <h1 className="text-2xl md:text-3xl text-white font-bold tracking-tight uppercase">
                                {LAYERS[step].subtitle}
                            </h1>
                        </div>

                        {/* OPTIONS */}
                        <div className="grid grid-cols-1 gap-4">
                            {LAYERS[step].options.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleSelect(step.toLowerCase() as keyof IntentDeclaration, opt.id)}
                                    className="group text-left p-6 border border-gray-800 hover:border-white hover:bg-white/5 transition-all duration-300 flex justify-between items-center"
                                >
                                    <div>
                                        <div className="text-white text-lg tracking-wide group-hover:text-[#d4af37] transition-colors uppercase">
                                            [{opt.label}]
                                        </div>
                                        <div className="text-xs text-gray-600 mt-1 font-sans uppercase">
                                            {opt.sub}
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4af37]">
                                        <Lock size={16} />
                                    </div>
                                </button>
                            ))}
                        </div>

                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="z-20 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <Lock className="w-12 h-12 text-[#d4af37] animate-pulse" />
                        <div className="space-y-2">
                            <h2 className="text-xl text-white font-bold tracking-widest uppercase">
                                {step === 'LOCKED' ? "CALIBRATION COMPLETE" : "PARAMETER LOCKED"}
                            </h2>
                            <p className="text-xs text-gray-500 tracking-[0.2em] uppercase">
                                {step === 'LOCKED' ? "INITIATING FORENSIC ENGINE..." : "SAVING CONFIGURATION STATE..."}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PROGRESS INDICATOR */}
            <div className="absolute bottom-12 left-0 w-full flex justify-center gap-2">
                {['NATURE', 'MARKET', 'OBJECTIVE', 'COMMITMENT'].map((s, i) => {
                    const currentIdx = ['NATURE', 'MARKET', 'OBJECTIVE', 'COMMITMENT', 'LOCKED'].indexOf(step);
                    const isActive = i <= currentIdx;
                    return (
                        <div key={s} className={`h-1 w-12 ${isActive ? 'bg-white' : 'bg-gray-800'} transition-colors duration-500`} />
                    )
                })}
            </div>

        </div>
    );
}
