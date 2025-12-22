export type Language = "es" | "en" | "pt"

export type Currency = "USD" | "EUR" | "BRL" | "MXN" | "ARS" | "COP" | "CLP" | "PEN"

export const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  BRL: "R$",
  MXN: "$",
  ARS: "$",
  COP: "$",
  CLP: "$",
  PEN: "S/",
}

export const currencyRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  BRL: 4.97,
  MXN: 17.15,
  ARS: 875,
  COP: 3950,
  CLP: 880,
  PEN: 3.72,
}

export const countryToCurrency: Record<string, Currency> = {
  US: "USD",
  ES: "EUR",
  PT: "EUR",
  BR: "BRL",
  MX: "MXN",
  AR: "ARS",
  CO: "COP",
  CL: "CLP",
  PE: "PEN",
  // Default to USD for other countries
}

export const countryToLanguage: Record<string, Language> = {
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  BR: "pt",
  PT: "pt",
}

// Define the shape of our translations based on the base file (en)
// We'll import the type from the en file which we assume is the source of truth
import type { en } from "./locales/en"
export type TranslationType = typeof en

export const translations = {
  es: () => import("./locales/es").then(m => m.es),
  en: () => import("./locales/en").then(m => m.en),
  pt: () => import("./locales/pt").then(m => m.pt),
}
