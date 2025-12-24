"use client";

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Activity, Lock, Hexagon } from "lucide-react"
import SmartGrowthConsultant from "@/components/trend-up/smart-growth-consultant"
import TrendUpFooter from "@/components/trend-up/footer"

// --- DATA: THE ELITE NARRATIVE ---

// --- COMPONENTS ---

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 tracking-tight">{title}</h2>
    <div className="w-24 h-0.5 bg-[#d4af37] mx-auto mb-6" />
    <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-light font-sans">{subtitle}</p>
  </div>
)

export default function HomePage() {
  const terminalRef = useRef<HTMLDivElement>(null)

  const scrollToTerminal = () => {
    terminalRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-[#000000] text-gray-200 font-sans selection:bg-[#d4af37] selection:text-black">

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center items-center pt-32 pb-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-12"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#d4af37]/30 bg-[#d4af37]/5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse"></span>
            <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-[0.3em]">Bureau of Digital Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-white italic tracking-tight leading-tight">
            Recupera tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#fcebb6]">Soberanía Digital</span>
          </h1>

          <p className="text-xs md:text-sm font-mono text-slate-400 uppercase tracking-widest max-w-xl mx-auto leading-loose">
            La única firma de auditoría forense capaz de desbloquear el alcance restringido por el algoritmo de Meta™.
          </p>

          <div className="flex flex-col items-center gap-8 pt-8">
            <button
              onClick={scrollToTerminal}
              className="group relative px-8 py-4 bg-[#d4af37] hover:bg-[#b5952f] transition-all duration-500"
            >
              <div className="absolute inset-0 border border-[#fcebb6]/30 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
              <span className="text-[10px] font-mono text-black font-bold uppercase tracking-[0.3em] relative z-10">
                Iniciar Protocolo
              </span>
            </button>

            {/* Authority Strip (Meta/IG) */}
            <div className="flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Systems Audited By:</span>
              {/* Meta Logo SVG */}
              <svg className="h-5 w-auto text-white" viewBox="0 0 100 20" fill="currentColor">
                <path d="M60.3,5.6c-0.8,0-1.6,0.3-2.1,0.8L54,10.7l-4.1-4.3c-0.6-0.6-1.3-0.8-2.1-0.8 c-1.6,0-2.9,1.3-2.9,2.9c0,0.8,0.3,1.5,0.8,2.1l5.4,5.6c0.4,0.4,0.9,0.6,1.4,0.6s1.1-0.2,1.4-0.6l5.4-5.6 c0.6-0.6,0.8-1.3,0.8-2.1C63.2,6.9,61.9,5.6,60.3,5.6z" />
                <path d="M80.5,5.6c-1.6,0-2.9,1.3-2.9,2.9c0,1,0.5,1.8,1.2,2.4l-4.7,4.8h4l2.4-2.5l2.4,2.5h4l-4.7-4.8 c0.7-0.6,1.2-1.4,1.2-2.4C83.4,6.9,82.1,5.6,80.5,5.6z M80.5,9.6c-0.6,0-1.1-0.5-1.1-1.1s0.5-1.1,1.1-1.1s1.1,0.5,1.1,1.1 S81.1,9.6,80.5,9.6z" />
              </svg>
              {/* Instagram Logo SVG */}
              <svg className="h-5 w-auto text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
          </div>

        </motion.div>
      </section>

      {/* ANALYZER SECTION (CLINICAL FRAME) */}
      <section id="analyzer" className="relative py-32 px-4 border-t border-[#d4af37]/10 bg-[#02040a]">
        <div className="max-w-6xl mx-auto relative z-10">
          <SmartGrowthConsultant />
        </div>
      </section>

      {/* PROTOCOL STATEMENTS (REPLACING FAQ) */}
      <section className="py-32 px-4 bg-black border-t border-[#d4af37]/10">
        <div className="max-w-4xl mx-auto space-y-24">
          <div className="space-y-6">
            <h3 className="text-4xl font-serif text-white italic">01. Auditoría de Estatus</h3>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest leading-loose max-w-xl">
              No buscamos volumen. Auditamos estatus. El algoritmo de Meta ha dejado de priorizar la frecuencia para priorizar la autoridad estructural. Si su cuenta no emite las señales correctas, es invisible.
            </p>
          </div>
          <div className="space-y-6 text-right ml-auto">
            <h3 className="text-4xl font-serif text-white italic">02. El Libro Mayor</h3>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest leading-loose max-w-xl ml-auto">
              El algoritmo no es aleatorio. Es un libro contable. Cada interacción perdida es una deuda de autoridad que se acumula. Nuestra intervención liquida esa deuda y restaura su solvencia digital.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-4xl font-serif text-white italic">03. Acceso Restringido</h3>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest leading-loose max-w-xl">
              El acceso a nuestras herramientas de corrección está reservado para activos verificados que cumplan con los criterios de elegibilidad financiera y estructural.
            </p>
          </div>
        </div>
      </section>

      {/* CASE NOTES (REPLACING TESTIMONIALS) */}
      <section className="py-32 px-4 border-t border-[#d4af37]/10 bg-[#02040a]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Case 1 */}
          <div className="border-l border-[#d4af37] pl-8 space-y-6">
            <div className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest mb-4">Case File: #MD-782 (Surgery)</div>
            <p className="text-xl font-serif text-white italic leading-relaxed">
              "La invisibilidad técnica estaba costando $45k/mes en leads cualificados. La reestructuración de metadatos restauró el flujo en 14 días."
            </p>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              — Dr. A. V. <br /> Plastic Surgeon, Dubai
            </div>
          </div>
          {/* Case 2 */}
          <div className="border-l border-[#d4af37] pl-8 space-y-6">
            <div className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest mb-4">Case File: #RE-901 (Luxury DE)</div>
            <p className="text-xl font-serif text-white italic leading-relaxed">
              "TDT no vende marketing. Venden soberanía. Mi inventario de $5M volvió a ser visible para el cluster de compradores correctos."
            </p>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              — M. R. <br /> Luxury Broker, Miami
            </div>
          </div>
        </div>
      </section>

      {/* FINAL GATE (CTA) */}
      <section className="py-32 px-4 bg-black text-center border-t border-[#d4af37]/10">
        <div className="max-w-2xl mx-auto space-y-12">
          <Lock className="w-12 h-12 text-[#d4af37] mx-auto opacity-50" />
          <h2 className="text-5xl md:text-6xl font-serif text-white italic">
            Validación Requerida
          </h2>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest max-w-md mx-auto">
            El sistema aceptará nuevas solicitudes durante las próximas 48 horas.
          </p>
          <button
            onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-block px-12 py-4 border border-[#d4af37] text-[#d4af37] text-xs font-mono uppercase tracking-[0.3em] hover:bg-[#d4af37] hover:text-black transition-all duration-500"
          >
            Iniciar Auditoría Forense
          </button>
        </div>
      </section>
    </main>
  )
}
