"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminOrder {
    id: string
    client_name: string
    client_email: string
    service_name: string
    price_final: number
    status: string
    created_at: string
    seller_email: string
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<AdminOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const supabase = createClient()

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from("orders")
                .select(`
                    id,
                    client_name,
                    client_email,
                    price_final,
                    status,
                    created_at,
                    services (name),
                    profiles!seller_id (email)
                `)
                .order('created_at', { ascending: false })

            if (error) throw error

            const formattedOrders = data.map((order: any) => ({
                id: order.id,
                client_name: order.client_name,
                client_email: order.client_email,
                service_name: order.services?.name || 'Unknown Service',
                price_final: order.price_final,
                status: order.status,
                created_at: order.created_at,
                seller_email: order.profiles?.email || 'Unknown Seller'
            }))

            setOrders(formattedOrders)
        } catch (error) {
            console.error("Error fetching orders:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-500'
            case 'PROCESSING': return 'bg-blue-500'
            case 'PENDING_PAYMENT': return 'bg-yellow-500'
            case 'PAYMENT_REJECTED': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Órdenes</h1>
                    <p className="text-muted-foreground">Control total de todas las órdenes de la plataforma</p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar CSV
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Todas las Órdenes</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar orden..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos</SelectItem>
                                    <SelectItem value="PENDING_PAYMENT">Pendiente Pago</SelectItem>
                                    <SelectItem value="PROCESSING">Procesando</SelectItem>
                                    <SelectItem value="COMPLETED">Completado</SelectItem>
                                    <SelectItem value="PAYMENT_REJECTED">Rechazado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="p-4 font-medium">ID / Cliente</th>
                                    <th className="p-4 font-medium">Servicio</th>
                                    <th className="p-4 font-medium">Vendedor</th>
                                    <th className="p-4 font-medium">Monto</th>
                                    <th className="p-4 font-medium">Estado</th>
                                    <th className="p-4 font-medium">Fecha</th>
                                    <th className="p-4 font-medium text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                            Cargando órdenes...
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                            No se encontraron órdenes
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="border-t hover:bg-muted/50">
                                            <td className="p-4">
                                                <div className="font-medium truncate w-32" title={order.id}>#{order.id.slice(0, 8)}</div>
                                                <div className="text-muted-foreground">{order.client_name}</div>
                                            </td>
                                            <td className="p-4">{order.service_name}</td>
                                            <td className="p-4 text-muted-foreground">{order.seller_email}</td>
                                            <td className="p-4 font-medium">${order.price_final}</td>
                                            <td className="p-4">
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                        <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                                        <DropdownMenuItem>Contactar Cliente</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600">Cancelar Orden</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
