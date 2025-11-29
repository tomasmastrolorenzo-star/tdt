import { ArrowRight, Instagram, Heart, Video, UserPlus } from "lucide-react"
import Link from "next/link"

export function ServicesList() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container px-4 mx-auto max-w-2xl flex flex-col gap-4">

                {/* Instagram Services */}
                <Link href="/services/instagram/followers" className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-orange-500 p-4 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Instagram className="w-6 h-6" />
                            <span className="font-bold text-lg">Instagram Followers</span>
                        </div>
                        <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </div>
                </Link>

                <Link href="/services/instagram/likes" className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-orange-500 p-4 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Heart className="w-6 h-6" />
                            <span className="font-bold text-lg">Instagram Likes</span>
                        </div>
                        <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </div>
                </Link>

                <Link href="/services/instagram/views" className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-orange-500 p-4 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Video className="w-6 h-6" />
                            <span className="font-bold text-lg">Instagram Video Views</span>
                        </div>
                        <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </div>
                </Link>

                <div className="h-8"></div>

                {/* TikTok Services */}
                <Link href="/services/tiktok/followers" className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-pink-600 to-cyan-500 p-4 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <UserPlus className="w-6 h-6" />
                            <span className="font-bold text-lg">TikTok Followers</span>
                        </div>
                        <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </div>
                </Link>

                <Link href="/services/tiktok/likes" className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-pink-600 to-cyan-500 p-4 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Heart className="w-6 h-6" />
                            <span className="font-bold text-lg">TikTok Likes</span>
                        </div>
                        <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </div>
                </Link>

                <Link href="/services/tiktok/views" className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-pink-600 to-cyan-500 p-4 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Video className="w-6 h-6" />
                            <span className="font-bold text-lg">TikTok Video Views</span>
                        </div>
                        <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </div>
                </Link>

            </div>
        </section>
    )
}
