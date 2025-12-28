"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Language = 'EN' | 'ES' | 'PT';

interface AssetIdentificationProps {
    onComplete: (handle: string) => void;
    lang: Language;
}

const COPY = {
    EN: {
        label: "ENTER ASSET ID",
        placeholder: "@entity_name",
        cta: "INITIATE FORENSIC SEQUENCE",
        cert: ["○ Public Signal Analysis Only", "○ Meta Platform Compliance"],
        warning: "WARNING: PRIVATE OR INVALID ASSETS WILL TERMINATE SESSION."
    },
    ES: {
        label: "INGRESAR ID DE ACTIVO",
        placeholder: "@nombre_entidad",
        cta: "INICIAR SECUENCIA FORENSE",
        cert: ["○ Analisis de Señal Publica", "○ Cumplimiento Plataforma Meta"],
        warning: "ADVERTENCIA: ACTIVOS PRIVADOS O INVALIDOS TERMINARAN LA SESION."
    },
    PT: {
        label: "INSERIR ID DO ATIVO",
        placeholder: "@nome_entidade",
        cta: "INICIAR SEQUENCIA FORENSE",
        cert: ["○ Análise de Sinal Público", "○ Conformidade Plataforma Meta"],
        warning: "AVISO: ATIVOS PRIVADOS OU INVALIDOS ENCERRARAO A SESSAO."
    }
};

export default function AssetIdentification({ onComplete, lang }: AssetIdentificationProps) {
    const [inputValue, setInputValue] = useState("");
    const [isExecuting, setIsExecuting] = useState(false);
    const [isBooting, setIsBooting] = useState(true);

    const txt = COPY[lang];

    // BOOT DELAY
    React.useEffect(() => {
        const timer = setTimeout(() => setIsBooting(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleExecute = () => {
        if (!inputValue) return;
        setIsExecuting(true);

        // Small artificial delay before handing off to Consultant (Psychological connection)
        setTimeout(() => {
            onComplete(inputValue);
        }, 1500);
    };

    return (
        <div className="h-screen w-full bg-[#000000] text-white font-mono flex flex-col items-center justify-center relative overflow-hidden selection:bg-white selection:text-black cursor-default">

            <AnimatePresence mode='wait'>
                {isBooting ? (
                    <motion.div
                        key="boot"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-xs font-mono tracking-widest text-gray-600 animate-pulse uppercase"
                    >
                        INITIALIZING INPUT STREAM...
                    </motion.div>
                ) : !isExecuting ? (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        className="w-full max-w-md space-y-12 p-6"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center opacity-50 border-b border-white/10 pb-4">
                            <span className="text-[10px] tracking-widest font-mono">PHASE 4 // ASSET ID</span>
                            <span className="text-[10px] tracking-widest font-mono text-green-500">CALIBRATION LOCKED</span>
                        </div>

                        {/* Input Area */}
                        <div className="space-y-4 relative">
                            <div className="flex justify-between items-baseline">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest pl-1">
                                    {txt.label}
                                </label>
                                {!inputValue && <span className="text-[9px] text-red-500 animate-pulse tracking-widest">IDENTITY_REQUIRED</span>}
                            </div>

                            <div className="relative group">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                                    placeholder=""
                                    className="w-full bg-transparent border-b border-[#333] text-3xl py-4 text-white focus:outline-none focus:border-white transition-colors font-mono tracking-wider caret-[#1877F2]"
                                    autoFocus
                                    spellCheck={false}
                                />
                            </div>

                            <p className="text-[9px] text-[#333] font-mono tracking-widest uppercase">
                                {txt.warning}
                            </p>
                        </div>

                        {/* CTA */}
                        {inputValue && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                onClick={handleExecute}
                                className="w-full py-5 bg-black border border-[#333] hover:border-[#1877F2] hover:text-[#1877F2] transition-colors duration-200 text-xs font-bold tracking-[0.2em] uppercase"
                            >
                                {txt.cta}
                            </motion.button>
                        )}

                        {/* Certs */}
                        <div className="flex justify-between pt-4 opacity-30">
                            {txt.cert.map((c, i) => (
                                <span key={i} className="text-[9px] font-mono uppercase">{c}</span>
                            ))}
                        </div>

                    </motion.div>
                ) : (
                    <motion.div
                        key="locking"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-mono tracking-widest text-[#1877F2] animate-pulse uppercase"
                    >
                        LOCKING TARGET ASSET // {inputValue}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
