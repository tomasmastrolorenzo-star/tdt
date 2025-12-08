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

  useEffect(() => {
    if (isDetected) return

    const detectLocation = async () => {
      try {
        // Try to get country from IP
        const response = await fetch("https://ipapi.co/json/")
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
        const browserLang = navigator.language.split("-")[0]
        if (browserLang === "es") setLanguage("es")
        else if (browserLang === "pt") setLanguage("pt")
        else setLanguage("en")

        setIsDetected(true)
      }
    }

    detectLocation()
  }, [isDetected])

  const t = translations[language] || translations.es

  const formatPrice = (priceUSD: number) => {
    const convertedPrice = priceUSD * currencyRates[currency]
    const symbol = currencySymbols[currency]

    // Format based on currency
    if (currency === "BRL" || currency === "EUR") {
      return `${symbol}${convertedPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    if (["ARS", "COP", "CLP"].includes(currency)) {
      return `${symbol}${Math.round(convertedPrice).toLocaleString()}`
    }

    return `${symbol}${convertedPrice.toFixed(2)}`
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
        currencySymbol: currencySymbols[currency],
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
