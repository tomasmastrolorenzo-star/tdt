"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SequenceState = 'UMBRAL_LOGS' | 'UMBRAL_DECLARATION' | 'HERO' | 'HANDSHAKE';
type Language = 'EN' | 'ES' | 'PT';

// PHASE 67 TECHNICAL COPY (No Input)
const COPY = {
    EN: {
        logs: ["INITIALIZING TDT_CORE_V3.0_STABLE...", "LOADING FORENSIC MODULES...", "ESTABLISHING SECURE SESSION... [OK]"],
        declaration: [
            "THIS SYSTEM EXECUTES A FORENSIC AUDIT OF DIGITAL ARCHITECTURES.",
            "THE OUTPUT IS A TECHNICAL VERDICT, NOT A COMMERCIAL SUGGESTION.",
            "BY PROCEEDING, YOU ACKNOWLEDGE THE OBJECTIVITY OF THE SYSTEM."
        ],
        acknowledge: "[ ACKNOWLEDGE PROTOCOL & ENTER ]",
        hero: {
            headerLeft: "TDT // SYSTEM_CORE V3.0",
            headerRight: "LATENCY: 24ms | STATUS: ACTIVE",
            title: "DIGITAL CAPITALIZATION ARCHITECTURE",
            subtitle: "FORENSIC AUDIT OF EMISSION, DISTRIBUTION,\nAND VALUE CAPTURE IN HIGH-COMPLEXITY ASSETS",
            declaration: "The system does not analyze content.\nIt dictates structural viability and identifies latent profit loss\nthrough algorithmic cross-layer correlation."
        },
        input: {
            cta: "INITIATE PROTOCOL CALIBRATION",
            cert: ["○ Public Signal Analysis Only", "○ Meta Platform Compliance"]
        }
    },
    ES: {
        logs: ["INICIALIZANDO TDT_CORE_V3.0_ESTABLE...", "CARGANDO MODULOS FORENSES...", "ESTABLECIENDO SESION SEGURA... [OK]"],
        declaration: [
            "ESTE SISTEMA EJECUTA UNA AUDITORIA FORENSE DE ARQUITECTURAS DIGITALES.",
            "EL RESULTADO ES UN VEREDICTO TECNICO, NO UNA SUGERENCIA COMERCIAL.",
            "AL PROCEDER, USTED RECONOCE LA OBJETIVIDAD DEL SISTEMA."
        ],
        acknowledge: "[ ACEPTAR PROTOCOLO & ENTRAR ]",
        hero: {
            headerLeft: "TDT // NUCLEO_SISTEMA V3.0",
            headerRight: "LATENCIA: 24ms | ESTADO: ACTIVO",
            title: "ARQUITECTURA DE CAPITALIZACION DIGITAL",
            subtitle: "AUDITORIA FORENSE DE EMISION, DISTRIBUCION,\nY CAPTURA DE VALOR EN ACTIVOS DE ALTA COMPLEJIDAD",
            declaration: "El sistema no analiza contenido.\nDictamina viabilidad estructural e identifica perdida de beneficio latente\nmediante correlacion algoritmica multicapa."
        },
        input: {
            cta: "INICIAR CALIBRACION DE PROTOCOLO",
            cert: ["○ Analisis de Señal Publica", "○ Cumplimiento Plataforma Meta"]
        }
    },
    PT: {
        logs: ["INICIALIZANDO TDT_CORE_V3.0_ESTAVEL...", "CARREGANDO MODULOS FORENSES...", "ESTABELECENDO SESSAO SEGURA... [OK]"],
        declaration: [
            "ESTE SISTEMA EXECUTA UMA AUDITORIA FORENSE DE ARQUITETURAS DIGITAIS.",
            "O RESULTADO É UM VEREDICTO TÉCNICO, NÃO UMA SUGESTÃO COMERCIAL.",
            "AO PROCEDER, VOCÊ RECONHECE A OBJETIVIDADE DO SISTEMA."
        ],
        acknowledge: "[ ACEITAR PROTOCOLO & ENTRAR ]",
        hero: {
            headerLeft: "TDT // NUCLEO_SISTEMA V3.0",
            headerRight: "LATENCIA: 24ms | ESTADO: ATIVO",
            title: "ARQUITETURA DE CAPITALIZAÇÃO DIGITAL",
            subtitle: "AUDITORIA FORENSE DE EMISSÃO, DISTRIBUIÇÃO,\nE CAPTURA DE VALOR EM ATIVOS DE ALTA COMPLEXIDADE",
            declaration: "O sistema não analisa conteúdo.\nDetermina viabilidade estrutural e identifica perda de lucro latente\natravés de correlação algorítmica multicamada."
        },
        input: {
            cta: "INICIAR CALIBRAÇAO DE PROTOCOLO",
            cert: ["○ Análise de Sinal Público", "○ Conformidade Plataforma Meta"]
        }
    }
};

interface SovereignEntryProps {
    onExecute: (handle: string) => void;
    lang: Language;
    setLang: (lang: Language) => void;
}

