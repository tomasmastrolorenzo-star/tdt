import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
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
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
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
      </body>
    </html>
  )
}
