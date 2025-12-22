"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"
import { LevelBadge } from "@/components/dashboard/level-badge"
import { getVendorLeaderboard } from "@/lib/dashboard/stats"

interface LeaderboardEntry {
    id: string
    full_name: string
    email: string
    total_sales: number
    vendor_levels: {
        name: string
        badge_color: string
    } | null
}

export default function VendorRankingPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    const fetchLeaderboard = async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setCurrentUserId(user.id)
            }

            const data = await getVendorLeaderboard(10)
            setLeaderboard(data as LeaderboardEntry[])
        } catch (error) {
            console.error("Error fetching leaderboard:", error)
        } finally {
            setLoading(false)
        }
    }

    const getRankIcon = (position: number) => {
        switch (position) {
            case 1:
                return <Trophy className="h-6 w-6 text-yellow-500" />
            case 2:
                return <Medal className="h-6 w-6 text-gray-400" />
            case 3:
                return <Award className="h-6 w-6 text-amber-600" />
            default:
                return <span className="text-lg font-bold text-muted-foreground">#{position}</span>
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <TrendingUp className="h-12 w-12 animate-pulse text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Ranking de Vendedores</h1>
                <p className="text-muted-foreground">Compite sanamente y sube en el ranking</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Top 10 Vendedores
                    </CardTitle>
                    <CardDescription>Los mejores vendedores de TDT Platform</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {leaderboard.map((vendor, index) => {
                            const position = index + 1
                            const isCurrentUser = vendor.id === currentUserId

                            return (
                                <div
                                    key={vendor.id}
                                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${isCurrentUser
                                        ? "bg-blue-50 dark:bg-blue-950 border-blue-500 shadow-md"
                                        : "bg-card hover:bg-muted/50"
                                        }`}
                                >
                                    {/* Rank */}
                                    <div className="flex items-center justify-center w-12">
                                        {getRankIcon(position)}
                                    </div>

                                    {/* Vendor Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold">
                                                {vendor.full_name || "Vendedor Anónimo"}
                                            </p>
                                            {isCurrentUser && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Tú
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{vendor.email}</p>
                                    </div>

                                    {/* Level Badge */}
                                    <div>
                                        {vendor.vendor_levels && (
                                            <LevelBadge
                                                levelName={vendor.vendor_levels.name}
                                                badgeColor={vendor.vendor_levels.badge_color}
                                                size="sm"
                                            />
                                        )}
                                    </div>

                                    {/* Sales */}
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Ventas Totales</p>
                                        <p className="text-lg font-bold text-green-600">
                                            ${vendor.total_sales.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {leaderboard.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No hay vendedores en el ranking aún</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
