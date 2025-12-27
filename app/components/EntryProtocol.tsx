"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SequenceState = 'BOOT' | 'MANIFESTO' | 'PROTOCOL' | 'INPUT_READY';
type Language = 'EN' | 'ES' | 'PT';

// --- TEXT CONTENT ---
const COPY = {
    EN: {
        boot: [
            "INITIALIZING SECURE EVALUATION ENVIRONMENT",
            "CALIBRATING JUDGMENT PARAMETERS",
            "LOADING DECISION PROTOCOL"
        ],
        manifesto: [
            "TDT does not issue recommendations.",
            "This system executes technical evaluations",
            "on the structural viability of digital assets.",
            "The result may enable, degradate, or block",
            "any form of intervention.",
            "Access implies acceptance of the system's criteria."
        ],
        hero: {
            title: "TDT — CAPITALIZATION ARCHITECTURE PROTOCOL",
            subtitle: "Detection of structural asymmetries and unrealized value in high-complexity digital assets."
        },
        controls: {
            acknowledge: "[ ACKNOWLEDGE PROTOCOL ]",
            inputLabel: "ASSET IDENTIFIER",
            execute: "[ EXECUTE EVALUATION ]",
            placeholder: "@instagram_username",
            lockedSession: "PUBLIC SIGNAL ANALYSIS · SESSION LOCKED"
        }
    },
    ES: {
        boot: [
            "INICIALIZANDO ENTORNO DE EVALUACIÓN SEGURA",
            "CALIBRANDO PARÁMETROS DE JUICIO",
            "CARGANDO PROTOCOLO DE DECISIÓN"
        ],
        manifesto: [
            "TDT no emite recomendaciones.",
            "Este sistema ejecuta evaluaciones técnicas",
            "sobre la viabilidad estructural de activos digitales.",
            "El resultado puede habilitar, degradar o bloquear",
            "cualquier forma de intervención.",
            "El acceso implica aceptación del criterio del sistema."
        ],
        hero: {
            title: "TDT — CAPITALIZATION ARCHITECTURE PROTOCOL",
            subtitle: "Detección de asimetrías estructurales y valor no realizado en activos digitales de alta complejidad."
        },
        controls: {
            acknowledge: "[ ACEPTAR PROTOCOLO ]",
            inputLabel: "IDENTIFICADOR DE ACTIVO",
            execute: "[ EJECUTAR EVALUACIÓN ]",
            placeholder: "@usuario_instagram",
            lockedSession: "ANÁLISIS DE SEÑAL PÚBLICA · SESIÓN BLOQUEADA"
        }
    },
    PT: {
        boot: [
            "INICIALIZANDO AMBIENTE DE AVALIAÇÃO SEGURA",
            "CALIBRANDO PARÂMETROS DE JULGAMENTO",
            "CARREGANDO PROTOCOLO DE DECISÃO"
        ],
        manifesto: [
            "TDT não emite recomendações.",
            "Este sistema executa avaliações técnicas",
            "sobre a viabilidade estrutural de ativos digitais.",
            "O resultado pode habilitar, degradar ou bloquear",
            "qualquer forma de intervenção.",
            "O acesso implica aceitação do critério do sistema."
        ],
        hero: {
            title: "TDT — PROTOCOLO DE ARQUITETURA DE CAPITALIZAÇÃO",
            subtitle: "Detecção de assimetrias estruturais e valor não realizado em ativos digitais de alta complexidade."
        },
        controls: {
            acknowledge: "[ ACEITAR PROTOCOLO ]",
            inputLabel: "IDENTIFICADOR DO ATIVO",
            execute: "[ EXECUTAR AVALIAÇÃO ]",
            placeholder: "@usuario_instagram",
            lockedSession: "ANÁLISE DE SINAL PÚBLICO · SESSÃO BLOQUEADA"
        }
    }
};

interface EntryProtocolProps {
    onExecute: (handle: string) => void;
}

