"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function AIEngineSection() {
    return (
        <section className="py-20 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-between items-start max-w-4xl mx-auto mb-8">
                    <div className="w-12 h-12 border-t-2 border-l-2 border-slate-300 rounded-tl-3xl" />
                    <div className="w-12 h-12 border-t-2 border-r-2 border-slate-300 rounded-tr-3xl" />
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                    Aprovecha el <br />
                    crecimiento de la IA
                </h2>

                <p className="text-slate-600 max-w-2xl mx-auto mb-12">
                    Nuestro motor de crecimiento GPT4o, impulsado pro IA, y nuestros especialistas en redes sociales te encontrarán los mejores seguidores.
                </p>

                <div className="relative max-w-4xl mx-auto mb-12">
                    {/* Dashboard Placeholder */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                        <div className="bg-slate-100 p-4 flex items-center gap-2 border-b border-slate-200">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                        </div>
                        <div className="p-2">
                            <img src="/dashboard-preview.png" alt="Dashboard Preview" className="w-full h-auto rounded-xl opacity-90" onError={(e) => e.currentTarget.src = 'https://placehold.co/1200x800/f1f5f9/94a3b8?text=Dashboard+Preview'} />
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 -left-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20" />
                    <div className="absolute top-1/2 -right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20" />
                </div>

                <Button className="bg-black text-white hover:bg-slate-800 px-8 py-6 rounded-xl text-lg font-bold">
                    Empieza ya <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <div className="flex justify-between items-end max-w-4xl mx-auto mt-8">
                    <div className="w-12 h-12 border-b-2 border-l-2 border-slate-300 rounded-bl-3xl" />
                    <div className="w-12 h-12 border-b-2 border-r-2 border-slate-300 rounded-br-3xl" />
                </div>
            </div>
        </section>
    )
}
