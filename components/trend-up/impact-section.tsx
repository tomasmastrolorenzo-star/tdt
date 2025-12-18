"use client"

import { Button } from "@/components/ui/button"
import { Star, ArrowUp, ArrowRight } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import Link from 'next/link'

export default function ImpactSection() {
    const { t } = useI18n()

    return (
        <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
            <div className="container mx-auto px-4 text-center relative z-10">
                {/* Social Logos (White 50% opacity) */}
                <div className="flex items-center justify-center gap-8 mb-10 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="h-8 invert brightness-0" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" className="h-8 invert brightness-0" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/34/Icon_hulus_TikTok_02.svg" alt="TikTok" className="h-7 invert brightness-0" />
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight max-w-4xl mx-auto">
                    {t.impact?.title || "Dominate Your Niche"} <br className="hidden md:block" />
                    <span className="bg-white/10 px-3 py-1 rounded-xl italic decoration-wavy decoration-white/30 text-white inline-block mt-2 backdrop-blur-sm">
                        {t.impact?.titleMiddle || "with Data-Driven Precision"}
                    </span>
                </h2>

                <Link href="#consultant" className="inline-block mb-16">
                    <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 font-bold text-lg px-8 py-6 rounded-full shadow-xl transition-all hover:scale-105 hover:shadow-slate-900/30 border border-slate-700/50">
                        {t.impact?.cta} <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
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
