import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trend Digital Trade - Compra Seguidores de Instagram, TikTok y Más",
  description:
    "Aumenta tu presencia en redes sociales con seguidores reales. Paquetes desde $15 USD. Entrega garantizada, soporte 24/7.",
  keywords: "comprar seguidores, instagram followers, tiktok followers, youtube subscribers, SMM panel",
  generator: "v0.app",
  openGraph: {
    title: "Trend Digital Trade - Impulsa tu Presencia Digital",
    description: "Seguidores reales, engagement auténtico. Crece en Instagram, TikTok y más.",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>",
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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
