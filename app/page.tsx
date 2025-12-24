"use client";

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Activity, Lock, ChevronDown, Star, Hexagon } from "lucide-react"
import SmartGrowthConsultant from "@/components/trend-up/smart-growth-consultant"
import TrendUpFooter from "@/components/trend-up/footer"

// --- DATA: THE ELITE NARRATIVE ---

const METHOD_PILLARS = [
  {
    title: "Auditoría Forense",
    desc: "Identificamos las fallas invisibles en tu contenido que Meta penaliza activamente.",
    icon: <Activity className="w-6 h-6 text-[#d4af37]" />
  },
  {
    title: "Diagnóstico Clínico",
    desc: "Analizamos la brecha entre tu estatus real y tu alcance digital frente al Top 1% de tu industria.",
    icon: <Hexagon className="w-6 h-6 text-[#d4af37]" />
  },
  {
    title: "Protocolo de Soberanía",
    desc: "Inyectamos señales de autoridad para que el algoritmo te reconozca como el líder indiscutible.",
    icon: <Shield className="w-6 h-6 text-[#d4af37]" />
  }
]

const TESTIMONIALS = [
  {
    quote: "Mi práctica en Miami dependía de referidos. TDT reestructuró mi autoridad digital y ahora el 60% de mis pacientes High-Net-Worth llegan por Instagram validado. Recuperé el control.",
    author: "Dr. Alexander V.",
    role: "Plastic Surgeon, Miami"
  },
  {
    quote: "En Real Estate de lujo en Dubai, la percepción es liquidez. Detectaron un bloqueo algorítmico que me costaba leads de $2M+. La corrección fue quirúrgica.",
    author: "Karem A.",
    role: "Senior Broker, Dubai Hills"
  },
  {
    quote: "No buscaba fama, buscaba leverage de negocios. Transformaron mi marca de 'atleta popular' a 'activo de inversión corporativa'. El ROI es incalculable.",
    author: "J. Martinez",
    role: "Pro Athlete & Angel Investor"
  }
]

const FAQS = [
  {
    q: "SEGURIDAD: ¿Es seguro entregar mi activo?",
    a: "Protocolo 100% Nativo. Operamos bajo la API oficial de Meta y encriptación de grado bancario (AES-256). No requerimos contraseñas, solo el 'Handle' público para la auditoría externa."
  },
  {
    q: "PRECIO: ¿Por qué la inversión es High-Ticket?",
    a: "No vendemos 'likes'. Ejecutamos una Ingeniería de Estatus que recupera activos valorados en 7 cifras. La tasación se basa en el Lucro Cesante que su marca pierde mensualmente por invisibilidad algorítmica."
  },
  {
    q: "INTEGRIDAD DE API: ¿Cumplen con los estándares de Meta?",
    a: "Absolutamente. TDT es un partner técnico certificado que opera estrictamente dentro de los límites de la Graph API. Cero bots. Cero riesgo de baneo."
  },
  {
    q: "¿En cuánto tiempo se cristaliza la soberanía?",
    a: "La estabilización de señales ocurre en 72 horas. La re-clasificación total del activo en el 'Cluster de Autoridad' se consolida en un ciclo clínico de 21 días."
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
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">Bureau of Digital Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] tracking-tight">
            Recupera tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#fcebb6]">Autoridad Digital.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            La primera firma de ingeniería forense dedicada a rescatar el alcance y el estatus de las figuras más influyentes del mundo. No gestionamos redes; blindamos legados.
          </p>

          <div className="pt-8">
            <button
              onClick={scrollToTerminal}
              className="bg-white text-black hover:bg-[#d4af37] transition-colors duration-300 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] min-w-[240px]"
            >
              Obtener Diagnóstico de Alcance Elite
            </button>
          </div>
        </div>

        {/* AUTHORITY STRIP */}
        <div className="absolute bottom-0 left-0 w-full border-t border-[#d4af37]/10 bg-[#000000] py-8 z-20">
          <div className="flex justify-center gap-16 items-center opacity-90 transition-opacity duration-700">
            {/* INSTAGRAM */}
            <div className="flex items-center gap-3 group transition-all">
              <div className="relative w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity">
                <Image
                  src="/assets/logos/instagram.png"
                  alt="Instagram"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif text-white tracking-widest font-bold leading-none">Instagram</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest group-hover:text-[#d4af37]"> Verified Node</span>
              </div>
            </div>


            {/* META */}
            <div className="flex items-center gap-3 group transition-all">
              <div className="relative w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity">
                <Image
                  src="/assets/logos/meta.png"
                  alt="Meta"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif text-white tracking-widest font-bold leading-none">Meta</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest group-hover:text-[#d4af37]"> Graph Partner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 HOW IT WORKS (THE TRIAD) */}
      <section className="py-24 px-6 bg-[#020202] border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-8 border border-white/5 hover:border-[#d4af37]/20 transition-colors group">
              <div className="text-[#d4af37] text-4xl font-serif mb-4 opacity-50 transition-opacity">I</div>
              <h3 className="text-xl text-white font-serif mb-2">Auditoría Forense</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">Extraemos metadatos nativos y analizamos la entropía visual para auditoría forense.</p>
            </div>
            <div className="relative p-8 border border-white/5 hover:border-[#d4af37]/20 transition-colors group">
              <div className="text-[#d4af37] text-4xl font-serif mb-4 opacity-50 transition-opacity">II</div>
              <h3 className="text-xl text-white font-serif mb-2">Diagnóstico Clínico</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">Identificamos vectores de repulsión algorítmica que invisibilizan el activo ante clientes Elite.</p>
            </div>
            <div className="relative p-8 border border-white/5 hover:border-[#d4af37]/20 transition-colors group">
              <div className="text-[#d4af37] text-4xl font-serif mb-4 opacity-50 transition-opacity">III</div>
              <h3 className="text-xl text-white font-serif mb-2">Protocolo de Soberanía</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">Inyectamos señales de autoridad de alta pureza para recuperar el mando del nicho.</p>
            </div>
          </div>
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
