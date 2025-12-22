"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FloatingActionButton({ href, label = "Crear" }: { href: string, label?: string }) {
    return (
        <Link href={href} className="lg:hidden">
            <Button
                size="lg"
                className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
                <Plus className="h-6 w-6" />
                <span className="sr-only">{label}</span>
            </Button>
        </Link>
    )
}
