import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Pricing } from "@/components/landing/pricing"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <Hero />
      <Pricing />
      <Footer />
    </main>
  )
}
