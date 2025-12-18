"use client"

import { Instagram, Music, ArrowRight, Heart, Eye, Video } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export default function DirectServices() {
    const { t } = useI18n()

    // Defensive check
    if (!t?.services) return null

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-50 z-0"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">
                        {t.direct?.title}
                    </h3>
                </div>

                <div className="max-w-2xl mx-auto space-y-4">
                    {/* Instagram Services Header */}
                    {/* <div className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-2 mb-2">Instagram</div> */}

                    {/* IG Followers - Best Seller */}
                    <Link href="/servicios?platform=instagram&service=followers" className="group block w-full no-underline relative">
                        <div className="absolute -top-3 -right-3 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg shadow-orange-500/40 animate-pulse">
                            {t.direct?.bestSeller}
                        </div>
                        <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 p-[1px] rounded-2xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 group-hover:brightness-110">
                            <div className="bg-slate-900/80 backdrop-blur-md group-hover:bg-slate-900/60 transition-colors rounded-[15px] p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 p-3 rounded-xl group-hover:bg-white/20 transition-colors">
                                        <Instagram className="w-6 h-6 text-white group-hover:text-pink-300 transition-colors group-hover:drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
                                    </div>
                                    <div>
                                        <span className="block text-white font-bold text-lg leading-tight">{t.services?.instagram?.followers}</span>
                                        <span className="text-slate-400 text-xs font-medium">High Quality Profiles</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-green-400 font-bold bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20 hidden sm:block">Recommended</span>
                                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* IG Likes */}
                    <Link href="/servicios?platform=instagram&service=likes" className="group block w-full no-underline">
                        <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 p-[1px] rounded-2xl shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 group-hover:brightness-110">
                            <div className="bg-slate-900/80 backdrop-blur-md group-hover:bg-slate-900/60 transition-colors rounded-[15px] p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 p-3 rounded-xl group-hover:bg-white/20 transition-colors">
                                        <Heart className="w-6 h-6 text-white text-white group-hover:text-red-400 fill-transparent group-hover:fill-red-400/50 transition-all group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
                                    </div>
                                    <span className="text-white font-bold text-lg">{t.services?.instagram?.likes}</span>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </div>
                    </Link>

                    {/* TikTok Views - Instant Start */}
                    <Link href="/servicios?platform=tiktok&service=views" className="group block w-full no-underline relative mt-8">
                        <div className="absolute -top-3 -right-3 z-20 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg shadow-cyan-500/40 animate-pulse">
                            {t.direct?.instant}
                        </div>
                        <div className="bg-gradient-to-r from-[#00f2ea] via-[#ff0050] to-[#000000] p-[1px] rounded-2xl shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 group-hover:brightness-110">
                            <div className="bg-slate-900/80 backdrop-blur-md group-hover:bg-slate-900/60 transition-colors rounded-[15px] p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 p-3 rounded-xl group-hover:bg-white/20 transition-colors">
                                        <Eye className="w-6 h-6 text-white group-hover:text-cyan-300 transition-colors group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                                    </div>
                                    <div>
                                        <span className="block text-white font-bold text-lg leading-tight">{t.services?.tiktok?.views}</span>
                                        <span className="text-slate-400 text-xs font-medium">Viral Boost</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </div>
                    </Link>

                    {/* TikTok Followers */}
                    <Link href="/servicios?platform=tiktok&service=followers" className="group block w-full no-underline">
                        <div className="bg-gradient-to-r from-[#00f2ea] via-[#ff0050] to-[#000000] p-[1px] rounded-2xl shadow-lg hover:shadow-rose-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 group-hover:brightness-110">
                            <div className="bg-slate-900/80 backdrop-blur-md group-hover:bg-slate-900/60 transition-colors rounded-[15px] p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/10 p-3 rounded-xl group-hover:bg-white/20 transition-colors">
                                        <Music className="w-6 h-6 text-white group-hover:text-pink-400 transition-colors group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                                    </div>
                                    <span className="text-white font-bold text-lg">{t.services?.tiktok?.followers}</span>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </div>
                    </Link>

                </div>
            </div>
        </section>
    )
}
