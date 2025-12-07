"use client"

import { useState } from "react"
import { I18nProvider } from "@/lib/i18n/context"
import LanguageSelector from "@/components/trend-up/language-selector"
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

function LandingContent() {
  return (
    <>
      <ChristmasSnow />
      <SocialProofTicker />
      <LanguageSelector />

      {/* PHASE 1: HERO (Action & Entry) */}
      <HeroSection />

      {/* PHASE 2: INFO & TRUST (Education, "No Bots") */}
      <ImpactSection />
      <FeaturesGrid />

      {/* PHASE 3: SOCIAL PROOF (Testimonials & Results) */}
      <StatsGrid />
      <TestimonialsSection />

      {/* PHASE 4: EL FARO (The Consultant) */}
      <SmartGrowthConsultant />

      {/* Footer Area */}
      <DirectServices />
      <FAQSection />
      <TrendUpFooter />
    </>
  )
}

export default function HomePage() {
  return (
    <I18nProvider>
      <main className="min-h-screen bg-slate-950">
        <LandingContent />
      </main>
    </I18nProvider>
  )
}
