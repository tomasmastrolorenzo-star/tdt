"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, Package, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { getAdminStats } from "@/lib/dashboard/stats"
import Link from "next/link"

interface AdminStats {
    totalRevenue: number
    netProfit: number
    activeOrders: number
    totalVendors: number
    revenueGrowth: number
    ordersGrowth: number
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminStats>({
        totalRevenue: 0,
        activeOrders: 0,
        totalVendors: 0,
        netProfit: 0,
        revenueGrowth: 0,
        ordersGrowth: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        setLoading(true)
        try {
            const adminStats = await getAdminStats()
            setStats(adminStats)
        } catch (error) {
            console.error("Error fetching admin stats:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Activity className="h-12 w-12 animate-pulse text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard General</h1>
                    <p className="text-muted-foreground">Visión completa de TDT Platform</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/admin/finance">
                        <Button variant="outline">Ver Finanzas</Button>
                    </Link>
                    <Link href="/dashboard/admin/orders">
                        <Button>Gestionar Órdenes</Button>
                    </Link>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Ingresos Totales"
                    value={`$${stats.totalRevenue.toFixed(2)}`}
                    icon={DollarSign}
                    trend={{
                        value: Math.abs(stats.revenueGrowth),
                        label: "vs mes anterior",
                        positive: stats.revenueGrowth >= 0
                    }}
                />
                <StatsCard
                    title="Ganancia Neta (TDT)"
                    value={`$${stats.netProfit.toFixed(2)}`}
                    icon={TrendingUp}
                    description="Margen de la plataforma"
                />
                <StatsCard
                    title="Órdenes Activas"
                    value={stats.activeOrders.toString()}
                    icon={Package}
                    trend={{
                        value: Math.abs(stats.ordersGrowth),
                        label: "esta semana",
                        positive: stats.ordersGrowth >= 0
                    }}
                />
                <StatsCard
                    title="Vendedores Activos"
                    value={stats.totalVendors.toString()}
                    icon={Users}
                    description="Generando ventas"
                />
            </div>

            {/* Secondary Stats & Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Resumen de Actividad</CardTitle>
                        <CardDescription>Tendencias de ventas y órdenes</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
                            <div className="text-center text-muted-foreground">
                                <Activity className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                <p>Gráfico de tendencias (Próximamente)</p>
                                <p className="text-xs mt-1">Visualización de ventas últimos 30 días</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Métricas Clave</CardTitle>
                        <CardDescription>Indicadores de rendimiento</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                                <p className="text-sm text-muted-foreground">Tasa de Conversión</p>
                                <p className="text-2xl font-bold">
                                    {stats.activeOrders > 0
                                        ? ((stats.activeOrders / (stats.activeOrders + 10)) * 100).toFixed(1)
                                        : "0"
                                    }%
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                                <p className="text-sm text-muted-foreground">Ticket Promedio</p>
                                <p className="text-2xl font-bold">
                                    ${stats.activeOrders > 0
                                        ? (stats.totalRevenue / stats.activeOrders).toFixed(2)
                                        : "0.00"
                                    }
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-blue-500" />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                                <p className="text-sm text-muted-foreground">Margen Promedio</p>
                                <p className="text-2xl font-bold">
                                    {stats.totalRevenue > 0
                                        ? ((stats.netProfit / stats.totalRevenue) * 100).toFixed(1)
                                        : "0"
                                    }%
                                </p>
                            </div>
                            <Activity className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/dashboard/admin/vendors">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-base">Gestión de Vendedores</CardTitle>
                            <CardDescription>
                                {stats.totalVendors} vendedores activos
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/dashboard/admin/finance">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-base">Centro Financiero</CardTitle>
                            <CardDescription>
                                Ganancia neta: ${stats.netProfit.toFixed(2)}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/dashboard/admin/orders">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-base">Órdenes Pendientes</CardTitle>
                            <CardDescription>
                                {stats.activeOrders} órdenes requieren atención
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
