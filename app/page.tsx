import Hero from "@/components/elite/hero";
import Trust from "@/components/elite/trust";
import Capabilities from "@/components/elite/capabilities";
import Analyzer from "@/components/elite/analyzer";
import { Footer } from "@/components/elite/footer";
import { StickyExitBar } from "@/components/elite/sticky-exit-bar";
import Testimonials from "@/components/elite/testimonials";

export default function ElitePage() {
  return (
    <main className="min-h-screen bg-black selection:bg-[#007AFF] selection:text-white relative">
      <Hero />
      <Trust />
      <Capabilities />
      <div id="analyzer-section">
        <Analyzer />
      </div>
      <Testimonials />
      <Footer />
    </main>
  );
}
