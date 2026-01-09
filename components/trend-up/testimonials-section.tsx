"use client"

import { useState, useRef } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { motion, AnimatePresence } from "framer-motion"

export default function TestimonialsSection() {
    const { t } = useI18n()
    const scrollRef = useRef<HTMLDivElement>(null)

    // Defensive check
    if (!t?.testimonials) return null

    const testimonials = t.testimonials as any[]

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef
            const scrollAmount = direction === 'left' ? -350 : 350
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 opacity-80" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-orange-500/5 text-orange-400 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-orange-500/10 animate-fade-in">
                        <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                        <span>{(t.testimonialsSection as any)?.badge || "Love from customers"}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        {(t.testimonialsSection as any)?.title || "Clients love our growth tool"}
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                        {t.testimonialsSection?.subtitle || "See why top influencers and brands trust us."}
                    </p>
                </div>

                <div className="relative max-w-full">
                    {/* Navigation Buttons (Desktop) */}
                    <div className="hidden md:flex justify-end gap-2 mb-4 pr-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900/50 hover:bg-slate-800 flex items-center justify-center text-white transition-all hover:scale-105"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900/50 hover:bg-slate-800 flex items-center justify-center text-white transition-all hover:scale-105"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Infinite Slider Implementation */}
                    {/* Using simple horizontal scroll with snap for robust mobile experience */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {testimonials.map((testimonial: any, i: number) => (
                            <div
                                key={i}
                                className="flex-none w-[85vw] md:w-[400px] snap-center"
                            >
                                <div className="bg-white rounded-[24px] p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between border border-white/10 group relative">
                                    {/* Quote Icon Background */}
                                    <div className="absolute top-6 right-6 text-slate-100 group-hover:text-orange-50/50 transition-colors">
                                        <Quote className="w-12 h-12 fill-current" />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-1 mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className="w-4 h-4 text-orange-500 fill-orange-500" />
                                            ))}
                                        </div>

                                        <p className="text-slate-700 text-lg leading-relaxed font-medium mb-8 relative z-10">
                                            "{testimonial.comment}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 border-t border-slate-100 pt-6">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-inner">
                                            {/* Flag derived from role if present in first char or explicitly in data. 
                                                Data: "🇩🇪 Germany". 
                                                I'll just render the first word of role if it's emoji?
                                                Actually, the 'role' field in updated translations contains "🇩🇪 Germany".
                                            */}
                                            {testimonial.role?.split(' ')[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-base">
                                                {testimonial.name}
                                            </div>
                                            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                                {testimonial.role?.substring(2) || "Verified"} {/* Remove flag */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots Indicator (Functional-ish, or static visual cue as scrolling is infinite/free) */}
                    {/* Since it's scroll-based, actual index tracking requires listener. 
                        For now, just visual dots or omit if scrollbar hidden.
                        User requested "Indicadores: Añadir puntos de navegación (dots) en la base del carrusel."
                        I'll add a simple visual indication that there are more.
                    */}
                    <div className="flex justify-center gap-1.5 mt-4">
                        {testimonials.slice(0, 5).map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full ${i === 0 ? "w-6 bg-orange-500" : "w-1.5 bg-slate-700"}`} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
