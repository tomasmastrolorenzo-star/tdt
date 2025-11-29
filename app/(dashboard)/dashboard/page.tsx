import { StatsCards } from "@/components/dashboard/stats-cards"
import { ProfitCalculator } from "@/components/dashboard/profit-calculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VendorDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
                <p className="text-gray-600">Bienvenido a tu Oficina Virtual.</p>
            </div>

            <StatsCards />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <ProfitCalculator />

                    <Card className="bg-white shadow-md border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Historial de Ventas Recientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { date: "25/11", service: "IG Followers 1000", client: "@cliente1", status: "Completado", amount: "$24.00", statusColor: "bg-green-100 text-green-800" },
                                    { date: "24/11", service: "TT Likes 5000", client: "@cliente2", status: "En Progreso", amount: "$15.00", statusColor: "bg-yellow-100 text-yellow-800" },
                                    { date: "23/11", service: "IG Views 10k", client: "@cliente3", status: "Completado", amount: "$8.00", statusColor: "bg-green-100 text-green-800" },
                                ].map((sale, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <div>
                                            <div className="font-medium text-gray-900">{sale.service}</div>
                                            <div className="text-sm text-gray-500">{sale.client} • {sale.date}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-green-600">{sale.amount}</div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${sale.statusColor}`}>
                                                {sale.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white border-none shadow-xl">
                        <CardHeader>
                            <CardTitle>Mi Wallet</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-blue-100 text-sm">Balance Total</p>
                                    <div className="text-4xl font-bold">$500.00</div>
                                </div>
                                <div className="text-right">
                                    <p className="text-blue-100 text-sm">Disponible</p>
                                    <div className="text-xl font-bold text-green-300">$300.00</div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-blue-100 text-xs">Pendiente</p>
                                    <div className="font-medium">$200.00</div>
                                </div>
                                <div>
                                    <p className="text-blue-100 text-xs">Retirado</p>
                                    <div className="font-medium">$1,200.00</div>
                                </div>
                            </div>
                            <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors mt-4">
                                Solicitar Retiro 💸
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-md border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Rendimiento Últimos 6 Meses</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[200px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-md border-dashed border-2 border-gray-300">
                            Gráfico de Rendimiento (Placeholder)
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
