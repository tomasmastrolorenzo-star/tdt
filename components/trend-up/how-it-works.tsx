"use client"

import { Target, FileText, Rocket } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function HowItWorks() {
  const { t } = useI18n()

  const icons = [Target, FileText, Rocket]

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.howItWorks.title}{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {t.howItWorks.titleHighlight}
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {t.howItWorks.steps.map((step, index) => {
            const Icon = icons[index]
            const number = String(index + 1).padStart(2, "0")

            return (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < t.howItWorks.steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-pink-500/50 to-transparent" />
                )}

                <div className="text-center group">
                  {/* Icon container */}
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-pink-500/50 flex items-center justify-center">
                        <Icon className="w-10 h-10 text-pink-400" />
                      </div>
                    </div>
                    {/* Number badge */}
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {number}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 max-w-xs mx-auto">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
