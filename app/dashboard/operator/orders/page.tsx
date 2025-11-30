"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, RefreshCw, Search, Package, DollarSign, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import type { Order, OrderStatus } from "@/lib/supabase/types"

interface OrderWithRelations extends Order {
  services: { name: string; base_price: number } | null
  users: { name: string | null; email: string } | null
}

const statusColors: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  PAYMENT_REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
  PAYMENT_CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PROCESSING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  COMPLETED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Pago Pendiente",
  PAYMENT_REJECTED: "Pago Rechazado",
  PAYMENT_CONFIRMED: "Pago Confirmado",
  PROCESSING: "En Proceso",
  COMPLETED: "Completado",
}

export default function OperatorOrdersPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderWithRelations[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderWithRelations[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  async function loadData() {
    setLoading(true)

    // Check user role
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!userData || (userData.role !== "OPERATOR" && userData.role !== "CEO")) {
      router.push("/dashboard")
      return
    }

    setUserRole(userData.role)

    // Load all orders
    const { data: ordersData, error } = await supabase
      .from("orders")
      .select(`
        *,
        services(name, base_price),
        users(name, email)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error loading orders:", error)
    } else {
      setOrders(ordersData || [])
    }

    setLoading(false)
  }

  function filterOrders() {
    let filtered = [...orders]

    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (o) =>
          o.client_name.toLowerCase().includes(term) ||
          o.client_email?.toLowerCase().includes(term) ||
          o.services?.name.toLowerCase().includes(term) ||
          o.users?.name?.toLowerCase().includes(term) ||
          o.users?.email.toLowerCase().includes(term),
      )
    }

    setFilteredOrders(filtered)
  }

  async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    setUpdatingId(orderId)

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (error) {
      console.error("Error updating order:", error)
      alert("Error al actualizar el estado")
    } else {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
    }

    setUpdatingId(null)
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "PENDING_PAYMENT" || o.status === "PAYMENT_CONFIRMED").length
  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.margin_trenzo || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
            <p className="text-zinc-400">Panel de operador - {userRole}</p>
          </div>
          <Button
            variant="outline"
            onClick={loadData}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Total Pedidos</p>
                  <p className="text-2xl font-bold text-white">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-500/20">
                  <Users className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Por Procesar</p>
                  <p className="text-2xl font-bold text-white">{pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/20">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Margen TDT Total</p>
                  <p className="text-2xl font-bold text-emerald-500">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    placeholder="Buscar por cliente, vendedor, servicio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="all" className="text-white hover:bg-zinc-700">
                    Todos
                  </SelectItem>
                  <SelectItem value="PENDING_PAYMENT" className="text-white hover:bg-zinc-700">
                    Pago Pendiente
                  </SelectItem>
                  <SelectItem value="PAYMENT_CONFIRMED" className="text-white hover:bg-zinc-700">
                    Pago Confirmado
                  </SelectItem>
                  <SelectItem value="PROCESSING" className="text-white hover:bg-zinc-700">
                    En Proceso
                  </SelectItem>
                  <SelectItem value="COMPLETED" className="text-white hover:bg-zinc-700">
                    Completados
                  </SelectItem>
                  <SelectItem value="PAYMENT_REJECTED" className="text-white hover:bg-zinc-700">
                    Rechazados
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Pedidos ({filteredOrders.length})</CardTitle>
            <CardDescription className="text-zinc-400">Gestiona y actualiza el estado de los pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">No hay pedidos que coincidan con los filtros</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-4 text-zinc-400 font-medium">Cliente</th>
                      <th className="text-left py-3 px-4 text-zinc-400 font-medium">Servicio</th>
                      <th className="text-left py-3 px-4 text-zinc-400 font-medium">Vendedor</th>
                      <th className="text-right py-3 px-4 text-zinc-400 font-medium">Precio</th>
                      <th className="text-right py-3 px-4 text-zinc-400 font-medium">Comisión</th>
                      <th className="text-right py-3 px-4 text-zinc-400 font-medium">Margen TDT</th>
                      <th className="text-center py-3 px-4 text-zinc-400 font-medium">Estado</th>
                      <th className="text-center py-3 px-4 text-zinc-400 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-white font-medium">{order.client_name}</p>
                            <p className="text-xs text-zinc-500">{order.client_email || "Sin email"}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-zinc-300">{order.services?.name || "N/A"}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-zinc-300">{order.users?.name || "Sin nombre"}</p>
                            <p className="text-xs text-zinc-500">{order.users?.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="text-white font-medium">${order.price_final.toFixed(2)}</p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="text-emerald-400">${order.seller_commission.toFixed(2)}</p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="text-blue-400">${order.margin_trenzo.toFixed(2)}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                            disabled={updatingId === order.id}
                          >
                            <SelectTrigger className="w-36 bg-zinc-800 border-zinc-700 text-white text-xs">
                              {updatingId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <SelectValue />}
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="PENDING_PAYMENT" className="text-white hover:bg-zinc-700">
                                Pago Pendiente
                              </SelectItem>
                              <SelectItem value="PAYMENT_CONFIRMED" className="text-white hover:bg-zinc-700">
                                Pago Confirmado
                              </SelectItem>
                              <SelectItem value="PROCESSING" className="text-white hover:bg-zinc-700">
                                En Proceso
                              </SelectItem>
                              <SelectItem value="COMPLETED" className="text-white hover:bg-zinc-700">
                                Completado
                              </SelectItem>
                              <SelectItem value="PAYMENT_REJECTED" className="text-white hover:bg-zinc-700">
                                Rechazado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
