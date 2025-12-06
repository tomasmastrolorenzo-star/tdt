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

                {/* Floating/Grid Stats */}
                <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300 text-left">
                    <div className="bg-slate-900 rounded-2xl p-4 mb-4 text-white flex justify-between items-center">
                        <span className="font-bold">{t.impact?.card?.growth}</span>
                        <div className="flex items-center text-green-400 font-bold">
                            +12.5k <ArrowUp className="w-5 h-5 ml-1" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center hover:bg-slate-100 transition-colors">
                            <span className="text-slate-600 text-sm font-medium">{t.impact?.card?.reach}</span>
                            <span className="text-green-600 font-bold">+245%</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center hover:bg-slate-100 transition-colors">
                            <span className="text-slate-600 text-sm font-medium">{t.impact?.card?.engagement}</span>
                            <span className="text-green-600 font-bold">+180%</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center hover:bg-slate-100 transition-colors">
                            <span className="text-slate-600 text-sm font-medium">{t.impact?.card?.sales}</span>
                            <span className="text-green-600 font-bold">+320%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
        </section>
    )
}
