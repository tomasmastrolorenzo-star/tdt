"use client"

import { Instagram, Video, Heart, Eye, Music } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export default function DirectServices() {
    const { t } = useI18n()

    // Defensive check
    if (!t?.services) return null

    return (
        <section className="py-10 bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto space-y-4">
                    {/* Instagram Services */}
                    <Link href="/servicios?category=instagram&type=followers" className="group block w-full">
                        <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-4 rounded-xl flex items-center justify-between text-white font-bold shadow-lg transform transition-all group-hover:scale-105 group-hover:shadow-orange-500/20">
                            <div className="flex items-center gap-3">
                                <Instagram className="w-6 h-6" />
                                <span>{t.services?.instagram?.followers}</span>
                            </div>
                            <span className="text-2xl">→</span>
                        </div>
                    </Link>

                    <Link href="/servicios?category=instagram&type=likes" className="group block w-full">
                        <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-4 rounded-xl flex items-center justify-between text-white font-bold shadow-lg transform transition-all group-hover:scale-105 group-hover:shadow-orange-500/20">
                            <div className="flex items-center gap-3">
                                <Heart className="w-6 h-6" />
                                <span>{t.services?.instagram?.likes}</span>
                            </div>
                            <span className="text-2xl">→</span>
                        </div>
                    </Link>

                    <Link href="/servicios?category=instagram&type=views" className="group block w-full">
                        <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-4 rounded-xl flex items-center justify-between text-white font-bold shadow-lg transform transition-all group-hover:scale-105 group-hover:shadow-orange-500/20">
                            <div className="flex items-center gap-3">
                                <Eye className="w-6 h-6" />
                                <span>{t.services?.instagram?.views}</span>
                            </div>
                            <span className="text-2xl">→</span>
                        </div>
                    </Link>

                    <div className="h-4"></div>

                    {/* TikTok Services */}
                    <Link href="/servicios?category=tiktok&type=followers" className="group block w-full">
                        <div className="bg-gradient-to-r from-pink-600 to-teal-400 p-4 rounded-xl flex items-center justify-between text-white font-bold shadow-lg transform transition-all group-hover:scale-105 group-hover:shadow-teal-400/20">
                            <div className="flex items-center gap-3">
                                <Music className="w-6 h-6" />
                                <span>{t.services?.tiktok?.followers}</span>
                            </div>
                            <span className="text-2xl">→</span>
                        </div>
                    </Link>

                    <Link href="/servicios?category=tiktok&type=likes" className="group block w-full">
                        <div className="bg-gradient-to-r from-pink-600 to-teal-400 p-4 rounded-xl flex items-center justify-between text-white font-bold shadow-lg transform transition-all group-hover:scale-105 group-hover:shadow-teal-400/20">
                            <div className="flex items-center gap-3">
                                <Heart className="w-6 h-6" />
                                <span>{t.services?.tiktok?.likes}</span>
                            </div>
                            <span className="text-2xl">→</span>
                        </div>
                    </Link>

                    <Link href="/servicios?category=tiktok&type=views" className="group block w-full">
                        <div className="bg-gradient-to-r from-pink-600 to-teal-400 p-4 rounded-xl flex items-center justify-between text-white font-bold shadow-lg transform transition-all group-hover:scale-105 group-hover:shadow-teal-400/20">
                            <div className="flex items-center gap-3">
                                <Eye className="w-6 h-6" />
                                <span>{t.services?.tiktok?.views}</span>
                            </div>
                            <span className="text-2xl">→</span>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
