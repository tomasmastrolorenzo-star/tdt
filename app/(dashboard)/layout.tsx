import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LayoutDashboard, Calculator, ShoppingCart, Wallet, Link as LinkIcon, History, FileText, LogOut, DollarSign } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        TDT System
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-3 bg-gray-800 rounded-lg text-white">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/operator/orders" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        <span>Órdenes (Operador)</span>
                    </Link>
                    <Link href="/finance" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <DollarSign className="w-5 h-5" />
                        <span>Finanzas</span>
                    </Link>
                    <Link href="/dashboard/calculator" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <Calculator className="w-5 h-5" />
                        <span>Calculadora</span>
                    </Link>
                    <Link href="/dashboard/orders/new" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        <span>Cargar Ventas</span>
                    </Link>
                    <Link href="/dashboard/wallet" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <Wallet className="w-5 h-5" />
                        <span>Mi Wallet</span>
                    </Link>
                    <Link href="/dashboard/affiliate" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <LinkIcon className="w-5 h-5" />
                        <span>Enlaces Afiliado</span>
                    </Link>
                    <Link href="/dashboard/history" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <History className="w-5 h-5" />
                        <span>Historial Ventas</span>
                    </Link>
                    <Link href="/dashboard/marketing" className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <FileText className="w-5 h-5" />
                        <span>Materiales</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800">
                        <LogOut className="w-5 h-5 mr-3" />
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
