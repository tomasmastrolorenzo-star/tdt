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
                {/* Social Proof */}
                <div className="inline-flex flex-col items-center justify-center mb-8">
                    <div className="flex -space-x-4 mb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-950 overflow-hidden bg-slate-800">
                                <img
                                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                    alt="Client"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                        <span className="text-white font-bold">5.0</span>
                    </div>
                    <p className="text-white/90 font-handwriting text-xl mb-4 italic">{t.impact?.lovedBy}</p>
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
                    {t.impact?.title} <br />
                    <span className="bg-white/20 px-2 rounded-lg italic">
                        {t.impact?.titleMiddle}
                    </span> <br />
                    {t.impact?.titleEnd}
                </h2>

                <Link href="#packages" className="inline-block mb-16">
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-lg px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105">
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
