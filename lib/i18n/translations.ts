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

import { es } from "./locales/es"
import { en } from "./locales/en"
import { pt } from "./locales/pt"

export const translations = {
  es,
  en,
  pt,
}
