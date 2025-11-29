import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, DollarSign, Wallet, Calendar } from "lucide-react"

export function StatsCards() {
    const stats = [
        {
            title: "Ventas Mes",
            value: "$4,200",
            description: "+20.1% vs mes anterior",
            icon: ShoppingCart,
        },
        {
            title: "Comisiones Ganadas",
            value: "$1,680",
            description: "+15% vs mes anterior",
            icon: DollarSign,
        },
        {
            title: "Saldo Disponible",
            value: "$300.00",
            description: "Listo para retirar",
            icon: Wallet,
            valueColor: "text-green-600",
        },
        {
            title: "Próximo Pago",
            value: "15/12",
            description: "En 18 días",
            icon: Calendar,
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
                <Card key={i} className="bg-white shadow-md border-gray-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stat.valueColor || 'text-gray-900'}`}>
                            {stat.value}
                        </div>
                        <p className="text-xs text-gray-500">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
