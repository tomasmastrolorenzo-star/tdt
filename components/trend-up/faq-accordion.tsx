"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FAQItem {
    question: string
    answer: string
}

export default function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs: FAQItem[] = [

        {
            question: "¿Ofrecen garantía de resultados?",
            answer: "Sí, ofrecemos una garantía de crecimiento. Si no ves un aumento medible en tus seguidores durante los primeros 30 días, te reembolsamos el 100% de tu inversión. Estamos tan seguros de nuestro servicio que asumimos todo el riesgo."
        }
    ]

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-slate-600">
                            Todo lo que necesitas saber sobre nuestro servicio
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                                >
                                    <span className="font-bold text-slate-900 pr-4">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {openIndex === index && (
                                    <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CTA after FAQ */}
                    <div className="mt-12 text-center bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-2">
                            ¿Todo listo para impulsar tu Instagram?
                        </h3>
                        <p className="mb-6 text-orange-100">
                            Únete a más de 80,000 usuarios que ya están creciendo con nosotros
                        </p>
                        <button className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-slate-50 transition-colors">
                            Comenzar Ahora →
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
