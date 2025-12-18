"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useI18n } from "@/lib/i18n/context"

export default function FAQSection() {
  const { t } = useI18n()

  if (!t.faq) return null

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            {t.faq.title}{" "}
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              {t.faq.titleHighlight}
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">{t.faq.subtitle}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {t.faq.items.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="group border border-slate-800/60 bg-slate-900/40 backdrop-blur-md rounded-2xl px-6 data-[state=open]:bg-slate-800/60 data-[state=open]:border-slate-700/80 transition-all duration-300 hover:border-slate-700"
              >
                <AccordionTrigger className="text-white text-lg font-medium py-6 hover:no-underline hover:text-pink-400 data-[state=open]:text-pink-400 transition-colors [&[data-state=open]>svg]:rotate-180 [&>svg]:duration-300">
                  <span className="text-left">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 text-base leading-relaxed pb-6 pl-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
