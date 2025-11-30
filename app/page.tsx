"use client"

import { useState } from "react"
import { I18nProvider } from "@/lib/i18n/context"
import LanguageSelector from "@/components/trend-up/language-selector"
import UrgencyBanner from "@/components/trend-up/urgency-banner"
import SocialProofTicker from "@/components/trend-up/social-proof-ticker"
import HeroSection from "@/components/trend-up/hero-section"
import PlatformSelector from "@/components/trend-up/platform-selector"
import ServicePackages from "@/components/trend-up/service-packages"
import TrustSection from "@/components/trend-up/trust-section"
import HowItWorks from "@/components/trend-up/how-it-works"
import FAQSection from "@/components/trend-up/faq-section"
import FinalCTA from "@/components/trend-up/final-cta"
import TrendUpFooter from "@/components/trend-up/footer"
import {
  instagramFollowersPackages,
  tiktokFollowersPackages,
  youtubeSubscribersPackages,
} from "@/lib/trend-up/packages"

function LandingContent() {
  const [selectedPlatform, setSelectedPlatform] = useState("instagram")

  const getPackages = () => {
    switch (selectedPlatform) {
      case "tiktok":
        return tiktokFollowersPackages
      case "youtube":
        return youtubeSubscribersPackages
      default:
        return instagramFollowersPackages
    }
  }

  return (
    <>
      <UrgencyBanner />
      <SocialProofTicker />
      <LanguageSelector />
      <HeroSection />
      <PlatformSelector selectedPlatform={selectedPlatform} onSelect={setSelectedPlatform} />
      <ServicePackages packages={getPackages()} platform={selectedPlatform} />
      <TrustSection />
      <HowItWorks />
      <FAQSection />
      <FinalCTA />
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
