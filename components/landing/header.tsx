import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard } from "lucide-react"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                            Trend Up
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                        <Link href="#" className="hover:text-black transition-colors">INSTAGRAM SERVICES</Link>
                        <Link href="#" className="hover:text-black transition-colors">TIKTOK SERVICES</Link>
                        <Link href="#" className="hover:text-black transition-colors">FAQ</Link>
                        <Link href="#" className="hover:text-black transition-colors">CONTACT</Link>
                    </nav>
                </div>

                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Link href="/dashboard">
                        <LayoutDashboard className="w-4 h-4" />
                        DASHBOARD
                    </Link>
                </Button>
            </div>
        </header>
    )
}
