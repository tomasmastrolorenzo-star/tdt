'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface FinancialOrder {
    id: string
    created_at: string
    sale_price: number
    cost_price: number
    status: string
    vendor: {
        name: string
    }
}

export default function FinancePage() {
    const [orders, setOrders] = useState<FinancialOrder[]>([])
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        margin: 0
    })

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id,
                    created_at,
                    sale_price,
                    cost_price,
                    status,
                    vendor:users(name)
                `)
                .order('created_at', { ascending: false })

            if (data) {
                const typedData = data as any[]
                setOrders(typedData)

                const revenue = typedData.reduce((acc, curr) => acc + (curr.sale_price || 0), 0)
                const cost = typedData.reduce((acc, curr) => acc + (curr.cost_price || 0), 0)
                const profit = revenue - cost
                const margin = revenue > 0 ? (profit / revenue) * 100 : 0

                setStats({
                    totalRevenue: revenue,
                    totalCost: cost,
                    totalProfit: profit,
                    margin: margin
                })
            }
        }
        fetchData()
    }, [])

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Finanzas & Reportes</h2>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Costos Operativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">${stats.totalCost.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Beneficio Neto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">${stats.totalProfit.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Margen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.margin.toFixed(1)}%</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Desglose de Órdenes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Vendedor</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Venta</TableHead>
                                <TableHead className="text-right">Costo</TableHead>
                                <TableHead className="text-right">Profit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>{order.vendor?.name || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{order.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">${order.sale_price}</TableCell>
                                    <TableCell className="text-right text-red-500">-${order.cost_price}</TableCell>
                                    <TableCell className="text-right text-green-600 font-bold">
                                        ${(order.sale_price - order.cost_price).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
