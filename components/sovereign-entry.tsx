"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SequenceState = 'HERO' | 'ACKNOWLEDGED' | 'INPUT_READY';
type Language = 'EN' | 'ES' | 'PT';

// --- TEXT CONTENT (PHASE 63 STRICT) ---
const COPY = {
    EN: {
        line1: "ARCHITECTURE OF DIGITAL CAPITALIZATION",
        line2: "PRIVATE DIAGNOSTIC SYSTEM FOR HIGH-COMPLEXITY ASSETS",
        line3: "THE SYSTEM DOES NOT ADVISE. IT DETERMINES STRUCTURAL VIABILITY.",
        acknowledge: "ACKNOWLEDGE OPERATIONAL PROTOCOL",
        inputLabel: "ASSET IDENTIFIER",
        execute: "[ EXECUTE EVALUATION ]",
        placeholder: "username"
    },
    ES: {
        line1: "ARQUITECTURA DE CAPITALIZACIÓN DIGITAL",
        line2: "SISTEMA DE DIAGNÓSTICO PRIVADO PARA ACTIVOS DE ALTA COMPLEJIDAD",
        line3: "EL SISTEMA NO ASESORA. DETERMINA VIABILIDAD ESTRUCTURAL.",
        acknowledge: "ACEPTAR PROTOCOLO OPERATIVO",
        inputLabel: "IDENTIFICADOR DE ACTIVO",
        execute: "[ EJECUTAR EVALUACIÓN ]",
        placeholder: "usuario"
    },
    PT: {
        line1: "ARQUITETURA DE CAPITALIZAÇÃO DIGITAL",
        line2: "SISTEMA DE DIAGNÓSTICO PRIVADO PARA ATIVOS DE ALTA COMPLEXIDADE",
        line3: "O SISTEMA NÃO ACONSELHA. DETERMINA VIABILIDADE ESTRUTURAL.",
        acknowledge: "ACEITAR PROTOCOLO OPERACIONAL",
        inputLabel: "IDENTIFICADOR DO ATIVO",
        execute: "[ EXECUTAR AVALIAÇÃO ]",
        placeholder: "usuario"
    }
};

interface SovereignEntryProps {
    onExecute: (handle: string) => void;
    lang: Language;
    setLang: (lang: Language) => void;
}

export default function SovereignEntry({ onExecute, lang, setLang }: SovereignEntryProps) {
    const [step, setStep] = useState<SequenceState>('HERO');
    const [inputValue, setInputValue] = useState("");
    const [showButton, setShowButton] = useState(false);

    // DELAY LOGIC (Block 2)
    useEffect(() => {
        if (step === 'HERO') {
            const timer = setTimeout(() => {
                setShowButton(true);
            }, 3000); // 3s Delay
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleAcknowledge = () => {
        setStep('INPUT_READY');
    };

    const handleExecute = () => {
        if (!inputValue) return;
        onExecute(inputValue);
    };

    const content = COPY[lang];

    return (
        <div className="h-screen w-full bg-[#050505] text-[#E5E5E5] font-mono flex flex-col items-center justify-center relative overflow-hidden selection:bg-white/20">

            {/* GLOBAL LANGUAGE SELECTOR (Block 3) - Visible in Hero */}
            <div className="absolute top-8 right-8 flex gap-6 text-[10px] tracking-widest z-50">
                {(['EN', 'ES', 'PT'] as Language[]).map((l) => (
                    <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`${lang === l ? 'text-white border-b border-white' : 'text-gray-600 hover:text-gray-400'} pb-1 transition-all duration-300`}
                    >
                        {l}
                    </button>
                ))}
            </div>

            <AnimatePresence mode='wait'>
                {step === 'HERO' && (
                    <motion.div
                        key="hero"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1.5 }}
                        className="flex flex-col items-center text-center space-y-12 max-w-4xl p-6"
                    >
                        {/* LINE 1 - DECLARATION */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-xs md:text-sm tracking-[0.3em] font-medium text-gray-500 uppercase"
                        >
                            {content.line1}
                        </motion.h1>

                        {/* LINE 2 - QUALIFIER */}
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 1 }}
                            className="text-lg md:text-2xl font-bold tracking-widest text-[#E5E5E5] uppercase leading-tight"
                        >
                            {content.line2}
                        </motion.h2>

                        {/* LINE 3 - RULE */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.5, duration: 1 }}
                            className="text-[10px] md:text-xs tracking-[0.2em] text-[#d4af37] uppercase opacity-80"
                        >
                            {content.line3}
                        </motion.p>

                        {/* DELAYED ACTION */}
                        <div className="h-16 flex items-center justify-center mt-12">
                            {showButton && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                    onClick={handleAcknowledge}
                                    className="text-[10px] border border-white/20 hover:border-white/60 hover:bg-white/5 text-gray-400 hover:text-white px-6 py-3 tracking-[0.25em] uppercase transition-all duration-500"
                                >
                                    [ {content.acknowledge} ]
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}

                {step === 'INPUT_READY' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center w-full max-w-md space-y-8"
                    >
                        <span className="text-[10px] tracking-[0.3em] text-gray-600 uppercase">
                            {content.inputLabel}
                        </span>

                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                            placeholder={content.placeholder}
                            autoFocus
                            className="w-full bg-transparent border-b border-white/20 py-4 text-center text-2xl text-white font-light tracking-widest focus:outline-none focus:border-[#d4af37] transition-all placeholder:text-white/10 placeholder:text-sm font-mono"
                        />

                        <button
                            onClick={handleExecute}
                            className={`text-[10px] tracking-[0.2em] uppercase transition-all duration-500 ${inputValue ? 'text-[#d4af37] opacity-100' : 'text-gray-700 opacity-50 cursor-not-allowed'}`}
                            disabled={!inputValue}
                        >
                            {content.execute}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
