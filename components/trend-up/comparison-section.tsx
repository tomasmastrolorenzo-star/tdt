"use client"

import Image from "next/image"

export default function ComparisonSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold mb-6">
                        ¿Cómo funciona?
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                        Cómo <span className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-lg text-2xl"><span className="text-orange-500">🔥</span> TDT</span> puede
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        impulsar tu promoción en Instagram
                    </h3>
                    <p className="text-slate-600 max-w-2xl mx-auto mb-12">
                        Te ayudamos a hacer crecer tu cuenta IG para que puedas centrarte en crear grandes contenidos 🧡
                    </p>
                </div>

                <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
                    <div className="relative w-full h-auto">
                        <img
                            src="/images/comparison-chart.png"
                            alt="Usted con TDT vs Usted sin TDT"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
