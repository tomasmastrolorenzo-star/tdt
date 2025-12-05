"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, RefreshCw, Search, Package, DollarSign, Clock, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Order, OrderStatus } from "@/lib/supabase/types"
import { StatsCard } from "@/components/dashboard/StatsCard"

interface OrderWithRelations extends Omit<Order, 'services'> {
  services: { name: string; base_price: number } | null
  profiles: { full_name: string | null; email: string } | null
}

const statusColors: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  PAYMENT_REJECTED: "bg-red-500/20 text-red-700 border-red-500/30",
  PAYMENT_CONFIRMED: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  PROCESSING: "bg-purple-500/20 text-purple-700 border-purple-500/30",
  COMPLETED: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const { data: userData } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!userData || (userData.role !== "OPERATOR" && userData.role !== "CEO")) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        services (name, base_price),
        profiles (full_name, email)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error loading orders:", error)
    } else {
      setOrders(data || [])
    }

    setLoading(false)
  }

  function filterOrders() {
    let filtered = orders

    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.services?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
  }

  async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    setUpdatingId(orderId)
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

    if (error) {
      console.error("Error updating order:", error)
    } else {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
    }

    setUpdatingId(null)
  }

  const pendingOrders = orders.filter((o) => o.status === "PENDING_PAYMENT" || o.status === "PAYMENT_CONFIRMED").length
  const completedOrders = orders.filter((o) => o.status === "COMPLETED").length
  const totalMargin = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.margin_trenzo || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Administra y actualiza el estado de los pedidos asignados</p>
        </div>
        <Button variant="outline" onClick={loadData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Pedidos"
          value={orders.length.toString()}
          icon={Package}
          description="En el sistema"
        />
        <StatsCard
          title="Pendientes"
          value={pendingOrders.toString()}
          icon={Clock}
          trend={{ value: 12, label: "vs semana pasada", positive: false }}
        />
        <StatsCard
          title="Completados"
          value={completedOrders.toString()}
          icon={CheckCircle}
          trend={{ value: 8, label: "esta semana", positive: true }}
        />
        <StatsCard
          title="Margen Total"
          value={`$${totalMargin.toFixed(2)}`}
          icon={DollarSign}
          description="Ganancia acumulada"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, vendedor, servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="PENDING_PAYMENT">Pago Pendiente</SelectItem>
                <SelectItem value="PAYMENT_CONFIRMED">Pago Confirmado</SelectItem>
                <SelectItem value="PROCESSING">En Proceso</SelectItem>
                <SelectItem value="COMPLETED">Completados</SelectItem>
                <SelectItem value="PAYMENT_REJECTED">Rechazados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
          <CardDescription>Gestiona y actualiza el estado de los pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No hay pedidos que coincidan con los filtros</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Servicio</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendedor</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Precio</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Comisión</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Margen TDT</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Estado</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{order.client_name}</p>
                          <p className="text-xs text-muted-foreground">{order.client_email || "Sin email"}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p>{order.services?.name || "N/A"}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p>{order.profiles?.full_name || "Sin nombre"}</p>
                          <p className="text-xs text-muted-foreground">{order.profiles?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-medium">${order.price_final.toFixed(2)}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="text-emerald-600">${order.seller_commission.toFixed(2)}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="text-blue-600">${order.margin_trenzo.toFixed(2)}</p>
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
                          <SelectTrigger className="w-36 text-xs">
                            {updatingId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <SelectValue />}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING_PAYMENT">Pago Pendiente</SelectItem>
                            <SelectItem value="PAYMENT_CONFIRMED">Pago Confirmado</SelectItem>
                            <SelectItem value="PROCESSING">En Proceso</SelectItem>
                            <SelectItem value="COMPLETED">Completado</SelectItem>
                            <SelectItem value="PAYMENT_REJECTED">Rechazado</SelectItem>
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
  )
}
