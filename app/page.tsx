"use client";

import { useState } from "react";
import { Loader2, ArrowRight, CheckCircle2, Instagram } from "lucide-react";

export default function LandingPage() {
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [goal, setGoal] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "saving" | "success" | "error">("idle");
  const [scanStep, setScanStep] = useState(0);
  const [scanData, setScanData] = useState<any>(null);

  const igHandle = process.env.NEXT_PUBLIC_IG_HANDLE || "trendigitaltrade";
  const IG_LINK = `https://www.instagram.com/${igHandle}/`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2 || !handle || !goal) return;

    setStatus("scanning");
    const cleanHandle = handle.trim().startsWith('@') ? handle.trim().substring(1) : handle.trim();

    // Visual progression simulation during Apify Boot
    const interval = setInterval(() => {
       setScanStep(prev => prev < 4 ? prev + 1 : prev);
    }, 4500);

    try {
      // 1. Forensics 
      const igRes = await fetch("/api/forensic/instagram", {
         method: "POST", headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ handle: cleanHandle })
      });
      const igData = await igRes.json();
      
      clearInterval(interval);
      setScanStep(5);
      setStatus("saving");

      const enrichedMetadata = {
         name, 
         goal,
         followers: igData?.data?.followers || 0,
         isPrivate: igData?.data?.isPrivate || false,
         engagementProxy: igData?.data?.engagement_proxy || 0
      };

      // 2. Lead Intake (Phase 23: Analizado)
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instagram_username: cleanHandle,
          source: "landing",
          status: "analizado", // Auto-dropped into Screener column logic later
          metadata: enrichedMetadata
        }),
      });

      if (!res.ok) throw new Error("Failed to submit lead");

      setScanData(igData.data);
      setStatus("success");
    } catch (err) {
      clearInterval(interval);
      setStatus("error");
    }
  };

  const scrollToForm = () => {
    document.getElementById('intake-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const isFormValid = name.length >= 2 && handle.trim().length > 0 && goal !== "";

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-zinc-800">
      
      {/* ── SECCIÓN 1 — HERO ── */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1D9E75]/10 blur-[150px] pointer-events-none rounded-full"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1] mb-8 text-white">
            Real growth. <br className="md:hidden" /><span className="text-zinc-500">No bots.</span> No gimmicks.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            We grow Instagram accounts for creators and entrepreneurs who are serious about their presence.<br className="hidden md:block"/>
            From 5K to 25K. From 30K to 100K.<br className="hidden md:block"/>
            <span className="text-white">Real followers. Real engagement. Real results.</span>
          </p>
          <div className="flex flex-col items-center justify-center gap-4">
            <button 
              onClick={scrollToForm}
              className="w-full sm:w-auto bg-[#1D9E75] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#168260] hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(29,158,117,0.2)]"
            >
              Get a Free Profile Review
            </button>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">
              No commitment. We'll tell you exactly what your account needs.
            </span>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 2 — SOCIAL PROOF ── */}
      <section className="py-24 px-6 border-y border-zinc-900/50 bg-black/50 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">Don't take our word for it.</h2>
            <p className="text-zinc-500 uppercase font-black tracking-widest text-[10px]">Look at the numbers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-zinc-900 rounded-3xl bg-[#050505]">
               <div className="flex items-center gap-4 text-3xl font-black text-white font-mono mb-4">
                 <span>8K</span> <ArrowRight className="w-5 h-5 text-[#1D9E75]" /> <span>47K</span>
               </div>
               <p className="text-xs uppercase font-bold tracking-widest text-zinc-500">Fitness coach · 60 days</p>
            </div>
            <div className="p-8 border border-zinc-900 rounded-3xl bg-[#050505]">
               <div className="flex items-center gap-4 text-3xl font-black text-white font-mono mb-4">
                 <span>5K</span> <ArrowRight className="w-5 h-5 text-[#1D9E75]" /> <span>25K</span>
               </div>
               <p className="text-xs uppercase font-bold tracking-widest text-zinc-500">Entrepreneur · 30 days</p>
            </div>
            <div className="p-8 border border-zinc-900 rounded-3xl bg-[#050505]">
               <div className="flex items-center gap-4 text-3xl font-black text-white font-mono mb-4">
                 <span>30K</span> <ArrowRight className="w-5 h-5 text-[#1D9E75]" /> <span>100K</span>
               </div>
               <p className="text-xs uppercase font-bold tracking-widest text-zinc-500">Lifestyle creator · 45 days</p>
            </div>
          </div>

          {/* WALL OF LOVE (TESTIMONIALS PLACEHOLDER) */}
          <div className="mt-20 pt-20 border-t border-zinc-900">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* SUCCESS STORY 1: FITNESS EXPLOSION */}
                <div className="aspect-[9/16] bg-zinc-950 border border-zinc-900 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
                   <img 
                     src="/tdt-assets/before-after/Screenshot_20250819-231756.png" 
                     alt="Fitness Growth" 
                     className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute bottom-8 left-8 z-20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                        <p className="text-white font-black text-xs uppercase tracking-widest">Case Study: Fitness</p>
                      </div>
                      <p className="text-4xl font-black text-white tracking-tighter">+40K</p>
                      <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Organic reach unlocked</p>
                   </div>
                </div>

                {/* SUCCESS STORY 2: ENTREPRENEUR AUTHORITY */}
                <div className="aspect-[9/16] bg-zinc-950 border border-zinc-900 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
                   <img 
                     src="/tdt-assets/before-after/Screenshot_20260401-222934.Instagram.png" 
                     alt="Business Growth" 
                     className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute bottom-8 left-8 z-20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
                        <p className="text-white font-black text-xs uppercase tracking-widest">Personal Brand</p>
                      </div>
                      <p className="text-4xl font-black text-white tracking-tighter">Verified</p>
                      <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Positioning & Trust</p>
                   </div>
                </div>

                {/* SUCCESS STORY 3: LIFESTYLE / MODEL */}
                <div className="aspect-[9/16] bg-zinc-950 border border-zinc-900 rounded-[2.5rem] relative overflow-hidden group shadow-2xl hidden lg:block">
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
                   <img 
                     src="/tdt-assets/before-after/Screenshot_20251002-094547.Instagram.png" 
                     alt="Lifestyle Growth" 
                     className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute bottom-8 left-8 z-20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>
                        <p className="text-white font-black text-xs uppercase tracking-widest">Creator Growth</p>
                      </div>
                      <p className="text-4xl font-black text-white tracking-tighter">10X</p>
                      <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">Inbound Leads Surge</p>
                   </div>
                </div>

             </div>
          </div>

        </div>
      </section>

      {/* ── SECCIÓN 3 — EL PROBLEMA ── */}
      <section className="py-32 px-6 bg-[#050505]">
        <div className="max-w-3xl mx-auto text-center md:text-left p-12 border border-zinc-900 bg-zinc-950/30 rounded-[3rem]">
          <p className="text-2xl md:text-3xl font-medium text-zinc-400 leading-snug mb-10">
            You're posting consistently.<br/>
            You're putting in the work.<br/>
            <span className="text-white font-bold">But your follower count isn't moving.</span>
          </p>
          <p className="text-lg text-zinc-500 leading-relaxed mx-auto mb-10">
            Your content is good — the problem is reach.<br/>
            Without the right growth strategy, Instagram buries your profile.<br/>
            You stay invisible while other accounts in your niche grow past you.
          </p>
          <p className="text-2xl font-black text-[#1D9E75]">That's what we fix.</p>
        </div>
      </section>

      {/* ── SECCIÓN 4 — CÓMO FUNCIONA ── */}
      <section className="py-32 px-6 border-y border-zinc-900/50 bg-black/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="relative">
               <div className="text-6xl font-black text-zinc-900 opacity-50 absolute -top-10 -left-6 -z-10">01</div>
               <h3 className="text-xl font-black text-white mb-4">We analyze your profile</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">
                 We look at your niche, content quality, current engagement, and growth potential. No generic approach — every account is different.
               </p>
            </div>
            <div className="relative">
               <div className="text-6xl font-black text-zinc-900 opacity-50 absolute -top-10 -left-6 -z-10">02</div>
               <h3 className="text-xl font-black text-white mb-4">We build your growth plan</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">
                 Followers, engagement, or both. We tell you exactly what your profile needs and what results to expect.
               </p>
            </div>
            <div className="relative">
               <div className="text-6xl font-black text-[#1D9E75]/20 absolute -top-10 -left-6 -z-10">03</div>
               <h3 className="text-xl font-black text-white mb-4">We execute. You focus on your content.</h3>
               <p className="text-zinc-500 text-sm leading-relaxed">
                 Our system runs in the background. You keep creating. Results start showing within 24–48 hours.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 5 — PARA QUIÉN ── */}
      <section className="py-32 px-6 bg-[#050505]">
        <div className="max-w-4xl mx-auto bg-zinc-950 border border-zinc-900 rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1D9E75]/5 blur-[100px] pointer-events-none rounded-full"></div>
          <h2 className="text-3xl font-black mb-8 text-white relative z-10">This works for:</h2>
          <ul className="space-y-4 mb-16 text-zinc-400 font-medium relative z-10">
            <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-[#1D9E75] shrink-0" /> <span className="pt-0.5">Fitness coaches and trainers building their client base online</span></li>
            <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-[#1D9E75] shrink-0" /> <span className="pt-0.5">Entrepreneurs using Instagram to grow their brand</span></li>
            <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-[#1D9E75] shrink-0" /> <span className="pt-0.5">Models and lifestyle creators looking to scale their reach</span></li>
            <li className="flex gap-4"><CheckCircle2 className="w-6 h-6 text-[#1D9E75] shrink-0" /> <span className="pt-0.5">Anyone between 5K and 200K followers ready to grow seriously</span></li>
          </ul>

          <div className="pt-8 border-t border-zinc-900 relative z-10">
            <p className="text-red-400 font-bold mb-2">This is NOT for people looking for fake numbers.</p>
            <p className="text-zinc-500 text-sm">
              If you want bots, we're not your agency.<br/>
              If you want real growth that holds — you're in the right place.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 6 — FORMULARIO ── */}
      <section id="intake-form" className="py-32 px-6 bg-black border-y border-zinc-900/50">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">Let's look at your profile.</h2>
            <p className="text-zinc-500 text-sm">
              Fill out the form below. We'll review your account and get back to you within 24 hours with a clear recommendation — no sales pressure.
            </p>
          </div>

          {status === "success" && scanData ? (
             <div className="bg-zinc-950 border border-zinc-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1D9E75]/10 blur-3xl pointer-events-none"></div>
                
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-16 h-16 rounded-2xl border-2 border-zinc-800 bg-black overflow-hidden flex-shrink-0">
                      {scanData.profilePic ? <img src={scanData.profilePic} alt="Profile" className="w-full h-full object-cover" /> : <Instagram className="w-full h-full p-4 text-zinc-800" />}
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-white">@{scanData.handle}</h3>
                      <div className="flex gap-2 items-center">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${scanData.is_real_data ? 'bg-[#1D9E75]/20 text-[#1D9E75] border-[#1D9E75]/30' : 'bg-amber-500/20 text-amber-500 border-amber-500/30'}`}>
                           {scanData.is_real_data ? 'Live Scrape Active' : 'Smart Estimate: Simulation Mode'}
                        </span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-black/40 border border-zinc-900 rounded-2xl p-4">
                      <p className="text-[9px] uppercase font-black text-zinc-600 mb-1">Followers</p>
                      <p className="text-xl font-black text-white">{scanData.followers?.toLocaleString() || '—'}</p>
                   </div>
                   <div className="bg-black/40 border border-zinc-900 rounded-2xl p-4">
                      <p className="text-[9px] uppercase font-black text-zinc-600 mb-1">Engagement</p>
                      <p className="text-xl font-black text-[#1D9E75]">{(scanData.engagement_proxy * 100).toFixed(1)}%</p>
                   </div>
                </div>

                <div className="bg-[#1D9E75] text-white p-5 rounded-2xl text-center shadow-[0_0_30px_rgba(29,158,117,0.3)]">
                   <p className="text-xs font-black uppercase tracking-widest">Audit Successful — Lead Sent to CEO</p>
                </div>
             </div>
          ) : status === "success" ? (
             <div className="bg-[#1D9E75]/10 border border-[#1D9E75]/30 p-8 rounded-2xl text-center">
                <CheckCircle2 className="w-12 h-12 text-[#1D9E75] mx-auto mb-4" />
                <h3 className="text-xl font-black text-[#1D9E75]">We'll be in touch within 24 hours.</h3>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-zinc-950 border border-zinc-900 p-8 rounded-3xl shadow-xl">
              
              <div>
                <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 block mb-2">Your name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-4 px-5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#1D9E75] transition-colors disabled:opacity-50"
                  disabled={status === "scanning" || status === "saving"}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 block mb-2">Instagram handle</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-zinc-600">@</span>
                  <input 
                    type="text" 
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.replace('@',''))}
                    placeholder="username"
                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-4 pl-10 pr-5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#1D9E75] transition-colors disabled:opacity-50"
                    disabled={status === "scanning" || status === "saving"}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 block mb-2">What are you looking for?</label>
                <select 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl py-4 px-5 text-white focus:outline-none focus:border-[#1D9E75] transition-colors disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5%22%20fill%3D%22none%22%20stroke%3D%22%2371717A%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:calc(100%_-_1rem)_center] bg-no-repeat"
                  disabled={status === "scanning" || status === "saving"}
                >
                  <option value="" disabled>Select an option</option>
                  <option value="Grow my followers">Grow my followers</option>
                  <option value="Increase my engagement">Increase my engagement</option>
                  <option value="Both — full growth package">Both — full growth package</option>
                  <option value="Not sure yet — I want a recommendation">Not sure yet — I want a recommendation</option>
                </select>
              </div>

              {status === "error" && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center mt-2">
                  <p className="text-sm text-red-500 font-bold mb-2">Something went wrong.</p>
                  <a href={IG_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-xs text-white hover:underline">
                    <Instagram className="w-4 h-4" /> DM us directly on Instagram
                  </a>
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === "scanning" || status === "saving" || !isFormValid}
                className="w-full mt-4 bg-[#1D9E75] text-white font-black uppercase tracking-widest text-[11px] py-5 rounded-xl hover:bg-[#168260] transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-80 disabled:hover:bg-[#1D9E75] relative overflow-hidden"
              >
                {(status === "scanning" || status === "saving") && (
                  <div className="absolute inset-0 bg-[#0c5940] w-full animate-pulse transition-all"></div>
                )}
                
                <div className="relative z-10 flex items-center gap-3">
                  {status === "scanning" || status === "saving" ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {status === "idle" || status === "error" ? "Run Profile Audit" : 
                   status === "scanning" && scanStep === 0 ? "Mounting Apify Proxy..." :
                   status === "scanning" && scanStep === 1 ? "Extracting Footprint..." :
                   status === "scanning" && scanStep === 2 ? "Analyzing Engagement Graph..." :
                   status === "scanning" && scanStep >= 3 ? "Compiling Audit Report..." :
                   "Finalizing Profile Review..."
                  }
                </div>
              </button>
              
              <p className="text-center text-[10px] uppercase font-bold tracking-widest text-zinc-600 mt-2">
                Scanning takes approximately 30 seconds. Do not close this window.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── SECCIÓN 7 — CIERRE ── */}
      <footer className="py-24 px-6 text-center bg-[#050505]">
        <h3 className="text-2xl font-black text-white mb-2">No contracts. No lock-ins.</h3>
        <p className="text-zinc-500 mb-10 font-medium">Results within 48 hours or we make it right.</p>
        <div className="inline-block px-4 py-3 bg-zinc-950 border border-zinc-900 rounded-lg">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
            — TDT · Trend Digital Trade
          </p>
        </div>
      </footer>
    </main>
  );
}
