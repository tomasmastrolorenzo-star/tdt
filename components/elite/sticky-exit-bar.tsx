"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';

export const StickyExitBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [handle, setHandle] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            // Show bar if scrolled more than 70% of the page
            const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            if (scrollPercentage > 0.7 && !isVisible) {
                setIsVisible(true);
            } else if (scrollPercentage < 0.6 && isVisible) {
                setIsVisible(false); // Hide if they scroll back up significantly
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isVisible]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const analyzerSection = document.getElementById('analyzer-section');
        const analyzerInput = document.getElementById('analyzer-input') as HTMLInputElement;

        if (analyzerSection) {
            analyzerSection.scrollIntoView({ behavior: 'smooth' });
            // Small delay to allow scroll to start/finish
            setTimeout(() => {
                if (analyzerInput) {
                    analyzerInput.value = handle; // Pre-fill
                    analyzerInput.focus();
                }
            }, 800);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 w-full z-50 p-4 pb-6 flex justify-center pointer-events-none"
                >
                    <div className="pointer-events-auto bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-xl w-full flex items-center gap-4">
                        <div className="hidden md:block text-xs font-mono text-white/60 uppercase tracking-widest whitespace-nowrap">
                            Diagnóstico Rápido:
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="@usuario"
                                    value={handle}
                                    onChange={(e) => setHandle(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#007AFF]/50 font-mono"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-[#007AFF] hover:bg-[#0066CC] text-white p-2 rounded-full transition-colors"
                            >
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
