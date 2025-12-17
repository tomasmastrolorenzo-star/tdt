"use client"

import { Instagram, Clock, CheckCircle, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"

export default function StatsGrid() {
    const { t } = useI18n()

    // Defensive check
    if (!t?.hero?.statsGrid) return null

    const stats = [
        {
            icon: Instagram,
            value: "4,152",
            label: t.hero.statsGrid.monthlyGrowth || "Monthly follower increase",
            color: "text-pink-500",
            bg: "bg-pink-500/10"
        },
        {
            icon: Clock,
            value: "8M+",
            label: t.hero.statsGrid.hoursSaved || "Hours saved for clients",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            icon: CheckCircle,
            value: "4.9/5",
            label: t.hero.statsGrid.rating || "Based on real client reviews",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: Users,
            value: "15,000+",
            label: t.hero.statsGrid.userBase || "Current TDT user base",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ]

    return (
        <section className="py-20 bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
                                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                                <h3 className={`text-3xl font-bold mb-2 ${stat.color}`}>{stat.value}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
