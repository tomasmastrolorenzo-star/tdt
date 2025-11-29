'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Order, OrderStatus } from '@/lib/supabase/types'

export default function OperatorOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                service:services(name),
                vendor:users(name, email)
            `)
            .order('created_at', { ascending: false })

        if (data) setOrders(data as any) // Type casting for joined relations
        setLoading(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)

        if (!error) {
            fetchOrders() // Refresh list
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500'
            case 'PROCESSING': return 'bg-blue-500'
            case 'COMPLETED': return 'bg-green-500'
            case 'CANCELLED': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Gestión de Tráfico (Operador)</h2>
                <Button onClick={fetchOrders} variant="outline">Actualizar</Button>
            </div>

            <div className="grid gap-4">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                        <span className="text-sm text-muted-foreground">
                                            #{order.id.slice(0, 8)}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-lg">
                                        {order.service?.name || 'Servicio Desconocido'}
                                    </h3>
                                    <div className="text-sm text-muted-foreground">
                                        <p>Vendedor: {order.vendor?.name} ({order.vendor?.email})</p>
                                        <p>Notas/Link: {order.notes}</p>
                                        <p>Fecha: {new Date(order.created_at).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 min-w-[200px]">
                                    <div className="text-right mb-2">
                                        <span className="font-bold text-xl">${order.sale_price}</span>
                                    </div>
                                    <Select
                                        defaultValue={order.status}
                                        onValueChange={(val) => updateStatus(order.id, val as OrderStatus)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Cambiar Estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">PENDING</SelectItem>
                                            <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                                            <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                                            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                                            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {orders.length === 0 && !loading && (
                    <div className="text-center py-10 text-muted-foreground">
                        No hay órdenes pendientes.
                    </div>
                )}
            </div>
        </div>
    )
}
