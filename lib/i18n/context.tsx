"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type Language,
  type Currency,
  translations,
  type TranslationType,
  currencyRates,
  currencySymbols,
  countryToCurrency,
  countryToLanguage,
} from "./translations"
import { en } from "./locales/en"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  currency: Currency
  setCurrency: (curr: Currency) => void
  t: TranslationType
  formatPrice: (priceUSD: number) => string
  currencySymbol: string
  isLoading: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Minimal fallback so the app doesn't crash before loading
const emptyT: any = {}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [t, setT] = useState<TranslationType>(en)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTranslations() {
      setIsLoading(true)
      try {
        const activeT = await translations[language]()
        setT(activeT)
      } catch (err) {
        console.error("Failed to load translations:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadTranslations()
  }, [language])

  const formatPrice = (priceUSD: number) => {
    return `$${priceUSD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
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
        currencySymbol: "$",
        isLoading
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
