"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calculator, TrendingUp, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function VendorNav() {
    const pathname = usePathname()

    const items = [
        {
            title: "Dashboard",
            href: "/dashboard/vendor",
            icon: LayoutDashboard,
        },
        {
            title: "Calculadora",
            href: "/dashboard/vendor/calculator",
            icon: Calculator,
        },
        {
            title: "Mis Pedidos",
            href: "/dashboard/orders",
            icon: Package,
        },
    ]

    return (
        <nav className="flex items-center space-x-2 mb-6">
            {items.map((item) => (
                <Link key={item.href} href={item.href}>
                    <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn(
                            "justify-start",
                            pathname === item.href && "bg-zinc-800 text-white hover:bg-zinc-700"
                        )}
                    >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                    </Button>
                </Link>
            ))}
        </nav>
    )
}
