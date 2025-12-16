import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { I18nProvider } from "@/lib/i18n/context"
import { Toaster } from "@/components/ui/toaster"
import ErrorBoundary from "@/components/ErrorBoundary"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trend Digital Trade | Crecimiento Real con IA para Redes Sociales",
  description:
    "La primera plataforma que utiliza Inteligencia Artificial para potenciar tu crecimiento en Instagram, TikTok y YouTube. Seguidores reales, segmentados y garantizados.",
  keywords: "crecimiento instagram, comprar seguidores reales, tiktok viral, ia para redes sociales, marketing digital, trend digital trade",
  generator: "Next.js",
  applicationName: "Trend Digital Trade",
  openGraph: {
    title: "Trend Digital Trade 🚀 - Crecimiento con IA",
    description: "¿Cansado del algoritmo? Usa nuestra IA para conectar con seguidores reales interesados en tu contenido.",
    url: "https://trenddigitaltrade.com",
    siteName: "Trend Digital Trade",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Trend Digital Trade - AI Social Growth",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>", type: "image/svg+xml" }
    ],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
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
