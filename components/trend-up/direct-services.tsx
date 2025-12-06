"use client"

import { Instagram, Music, ArrowRight, Heart, Eye, Video } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export default function DirectServices() {
    const { t } = useI18n()

    // Defensive check
    if (!t?.services) return null

    return (
        <section className="py-16 bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto space-y-4">
                    {/* Instagram Services */}
                    <Link href="/checkout/service?platform=instagram&service=followers&package=starter" className="group block w-full no-underline">
                        <div className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 p-4 rounded-xl flex items-center justify-between text-white font-bold shadow-lg transform transition-all hover:scale-105 active:scale-95 border border-white/10">
                            <div className="flex items-center gap-3">
                                <Instagram className="w-6 h-6 fill-white stroke-white" />
                                <span className="text-lg">{t.services?.instagram?.followers || "Instagram Followers"}</span>
                            </div>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <Link href="/checkout/service?platform=instagram&service=likes&package=likes-1000" className="group block w-full no-underline">
                        <div className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 p-4 rounded-xl flex items-center justify-between text-white font-bold shadow-lg transform transition-all hover:scale-105 active:scale-95 border border-white/10">
                            <div className="flex items-center gap-3">
                                <Heart className="w-6 h-6 fill-white stroke-white" />
                                <span className="text-lg">{t.services?.instagram?.likes || "Instagram Likes"}</span>
                            </div>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <Link href="/checkout/service?platform=instagram&service=views&package=views-2000" className="group block w-full no-underline">
                        <div className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 p-4 rounded-xl flex items-center justify-between text-white font-bold shadow-lg transform transition-all hover:scale-105 active:scale-95 border border-white/10">
                            <div className="flex items-center gap-3">
                                <Video className="w-6 h-6 fill-white stroke-white" />
                                <span className="text-lg">{t.services?.instagram?.views || "Instagram Video Views"}</span>
                            </div>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <div className="h-4"></div>

                    {/* TikTok Services */}
                    <Link href="/checkout/service?platform=tiktok&service=followers&package=starter" className="group block w-full no-underline">
                        <div className="bg-gradient-to-r from-rose-600 to-teal-500 hover:from-rose-500 hover:to-teal-400 p-4 rounded-xl flex items-center justify-between text-white font-bold shadow-lg transform transition-all hover:scale-105 active:scale-95 border border-white/10">
                            <div className="flex items-center gap-3">
                                <Music className="w-6 h-6 fill-white stroke-white" />
                                <span className="text-lg">{t.services?.tiktok?.followers || "TikTok Followers"}</span>
                            </div>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <Link href="/checkout/service?platform=tiktok&service=likes&package=likes-500" className="group block w-full no-underline">
                        <div className="bg-gradient-to-r from-rose-600 to-teal-500 hover:from-rose-500 hover:to-teal-400 p-4 rounded-xl flex items-center justify-between text-white font-bold shadow-lg transform transition-all hover:scale-105 active:scale-95 border border-white/10">
                            <div className="flex items-center gap-3">
                                <Heart className="w-6 h-6 fill-white stroke-white" />
                                <span className="text-lg">{t.services?.tiktok?.likes || "TikTok Likes"}</span>
                            </div>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    <Link href="/checkout/service?platform=tiktok&service=views&package=views-1000" className="group block w-full no-underline">
                        <div className="bg-gradient-to-r from-rose-600 to-teal-500 hover:from-rose-500 hover:to-teal-400 p-4 rounded-xl flex items-center justify-between text-white font-bold shadow-lg transform transition-all hover:scale-105 active:scale-95 border border-white/10">
                            <div className="flex items-center gap-3">
                                <Eye className="w-6 h-6 fill-white stroke-white" />
                                <span className="text-lg">{t.services?.tiktok?.views || "TikTok Video Views"}</span>
                            </div>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
