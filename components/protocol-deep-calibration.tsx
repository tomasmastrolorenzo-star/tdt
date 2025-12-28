"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldAlert, Cpu } from 'lucide-react';
import { OperatorContext } from '@/app/lib/forensic/intelligence';

interface ProtocolDeepCalibrationProps {
    onComplete: (data: OperatorContext) => void;
}

type Step = 'HORIZON' | 'SACRIFICE' | 'THRESHOLD' | 'VETO' | 'LOCKED';

export default function ProtocolDeepCalibration({ onComplete }: ProtocolDeepCalibrationProps) {
    const [step, setStep] = useState<Step>('HORIZON');
    const [data, setData] = useState<Partial<OperatorContext>>({});
    const [isThinking, setIsThinking] = useState(false);

    const handleSelection = async (key: keyof OperatorContext, value: string) => {
        setIsThinking(true);

        // Emulate system processing
        setTimeout(() => {
            const newData = { ...data, [key]: value };
            setData(newData);
            setIsThinking(false);

            if (step === 'HORIZON') setStep('SACRIFICE');
            else if (step === 'SACRIFICE') setStep('THRESHOLD');
            else if (step === 'THRESHOLD') setStep('VETO');
            else if (step === 'VETO') {
                finalize(newData as OperatorContext);
            }
        }, 800);
    };

    const finalize = async (finalData: OperatorContext) => {
        setStep('LOCKED');
        // Generate Mock Hash (In production use crypto.subtle)
        const mockHash = `TX-${Date.now().toString(16).toUpperCase()}-${Math.random().toString(16).substr(2, 8).toUpperCase()}`;

        setTimeout(() => {
            onComplete({ ...finalData, context_hash: mockHash });
        }, 2000);
    };

    const renderOption = (label: string, value: string, currentStepKey: keyof OperatorContext, description?: string) => (
        <button
            onClick={() => handleSelection(currentStepKey, value)}
            disabled={isThinking}
            className="w-full text-left p-4 border border-white/10 bg-[#0A0A0A] hover:border-white hover:bg-black transition-all duration-100 group relative overflow-hidden"
        >
            <div className="flex justify-between items-center relative z-10">
                <div>
                    <span className="block text-xs font-mono text-gray-400 group-hover:text-white transition-colors tracking-widest uppercase">
                        [{label}]
                    </span>
                    {description && (
                        <span className="block text-[10px] text-gray-600 group-hover:text-gray-400 mt-1 font-mono tracking-tight uppercase">
                            {description}
                        </span>
                    )}
                </div>
                <div className="w-2 h-2 bg-white/10 group-hover:bg-[#d4af37] rotate-0 transition-all" />
            </div>
        </button>
    );

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-6 select-none cursor-default">

            <div className="w-full max-w-md space-y-8">

                {/* Header */}
                <div className="border-l-2 border-[#333] pl-4 transition-all duration-500" style={{ borderColor: isThinking ? '#d4af37' : '#333' }}>
                    <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-1">
                        PHASE 65 DEEP PROTOCOL
                    </h2>
                    <h1 className="text-xl text-white font-mono font-bold uppercase tracking-widest">
                        {step === 'HORIZON' && "OPERATIVE HORIZON LOCK"}
                        {step === 'SACRIFICE' && "SACRIFICE DECLARATION"}
                        {step === 'THRESHOLD' && "FAILURE THRESHOLD"}
                        {step === 'VETO' && "ABSOLUTE VETO"}
                        {step === 'LOCKED' && "CONTEXT FINALIZATION"}
                    </h1>
                </div>

                {/* Content */}
                <div className="space-y-4 min-h-[300px]">
                    <AnimatePresence mode="wait">

                        {/* INPUT 1: HORIZON */}
                        {step === 'HORIZON' && (
                            <motion.div
                                key="horizon"
                                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                                className="space-y-4"
                            >
                                <p className="text-xs text-gray-400 font-mono mb-6 uppercase tracking-widest">DECLARE MEASURABLE RESULTS COMMITMENT WINDOW</p>
                                {renderOption("IMMEDIATE_RESULTS", "IMMEDIATE_RESULTS", "operative_horizon", "0–3 months")}
                                {renderOption("STRATEGIC_BUILD", "STRATEGIC_BUILD", "operative_horizon", "4–9 months")}
                                {renderOption("TRANSFORMATIONAL", "TRANSFORMATIONAL", "operative_horizon", "10–18 months")}
                                {renderOption("LEGACY_BUILD", "LEGACY_BUILD", "operative_horizon", "19+ months")}
                            </motion.div>
                        )}

                        {/* INPUT 2: SACRIFICE */}
                        {step === 'SACRIFICE' && (
                            <motion.div
                                key="sacrifice"
                                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                                className="space-y-4"
                            >
                                <p className="text-xs text-gray-400 font-mono mb-6 uppercase tracking-widest">DECLARE PRIMARY RESOURCE ALLOCATION</p>
                                {renderOption("OPERATOR_ACTIVE", "OPERATOR_ACTIVE", "sacrifice_model", "≥20h/week personal involvement")}
                                {renderOption("CAPITAL_COMMITTED", "CAPITAL_COMMITTED", "sacrifice_model", "Liquid capital allocation")}
                                {renderOption("CONTROL_CEDED", "CONTROL_CEDED", "sacrifice_model", "Delegation of control")}
                                {renderOption("SKIN_IN_GAME", "SKIN_IN_GAME", "sacrifice_model", "Personal exposure / reputation")}
                            </motion.div>
                        )}

                        {/* INPUT 3: THRESHOLD */}
                        {step === 'THRESHOLD' && (
                            <motion.div
                                key="threshold"
                                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                                className="space-y-4"
                            >
                                <p className="text-xs text-gray-400 font-mono mb-6 uppercase tracking-widest">ESTABLISH NON-VIABILITY CONDITION</p>
                                {renderOption("ROI_SENSITIVE", "ROI_SENSITIVE", "failure_threshold", "ROI < 1.5x")}
                                {renderOption("GROWTH_DRIVEN", "GROWTH_DRIVEN", "failure_threshold", "<20% YoY growth")}
                                {renderOption("MARKET_SHARE_FOCUS", "MARKET_SHARE_FOCUS", "failure_threshold", "Competitive position loss")}
                                {renderOption("CAPITAL_CONSTRAINED", "CAPITAL_CONSTRAINED", "failure_threshold", "Allocated resources depleted")}
                            </motion.div>
                        )}

                        {/* INPUT 4: VETO */}
                        {step === 'VETO' && (
                            <motion.div
                                key="veto"
                                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                                className="space-y-4"
                            >
                                <p className="text-xs text-gray-400 font-mono mb-6 uppercase tracking-widest">DECLARE IMMEDIATE EXIT CONDITION</p>
                                {renderOption("COMPLIANCE_ABSOLUTE", "COMPLIANCE_ABSOLUTE", "operational_veto", "Illegal / regulatory risk")}
                                {renderOption("CONTROL_REQUIRED", "CONTROL_REQUIRED", "operational_veto", "External dependency")}
                                {renderOption("SCALABILITY_CONSCIOUS", "SCALABILITY_CONSCIOUS", "operational_veto", "Capacity exceeded")}
                                {renderOption("AUDIENCE_PRIMARY", "AUDIENCE_PRIMARY", "operational_veto", "Audience damage")}
                            </motion.div>
                        )}

                        {/* LOCKED STATE */}
                        {step === 'LOCKED' && (
                            <motion.div
                                key="locked"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 space-y-6"
                            >
                                <Lock className="w-12 h-12 text-[#d4af37] animate-pulse" />
                                <div className="text-center space-y-2">
                                    <h3 className="text-white font-mono text-lg tracking-widest">STATUS: PARAMETER LOCKED</h3>
                                    <p className="text-gray-600 font-mono text-xs uppercase">Hashing Context...</p>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Footer / Status */}
                <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-[#d4af37] animate-ping' : 'bg-gray-600'}`} />
                        <span className="text-[9px] text-gray-600 font-mono tracking-widest uppercase">
                            SYSTEM ACTIVE
                        </span>
                    </div>
                    <span className="text-[9px] text-[#333] font-mono tracking-widest">
                        v1.2.4
                    </span>
                </div>

            </div>
        </div>
    );
}
