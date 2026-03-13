"use client"

import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface OfficeHeaderProps {
    userName: string
    userEmail: string
}

export function OfficeHeader({ userName, userEmail }: OfficeHeaderProps) {
    const router = useRouter()
    const [loggingOut, setLoggingOut] = useState(false)

    const handleLogout = async () => {
        setLoggingOut(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/login")
        router.refresh()
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-100">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-black tracking-tighter">TDT</span>
                    <span className="hidden md:block text-xs font-bold text-zinc-300">|</span>
                    <span className="hidden md:block text-xs font-black tracking-widest uppercase text-zinc-400">
                        La Oficina
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500">
                        <User className="w-3.5 h-3.5" />
                        <span className="font-semibold">{userName || userEmail}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-zinc-400 hover:text-black transition-colors disabled:opacity-50"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden md:block">Salir</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
