import Hero from "@/components/elite/hero";
import Trust from "@/components/elite/trust";
import Narrative from "@/components/elite/narrative";
import AnalyzerWrapper from "@/components/elite/analyzer-wrapper";
import { Footer } from "@/components/elite/footer";
import { StickyExitBar } from "@/components/elite/sticky-exit-bar";

export default function ElitePage() {
  return (
    <main className="min-h-screen bg-black selection:bg-[#007AFF] selection:text-white relative">
      <Hero />
      <Trust />
      <Narrative />
      <div id="analyzer-section">
        <AnalyzerWrapper />
      </div>
      <Footer />
      <StickyExitBar />
    </main>
  );
}
