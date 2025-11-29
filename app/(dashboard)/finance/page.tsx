'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Order } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DollarSign, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'

export default function FinancePage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (data && !error) {
            setOrders(data as Order[])
        }
    }

    const updatePaymentStatus = async (orderId: string, newStatus: string) => {
        setLoading(true)

        const { error } = await supabase
            .from('orders')
            .update({
                payment_status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', orderId)

        setLoading(false)

        if (!error) {
            fetchOrders()
        } else {
            alert('Error al actualizar: ' + error.message)
        }
    }

    // Calculate stats
    const totalRevenue = orders
        .filter(o => o.payment_status === 'CONFIRMED')
        .reduce((sum, o) => sum + parseFloat(o.price.toString()), 0)

    const pendingPayments = orders
        .filter(o => o.payment_status === 'PENDING')
        .reduce((sum, o) => sum + parseFloat(o.price.toString()), 0)

    const confirmedToday = orders
        .filter(o => {
            const today = new Date().toDateString()
            const orderDate = new Date(o.created_at).toDateString()
            return orderDate === today && o.payment_status === 'CONFIRMED'
        })
        .reduce((sum, o) => sum + parseFloat(o.price.toString()), 0)

    const pendingOrders = orders.filter(o => o.payment_status === 'PENDING')
    const confirmedOrders = orders.filter(o => o.payment_status === 'CONFIRMED')

    const getPaymentBadge = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800',
        }

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || colors.PENDING}`}>
                {status}
            </span>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard de Finanzas</h2>
                <p className="text-gray-600">Gestión de pagos y revenue</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm opacity-90">Revenue Total</div>
                                <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
                            </div>
                            <DollarSign className="w-12 h-12 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm opacity-90">Hoy</div>
                                <div className="text-3xl font-bold">${confirmedToday.toFixed(2)}</div>
                            </div>
                            <TrendingUp className="w-12 h-12 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500 to-yellow-700 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm opacity-90">Pendientes</div>
                                <div className="text-3xl font-bold">${pendingPayments.toFixed(2)}</div>
                            </div>
                            <Clock className="w-12 h-12 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm opacity-90">Órdenes Confirmadas</div>
                                <div className="text-3xl font-bold">{confirmedOrders.length}</div>
                            </div>
                            <CheckCircle2 className="w-12 h-12 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Payments */}
            <Card>
                <CardHeader>
                    <CardTitle>Pagos Pendientes ({pendingOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {pendingOrders.map((order) => (
                            <div
                                key={order.id}
                                className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-gray-900">{order.order_number}</span>
                                            {getPaymentBadge(order.payment_status)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <div><strong>Cliente:</strong> {order.customer_username} ({order.customer_email})</div>
                                            <div><strong>Servicio:</strong> {order.platform} {order.service_type} - {order.quality}</div>
                                            <div><strong>Cantidad:</strong> {order.quantity.toLocaleString()}</div>
                                            <div><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-3">
                                        <div className="text-2xl font-bold text-green-600">${order.price}</div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => updatePaymentStatus(order.id, 'CONFIRMED')}
                                                disabled={loading}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                ✓ Confirmar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => updatePaymentStatus(order.id, 'REJECTED')}
                                                disabled={loading}
                                            >
                                                ✗ Rechazar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {pendingOrders.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No hay pagos pendientes
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Confirmed Payments */}
            <Card>
                <CardHeader>
                    <CardTitle>Pagos Confirmados Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {confirmedOrders.slice(0, 10).map((order) => (
                            <div
                                key={order.id}
                                className="border border-green-200 bg-green-50 rounded-lg p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-gray-900">{order.order_number}</span>
                                            {getPaymentBadge(order.payment_status)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {order.customer_username} • {order.platform} {order.service_type} • {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="text-xl font-bold text-green-600">${order.price}</div>
                                </div>
                            </div>
                        ))}

                        {confirmedOrders.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No hay pagos confirmados aún
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
