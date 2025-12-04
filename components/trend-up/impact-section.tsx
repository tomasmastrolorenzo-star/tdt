"use client"

import { Button } from "@/components/ui/button"
import { Star, ArrowUp } from "lucide-react"

export default function ImpactSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
            <div className="container mx-auto px-4 text-center relative z-10">
                <p className="text-white/90 font-handwriting text-xl mb-4 italic">Amado por más de 80.000 fans</p>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                    TDT impulsa los <br />
                    resultados de su marca <br />
                    específica
                </h2>

                <Button className="bg-white text-orange-600 hover:bg-orange-50 px-10 py-6 rounded-2xl text-xl font-bold shadow-xl mb-8">
                    Empieza ya
                </Button>

                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-orange-500 bg-slate-200 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-start">
                        <div className="flex text-yellow-300">
                            {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <span className="text-white/80 text-xs">Amado por 80,000+ clientes</span>
                    </div>
                </div>

                {/* Impact Card */}
                <div className="max-w-md mx-auto bg-white rounded-[2rem] p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-slate-200 mb-3 overflow-hidden border-4 border-orange-100">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-lg text-slate-900">@sofia.digital</div>
                        <div className="text-slate-500 font-medium">15.2k Seguidores</div>
                    </div>

                    <div className="bg-green-500 text-white rounded-xl p-4 mb-6 flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-500/30 animate-pulse">
                        Crecimiento: +12.5k <ArrowUp className="w-5 h-5" />
                    </div>

                    <div className="space-y-3">
                        <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center hover:bg-slate-100 transition-colors">
                            <span className="text-slate-600 text-sm font-medium">Alcance de cuenta</span>
                            <span className="text-green-600 font-bold">+245%</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center hover:bg-slate-100 transition-colors">
                            <span className="text-slate-600 text-sm font-medium">Engagement</span>
                            <span className="text-green-600 font-bold">+180%</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center hover:bg-slate-100 transition-colors">
                            <span className="text-slate-600 text-sm font-medium">Ventas mensuales</span>
                            <span className="text-green-600 font-bold">+320%</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
