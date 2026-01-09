"use client"

import { Button } from "@/components/ui/button"
import { Star, ArrowUp, ArrowRight } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import Link from 'next/link'

export default function ImpactSection() {
    const { t } = useI18n()

    return (
        <section className="py-5 bg-gradient-to-br from-orange-600 to-red-600 relative overflow-hidden">
            <div className="container mx-auto px-4 text-center relative z-10">
                {/* Social Logos (Inline White SVGs) */}
                <div className="flex items-center justify-center gap-8 mb-8 opacity-70 hover:opacity-100 transition-all duration-500">
                    {/* Instagram */}
                    <svg className="h-8 w-8 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    {/* YouTube */}
                    <svg className="h-8 w-11 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                    {/* TikTok */}
                    <svg className="h-7 w-7 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.03 5.91-.18 8.81-.31 4.38-4.09 7.82-8.5 7.78-4.42-.05-8.1-3.66-8.08-8.22.02-4.43 3.63-7.98 8.08-7.96 1.07-.01 2.11.23 3.08.62v4.11c-1.49-.93-2.91-1.09-4.32-.42-1.42.66-2.58 2.01-2.43 3.64.12 1.48 1.34 2.89 2.91 2.9 1.45.02 2.72-1.12 2.78-2.67.03-3.08.01-6.17.01-9.25.01-1.57.01-3.14.01-4.71z" /></svg>
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight max-w-4xl mx-auto">
                    {(t.impact as any)?.title || "Dominate Your Niche"} <br className="hidden md:block" />
                    <span className="bg-white/10 px-3 py-1 rounded-xl italic decoration-wavy decoration-white/30 text-white inline-block mt-2 backdrop-blur-sm">
                        {(t.impact as any)?.titleMiddle || "with Data-Driven Precision"}
                    </span>
                </h2>

                <Link href="#consultant" className="inline-block mb-8">
                    <button
                        className="flex items-center justify-center font-bold text-lg px-8 py-6 rounded-full shadow-xl transition-all hover:scale-105 hover:shadow-slate-900/50 !bg-black"
                        style={{ backgroundColor: '#020617', color: 'white', border: '1px solid #1e293b' }}
                    >
                        {(t.impact as any)?.cta} <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </Link>

                {/* Floating/Grid Stats removed per user feedback */}
            </div>

            {/* Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
        </section>
    )
}
