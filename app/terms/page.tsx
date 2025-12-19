"use client"

import { useI18n } from "@/lib/i18n/context"
import { Shield, FileText, Ban, AlertTriangle } from "lucide-react"

export default function TermsPage() {
    const { t } = useI18n()

    // Safety fallback if t.legal is missing during build/transition
    const legal = t.legal || {
        title: "Terms of Service & Refund Policy",
        sections: {
            refund: { title: "1. NO-REFUND POLICY", content: "Loading..." },
            chargeback: { title: "2. CHARGEBACK & DISPUTE CLAUSE", content: "Loading..." },
            disclaimer: { title: "3. SERVICE DISCLAIMER", content: "Loading..." },
            cancellation: { title: "4. SUBSCRIPTION CANCELLATION", content: "Loading..." }
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 py-20 font-sans">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-900 px-8 py-10 text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-xl mb-6">
                            <Shield className="w-8 h-8 text-orange-500" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
                            {legal.title}
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Please read these terms carefully before proceeding with your purchase.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 space-y-12">

                        {/* 1. NO REFUND */}
                        <section className="relative pl-8 border-l-4 border-orange-500">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                {legal.sections.refund.title}
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
                                {legal.sections.refund.content}
                            </div>
                        </section>

                        {/* 2. CHARGEBACK */}
                        <section className="relative pl-8 border-l-4 border-red-500 bg-red-50/50 p-6 rounded-r-xl">
                            <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-3">
                                <Ban className="w-6 h-6 text-red-600" />
                                {legal.sections.chargeback.title}
                            </h2>
                            <div className="prose prose-red max-w-none text-red-800 whitespace-pre-wrap font-medium">
                                {legal.sections.chargeback.content}
                            </div>
                        </section>

                        {/* 3. DISCLAIMER */}
                        <section className="relative pl-8 border-l-4 border-slate-300">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                                {legal.sections.disclaimer.title}
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
                                {legal.sections.disclaimer.content}
                            </div>
                        </section>

                        {/* 4. CANCELLATION */}
                        <section className="relative pl-8 border-l-4 border-slate-300">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-blue-500" />
                                {legal.sections.cancellation.title}
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
                                {legal.sections.cancellation.content}
                            </div>
                        </section>

                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 border-t border-slate-100 p-8 text-center text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} Trend Digital Trade. All rights reserved.
                    </div>
                </div>
            </div>
        </main>
    )
}
