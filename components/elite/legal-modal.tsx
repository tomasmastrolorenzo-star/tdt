"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: React.ReactNode;
}

export const LegalModal = ({ isOpen, onClose, title, content }: LegalModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-black border border-[#C5A059] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-sm shadow-[0_0_30px_rgba(197,160,89,0.1)]"
                    >
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                            <h3 className="text-xl font-serif text-white tracking-wide">{title}</h3>
                            <button onClick={onClose} className="text-[#C5A059] hover:text-white transition-colors text-xl">✕</button>
                        </div>
                        <div className="text-white/70 font-light leading-relaxed space-y-6 text-sm font-sans">
                            {content}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
