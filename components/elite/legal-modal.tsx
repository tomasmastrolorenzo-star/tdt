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
                        className="bg-[#0A0A0A] border border-white/10 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl shadow-black/50"
                    >
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                            <h3 className="text-xl font-serif text-white">{title}</h3>
                            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">✕</button>
                        </div>
                        <div className="text-white/60 font-light leading-relaxed space-y-4 text-sm">
                            {content}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
