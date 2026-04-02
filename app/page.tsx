"use client";

import { useState } from "react";
import { Instagram, MessageCircle, ArrowRight, CheckCircle2, Loader2, Zap, Rocket, Crown, TrendingUp, Users, Target } from "lucide-react";
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
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, source: "landing_v2_reset" }),
      });
      
      if (!res.ok) throw new Error("Failed to submit");
      
      setStatus("success");
      setUsername("");
      toast.success("Analysis started. Talk soon.");
    } catch (err) {
      setStatus("idle");
      toast.error("Process interrupted. Try standard capture.");
    }
  };

  const scrollToOffer = () => {
     document.getElementById('offer-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800">
      {/* ── MINIMALIST HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-zinc-900/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-black tracking-tighter text-white hover:opacity-80 transition-opacity cursor-default">TDT.</span>
          <div className="flex items-center gap-6">
            <button onClick={scrollToOffer} className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">Pricing</button>
            <a href={IG_LINK} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* ── 1. HOOK (HERO) ── */}
      <section className="pt-48 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-10 text-white">
            Turn your Instagram into a <span className="text-zinc-500 italic">high-performing</span>, viral profile.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-xl mx-auto font-medium">
            We grow your Instagram and make it look viral — or you don’t pay.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={scrollToOffer}
              className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. PROBLEM (PAIN POINTS) ── */}
      <section className="py-32 px-6 bg-zinc-950/20 border-y border-zinc-900/50">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase mb-20 text-center">Identifying the friction</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="group">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-zinc-800 transition-colors">
                <Target className="w-5 h-5 text-zinc-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Low views</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Shadowbanned or algorithm-trapped? We break the ceiling with tactical attention hacks.</p>
            </div>
            <div className="group">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-zinc-800 transition-colors">
                <TrendingUp className="w-5 h-5 text-zinc-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">No growth</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Stuck at the same number for months? We inject predictable, qualified traffic.</p>
            </div>
            <div className="group">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-zinc-800 transition-colors">
                <Users className="w-5 h-5 text-zinc-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Profile looks dead</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Lack of engagement and authority? We re-engineer your profile perception.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SOLUTION (CORE PILLARS) ── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8">The TDT Solution</h2>
            <ul className="space-y-8">
               <li className="flex gap-4">
                 <div className="mt-1 flex-shrink-0 animate-pulse"><Zap className="w-5 h-5 text-yellow-500" /></div>
                 <div>
                   <h4 className="font-bold text-white uppercase text-xs tracking-widest mb-2">Growth + Engagement</h4>
                   <p className="text-zinc-500 text-sm">Automated systems fueling your profile with real, human activity 24/7.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="mt-1 flex-shrink-0"><Rocket className="w-5 h-5 text-red-500" /></div>
                 <div>
                   <h4 className="font-bold text-white uppercase text-xs tracking-widest mb-2">Profile Optimization</h4>
                   <p className="text-zinc-500 text-sm">Strategic bio rewrite, highlight restructuring, and aesthetic alignment.</p>
                 </div>
               </li>
               <li className="flex gap-4">
                 <div className="mt-1 flex-shrink-0"><Crown className="w-5 h-5 text-zinc-400" /></div>
                 <div>
                   <h4 className="font-bold text-white uppercase text-xs tracking-widest mb-2">Viral Perception</h4>
                   <p className="text-zinc-500 text-sm">Authority hacking techniques to ensure you look like a leader in your niche.</p>
                 </div>
               </li>
            </ul>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-white/5 blur-3xl opacity-50 rounded-full"></div>
             <div className="relative bg-zinc-950 border border-zinc-900 p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800"></div>
                      <div>
                        <div className="w-20 h-2 bg-zinc-800 rounded-full mb-1.5"></div>
                        <div className="w-12 h-1.5 bg-zinc-900 rounded-full"></div>
                      </div>
                   </div>
                   <div className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded">MATCH</div>
                </div>
                <div className="space-y-4">
                   <div className="w-full h-24 bg-zinc-900 rounded-xl"></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 bg-zinc-900 rounded-xl"></div>
                      <div className="h-16 bg-zinc-900 rounded-xl"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── 4. PROOF (RESULTS) ── */}
      <section className="py-32 px-6 bg-zinc-950/30 border-y border-zinc-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase mb-12">Proof of delivery</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 bg-black border border-zinc-900 rounded-3xl shadow-xl">
               <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-6">Client Case A</span>
               <div className="flex items-center justify-center gap-6 text-4xl font-black italic">
                 <span className="text-zinc-800">4K</span>
                 <ArrowRight className="w-5 h-5 text-zinc-700" />
                 <span className="text-white">85K</span>
               </div>
               <p className="mt-4 text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Followers in 30 days</p>
            </div>
            <div className="p-10 bg-black border border-zinc-900 rounded-3xl shadow-xl">
               <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-6">Engagement Audit</span>
               <div className="flex items-center justify-center gap-6 text-4xl font-black italic">
                 <span className="text-zinc-800">0.8%</span>
                 <ArrowRight className="w-5 h-5 text-zinc-700" />
                 <span className="text-white">7.2%</span>
               </div>
               <p className="mt-4 text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Avg. Profile Interaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. OFFER & 6. CTA (PRICING) ── */}
      <section id="offer-section" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">Secure Your Access</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">We work with a limited number of high-potential profiles each month.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* OFFER 1: THE TEST */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-10 hover:border-zinc-700 transition-all flex flex-col">
               <h3 className="text-xl font-bold text-white mb-2">The Test</h3>
               <p className="text-zinc-500 text-sm mb-6">10 days of intensive scale to prove our power.</p>
               <div className="mb-10">
                  <span className="text-4xl font-black text-white">$150</span>
                  <span className="text-xs uppercase font-black tracking-widest text-zinc-700 ml-2">/ 10 Days</span>
               </div>
               <ul className="space-y-4 mb-10 text-sm text-zinc-400 font-medium">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-700" /> Audit & Setup</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-700" /> 10 Days Growth Engine</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-zinc-700" /> Full Metrics Report</li>
               </ul>
               <button onClick={() => document.getElementById('capture')?.scrollIntoView({ behavior: 'smooth' })} className="mt-auto w-full py-4 rounded-xl border border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-colors">Start Test</button>
            </div>

            {/* OFFER 2: MONTHLY SCALE */}
            <div className="bg-white border text-black border-zinc-200 rounded-3xl p-10 shadow-2xl flex flex-col relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                  <Rocket className="w-20 h-20" />
               </div>
               <h3 className="text-xl font-bold mb-2">Monthly Scale</h3>
               <p className="text-zinc-500 text-sm mb-6">Full retention and daily growth dominance.</p>
               <div className="mb-10">
                  <span className="text-4xl font-black">$300</span>
                  <span className="text-xs uppercase font-black tracking-widest opacity-50 ml-2">/ Month</span>
               </div>
               <ul className="space-y-4 mb-10 text-sm font-medium">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4" /> Full System Integration</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4" /> Professional Setter (24/7)</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4" /> Dynamic Scripting</li>
               </ul>
               <button onClick={() => document.getElementById('capture')?.scrollIntoView({ behavior: 'smooth' })} className="mt-auto w-full py-4 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">Apply Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CAPTURE ── */}
      <section id="capture" className="py-32 px-6 bg-black border-t border-zinc-950">
        <div className="max-w-xl mx-auto text-center">
           <h2 className="text-4xl font-black tracking-tighter mb-4 text-white">Apply for Analysis</h2>
           <p className="text-zinc-500 mb-12">Submit your handle. We evaluate potential before accepting profiles.</p>
           
           {status === "success" ? (
             <div className="bg-zinc-950 border border-zinc-900 p-12 rounded-3xl animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-white mb-2">Submission Received</h3>
                <p className="text-sm text-zinc-500">Our structural analyst will DM you natively on Instagram if your profile matches our criteria.</p>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-zinc-600">@</span>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace('@',''))}
                    placeholder="instagram_handle" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-5 pl-12 pr-6 text-white font-bold placeholder:text-zinc-800 focus:outline-none focus:border-white transition-all disabled:opacity-50"
                    disabled={status === "loading"}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={status === "loading" || !username}
                  className="w-full bg-zinc-900 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                  Submit for Evaluation
                </button>
             </form>
           )}

           <div className="mt-12 flex flex-wrap justify-center gap-6">
              <a href={IG_LINK} target="_blank" className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all">Instagram Feed</a>
              <a href={WA_LINK} target="_blank" className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all">WhatsApp Concierge</a>
           </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-zinc-950 text-center opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.4em]">© 2026 TDT. Elite Operational Scaling.</p>
      </footer>
    </main>
  );
}
