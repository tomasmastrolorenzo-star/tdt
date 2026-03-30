"use client";

import { useState } from "react";
import { Instagram, MessageCircle, ArrowRight, CheckCircle2, Loader2, Zap, Rocket, Crown } from "lucide-react";
import { toast } from "sonner"; 

const IG_LINK = "https://www.instagram.com/trendigitaltrade/";
const WA_LINK = "https://wa.me/message/LAOREV7O4KONP1";

export default function LandingMVP() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setStatus("loading");
    
    try {
      const apiCall = fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, source: "landing" }),
      });
      
      const [res] = await Promise.all([apiCall, new Promise(r => setTimeout(r, 2000))]);
      
      if (!res.ok) throw new Error("Failed to submit");
      
      setStatus("success");
      setUsername("");
    } catch (err) {
      setStatus("idle");
      toast.error("Processing offline. Diverting to external message gateway.");
    }
  };

  const scrollToPacks = () => {
     document.getElementById('packs-matrix')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800">
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-black tracking-tighter text-white">TDT.</span>
          <div className="flex items-center gap-4">
             <button onClick={scrollToPacks} className="text-[10px] hidden md:block uppercase font-black tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">Sistemas</button>
            <a href={IG_LINK} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors ml-4">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* ── AGGRESSIVE HERO ── */}
      <section className="pt-40 md:pt-48 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/10 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-8 text-white">
            Dominamos la atención.<br/>
            Escalamos tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">facturación</span>.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-medium">
            Sistemas predecibles de crecimiento, tráfico altamente calificado y estructuras de cierre para creadores y marcas que no quieren depender del algoritmo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={scrollToPacks}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              Aplicar ahora
            </button>
            <a 
              href={IG_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-colors border border-zinc-800"
            >
              <Instagram className="w-4 h-4" />
              Ver Resultados
            </a>
          </div>
        </div>
      </section>

      {/* ── HARD SOCIAL PROOF ── */}
      <section className="py-24 px-6 border-y border-zinc-900 bg-zinc-950/30">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[10px] font-black tracking-[0.3em] text-red-500/80 uppercase mb-16 flex items-center justify-center gap-3">
             <span className="w-8 h-[1px] bg-red-900/50"></span>
             Métricas de Escalamiento Real
             <span className="w-8 h-[1px] bg-red-900/50"></span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-black/60 border border-zinc-900 rounded-3xl hover:border-zinc-800 transition-colors">
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Captación Masiva</p>
              <div className="flex items-center justify-center gap-4 text-4xl md:text-5xl font-black">
                <span className="text-zinc-500 line-through decoration-zinc-800 decoration-4">12K</span>
                <ArrowRight className="w-6 h-6 text-red-500" />
                <span className="text-white">105K</span>
              </div>
              <p className="text-zinc-600 mt-4 text-[10px] uppercase font-bold tracking-widest">+ Seguidores cualificados</p>
            </div>
            <div className="p-8 bg-black/60 border border-zinc-900 rounded-3xl hover:border-zinc-800 transition-colors">
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Retención & Eng.</p>
              <div className="flex items-center justify-center gap-4 text-4xl md:text-5xl font-black">
                <span className="text-zinc-500 line-through decoration-zinc-800 decoration-4">1.2%</span>
                <ArrowRight className="w-6 h-6 text-orange-500" />
                <span className="text-white">6.8%</span>
              </div>
              <p className="text-zinc-600 mt-4 text-[10px] uppercase font-bold tracking-widest">+ Interacción diaria directa</p>
            </div>
            <div className="p-8 bg-black/60 border border-zinc-900 rounded-3xl hover:border-zinc-800 transition-colors">
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Facturación Base</p>
              <div className="flex items-center justify-center gap-4 text-4xl md:text-5xl font-black">
                <span className="text-zinc-500 line-through decoration-zinc-800 decoration-4">$2k</span>
                <ArrowRight className="w-6 h-6 text-green-500" />
                <span className="text-white">$15k+</span>
              </div>
              <p className="text-zinc-600 mt-4 text-[10px] uppercase font-bold tracking-widest">+ Cashflow MRR validado</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLEAR PACKS (PHASE 10 PRICING MATRIX) ── */}
      <section id="packs-matrix" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">Sistemas de Operación</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">No vendemos cursos. Implementamos infraestructuras de negocio hiper-eficientes directamente en tu biografía.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* PACK 1 */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 hover:border-zinc-800 transition-all">
               <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 mb-6">
                 <Zap className="w-6 h-6" />
               </div>
               <h3 className="text-2xl font-black text-white mb-2">Growth Boost</h3>
               <p className="text-zinc-500 text-sm font-medium mb-6 min-h-[40px]">Inyección táctica de atención para revivir métricas congeladas.</p>
               <div className="mb-8">
                  <span className="text-3xl font-black text-white">$149</span>
                  <span className="text-xs uppercase font-bold tracking-widest text-zinc-600 ml-2">/ Una vez</span>
               </div>
               <ul className="space-y-4 mb-8 text-sm text-zinc-400 font-medium">
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" /> Auditoría forense de perfil.</li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" /> Plan de reestructuración de imagen.</li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" /> 14 Días de Growth acelerado masivo.</li>
               </ul>
               <button onClick={() => document.getElementById('capture-form')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 rounded-xl border border-zinc-800 text-xs font-black uppercase tracking-widest hover:bg-zinc-900 transition-colors">Start Boost</button>
            </div>

            {/* PACK 2 (MOST POPULAR) */}
            <div className="bg-gradient-to-br from-red-950/40 to-black border border-red-900/50 rounded-3xl p-8 relative shadow-2xl scale-[1.02] z-10">
               <div className="absolute top-0 right-10 translate-y-[-50%] bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                 El Estándar
               </div>
               <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                 <Rocket className="w-6 h-6" />
               </div>
               <h3 className="text-2xl font-black text-white mb-2">Monthly Growth + Setter</h3>
               <p className="text-red-500/80 text-sm font-medium mb-6 min-h-[40px]">La maquinaria que transforma atención bruta en llamadas agendadas todos los días.</p>
               <div className="mb-8">
                  <span className="text-4xl font-black text-white">$300</span>
                  <span className="text-xs text-zinc-500 uppercase font-black tracking-widest ml-2">/ mes</span>
               </div>
               <ul className="space-y-4 mb-8 text-sm text-zinc-300 font-medium">
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Operador táctico (Setter) 24/7.</li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Scripting dinámico de ventas (DM).</li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Flujo perpetuo de contenido base.</li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Calificación estricta de leads diarios.</li>
               </ul>
               <button onClick={() => document.getElementById('capture-form')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-[1.02] hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">Postular Negocio</button>
            </div>

            {/* PACK 3 */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 hover:border-zinc-800 transition-all">
               <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400 mb-6">
                 <Crown className="w-6 h-6" />
               </div>
               <h3 className="text-2xl font-black text-white mb-2">TDT Full System</h3>
               <p className="text-zinc-500 text-sm font-medium mb-6 min-h-[40px]">Delegación operativa total. IA, automatizaciones y un equipo agresivo a tu disposición.</p>
               <div className="mb-8">
                  <span className="text-3xl font-black text-white">$500+</span>
                  <span className="text-xs uppercase font-bold tracking-widest text-zinc-600 ml-2">/ Custom</span>
               </div>
               <ul className="space-y-4 mb-8 text-sm text-zinc-400 font-medium">
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" /> Creación del Offer Irresistible.</li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" /> Ads management y control CPA.</li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" /> Integración CRM TDT a medida.</li>
                 <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" /> Growth + Setter + Consultoría 1-1.</li>
               </ul>
               <button onClick={() => document.getElementById('capture-form')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 rounded-xl border border-zinc-800 text-xs font-black uppercase tracking-widest hover:bg-zinc-900 transition-colors">Solicitar Acceso</button>
            </div>

          </div>
        </div>
      </section>

      {/* ── FINAL DIRECT CTA & LEAD CAPTURE ── */}
      <section id="capture-form" className="py-24 px-6 text-center bg-black">
        <div className="max-w-2xl mx-auto border-t border-zinc-900 pt-24">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">Escalamos hoy.</h2>
          <p className="text-xl text-zinc-400 mb-12">No agarramos cuentas muertas sin potencial. Ingresa tu usuario para evaluar si podemos estructurarte.</p>

          {status === "success" ? (
             <div className="max-w-md mx-auto bg-green-950/20 border border-green-900/50 p-10 rounded-3xl mb-16 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">Cuenta en Revisión</h3>
                <p className="text-[10px] text-green-500/80 font-black tracking-[0.3em] uppercase mb-6">Autorización exitosa de sistema</p>
                <div className="bg-black/50 border border-green-900/30 p-4 rounded-xl text-sm font-medium text-zinc-400">Nuestro equipo está ejecutando el análisis estructural de tu perfil. En caso de ser aceptado, un operador de TDT te hablará nativamente por Instagram.</div>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-16 relative">
              <div className="flex flex-col gap-4">
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold group-focus-within:text-white transition-colors">@</span>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tu usuario de Instagram" 
                    disabled={status === "loading"}
                    className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl py-5 pl-12 pr-6 text-white placeholder-zinc-600 font-bold text-lg focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all disabled:opacity-50"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={status === "loading" || !username}
                  className="w-full flex items-center justify-center gap-3 bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 transition-all disabled:opacity-80 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin text-zinc-500" /> Computando Métricas...</> : "Aplicar para Trabajar Juntos"}
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={IG_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-colors border border-zinc-700"
            >
              <Instagram className="w-4 h-4 text-zinc-400" /> Seguir en Instagram
            </a>
            <a 
              href={WA_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-colors border border-zinc-700"
            >
              <MessageCircle className="w-4 h-4 text-zinc-400" /> Directo a WhatsApp
            </a>
          </div>
        </div>
      </section>
      
      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 border-t border-zinc-900 text-center bg-black">
        <p className="text-zinc-600 text-[10px] font-black tracking-[0.3em] uppercase">© 2026 Trend Digital Trade • Elite Scaling</p>
      </footer>
    </main>
  );
}
