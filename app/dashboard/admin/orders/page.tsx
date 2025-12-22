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
    username: string
    email: string
    plan: string
    amount: number
    status: string
    created_at: string
    ip_address?: string
    funnel_history?: any[]
    is_spam?: boolean
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
                    details,
                    amount,
                    status,
                    created_at
                `)
                .order('created_at', { ascending: false })

            if (error) throw error

            const now = new Date().getTime()
            const oneHour = 60 * 60 * 1000

            // IP Count Map for Spam Detection
            const ipCounts: Record<string, number[]> = {}

            const formattedOrders = data.map((order: any) => {
                const ip = order.details?.ip_address || 'unknown'
                const timestamp = new Date(order.created_at).getTime()

                if (ip !== 'unknown') {
                    if (!ipCounts[ip]) ipCounts[ip] = []
                    ipCounts[ip].push(timestamp)
                }

                return {
                    id: order.id,
                    username: order.details?.username || 'N/A',
                    email: order.details?.email || 'N/A',
                    plan: order.details?.plan || 'Unknown',
                    amount: order.amount,
                    status: order.status,
                    created_at: order.created_at,
                    ip_address: ip,
                    funnel_history: order.details?.funnel_history
                }
            })

            // Flag Spam
            const ordersWithFlags = formattedOrders.map(order => {
                const ip = order.ip_address
                if (ip && ip !== 'unknown') {
                    const timestamps = ipCounts[ip]
                    const recentAttempts = timestamps.filter(t => (now - t) < oneHour).length
                    return { ...order, is_spam: recentAttempts > 3 }
                }
                return order
            })

            setOrders(ordersWithFlags)
        } catch (error) {
            console.error("Error fetching orders:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase()
        switch (s) {
            case 'completed': return 'bg-emerald-500'
            case 'processing': return 'bg-blue-500'
            case 'initiated': return 'bg-amber-500'
            case 'cancelled': return 'bg-rose-500'
            default: return 'bg-slate-500'
        }
    }

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch("/api/admin/orders/update-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: id, newStatus })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Update failed")

            fetchOrders()
            alert(`Order ${id.slice(0, 8)} updated to ${newStatus}`)
        } catch (error: any) {
            console.error("Error updating status:", error)
            alert(error.message || "Failed to update status")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
                    <p className="text-muted-foreground">Full control over leads and manual orders</p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Global Ledger</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by User/Email/ID..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Statuses</SelectItem>
                                    <SelectItem value="initiated">Initiated (Lead)</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
                                    <th className="p-4 font-medium">ID / Instagram</th>
                                    <th className="p-4 font-medium">Plan</th>
                                    <th className="p-4 font-medium">Email</th>
                                    <th className="p-4 font-medium">Amount</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground italic">
                                            Loading orders from matrix...
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            No sync entries found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="border-t hover:bg-muted/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        <div className="font-mono text-[10px] text-slate-400">#{order.id.slice(0, 8)}</div>
                                                        <div className="font-bold text-slate-900 group flex items-center gap-1.5">
                                                            @{order.username}
                                                        </div>
                                                    </div>
                                                    {order.is_spam && (
                                                        <Badge variant="destructive" className="animate-pulse py-0 h-5 px-1.5 text-[8px] font-black uppercase tracking-tighter">SPAM RISK</Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="capitalize font-bold border-indigo-200 text-indigo-700 bg-indigo-50">
                                                    {order.plan}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-xs font-medium text-slate-500">{order.email}</td>
                                            <td className="p-4 font-black">${order.amount}</td>
                                            <td className="p-4">
                                                <Badge className={`${getStatusColor(order.status)} text-[10px] font-black uppercase tracking-wider`}>
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Manual Override</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => updateStatus(order.id, 'processing')}>Mark as PAID</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => updateStatus(order.id, 'completed')}>Mark as COMPLETED</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => window.open(`mailto:${order.email}`)}>Contact User</DropdownMenuItem>
                                                        {order.funnel_history && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => alert(JSON.stringify(order.funnel_history, null, 2))}>View Funnel Journey</DropdownMenuItem>
                                                            </>
                                                        )}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => updateStatus(order.id, 'cancelled')} className="text-red-600 font-bold">CANCEL ORDER</DropdownMenuItem>
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