export default function SovereignEntry({ onExecute, lang, setLang }: SovereignEntryProps) {
    const [step, setStep] = useState<SequenceState>('UMBRAL_LOGS');
    const [logIndex, setLogIndex] = useState(0);

    const txt = COPY[lang];

    // 1. LOGS ANIMATION
    useEffect(() => {
        if (step === 'UMBRAL_LOGS') {
            if (logIndex < txt.logs.length) {
                const timeout = setTimeout(() => setLogIndex(prev => prev + 1), 800);
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => setStep('UMBRAL_DECLARATION'), 1000);
                return () => clearTimeout(timeout);
            }
        }
    }, [step, logIndex, txt.logs.length]);

    // 2. HERO TO HANDSHAKE TIMEOUT
    useEffect(() => {
        if (step === 'HERO') {
            const timeout = setTimeout(() => setStep('HANDSHAKE'), 3000); // 3s delay per prompt
            return () => clearTimeout(timeout);
        }
    }, [step]);

    const handleStartCalibration = () => {
        // We pass empty string because handle is now collected later.
        // This signals to parent that Entry phase is done.
        onExecute("");
    };

    return (
        <div className="fixed inset-0 bg-[#000000] text-white font-mono flex flex-col items-center justify-center z-50 overflow-hidden cursor-default selection:bg-white selection:text-black">

            {/* GLOBAL LANGUAGE SELECTOR (Persistent) */}
            <div className="absolute top-8 right-8 flex gap-4 z-[60]">
                {(['EN', 'ES', 'PT'] as Language[]).map((l) => (
                    <button
                        key={l}
                        onClick={() => { setLang(l); setLogIndex(0); }} // Reset logs on lang change if in logs
                        className={`text-[10px] tracking-widest transition-opacity duration-300 ${lang === l ? 'opacity-100 border-b border-white' : 'opacity-40 hover:opacity-70'}`}
                    >
                        {l}
                    </button>
                ))}
            </div>

            <AnimatePresence mode='wait'>

                {/* SCREEN 0: UMBRAL (LOGS) */}
                {step === 'UMBRAL_LOGS' && (
                    <motion.div
                        key="logs"
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-start gap-2 w-full max-w-md p-6"
                    >
                        {txt.logs.slice(0, logIndex + 1).map((log, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-xs text-green-500 font-mono tracking-tight"
                            >
                                {">"} {log}
                            </motion.span>
                        ))}
                        <motion.div
                            className="h-[1px] bg-green-900 w-full mt-4"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 2, ease: "linear" }}
                        />
                    </motion.div>
                )}

                {/* SCREEN 0: UMBRAL (DECLARATION) */}
                {step === 'UMBRAL_DECLARATION' && (
                    <motion.div
                        key="declaration"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(10px)" }}
                        className="flex flex-col items-center text-center space-y-12 max-w-2xl p-6"
                    >
                        <div className="space-y-4">
                            {txt.declaration.map((line, i) => (
                                <p key={i} className="text-sm text-gray-300 font-mono uppercase tracking-wide leading-relaxed">
                                    {line}
                                </p>
                            ))}
                        </div>

                        <button
                            onClick={() => setStep('HERO')}
                            className="px-8 py-3 bg-black border border-[#333] hover:border-[#1877F2] hover:text-[#1877F2] transition-colors duration-200 text-xs tracking-[0.2em] text-gray-500 font-bold uppercase"
                        >
                            {txt.acknowledge}
                        </button>
                    </motion.div>
                )}

                {/* SCREEN 1: HERO & HANDSHAKE */}
                {(step === 'HERO' || step === 'HANDSHAKE') && (
                    <motion.div
                        key="main"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="w-full h-full flex flex-col items-center justify-between py-12 px-6"
                    >
                        {/* HEADER */}
                        <div className="w-full flex justify-between items-start opacity-50 border-b border-white/10 pb-4 max-w-7xl mx-auto">
                            <span className="text-[10px] tracking-widest font-mono">{txt.hero.headerLeft}</span>
                            <span className="text-[10px] tracking-widest font-mono text-right">{txt.hero.headerRight}</span>
                        </div>

                        {/* CENTER CONTENT */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center gap-12 max-w-5xl">
                            <div className="space-y-6">
                                <motion.h1
                                    layoutId="title"
                                    className="text-4xl md:text-6xl font-[200] tracking-tight text-white uppercase"
                                >
                                    {txt.hero.title}
                                </motion.h1>
                                <motion.h2
                                    className="text-sm md:text-base text-gray-500 font-mono tracking-widest uppercase leading-loose"
                                >
                                    {txt.hero.subtitle}
                                </motion.h2>
                            </div>

                            <motion.p
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                                className="text-sm text-gray-400 font-[300] max-w-2xl leading-relaxed whitespace-pre-line"
                            >
                                {txt.hero.declaration}
                            </motion.p>

                            {/* HANDSHAKE (BUTTON ONLY - NO INPUT) */}
                            <AnimatePresence>
                                {step === 'HANDSHAKE' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                                        className="w-full max-w-md space-y-8 mt-12"
                                    >
                                        <button
                                            onClick={handleStartCalibration}
                                            className="w-full py-4 bg-white text-black text-xs font-bold tracking-[0.2em] hover:bg-gray-200 transition-colors"
                                        >
                                            {txt.input.cta}
                                        </button>

                                        <div className="flex justify-between pt-4 opacity-40">
                                            {txt.input.cert.map((c, i) => (
                                                <span key={i} className="text-[9px] font-mono uppercase">{c}</span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* FOOTER */}
                        <div className="w-full text-center pb-8 opacity-20">
                            <div className="w-1 h-12 bg-white mx-auto mb-4" />
                        </div>

                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
