import Hero from "@/components/elite/hero";
import Trust from "@/components/elite/trust";
import Narrative from "@/components/elite/narrative";
import AnalyzerWrapper from "@/components/elite/analyzer-wrapper";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-[#007AFF] selection:text-white">
      <Hero />
      <Trust />
      <Narrative />
      <AnalyzerWrapper />

      {/* Simple Elite Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#050505] text-center">
        <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-mono">
          &copy; {new Date().getFullYear()} TDT Elite Protocol. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
