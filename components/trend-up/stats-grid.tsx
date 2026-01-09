import { Instagram, Clock, CheckCircle2, Users, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"
import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

// Simple CountUp Component
const CountUp = ({ to, prefix = "", suffix = "", duration = 2 }: { to: number, prefix?: string, suffix?: string, duration?: number }) => {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (isInView) {
            let start = 0
            const end = to
            const totalFrames = Math.round(duration * 60)
            const easeOutQuad = (t: number) => t * (2 - t)

            let frame = 0
            const counter = setInterval(() => {
                frame++
                const progress = easeOutQuad(frame / totalFrames)
                setCount(Math.round(end * progress))

                if (frame === totalFrames) {
                    clearInterval(counter)
                }
            }, 1000 / 60)

            return () => clearInterval(counter)
        }
    }, [isInView, to, duration])

    return <span ref={ref} className="tabular-nums opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        {prefix}{count.toLocaleString()}{suffix}
    </span>
}

export default function StatsGrid() {
    const { t } = useI18n()

    // Defensive check
    if (!(t?.hero as any)?.statsGrid) return null

    const stats = [
        {
            icon: Instagram,
            value: 4152,
            suffix: "",
            label: t.hero.statsGrid.monthlyGrowth || "Monthly follower increase",
            color: "text-white", // Icon color override for gradient
            bg: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600", // Instagram Official Gradient
            isIg: true
        },
        {
            icon: Clock,
            value: 8,
            suffix: "M+",
            label: t.hero.statsGrid.hoursSaved || "Hours saved for clients",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            icon: CheckCircle2,
            value: 4.9, // Float handling needed? CountUp does int. Manual render for rating.
            suffix: "/5",
            label: t.hero.statsGrid.rating || "Based on real client reviews",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            isRating: true
        },
        {
            icon: Users,
            value: 15000,
            suffix: "+",
            label: t.hero.statsGrid.userBase || "Current TDT user base",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ]

    return (
        <section className="py-20 bg-slate-950 relative overflow-hidden">
            {/* Background Stars/Dots (Simple CSS radial gradient pattern or SVG) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 opacity-80" />
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>

            <div className="container mx-auto px-4 relative z-10 w-full max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <Card key={index} className="bg-slate-900/50 backdrop-blur-md border-slate-800 hover:border-slate-700 transition-colors rounded-[20px] overflow-hidden group">
                            <CardContent className="p-4 flex flex-col items-center text-center h-full justify-center">
                                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className={`text-3xl md:text-4xl font-extrabold mb-1 ${stat.isIg ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400" : stat.color}`}>
                                    {stat.isRating ? (
                                        <div className="flex flex-col items-center">
                                            <span>4.9/5</span>
                                            <div className="flex gap-0.5 mt-1 justify-center">
                                                {[1, 2, 3, 4].map(s => <Star key={s} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />)}
                                                <div className="relative">
                                                    <Star className="w-3.5 h-3.5 text-yellow-500/30 fill-yellow-500/30" />
                                                    <div className="absolute top-0 left-0 w-[90%] overflow-hidden">
                                                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <CountUp to={stat.value} suffix={stat.suffix} />
                                    )}
                                </div>
                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
