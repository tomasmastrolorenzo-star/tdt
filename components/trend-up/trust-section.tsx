"use client"

import { Shield, Users, Headphones, CreditCard, RefreshCw, Star } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function TrustSection() {
  const { t } = useI18n()

  const trustElements = [
    { icon: Users, title: t.trust.elements.clients, description: t.trust.elements.clientsDesc },
    { icon: Shield, title: t.trust.elements.guaranteed, description: t.trust.elements.guaranteedDesc },
    { icon: Users, title: t.trust.elements.real, description: t.trust.elements.realDesc },
    { icon: Headphones, title: t.trust.elements.support, description: t.trust.elements.supportDesc },
    { icon: CreditCard, title: t.trust.elements.secure, description: t.trust.elements.secureDesc },
    { icon: RefreshCw, title: t.trust.elements.refund, description: t.trust.elements.refundDesc },
  ]

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.trust.title}{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Trend Digital Trade
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t.trust.subtitle}</p>
        </div>

        {/* Trust grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {trustElements.map((element, index) => {
            const Icon = element.icon
            return (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 group"
              >
                <Icon className="w-10 h-10 text-pink-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-white font-semibold mb-1 text-sm">{element.title}</h3>
                <p className="text-slate-400 text-xs">{element.description}</p>
              </div>
            )
          })}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:bg-slate-800 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-slate-400 text-sm">{testimonial.platform}</div>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm">{`"${testimonial.comment}"`}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
