"use client"

import type React from "react"

import { useState } from "react"
import {
  Instagram,
  Youtube,
  Music2,
  Users,
  Heart,
  Eye,
  MessageCircle,
  Share2,
  Clock,
  ArrowRight,
  Zap,
  Shield,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { I18nProvider, useI18n } from "@/lib/i18n/context"
import { allServices, platforms } from "@/lib/trend-up/packages"
import LanguageSelector from "@/components/trend-up/language-selector"
import UrgencyBanner from "@/components/trend-up/urgency-banner"
import Link from "next/link"

const platformIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
}

const serviceIcons: Record<string, React.ElementType> = {
  followers: Users,
  subscribers: Users,
  likes: Heart,
  views: Eye,
  comments: MessageCircle,
  shares: Share2,
  watchTime: Clock,
}

function ServiciosContent() {
  const { t, formatPrice } = useI18n()
  const [selectedPlatform, setSelectedPlatform] = useState<"instagram" | "tiktok" | "youtube">("instagram")
  const [selectedService, setSelectedService] = useState<string>("followers")

  const platformData = allServices[selectedPlatform]
  const serviceKeys = Object.keys(platformData)

  // Adjust selected service when platform changes
  const currentService = serviceKeys.includes(selectedService) ? selectedService : serviceKeys[0]

  const getServiceLabel = (service: string) => {
    const labels: Record<string, Record<string, string>> = {
      es: {
        followers: "Seguidores",
        subscribers: "Suscriptores",
        likes: "Likes",
        views: "Views",
        comments: "Comentarios",
        shares: "Compartidos",
        watchTime: "Watch Time",
      },
      en: {
        followers: "Followers",
        subscribers: "Subscribers",
        likes: "Likes",
        views: "Views",
        comments: "Comments",
        shares: "Shares",
        watchTime: "Watch Time",
      },
      pt: {
        followers: "Seguidores",
        subscribers: "Inscritos",
        likes: "Likes",
        views: "Views",
        comments: "Comentários",
        shares: "Compartilhamentos",
        watchTime: "Watch Time",
      },
    }
    const lang = t.hero.badge.includes("Latinoamérica") ? "es" : t.hero.badge.includes("Américas") ? "pt" : "en"
    return labels[lang][service] || service
  }

  const titles: Record<string, Record<string, string>> = {
    es: {
      title: "Todos Nuestros Servicios",
      subtitle: "Elige tu plataforma y el tipo de servicio que necesitas",
      selectPlatform: "Selecciona Plataforma",
      selectService: "Tipo de Servicio",
      amount: "Cantidad",
      price: "Precio",
      action: "Comprar",
      popular: "Popular",
    },
    en: {
      title: "All Our Services",
      subtitle: "Choose your platform and the type of service you need",
      selectPlatform: "Select Platform",
      selectService: "Service Type",
      amount: "Amount",
      price: "Price",
      action: "Buy",
      popular: "Popular",
    },
    pt: {
      title: "Todos os Nossos Serviços",
      subtitle: "Escolha sua plataforma e o tipo de serviço que você precisa",
      selectPlatform: "Selecione a Plataforma",
      selectService: "Tipo de Serviço",
      amount: "Quantidade",
      price: "Preço",
      action: "Comprar",
      popular: "Popular",
    },
  }

  const lang = t.hero.badge.includes("Latinoamérica") ? "es" : t.hero.badge.includes("Américas") ? "pt" : "en"
  const text = titles[lang]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <UrgencyBanner />

      {/* Header */}
      <header className="fixed top-10 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 bg-clip-text text-transparent"
          >
            TrendDigitalTrade
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Link href="/login">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                {t.footer.login}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              {text.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
                {text.title.split(" ").slice(-1)}
              </span>
            </h1>
            <p className="text-slate-400 text-lg">{text.subtitle}</p>
          </div>

          {/* Platform Selector */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-4 text-center">{text.selectPlatform}</h3>
            <div className="flex justify-center gap-4">
              {platforms.map((platform) => {
                const Icon = platformIcons[platform.id]
                return (
                  <button
                    key={platform.id}
                    onClick={() => {
                      setSelectedPlatform(platform.id as "instagram" | "tiktok" | "youtube")
                      setSelectedService(platform.id === "youtube" ? "subscribers" : "followers")
                    }}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                      selectedPlatform === platform.id
                        ? `bg-gradient-to-r ${platform.color} text-white shadow-lg`
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {platform.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Service Type Selector */}
          <div className="mb-12">
            <h3 className="text-white font-bold mb-4 text-center">{text.selectService}</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {serviceKeys.map((service) => {
                const Icon = serviceIcons[service] || Users
                return (
                  <button
                    key={service}
                    onClick={() => setSelectedService(service)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all",
                      currentService === service
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-700",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {getServiceLabel(service)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {(platformData[currentService as keyof typeof platformData] as any[])?.map((item: any, index: number) => {
              const isPopular = index === 1 || index === 2
              const amount = item.followers || item.amount
              const unit = item.unit || ""

              return (
                <div
                  key={item.id}
                  className={cn(
                    "relative rounded-2xl p-[2px] transition-all hover:scale-105",
                    isPopular
                      ? "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-500"
                      : "bg-gradient-to-br from-slate-600 to-slate-700",
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {text.popular}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-900 rounded-2xl p-5 h-full flex flex-col">
                    {/* Amount */}
                    <div className="text-center mb-4">
                      <div className="text-slate-500 text-sm line-through">
                        {amount < 1000 ? amount : `${(amount / 1000).toFixed(amount >= 10000 ? 0 : 1)}K`} {unit}
                      </div>
                      <div className="text-3xl font-black text-white">
                        {amount < 1000 ? amount * 2 : `${((amount * 2) / 1000).toFixed(amount * 2 >= 10000 ? 0 : 1)}K`}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {getServiceLabel(currentService)} {unit}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-4">
                      <div className="text-slate-500 line-through text-sm">{formatPrice(item.originalPrice)}</div>
                      <div className="text-2xl font-black text-white">{formatPrice(item.price)}</div>
                      <div className="inline-flex items-center gap-1 bg-red-500/20 border border-red-500/50 text-red-400 px-2 py-0.5 rounded-full text-xs font-bold mt-1">
                        <Zap className="w-3 h-3" />
                        50% OFF
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mb-4 flex-grow">
                      <li className="flex items-center gap-2 text-slate-300 text-xs">
                        <Check className="w-4 h-4 text-green-400" />
                        {lang === "es" ? "Entrega rápida" : lang === "pt" ? "Entrega rápida" : "Fast delivery"}
                      </li>
                      <li className="flex items-center gap-2 text-slate-300 text-xs">
                        <Shield className="w-4 h-4 text-green-400" />
                        {lang === "es" ? "100% seguro" : lang === "pt" ? "100% seguro" : "100% safe"}
                      </li>
                    </ul>

                    {/* CTA */}
                    <Link
                      href={`/checkout/service?platform=${selectedPlatform}&service=${currentService}&package=${item.id}`}
                      className="w-full"
                    >
                      <Button
                        className={cn(
                          "w-full font-bold",
                          isPopular
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                            : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
                        )}
                      >
                        {text.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-5 h-5 text-green-400" />
              <span>
                {lang === "es" ? "Pago 100% seguro" : lang === "pt" ? "Pagamento 100% seguro" : "100% secure payment"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>
                {lang === "es" ? "Entrega instantánea" : lang === "pt" ? "Entrega instantânea" : "Instant delivery"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-5 h-5 text-blue-400" />
              <span>+50,000 {lang === "es" ? "clientes" : lang === "pt" ? "clientes" : "clients"}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ServiciosPage() {
  return (
    <I18nProvider>
      <ServiciosContent />
    </I18nProvider>
  )
}
