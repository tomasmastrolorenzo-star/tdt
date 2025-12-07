"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, DollarSign, Star, ArrowUpRight, Target, Award } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { LevelBadge } from "@/components/dashboard/LevelBadge"
import { ProgressRing } from "@/components/dashboard/ProgressRing"
import { VendorReferralCard } from "@/components/dashboard/VendorReferralCard"
import { getVendorStats, type VendorStats } from "@/lib/dashboard/stats"
import Link from "next/link"

export default function VendorDashboardPage() {
    const [stats, setStats] = useState<VendorStats | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchVendorStats()
    }, [])

    const fetchVendorStats = async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/login")
                return
            }

            const vendorStats = await getVendorStats(user.id)
            setStats(vendorStats)
        } catch (error) {
            console.error("Error fetching vendor stats:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
                    <p className="text-muted-foreground">Cargando tu oficina virtual...</p>
                </div>
            </div>
        )
    }

    const currentLevel = stats.currentLevel
    const nextLevel = stats.nextLevel

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mi Oficina Virtual</h1>
                    <p className="text-muted-foreground">Bienvenido a tu panel de ventas</p>
                </div>
                {currentLevel && (
                    <LevelBadge
                        levelName={currentLevel.name}
                        badgeColor={currentLevel.badge_color}
                        size="lg"
                    />
                )}
            </div>

            {/* Level Progress Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Tu Progreso de Nivel
                    </CardTitle>
                    <CardDescription>
                        {nextLevel
                            ? `Estás a $${stats.salesUntilNextLevel.toFixed(2)} de alcanzar el nivel ${nextLevel.name}`
                            : "¡Has alcanzado el nivel máximo!"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Progress Ring */}
                        <div className="flex items-center justify-center">
                            <ProgressRing
                                progress={stats.progress}
                                size={160}
                                strokeWidth={12}
                                color={currentLevel?.badge_color || "#3b82f6"}
                            />
                        </div>

                        {/* Level Info */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Nivel Actual</p>
                                <div className="flex items-center gap-2">
                                    {currentLevel && (
                                        <LevelBadge
                                            levelName={currentLevel.name}
                                            badgeColor={currentLevel.badge_color}
                                        />
                                    )}
                                    <span className="text-2xl font-bold text-green-600">
                                        {stats.commissionRate}% comisión
                                    </span>
                                </div>
                            </div>

                            {nextLevel && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Próximo Nivel</p>
                                    <div className="flex items-center gap-2">
                                        <LevelBadge
                                            levelName={nextLevel.name}
                                            badgeColor={nextLevel.badge_color}
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            {nextLevel.commission_rate}% comisión
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2 border-t">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Ventas Totales</span>
                                    <span className="font-semibold">${stats.totalSales.toFixed(2)}</span>
                                </div>
                                {nextLevel && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Meta para {nextLevel.name}</span>
                                        <span className="font-semibold">${nextLevel.min_sales.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatsCard
                    title="Ventas Totales"
                    value={`$${stats.totalSales.toFixed(2)}`}
                    icon={DollarSign}
                    description="Acumuladas"
                />

                <StatsCard
                    title="Tu Ranking"
                    value={stats.rank ? `#${stats.rank}` : "N/A"}
                    icon={Star}
                    description={`De ${stats.totalVendors} vendedores`}
                />

                <StatsCard
                    title="Tasa de Comisión"
                    value={`${stats.commissionRate}%`}
                    icon={TrendingUp}
                    description={currentLevel?.name || "Sin nivel"}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <Link href="/dashboard/vendor/ranking">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-yellow-500" />
                                Ver Ranking Completo
                            </CardTitle>
                            <CardDescription>
                                Compite con otros vendedores y sube en el ranking
                            </CardDescription>
                        </CardHeader>
                    </Link>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <Link href="/dashboard/vendor/calculator">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-blue-500" />
                                Calculadora de Ganancias
                            </CardTitle>
                            <CardDescription>
                                Calcula tus comisiones y proyecta tus ingresos
                            </CardDescription>
                        </CardHeader>
                    </Link>
                </Card>
            </div>

            {/* Referral Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <VendorReferralCard referralCode={stats.referralCode || "CODIGO-PENDIENTE"} />

                {/* Tips Card could go here */}
                <Card className="bg-slate-50 dark:bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Tips de Venta 🚀</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>• Comparte resultados de "Antes y Después" con tus clientes.</p>
                        <p>• Usa el nuevo "El Faro" en el landing para análisis personalizados.</p>
                        <p>• Ofrece el cupón del 5% como cierre de venta.</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>Tus últimas ventas y logros</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <DollarSign className="h-12 w-12 mb-4 opacity-20" />
                        <p>No hay actividad reciente para mostrar</p>
                        <Link href="/dashboard/orders">
                            <Button variant="link" className="mt-2">Ver todos mis pedidos</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
