"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type Language,
  type Currency,
  translations,
  currencyRates,
  currencySymbols,
  countryToCurrency,
  countryToLanguage,
} from "./translations"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  currency: Currency
  setCurrency: (curr: Currency) => void
  t: typeof translations.es
  formatPrice: (priceUSD: number) => string
  currencySymbol: string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [isDetected, setIsDetected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isDetected) return

    const detectLocation = async () => {
      try {
        // Try to get country from IP
        const response = await fetch("https://ipapi.co/json/", {
          signal: AbortSignal.timeout(3000) // 3 second timeout
        })
        const data = await response.json()
        const countryCode = data.country_code || "US"

        // Set language based on country
        const detectedLang = countryToLanguage[countryCode] || "en"
        setLanguage(detectedLang)

        // Set currency based on country
        const detectedCurrency = countryToCurrency[countryCode] || "USD"
        setCurrency(detectedCurrency)

        setIsDetected(true)
      } catch (error) {
        // Fallback to browser language
        try {
          const browserLang = navigator.language.split("-")[0]
          if (browserLang === "es") setLanguage("es")
          else if (browserLang === "pt") setLanguage("pt")
          else setLanguage("en")
        } catch {
          setLanguage("en") // Ultimate fallback
        }

        setIsDetected(true)
      } finally {
        setIsLoading(false)
      }
    }

    detectLocation()
  }, [isDetected])

  // Always use a valid translation object
  const t = translations[language] || translations.en || translations.es

  const formatPrice = (priceUSD: number) => {
    try {
      const convertedPrice = priceUSD * (currencyRates[currency] || 1)
      const symbol = currencySymbols[currency] || "$"

      // Format based on currency
      if (currency === "BRL" || currency === "EUR") {
        return `${symbol}${convertedPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }

      if (["ARS", "COP", "CLP"].includes(currency)) {
        return `${symbol}${Math.round(convertedPrice).toLocaleString()}`
      }

      return `${symbol}${convertedPrice.toFixed(2)}`
    } catch {
      return `$${priceUSD.toFixed(2)}` // Fallback to USD
    }
  }

  // Show loading state while detecting location
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        formatPrice,
        currencySymbol: currencySymbols[currency] || "$",
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