export default function EntryProtocol({ onExecute }: EntryProtocolProps) {
    const [step, setStep] = useState<SequenceState>('BOOT');
    const [lang, setLang] = useState<Language>('ES');
    const [inputValue, setInputValue] = useState("");

    // --- TIMING ---
    useEffect(() => {
        // Boot Sequence: 2.0s total
        if (step === 'BOOT') {
            const timer = setTimeout(() => {
                setStep('MANIFESTO');
            }, 2000);
            return () => clearTimeout(timer);
        }

        // Manifesto: Wait for user? Or auto? 
        // Instructions: "No hay botón aún. Silencio 1s tras render." -> Doesn't explicitly say auto-advance, but implies it transitions to Hero or requires a click?
        // "3. DECLARATION OF AUTHORITY ... No button yet. Silence 1s after render."
        // "4. HERO ... This is the focal point."
        // I will assume auto-transition after reading time (e.g., 4-5s) OR click anywhere.
        // Let's make it auto for now, 5s.
        if (step === 'MANIFESTO') {
            const timer = setTimeout(() => {
                setStep('PROTOCOL');
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleAcknowledge = () => {
        setStep('INPUT_READY');
    };

    const handleExecute = () => {
        if (!inputValue) return;
        // Trigger Analysis
        console.log("EXECUTE", inputValue);
        onExecute(inputValue);
    };

    const content = COPY[lang];

    return (
        <div className="min-h-screen bg-black text-gray-400 font-mono flex flex-col items-center justify-center p-4 overflow-hidden relative selection:bg-gray-800 selection:text-white">

            {/* GLOBAL LANGUAGE SELECTOR (Visible in PROTOCOL phase and beyond) */}
            {step !== 'BOOT' && step !== 'MANIFESTO' && (
                <div className="absolute top-6 right-6 flex gap-4 text-xs tracking-widest z-50">
                    {(['EN', 'ES', 'PT'] as Language[]).map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`${lang === l ? 'text-white border-b border-white' : 'text-gray-600 hover:text-gray-400'} pb-1 transition-colors`}
                        >
                            [{l}]
                        </button>
                    ))}
                </div>
            )}

            <AnimatePresence mode='wait'>

                {/* 1. BLACK SCREEN BOOT */}
                {step === 'BOOT' && (
                    <motion.div
                        key="boot"
                        className="flex flex-col gap-2 items-start max-w-md w-full"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {content.boot.map((line, i) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.5, duration: 0 }}
                                className="text-xs md:text-sm text-gray-500"
                            >
                                {`> ${line}...`}
                            </motion.p>
                        ))}
                    </motion.div>
                )}

                {/* 2. MANIFESTO */}
                {step === 'MANIFESTO' && (
                    <motion.div
                        key="manifesto"
                        className="max-w-[640px] text-center space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 1 } }}
                        transition={{ duration: 1.5 }}
                    >
                        <div className="space-y-4 text-sm md:text-base leading-relaxed text-gray-300">
                            {content.manifesto.map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* 3. HERO & PROTOCOL */}
                {(step === 'PROTOCOL' || step === 'INPUT_READY') && (
                    <motion.div
                        key="protocol"
                        className="w-full max-w-4xl flex flex-col items-center text-center space-y-12"
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 1.2 }}
                    >
                        {/* HERO */}
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase">
                                {content.hero.title}
                            </h1>
                            <p className="text-sm md:text-base text-gray-500 tracking-wide">
                                {content.hero.subtitle}
                            </p>
                        </div>

                        {/* INTERACTION AREA */}
                        <div className="w-full max-w-md space-y-8 min-h-[200px] flex flex-col items-center justify-center">

                            {step === 'PROTOCOL' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <button
                                        onClick={handleAcknowledge}
                                        className="text-xs md:text-sm text-white border border-gray-800 hover:border-gray-500 px-8 py-3 tracking-[0.2em] transition-all hover:bg-gray-900 active:scale-95"
                                    >
                                        {content.controls.acknowledge}
                                    </button>
                                </motion.div>
                            )}

                            {step === 'INPUT_READY' && (
                                <motion.div
                                    className="w-full space-y-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-gray-600 tracking-widest uppercase">
                                            {content.controls.inputLabel}
                                        </p>
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder={content.controls.placeholder}
                                            className="w-full bg-transparent border-b border-gray-800 py-3 text-center text-xl text-white focus:outline-none focus:border-gray-500 transition-colors placeholder:text-gray-800 font-mono"
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                                        />
                                    </div>

                                    <div className="flex flex-col items-center gap-4">
                                        <p className="text-[10px] text-gray-700 font-mono">
                                            {content.controls.lockedSession}
                                        </p>

                                        <button
                                            onClick={handleExecute}
                                            className="text-[10px] text-gray-500 hover:text-white transition-colors tracking-widest"
                                        >
                                            {content.controls.execute}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
