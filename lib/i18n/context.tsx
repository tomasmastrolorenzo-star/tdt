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
  // STRICT ENGLISH ENFORCEMENT for Global Launch
  // We intentionally bypass IP detection to ensure:
  // 1. consistent English experience worldwide
  // 2. fast load times (no API delay)
  // 3. no crashes for non-US users falling back to broken locales
  const [language, setLanguage] = useState<Language>("en")
  const [currency, setCurrency] = useState<Currency>("USD")

  // Always use English translations
  const t = translations.en

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
