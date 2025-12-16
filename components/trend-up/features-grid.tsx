"use client"

import { Shield, Users, Heart, Zap, Globe, MessageSquare } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function FeaturesGrid() {
    const { t } = useI18n()

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">

                {/* Main Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">{t.features?.riskFree?.title}</h3>
                        <p className="text-slate-600">
                            {t.features?.riskFree?.desc}
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">{t.features?.engaged?.title}</h3>
                        <p className="text-slate-600">
                            {t.features?.engaged?.desc}
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                            <Heart className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">{t.features?.noSpam?.title}</h3>
                        <p className="text-slate-600">
                            {t.features?.noSpam?.desc}
                        </p>
                    </div>
                </div>

                {/* AI + Marketing Section */}
                <div className="bg-white rounded-[3rem] p-8 md:p-16 text-center mb-20 shadow-xl">
                    <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold mb-6">
                        {t.features?.secret}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-12">
                        {t.features?.header?.main} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">{t.features?.header?.highlight}</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div className="bg-slate-50 p-8 rounded-3xl">
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{t.features?.ai?.title}</h3>
                            <p className="text-slate-600">
                                {t.features?.ai?.desc}
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl">
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{t.features?.demographics?.title}</h3>
                            <p className="text-slate-600">
                                {t.features?.demographics?.desc}
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl">
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{t.features?.anywhere?.title}</h3>
                            <p className="text-slate-600">
                                {t.features?.anywhere?.desc}
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{t.features?.support?.title}</h3>
                            <p className="text-slate-600">
                                {t.features?.support?.desc}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
