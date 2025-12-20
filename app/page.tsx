"use client"

import { useState } from "react"
// import LanguageSelector from "@/components/trend-up/language-selector"
import UrgencyBanner from "@/components/trend-up/urgency-banner"
import SocialProofTicker from "@/components/trend-up/social-proof-ticker"
import HeroSection from "@/components/trend-up/hero-section"
import StatsGrid from "@/components/trend-up/stats-grid"
import NicheSelector from "@/components/trend-up/niche-selector"
import BeforeAfter from "@/components/trend-up/before-after"
import HowItWorks from "@/components/trend-up/how-it-works"
import FeaturesGrid from "@/components/trend-up/features-grid"
import ImpactSection from "@/components/trend-up/impact-section"
import TestimonialsSection from "@/components/trend-up/testimonials-section"
import PricingSection from "@/components/trend-up/pricing-section"
import DirectServices from "@/components/trend-up/direct-services"
import FAQSection from "@/components/trend-up/faq-section"
import TrendUpFooter from "@/components/trend-up/footer"
import ServicePackages from "@/components/trend-up/service-packages"
import ChristmasSnow from "@/components/ui/christmas-snow"
import SmartGrowthConsultant from "@/components/trend-up/smart-growth-consultant"
import { instagramFollowersPackages } from "@/lib/trend-up/packages"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* <ChristmasSnow /> */}
      {/* <SocialProofTicker /> */}
      {/* <LanguageSelector /> */}

      {/* PHASE 1: HERO (Action & Entry) */}
      <HeroSection />

      {/* PHASE 2: INFO & TRUST (Education, "No Bots") */}
      <ImpactSection />
      <FeaturesGrid />
      <HowItWorks />

      {/* PHASE 3: SOCIAL PROOF (Testimonials & Results) */}
      <StatsGrid />
      <TestimonialsSection />

      {/* PHASE 4: EL FARO (The Consultant) */}
      <SmartGrowthConsultant />

      {/* Pricing Section (Was Missing) */}
      {/* PRICING HIDDEN - STRATEGY CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-indigo-950/50" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white px-4">
              How much does growth cost?
            </h2>
            <p className="text-xl text-slate-400 font-medium">
              Our AI customizes plans based on your Niche and Goals.
            </p>
            <div className="flex justify-center pt-4">
              <a
                href="#consultant"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full text-xl font-black hover:bg-indigo-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105"
              >
                <span>Calculate My Strategy 🤖</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Area */}
      <DirectServices />
      <FAQSection />
      <TrendUpFooter />
    </main>
  )
}
