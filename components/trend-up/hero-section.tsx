"use client"

import { useState, useEffect } from "react"
import { ArrowRight, CheckCircle2, Shield, Zap, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"

export default function HeroSection() {
  const { t } = useI18n()
  const [textIndex, setTextIndex] = useState(0)
  const dynamicTexts = ["Redes sociales", "Fans", "Audiencia", "Marca"]

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % dynamicTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollToPackages = () => {
    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-1.5 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-slate-300 font-medium">Trend Up Powered by GPT-4o</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
          Real, orgánico
          <br />
          <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent transition-all duration-500">
            {dynamicTexts[textIndex]}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          <span className="text-white font-semibold border-b border-pink-500/50">Sin spam ni bots.</span> Utiliza nuestra tecnología patentada de IA y GPT4o, además de nuestro propio equipo de especialistas en crecimiento de Instagram, para obtener un crecimiento de seguidores orgánico, focalizado y que genere las interacciones que buscas.
        </p>

        {/* CTA Button */}
        <div className="mb-12">
          <Button
            onClick={scrollToPackages}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-12 py-8 text-xl font-bold rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
          >
            Empieza ya
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>

        {/* Social Proof Avatars (Placeholder for now, will be its own section later but good to have here too) */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-xs text-slate-400 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
              80K+
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Zap key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-sm text-slate-400 ml-2">Amado por 80,000+ clientes</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-orange-500" />
            <span>Configuración en 2 minutos</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
            <Shield className="w-4 h-4 text-orange-500" />
            <span>No necesitas contraseña</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
            <MessageCircle className="w-4 h-4 text-orange-500" />
            <span>Asistencia vía chat 24/7</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Garantía de reembolso</span>
          </div>
        </div>
      </div>
    </section>
  )
}
