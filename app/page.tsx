"use client";

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Activity, Lock, ChevronDown, Star, Hexagon } from "lucide-react"
import SmartGrowthConsultant from "@/components/trend-up/smart-growth-consultant"
import TrendUpFooter from "@/components/trend-up/footer"

// --- DATA: THE ELITE NARRATIVE ---

const METHOD_PILLARS = [
  {
    title: "Auditoría Multimodal",
    desc: "Mapeamos la entropía visual y los metadatos nativos de tu activo para detectar bloqueos de visibilidad invisibles para el ojo humano.",
    icon: <Activity className="w-6 h-6 text-[#d4af37]" />
  },
  {
    title: "Diagnóstico de Patologías",
    desc: "Identificamos los vectores de repulsión que hacen que Meta clasifique tu marca como contenido genérico, limitando tu acceso al 0.1% del mercado.",
    icon: <Hexagon className="w-6 h-6 text-[#d4af37]" />
  },
  {
    title: "Protocolo de Soberanía",
    desc: "Ejecutamos una re-alineación algorítmica diseñada para devolverte el mando absoluto de tu nicho y proteger tu legado digital.",
    icon: <Shield className="w-6 h-6 text-[#d4af37]" />
  }
]

const TESTIMONIALS = [
  {
    quote: "TDT no gestiona redes; audita patrimonios. Recuperé mi autoridad frente a pacientes VIP cuando otras agencias solo me daban métricas vacías.",
    author: "Dr. R. Hoffmann",
    role: "Elite Surgeon, Miami"
  },
  {
    quote: "En mercados como Dubai, si no proyectas una autoridad única, el algoritmo te borra. Detectaron la fuga de prestigio que nos costaba millones.",
    author: "A. Al-Sayed",
    role: "Luxury Real Estate Principal"
  },
  {
    quote: "Mi marca personal era un pasivo. Ahora es mi activo de negocios más fuerte. Profesionalismo al nivel de una firma de consultoría estratégica.",
    author: "M. Peterson",
    role: "Professional Athlete & Founder"
  }
]

const FAQS = [
  {
    q: "¿Es este protocolo seguro para la integridad del activo?",
    a: "Operamos exclusivamente bajo protocolos nativos de Meta y encriptación de grado militar. No solicitamos credenciales. Somos una intervención de ingeniería, no una herramienta de automatización."
  },
  {
    q: "¿Cómo se determina la viabilidad de la intervención?",
    a: "Cada activo es único. El Escáner Forense realiza una tasación técnica inicial; si el activo califica, se procede a un briefing privado para definir el nivel de custodia requerido."
  },
  {
    q: "¿En cuánto tiempo se cristaliza la soberanía?",
    a: "La estabilización de señales ocurre en las primeras 72 horas. La soberanía total y la re-clasificación del activo se consolidan en un ciclo clínico de 21 días."
  }
]

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
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const scrollToTerminal = () => {
    terminalRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-[#000000] text-gray-200 font-sans selection:bg-[#d4af37] selection:text-black">

      {/* 1. HERO: THE PRESTIGE FLOW */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#d4af37]/10 to-transparent rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 border border-[#d4af37]/30 rounded-full px-4 py-1 mb-4">
            <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">Bureau of Digital Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] tracking-tight">
            Domina el <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#fcebb6]">Escenario Global.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            La ingeniería de autoridad que usan las firmas de Dubai y Miami para someter el algoritmo a su voluntad.
          </p>

          <div className="pt-8">
            <button
              onClick={scrollToTerminal}
              className="bg-white text-black hover:bg-[#d4af37] transition-colors duration-300 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] min-w-[240px]"
            >
              Iniciar Diagnóstico de Autoridad
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </section>

      {/* 2. THE METHOD */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="El Método" subtitle="Ciencia Forense aplicada a la percepción de alto valor." />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {METHOD_PILLARS.map((pillar, i) => (
              <div key={i} className="group p-8 border border-white/5 hover:border-[#d4af37]/30 transition-all duration-500 bg-white/[0.02]">
                <div className="mb-6 p-4 bg-white/5 inline-block rounded-full group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-serif text-white mb-4">{pillar.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VOICES OF AUTHORITY */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Voces de Autoridad" subtitle="Resultados validados por la élite global." />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="relative p-10 border-l border-[#d4af37]/50 bg-[#020202]">
                <Star className="w-4 h-4 text-[#d4af37] mb-6 absolute top-10 right-10 opacity-50" />
                <p className="text-lg text-gray-300 italic font-serif mb-8 leading-relaxed">"{t.quote}"</p>
                <div>
                  <div className="text-white font-bold text-sm tracking-wide">{t.author}</div>
                  <div className="text-[#d4af37] text-xs uppercase tracking-widest mt-1">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CLARITY (FAQ) */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title="Claridad Estratégica" subtitle="Protocolos de intervención y seguridad." />

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-white/10">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left hover:text-[#d4af37] transition-colors"
                >
                  <span className="text-lg font-serif">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 text-gray-400 font-light leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE VAULT (TERMINAL) */}
      <section id="terminal" ref={terminalRef} className="py-32 px-6 bg-[#02040a] border-t border-[#d4af37]/20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-6 py-2 border border-[#d4af37]/30 text-[#d4af37] text-[10px] uppercase tracking-[0.3em]">
          Accessing Secure Vault
        </div>

        <div className="max-w-5xl mx-auto">
          <SmartGrowthConsultant />
        </div>
      </section>

      <TrendUpFooter />
    </main>
  )
}
