import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <nav className="fixed top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
                    <span className="text-cyan-500">TDT</span> Platform
                </Link>

                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                    <Link href="#features" className="hover:text-cyan-400 transition-colors">Características</Link>
                    <Link href="#pricing" className="hover:text-cyan-400 transition-colors">Precios</Link>
                    <Link href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white">
                        Iniciar Sesión
                    </Link>
                    <Link href="/register">
                        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white">
                            Registrarse
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
