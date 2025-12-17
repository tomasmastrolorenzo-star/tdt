"use client"

import { Star } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function TestimonialsSection() {
    const { t } = useI18n()

    // Defensive check
    if (!t?.testimonialsSection) return null

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold mb-6">
                        {t.testimonialsSection.badge}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        {t.testimonialsSection.title}
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        {t.testimonialsSection.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {t.testimonials?.map((testimonial: any, i: number) => (
                        <div key={i} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                                    {/* Placeholder avatars based on index to keep consistent */}
                                    <img
                                        src={`https://i.pravatar.cc/150?img=${30 + i}`}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="font-bold text-slate-900">{testimonial.name}</div>
                            </div>

                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>

                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-slate-900 mb-2">
                                    {testimonial.platform}
                                </h3>

                                <p className="text-slate-600 leading-relaxed text-sm">
                                    "{testimonial.comment}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
