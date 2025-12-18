"use client"

import { Target, Zap, TrendingUp } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function HowItWorks() {
  const { t } = useI18n()

  const steps = [
    {
      icon: Target,
      title: t.howItWorks?.steps?.[0]?.title,
      description: t.howItWorks?.steps?.[0]?.description,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    },
    {
      icon: Zap,
      title: t.howItWorks?.steps?.[1]?.title,
      description: t.howItWorks?.steps?.[1]?.description,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      icon: TrendingUp,
      title: t.howItWorks?.steps?.[2]?.title,
      description: t.howItWorks?.steps?.[2]?.description,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    }
  ]

  return (
    <section id="how-it-works" className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold mb-6">
            {t.howItWorks?.badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t.howItWorks?.title} <br />
            <span className="text-slate-200">{t.howItWorks?.titleHighlight}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className={`relative flex flex-col items-center text-center bg-white rounded-3xl p-8 border ${step.border} hover:shadow-xl transition-all duration-300 group z-10`}>
              {/* Connector Line (Mobile hidden, Desktop visible) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 -right-1/2 w-full h-[2px] border-t-2 border-dashed border-slate-300 z-0 pointer-events-none"
                  style={{ transform: "translateY(50%)" }}
                />
                // Logic: Positions a line extending to the right. 
                // Issue: "right-1/2" might be too far or short depending on grid gap. 
                // A better approach is using a pseudo element on the container or a separate element between columns.
                // Given the grid setup, "absolute" on the card might be tricky if not overflowing correctly.
                // Let's try a simpler approach: Draw the arrow/line in the grid gap? No.
                // Standard approach: Absolute positioning on the card, pointing right.
                // CSS: `left-full` width `half-gap`.
              )}
              {/* Improved Connector: Render only if not last */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-[3.5rem] left-[60%] w-[80%] h-auto -z-10">
                  {/* SVG Arrow or Dashed Line */}
                  <svg className="w-full h-12 text-slate-300/50" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0,10 Q50,0 100,10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl ${step.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
