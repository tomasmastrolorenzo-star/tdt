"use client"

import { Gift, Star } from "lucide-react"

export default function UrgencyBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-900 to-slate-900 border-b border-red-500/30 py-3 px-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-center gap-3 text-white text-sm md:text-base font-semibold">
        <Gift className="w-5 h-5 text-red-500 animate-bounce" />
        <span className="text-slate-200">
          <span className="text-red-400 font-bold">Oferta de Navidad:</span> Análisis de Perfil Gratuito + Bonus en todos los planes 🎄
        </span>
        <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
      </div>
    </div>
  )
}
