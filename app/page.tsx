"use client"

import { useState } from "react"
import { I18nProvider } from "@/lib/i18n/context"
import LanguageSelector from "@/components/trend-up/language-selector"
import UrgencyBanner from "@/components/trend-up/urgency-banner"
import SocialProofTicker from "@/components/trend-up/social-proof-ticker"
import HeroSection from "@/components/trend-up/hero-section"
import ServicePackages from "@/components/trend-up/service-packages"
import { instagramFollowersPackages } from "@/lib/trend-up/packages"

function LandingContent() {
  return (
    <>
      <SocialProofTicker />
      <LanguageSelector />
      <HeroSection />
      {/* <ProfileAnalyzer /> - Removed per user feedback */}
      <StatsGrid />
      <NicheSelector />
      <BeforeAfter />
      <HowItWorks />
      {/* <ComparisonSection /> - Removed per user feedback */}
      <FeaturesGrid />
      {/* <AIEngineSection /> - Removed per user feedback about dashboard image */}
      <ImpactSection />
      <TestimonialsSection />

      {/* Pricing Slider */}
      <PricingSection />

      {/* Detailed Gaming-style Packages */}
      <ServicePackages packages={instagramFollowersPackages} platform="instagram" />

      {/* Other Services - Moved to bottom per user request */}
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
