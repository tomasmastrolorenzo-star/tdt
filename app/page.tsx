"use client";

import { useState } from "react";
import { Instagram, MessageCircle, ArrowRight, TrendingUp, Users, Target, CheckCircle2 } from "lucide-react";
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
        body: JSON.stringify({ username, source: "landing_mvp" }),
      });
      
      if (!res.ok) throw new Error("Failed to submit");
      
      setStatus("success");
      setUsername("");
      toast.success("Profile submitted successfully! We'll be in touch.");
    } catch (err) {
      setStatus("idle");
      toast.error("Something went wrong. Please try again or message us directly.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800">
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-black tracking-tighter text-white">TDT</span>
          <div className="flex items-center gap-4">
            <a href={IG_LINK} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight mb-6 text-white">
            We help you grow your audience and boost your engagement.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Build a stronger profile, attract more opportunities and stand out.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={IG_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition-colors"
            >
              <Instagram className="w-5 h-5" />
              Message us on Instagram
            </a>
            <a 
              href={WA_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-full font-bold hover:bg-zinc-800 transition-colors border border-zinc-800"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-20 px-6 border-y border-zinc-900 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-12">Real Results</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-black border border-zinc-900 rounded-2xl">
              <p className="text-zinc-500 text-sm font-semibold mb-2">Account Growth</p>
              <div className="flex items-center justify-center gap-3 text-3xl font-black">
                <span className="text-zinc-400">12K</span>
                <ArrowRight className="w-6 h-6 text-zinc-600" />
                <span className="text-white">105K</span>
              </div>
            </div>
            <div className="p-6 bg-black border border-zinc-900 rounded-2xl">
              <p className="text-zinc-500 text-sm font-semibold mb-2">Engagement Rate</p>
              <div className="flex items-center justify-center gap-3 text-3xl font-black">
                <span className="text-zinc-400">1.2%</span>
                <ArrowRight className="w-6 h-6 text-zinc-600" />
                <span className="text-white">6.8%</span>
              </div>
            </div>
            <div className="p-6 bg-black border border-zinc-900 rounded-2xl">
              <p className="text-zinc-500 text-sm font-semibold mb-2">Monthly Views</p>
              <div className="flex items-center justify-center gap-3 text-3xl font-black">
                <span className="text-zinc-400">50K</span>
                <ArrowRight className="w-6 h-6 text-zinc-600" />
                <span className="text-white">2.4M</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-black text-white">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">We analyze your profile</h3>
              <p className="text-zinc-400">Deep dive into your current metrics, content strategy, and target audience.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-black text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">We create a strategy</h3>
              <p className="text-zinc-400">Custom roadmap designed specifically to attract and retain your ideal followers.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-black text-white">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">We boost your audience</h3>
              <p className="text-zinc-400">Execution and optimization to rapidly scale your engagement and reach.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-20 px-6 bg-zinc-950/50 border-y border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">Services</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center gap-4 p-6 bg-black border border-zinc-900 rounded-2xl">
              <div className="p-3 bg-zinc-900 text-white rounded-xl"><Users className="w-6 h-6" /></div>
              <span className="text-lg font-bold text-white">Follower growth</span>
            </div>
            <div className="flex items-center gap-4 p-6 bg-black border border-zinc-900 rounded-2xl">
              <div className="p-3 bg-zinc-900 text-white rounded-xl"><TrendingUp className="w-6 h-6" /></div>
              <span className="text-lg font-bold text-white">Engagement boost</span>
            </div>
            <div className="flex items-center gap-4 p-6 bg-black border border-zinc-900 rounded-2xl">
              <div className="p-3 bg-zinc-900 text-white rounded-xl"><Target className="w-6 h-6" /></div>
              <span className="text-lg font-bold text-white">Profile positioning</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA & LEAD CAPTURE ── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">We can start today.</h2>
          <p className="text-xl text-zinc-400 mb-10">Message us and we'll analyze your profile.</p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-16">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">@</span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Instagram username" 
                  disabled={status === "loading" || status === "success"}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={status === "loading" || status === "success" || !username}
                className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Analyzing..." : status === "success" ? <><CheckCircle2 className="w-5 h-5"/> Request Received</> : "Analyze my profile"}
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={IG_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-full font-bold hover:bg-zinc-800 transition-colors border border-zinc-800"
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </a>
            <a 
              href={WA_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 text-white px-8 py-4 rounded-full font-bold hover:bg-zinc-800 transition-colors border border-zinc-800"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
      
      {/* ── FOOTER ── */}
      <footer className="py-8 px-6 border-t border-zinc-900 text-center">
        <p className="text-zinc-600 text-sm font-bold tracking-widest uppercase">© 2026 Trend Digital Trade</p>
      </footer>
    </main>
  );
}
