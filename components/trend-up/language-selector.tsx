"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import type { Language } from "@/lib/i18n/translations"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
]

export default function LanguageSelector() {
  const { language, setLanguage } = useI18n()
  const [isLangOpen, setIsLangOpen] = useState(false)

  const currentLang = languages.find((l) => l.code === language)

  return (
    <div className="fixed bottom-24 left-4 md:top-4 md:right-4 md:bottom-auto md:left-auto z-[60] flex items-center gap-2">
      {/* Language Selector */}
      <div className="relative">
        <button
          onClick={() => {
            setIsLangOpen(!isLangOpen)
          }}
          className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#C5A059]/50 rounded-full px-4 py-2 text-white/80 hover:text-[#C5A059] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        >
          <span className="text-xl">{currentLang?.flag}</span>
          <span className="text-sm hidden sm:inline">{currentLang?.name}</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", isLangOpen && "rotate-180")} />
        </button>

        {isLangOpen && (
          <div className="absolute bottom-full mb-2 md:bottom-auto md:top-full md:mt-2 left-0 md:left-auto md:right-0 bg-[#0A0A0A] backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] min-w-[150px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code)
                  setIsLangOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors font-mono text-xs uppercase tracking-wider",
                  language === lang.code ? "text-[#C5A059] bg-[#C5A059]/10" : "text-white/60",
                )}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
