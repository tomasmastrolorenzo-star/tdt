import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { I18nProvider } from "@/lib/i18n/context"
import { Toaster } from "@/components/ui/toaster"
import ErrorBoundary from "@/components/ErrorBoundary"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "TDT — Real Instagram Growth. No Bots.",
  description: "We grow Instagram accounts for creators and entrepreneurs. Real followers, real engagement. Results within 48 hours.",
  keywords: "social media growth, instagram followers, tiktok growth, ai marketing, trend digital trade, real followers",
  generator: "Next.js",
  applicationName: "Trend Digital Trade",
  openGraph: {
    title: "TDT — Real Instagram Growth",
    description: "From 5K to 100K. Real growth. No bots.",
    url: "https://trenddigitaltrade.com",
    siteName: "Trend Digital Trade",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://trenddigitaltrade.com/assets/og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Trend Digital Trade - Instagram Growth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TDT — Real Instagram Growth",
    description: "From 5K to 100K. Real growth. No bots.",
    images: ["https://trenddigitaltrade.com/assets/og-preview.jpg"],
  },
  icons: {
    icon: [
      { url: "/assets/tdt-icon-gold.jpg" },
    ],
    shortcut: ["/assets/tdt-icon-gold.jpg"],
    apple: ["/assets/tdt-icon-gold.jpg"],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <I18nProvider>
            {children}
            <Toaster />
          </I18nProvider>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
