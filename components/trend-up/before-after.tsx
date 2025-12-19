"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Instagram } from "lucide-react"

export default function BeforeAfter() {
    const [isAfter, setIsAfter] = useState(false)

    return (
        <section className="py-20 bg-slate-950 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-flex bg-slate-900 p-1 rounded-full border border-slate-800 mb-8">
                        <button
                            onClick={() => setIsAfter(false)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isAfter ? "bg-white text-slate-900 shadow-lg" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            Antes
                        </button>
                        <button
                            onClick={() => setIsAfter(true)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isAfter ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            Después TDT
                        </button>
                    </div>
                </div>

                <div className="max-w-md mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
                    {/* Instagram Header Mock */}
                    <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-1">
                        <div className="bg-white rounded-t-[20px] p-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="font-bold text-lg flex items-center gap-1">
                                    cookingforgains_ <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500" />
                                </div>
                                <Instagram className="w-6 h-6 text-slate-800" />
                            </div>

                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden border-2 border-pink-500 p-0.5">
                                    <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="w-full h-full rounded-full object-cover" />
                                </div>
                                <div className="flex-1 flex justify-around text-center">
                                    <div>
                                        <div className="font-bold text-lg text-slate-900">840</div>
                                        <div className="text-xs text-slate-500">Publicaciones</div>
                                    </div>
                                    <div>
                                        <div className={`font-bold text-lg transition-all duration-1000 ${isAfter ? "text-green-600 scale-110" : "text-slate-900"}`}>
                                            {isAfter ? "25,405" : "2,405"}
                                        </div>
                                        <div className="text-xs text-slate-500">Followers</div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg text-slate-900">647</div>
                                        <div className="text-xs text-slate-500">Siguiendo</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="font-bold text-slate-900">Cameron Dukes</div>
                                <div className="text-sm text-slate-600">
                                    @gentlemansupps 20% de descuento<br />
                                    @ryse código cookingforgains 15% de descuento<br />
                                    @buffin_muffins código cookingforgains
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg">
                                    Seguir
                                </Button>
                                <Button variant="outline" className="flex-1 border-slate-300 text-slate-900 font-semibold rounded-lg">
                                    Mensaje
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12 max-w-2xl mx-auto">
                    <p className="text-xl text-slate-300 italic">
                        "Conseguí casi 4000 seguidores en el primer mes y desde entonces, mi número de seguidores no ha parado de crecer."
                    </p>
                </div>
            </div>
        </section>
    )
}
