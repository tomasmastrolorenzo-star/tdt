"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Settings, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function OperatorNav() {
    const pathname = usePathname()

    const items = [
        {
            title: "Pedidos",
            href: "/dashboard/operator/orders",
            icon: Package,
        },
        {
            title: "Servicios",
            href: "/dashboard/operator/services",
            icon: Settings,
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
