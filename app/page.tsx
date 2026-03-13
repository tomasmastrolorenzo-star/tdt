import type { Metadata } from "next"
import { Logo } from "@/components/ui/logo"

export const metadata: Metadata = {
  title: "Trend Digital Trade — Vive donde quieras. Opera cuando quieras.",
  description: "TDT es una comunidad de traders y nómadas digitales. Señales en vivo, educación y una tribu que opera desde cualquier lugar del mundo.",
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-white" />
            <span className="text-xl font-black tracking-tighter text-white">TDT</span>
          </div>
          <a
            href="/login"
            className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Acceder →
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6 border-b border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-black tracking-[0.3em] text-zinc-500 uppercase mb-6">
            Trend Digital Trade
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8 text-white">
            Vive donde quieras.<br />
            <span className="text-zinc-500">Opera cuando quieras.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Una comunidad privada de traders que combinan libertad geográfica, análisis institucional
            y mentalidad de largo plazo. Sin ruido. Sin promesas vacías.
          </p>
          <a
            href="/register"
            className="inline-block bg-white text-black text-sm font-black tracking-widest uppercase px-10 py-4 hover:bg-zinc-200 transition-colors"
          >
            Unirse a la Manada
          </a>
          <p className="mt-4 text-xs text-zinc-600">Acceso limitado · Solo por invitación</p>
        </div>
      </section>

      {/* ── EL MOVIMIENTO ── */}
      <section className="py-24 px-6 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-black tracking-[0.3em] text-zinc-500 uppercase mb-4">
                El Movimiento
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-6 text-white">
                El mercado no espera. Nosotros tampoco.
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                TDT nació de una convicción simple: los traders que operan con disciplina institucional,
                rodeados de la tribu correcta, tienen una ventaja estructural sobre el mercado.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                No somos un grupo de señales aleatorias. Somos un sistema: análisis de mercado,
                gestión de riesgo probada y una comunidad que se exige mutuamente.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "100%", label: "Digital & Remoto" },
                { num: "24/7", label: "Mercados activos" },
                { num: "BingX", label: "Exchange oficial" },
                { num: "∞", label: "Sin límite geográfico" },
              ].map((item) => (
                <div key={item.label} className="border border-zinc-800 bg-zinc-950/50 p-6">
                  <div className="text-3xl font-black tracking-tighter mb-1 text-white">{item.num}</div>
                  <div className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUÉ OBTIENES (3 módulos) ── */}
      <section className="py-24 px-6 bg-zinc-950 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black tracking-[0.3em] text-zinc-500 uppercase mb-4">Tu Acceso</p>
            <h2 className="text-4xl font-black tracking-tighter text-white">Tres herramientas. Un propósito.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📡",
                title: "Señales & Análisis",
                desc: "Canal privado de Telegram con alertas en tiempo real. Niveles institucionales, zonas de demanda y contexto de mercado antes de que el retail lo vea.",
              },
              {
                icon: "🐺",
                title: "La Manada",
                desc: "Grupo privado de la comunidad. Traders activos, accountability diario y un espacio donde el nivel de conversación está por encima de la media.",
              },
              {
                icon: "📚",
                title: "Academia TDT",
                desc: "Guías descargables: desde crear tu cuenta en BingX hasta construir tu marca personal como trader. Todo lo que necesitas para comenzar bien.",
              },
            ].map((mod) => (
              <div key={mod.title} className="bg-black border border-zinc-800 p-8 hover:border-zinc-600 transition-colors">
                <div className="text-4xl mb-6">{mod.icon}</div>
                <h3 className="text-xl font-black tracking-tighter mb-3 text-white">{mod.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CEO / ABOUT ── */}
      <section className="py-24 px-6 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <p className="text-xs font-black tracking-[0.3em] text-zinc-500 uppercase mb-4">
                El Fundador
              </p>
              <h2 className="text-4xl font-black tracking-tighter mb-6 text-white">
                Transparencia total. Resultados reales.
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                TDT no es un proyecto anónimo. Hay una persona detrás, con nombre, cara y reputación
                en juego. La transparencia del fundador es la primera garantía de la comunidad.
              </p>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Trader activo. Nómada digital. Construyendo este movimiento desde adentro.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/trenddigitaltrade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-black tracking-widest uppercase border border-zinc-800 px-5 py-2 hover:bg-white hover:text-black hover:border-white transition-all text-zinc-300"
                >
                  Instagram
                </a>
                <a
                  href="https://t.me/trenddigitaltrade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-black tracking-widest uppercase border border-zinc-800 px-5 py-2 hover:bg-white hover:text-black hover:border-white transition-all text-zinc-300"
                >
                  Telegram
                </a>
              </div>
            </div>
            <div className="order-1 md:order-2 bg-zinc-950 border border-zinc-900 aspect-square flex items-center justify-center p-12">
              <div className="text-center w-full max-w-xs">
                <Logo className="w-full h-auto text-zinc-800 mb-6 drop-shadow-2xl" />
                <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold">Trend Digital Trade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-32 px-6 bg-zinc-950 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-black tracking-[0.3em] text-zinc-500 uppercase mb-6">Acceso Limitado</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 text-white">
            ¿Estás listo para operar con propósito?
          </h2>
          <p className="text-zinc-400 mb-12 leading-relaxed">
            El primer paso es registrarte y conectar tu cuenta de BingX.
            Desde ahí, la manada te guía.
          </p>
          <a
            href="/register"
            className="inline-block bg-white text-black text-sm font-black tracking-widest uppercase px-10 py-4 hover:bg-zinc-200 transition-colors"
          >
            Unirse a la Manada →
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-zinc-900 bg-black py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-zinc-700 text-xs font-black tracking-widest">
            © 2026 TREND DIGITAL TRADE
          </span>
          <div className="flex gap-6">
            <a href="/terms" className="text-zinc-600 text-xs hover:text-white transition-colors">Términos</a>
            <a href="/privacy" className="text-zinc-600 text-xs hover:text-white transition-colors">Privacidad</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
