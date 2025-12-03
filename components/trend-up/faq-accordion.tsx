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
            question: "¿Cómo funciona Trend Up?",
            answer: "Trend Up utiliza inteligencia artificial avanzada para identificar y conectar con tu audiencia objetivo en Instagram. Nuestro sistema analiza patrones de comportamiento, intereses y demografía para atraer seguidores reales y comprometidos a tu cuenta de forma orgánica y segura."
        },
        {
            question: "¿Es Trend Up compatible con las normas de servicio de Instagram?",
            answer: "Sí, absolutamente. Utilizamos únicamente métodos orgánicos aprobados por Instagram. No usamos bots, automatización agresiva ni prácticas que violen los términos de servicio. Tu cuenta está 100% segura con nosotros."
        },
        {
            question: "¿Necesito dar mi contraseña de Instagram?",
            answer: "No, nunca te pediremos tu contraseña de Instagram. Nuestro servicio funciona de manera completamente segura sin necesidad de acceso a tu cuenta. Solo necesitamos tu nombre de usuario público para comenzar."
        },
        {
            question: "¿Cuánto tiempo tardaré en ver resultados?",
            answer: "La mayoría de nuestros clientes comienzan a ver resultados en las primeras 24-48 horas. El crecimiento es gradual y orgánico, lo que garantiza que tus nuevos seguidores sean reales y comprometidos. Los resultados completos se ven típicamente en 2-4 semanas."
        },
        {
            question: "¿Qué diferencia hay entre el plan Standard y el Turbo AI?",
            answer: "El plan Turbo AI incluye todas las características del Standard, más: segmentación avanzada por IA, un gestor de cuenta personal, formación exclusiva en estrategias de IA, y crecimiento 40% más rápido. Es ideal para usuarios que buscan resultados profesionales acelerados."
        },
        {
            question: "¿Puedo cancelar en cualquier momento?",
            answer: "Sí, puedes cancelar tu suscripción en cualquier momento sin penalizaciones. Si cancelas, tu servicio continuará hasta el final del período facturado. Ofrecemos garantía de reembolso de 14 días si no estás satisfecho con los resultados."
        },
        {
            question: "¿Los seguidores son reales?",
            answer: "Sí, 100% reales. No trabajamos con bots ni cuentas falsas. Todos los seguidores que ganas son usuarios reales de Instagram que tienen un interés genuino en tu contenido o nicho. Esto garantiza un engagement real y duradero."
        },
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
