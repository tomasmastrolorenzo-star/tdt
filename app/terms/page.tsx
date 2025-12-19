"use client"

import { useI18n } from "@/lib/i18n/context"
import { Shield, FileText, Ban, AlertTriangle } from "lucide-react"

export default function TermsPage() {
    const { t } = useI18n()

    // Safety fallback if t.legal is missing during build/transition
    // Correct path is t.checkout.legal
    const legal = t.checkout?.legal || {
        title: "Terms of Service & Refund Policy",
        sections: {
            refund: {
                title: "1. NO-REFUND POLICY",
                content: "Due to the nature of digital marketing services and intangible goods, Trend Digital Trade (TDT) does not offer monetary refunds once the order processing has begun.\n\nDigital Nature: You acknowledge that by purchasing a plan, you are paying for a digital promotional campaign that consumes server resources and ad spend immediately. These costs are non-recoverable.\n\nThe Remedy: In the event of followers dropping or delivery delays, TDT offers a 30-Day Free Refill Guarantee. We will restore any lost numbers automatically. Refills are the sole remedy; monetary refunds are not permitted."
            },
            chargeback: {
                title: "2. CHARGEBACK & DISPUTE CLAUSE",
                content: "By completing a purchase, you agree that you will not file a chargeback or dispute with your payment provider.\n\nBreach of Contract: Filing a dispute without contacting our support team first is considered a breach of these Terms.\n\nConsequences: In the event of an unauthorized chargeback, TDT reserves the right to:\n- Ban your account and IP address permanently.\n- Report your details to global merchant blacklists.\n- Remove all delivered followers/likes instantly using our reversal algorithm."
            },
            disclaimer: {
                title: "3. SERVICE DISCLAIMER",
                content: "TDT is an independent digital strategy agency and is not affiliated with Instagram, TikTok, or Meta.\n\nPlatform Updates: We are not responsible for damages, bans, or blocks caused by updates to Instagram/TikTok algorithms. You use our services at your own risk.\n\nDelivery Speed: Delivery times are estimates. 'Instant Start' implies the campaign setup begins immediately, but full delivery may take time to ensure organic safety."
            },
            cancellation: {
                title: "4. SUBSCRIPTION CANCELLATION",
                content: "You may cancel your monthly subscription at any time via your dashboard or by contacting support.\n\nTiming: Cancellations must be requested at least 24 hours before the next billing cycle.\n\nPartial Months: No refunds will be issued for partial months of service if you cancel mid-cycle. The service will continue until the end of the paid period."
            }
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
