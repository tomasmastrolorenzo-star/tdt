import { Banner } from "@/components/landing/banner"
import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Ticker } from "@/components/landing/ticker"
import { Features } from "@/components/landing/features"
import { ServicesList } from "@/components/landing/services-list"
import { PricingCards } from "@/components/landing/pricing-cards"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Banner />
      <Header />
      <Hero />
      <Ticker />
      <Features />
      <ServicesList />
      <PricingCards />
    </main>
  )
}
