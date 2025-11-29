'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Order } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Clock, CheckCircle, XCircle, Search } from 'lucide-react'

export default function OperatorOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('ALL')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchOrders()
    }, [])

    useEffect(() => {
        filterOrders()
    }, [orders, searchTerm, statusFilter])

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (data && !error) {
            setOrders(data as Order[])
        }
    }

    const filterOrders = () => {
        let filtered = orders

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(o => o.status === statusFilter)
        }

        if (searchTerm) {
            filtered = filtered.filter(o =>
                o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.customer_username.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredOrders(filtered)
    }

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        setLoading(true)

        const { error } = await supabase
            .from('orders')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString(),
                ...(newStatus === 'COMPLETED' && { completed_at: new Date().toISOString() })
            })
            .eq('id', orderId)

        setLoading(false)

        if (!error) {
            fetchOrders()
            alert('Estado actualizado correctamente')
        } else {
            alert('Error al actualizar: ' + error.message)
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
            alert('Estado de pago actualizado')
        } else {
            alert('Error al actualizar: ' + error.message)
        }
    }

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any, icon: any }> = {
            PENDING: { variant: 'secondary', icon: Clock },
            PROCESSING: { variant: 'default', icon: ShoppingCart },
            COMPLETED: { variant: 'default', icon: CheckCircle },
            REJECTED: { variant: 'destructive', icon: XCircle },
        }

        const config = variants[status] || variants.PENDING
        const Icon = config.icon

        return (
            <Badge variant={config.variant as any} className="gap-1">
                <Icon className="w-3 h-3" />
                {status}
            </Badge>
        )
    }

    const getPaymentBadge = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800',
        }

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.PENDING}`}>
                {status}
            </span>
        )
    }

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        processing: orders.filter(o => o.status === 'PROCESSING').length,
        completed: orders.filter(o => o.status === 'COMPLETED').length,
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Gestión de Órdenes</h2>
                <p className="text-gray-600">Dashboard de Operador de Tráfico</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-500">Total Órdenes</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <div className="text-sm text-gray-500">Pendientes</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
                        <div className="text-sm text-gray-500">En Proceso</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        <div className="text-sm text-gray-500">Completadas</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label htmlFor="search">Buscar</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Buscar por orden, email o username..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-48">
                            <Label>Estado</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos</SelectItem>
                                    <SelectItem value="PENDING">Pendiente</SelectItem>
                                    <SelectItem value="PROCESSING">Procesando</SelectItem>
                                    <SelectItem value="COMPLETED">Completado</SelectItem>
                                    <SelectItem value="REJECTED">Rechazado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Órdenes ({filteredOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedOrder(order)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-gray-900">{order.order_number}</span>
                                            {getStatusBadge(order.status)}
                                            {getPaymentBadge(order.payment_status)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <div><strong>Cliente:</strong> {order.customer_username} ({order.customer_email})</div>
                                            <div><strong>Servicio:</strong> {order.platform} {order.service_type} - {order.quality}</div>
                                            <div><strong>Cantidad:</strong> {order.quantity.toLocaleString()}</div>
                                            <div><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-purple-600">${order.price}</div>
                                        {selectedOrder?.id === order.id && (
                                            <div className="mt-4 space-y-2">
                                                <Select
                                                    value={order.status}
                                                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                                                    disabled={loading}
                                                >
                                                    <SelectTrigger className="w-40">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PENDING">Pendiente</SelectItem>
                                                        <SelectItem value="PROCESSING">Procesando</SelectItem>
                                                        <SelectItem value="COMPLETED">Completado</SelectItem>
                                                        <SelectItem value="REJECTED">Rechazado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Select
                                                    value={order.payment_status}
                                                    onValueChange={(value) => updatePaymentStatus(order.id, value)}
                                                    disabled={loading}
                                                >
                                                    <SelectTrigger className="w-40">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PENDING">Pago Pendiente</SelectItem>
                                                        <SelectItem value="CONFIRMED">Pago Confirmado</SelectItem>
                                                        <SelectItem value="REJECTED">Pago Rechazado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredOrders.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No se encontraron órdenes
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
