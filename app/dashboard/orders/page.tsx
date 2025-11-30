"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
router.push("/login")
return
            }

let query = supabase
    .from("orders")
    .select("*, services(name)")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })

if (statusFilter !== "ALL") {
    query = query.eq("status", statusFilter)
}

const { data, error } = await query

if (error) {
    console.error("Error loading orders:", error)
} else {
    setOrders(data || [])
}

setLoading(false)
        }

loadOrders()
    }, [router, supabase, statusFilter])

const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
        PENDING_PAYMENT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        PAYMENT_REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
        PAYMENT_CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        PROCESSING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
    }
    return styles[status] || "bg-zinc-500/20 text-zinc-400"
}

const filteredOrders = orders.filter(order =>
    order.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.services?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.includes(searchTerm)
)

return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Dashboard
                </Link>

                <Link href="/dashboard/new-order">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Nuevo Pedido
                    </Button>
                </Link>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 mb-6">
                <CardHeader>
                    <CardTitle className="text-xl text-white">Mis Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <Input
                                placeholder="Buscar por cliente, servicio o ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-zinc-800 border-zinc-700 text-white"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            {["ALL", "PENDING_PAYMENT", "PROCESSING", "COMPLETED"].map((status) => (
                                <Button
                                    key={status}
                                    variant={statusFilter === status ? "default" : "outline"}
                                    onClick={() => setStatusFilter(status)}
                                    className={`whitespace-nowrap ${statusFilter === status
                                        ? "bg-emerald-600 hover:bg-emerald-700 border-transparent"
                                        : "bg-transparent border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                        }`}
                                >
                                    {status === "ALL" ? "Todos" : status.replace("_", " ")}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500">
                            No se encontraron pedidos
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50 hover:border-zinc-600 transition-colors gap-4"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-white">{order.services?.name || "Servicio desconocido"}</span>
                                            <Badge className={`text-[10px] px-1.5 py-0 ${getStatusBadge(order.status)}`}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-zinc-400 flex flex-col sm:flex-row sm:gap-4">
                                            <span>Cliente: {order.client_name}</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6">
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white">${order.price_final.toFixed(2)}</p>
                                            <p className="text-xs text-emerald-400">Comisión: ${order.seller_commission.toFixed(2)}</p>
                                        </div>

                                        {order.link && (
                                            <a
                                                href={order.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
)
}
