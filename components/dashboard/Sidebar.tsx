"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Settings, LayoutDashboard, ShoppingBag, Users, Wallet, Ticket, BarChart3, Shield } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { LevelBadge } from "./LevelBadge"
import { getVendorStats } from "@/lib/dashboard/stats"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const [userRole, setUserRole] = useState<string | null>(null)
    const [vendorLevel, setVendorLevel] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
                setUserRole(data?.role)

                if (data?.role === 'VENDOR') {
                    const stats = await getVendorStats(user.id)
                    if (stats?.currentLevel) {
                        setVendorLevel(stats.currentLevel)
                    }
                }
            }
        }
        getUser()
    }, [])

    const adminRoutes = [
        { title: "Overview", icon: LayoutDashboard, href: "/dashboard/admin" },
        { title: "Órdenes", icon: ShoppingBag, href: "/dashboard/admin/orders" },
        { title: "Vendedores", icon: Users, href: "/dashboard/admin/vendors" },
        { title: "Finanzas", icon: Wallet, href: "/dashboard/admin/finance" },
    ]

    const operatorRoutes = [
        { title: "Pedidos", icon: ShoppingBag, href: "/dashboard/operator/orders" },
        { title: "Servicios", icon: Settings, href: "/dashboard/operator/services" },
        { title: "Tickets", icon: Ticket, href: "/dashboard/operator/tickets" },
    ]

    const vendorRoutes = [
        { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard/vendor" },
        { title: "Ranking", icon: CrownIcon, href: "/dashboard/vendor/ranking" },
        { title: "Calculadora", icon: BarChart3, href: "/dashboard/vendor/calculator" },
        { title: "Mis Pedidos", icon: ShoppingBag, href: "/dashboard/orders" },
    ]

    function CrownIcon(props: any) {
        return (
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
            </svg>
        )
    }

    const getRoutes = () => {
        if (userRole === 'CEO') return adminRoutes
        if (userRole === 'OPERATOR') return operatorRoutes
        if (userRole === 'VENDOR') return vendorRoutes
        // Default routes for new users or undefined roles
        return [
            { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
            { title: "Mis Pedidos", icon: ShoppingBag, href: "/dashboard/orders" },
        ]
    }

    const routes = getRoutes()

    return (
        <div className={cn("pb-12 min-h-screen bg-zinc-950 text-white border-r border-zinc-800", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center justify-between mb-8 px-4">
                        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            <Shield className="h-6 w-6 text-emerald-500" />
                            TDT Platform
                        </h2>
                    </div>

                    {/* Vendor Level Badge Display in Sidebar */}
                    {userRole === 'VENDOR' && vendorLevel && (
                        <div className="px-4 mb-6">
                            <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800 flex items-center gap-3">
                                <div className="flex-1">
                                    <p className="text-xs text-zinc-500 mb-1">Nivel Actual</p>
                                    <LevelBadge levelName={vendorLevel.name} badgeColor={vendorLevel.badge_color} size="sm" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Link key={route.href} href={route.href}>
                                <Button
                                    variant={pathname === route.href ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start text-sm font-medium transition-colors",
                                        pathname === route.href
                                            ? "bg-zinc-800 text-white hover:bg-zinc-700"
                                            : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                                    )}
                                >
                                    <route.icon className="mr-2 h-4 w-4" />
                                    {route.title}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="px-3 py-2 mt-auto">
                    <div className="space-y-1">
                        <Link href="/dashboard/profile">
                            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800/50">
                                <Settings className="mr-2 h-4 w-4" />
                                Configuración
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
