"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, Package, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/dashboard/stats-card"
import { getAdminStats } from "@/lib/dashboard/stats"
import Skeleton from "../../../components/ui/skeleton"
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

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Platform Overview</h1>
                    <p className="text-zinc-400">Comprehensive real-time statistics for TDT Platform.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/dashboard/admin/finance">
                        <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800">
                            View Finance
                        </Button>
                    </Link>
                    <Link href="/dashboard/admin/orders">
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            Process Orders
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <Card key={i} className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-24 bg-zinc-800" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-32 bg-zinc-800" />
                                <Skeleton className="h-3 w-16 mt-2 bg-zinc-800" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <>
                        <StatsCard
                            title="Total Revenue"
                            value={`$${stats.totalRevenue.toLocaleString()}`}
                            icon={DollarSign}
                            className="bg-zinc-900 border-zinc-800"
                            trend={{
                                value: Math.abs(stats.revenueGrowth),
                                label: "vs last month",
                                positive: stats.revenueGrowth >= 0
                            }}
                        />
                        <StatsCard
                            title="Net Profit (TDT)"
                            value={`$${stats.netProfit.toLocaleString()}`}
                            icon={TrendingUp}
                            className="bg-zinc-900 border-zinc-800"
                            description="Platform yield"
                        />
                        <StatsCard
                            title="Active Orders"
                            value={stats.activeOrders.toString()}
                            icon={Package}
                            className="bg-zinc-900 border-zinc-800"
                            trend={{
                                value: Math.abs(stats.ordersGrowth),
                                label: "this week",
                                positive: stats.ordersGrowth >= 0
                            }}
                        />
                        <StatsCard
                            title="Signed Vendors"
                            value={stats.totalVendors.toString()}
                            icon={Users}
                            className="bg-zinc-900 border-zinc-800"
                            description="Active sales agents"
                        />
                    </>
                )}
            </div>

            {/* AI Insights & Secondary Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-full lg:col-span-4 bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Growth Projection</CardTitle>
                        <CardDescription className="text-zinc-500">Sales and order volume trends</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] flex items-center justify-center bg-zinc-950/40 rounded-xl border border-dashed border-zinc-800">
                            <div className="text-center text-zinc-600">
                                <Activity className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p className="font-semibold">AI Charts coming soon</p>
                                <p className="text-xs mt-1">Real-time data visualization is being processed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-full lg:col-span-3 bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Performance KPIs</CardTitle>
                        <CardDescription className="text-zinc-500">Core business health indicators</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Global Conversion</p>
                                <p className="text-3xl font-bold text-white mt-1 font-mono">
                                    {stats.activeOrders > 0
                                        ? ((stats.activeOrders / (stats.activeOrders + 10)) * 100).toFixed(1)
                                        : "0"
                                    }%
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <TrendingUp className="h-6 w-6 text-emerald-500" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Average Ticket</p>
                                <p className="text-3xl font-bold text-white mt-1 font-mono">
                                    ${stats.activeOrders > 0
                                        ? (stats.totalRevenue / stats.activeOrders).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : "0.00"
                                    }
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <DollarSign className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Profit Margin</p>
                                <p className="text-3xl font-bold text-white mt-1 font-mono">
                                    {stats.totalRevenue > 0
                                        ? ((stats.netProfit / stats.totalRevenue) * 100).toFixed(1)
                                        : "0"
                                    }%
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                <Activity className="h-6 w-6 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/dashboard/admin/vendors">
                    <Card className="hover:bg-zinc-800/50 transition-all border-zinc-800 bg-zinc-900 group cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-base text-white group-hover:text-indigo-400 transition-colors">Vendor Network</CardTitle>
                            <CardDescription className="text-zinc-500">
                                {stats.totalVendors} active agents processing sales
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/dashboard/admin/finance">
                    <Card className="hover:bg-zinc-800/50 transition-all border-zinc-800 bg-zinc-900 group cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-base text-white group-hover:text-indigo-400 transition-colors">Financial Treasury</CardTitle>
                            <CardDescription className="text-zinc-500">
                                Current net profit: ${stats.netProfit.toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/dashboard/admin/orders">
                    <Card className="hover:bg-zinc-800/50 transition-all border-zinc-800 bg-zinc-900 group cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-base text-white group-hover:text-indigo-400 transition-colors">Processing Hub</CardTitle>
                            <CardDescription className="text-zinc-500">
                                {stats.activeOrders} active orders awaiting processing
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
