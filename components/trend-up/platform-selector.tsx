"use client"

import { Instagram, Music2, Youtube } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-500" },
  { id: "tiktok", name: "TikTok", icon: Music2, color: "from-cyan-400 to-pink-500" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "from-red-500 to-red-600" },
]

interface PlatformSelectorProps {
  selectedPlatform: string
  onSelect: (platform: string) => void
}

export default function PlatformSelector({ selectedPlatform, onSelect }: PlatformSelectorProps) {
  const { t } = useI18n()

  return (
    <section className="py-12 bg-slate-950">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-white text-center mb-8">{t.platform.title}</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon
            const isSelected = selectedPlatform === platform.id

            return (
              <button
                key={platform.id}
                onClick={() => onSelect(platform.id)}
                className={cn(
                  "group relative flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300",
                  isSelected
                    ? `bg-gradient-to-r ${platform.color} text-white shadow-lg shadow-pink-500/25`
                    : "bg-slate-900/50 text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-900",
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6 transition-transform duration-300",
                    isSelected ? "scale-110" : "group-hover:scale-110",
                  )}
                />
                <span>{platform.name}</span>
                {isSelected && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
