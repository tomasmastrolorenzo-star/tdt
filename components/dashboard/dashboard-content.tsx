"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  LogOut,
  Wallet,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Trophy,
  Users,
  Calculator,
  Star,
  Award,
  Target,
  Zap,
  Plus,
  Settings,
  Send,
  Check,
  Video
} from "lucide-react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface Level {
  id: string
  name: string
  min_sales: number
  commission_rate: number
}

interface WalletData {
  id: string
  user_id: string
  balance: number
}

interface Order {
  id: string
  status: string
  price_final: number
  seller_commission: number
  created_at: string
  services?: { name: string }
}

interface Service {
  id: string
  name: string
  base_price: number
  description?: string
}

interface UserData {
  id: string
  email: string
  name: string | null
  role: string
  nda_signed: boolean
  levels?: Level
}

interface DashboardContentProps {
  user: User
  userData: UserData | null
  wallet: WalletData | null
  orders: Order[]
  levels: Level[]
  services: Service[]
}

export function DashboardContent({ user, userData, wallet, orders, levels, services }: DashboardContentProps) {
  const [loggingOut, setLoggingOut] = useState(false)
  const [calcPrice, setCalcPrice] = useState(500)
  const [vipPostUrl, setVipPostUrl] = useState("")
  const [isVipSubmitting, setIsVipSubmitting] = useState(false)
  const [vipCountdown, setVipCountdown] = useState<number | null>(null)
  const router = useRouter()

  const hasVipAccess = userData?.role === "CEO" || orders.some(o =>
    o.status === 'COMPLETED' &&
    (o.services?.name?.toLowerCase().includes('authority') || o.services?.name?.toLowerCase().includes('elite') || o.services?.name?.toLowerCase().includes('resurrection'))
  )

  useEffect(() => {
    if (vipCountdown === null) return
    if (vipCountdown <= 0) {
      setVipCountdown(null)
      return
    }
    const timer = setInterval(() => {
      setVipCountdown(prev => prev !== null ? prev - 1 : null)
    }, 1000)
    return () => clearInterval(timer)
  }, [vipCountdown])

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleVipPost = async () => {
    if (!vipPostUrl) return;
    setIsVipSubmitting(true);

    // Optimistic UI Response
    const currentUrl = vipPostUrl;
    setVipPostUrl("");
    setVipCountdown(1800); // 30 mins

    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'VIP_POST_ACTION',
          metadata: {
            url: currentUrl,
            username: userData?.name || user.email,
            plan: 'VIP/ELITE'
          },
          timestamp: new Date().toISOString()
        })
      });
      // We don't wait for the fetch to finish for the user
    } catch (e) {
      console.error(e);
    } finally {
      setIsVipSubmitting(false);
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING_PAYMENT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      PAYMENT_REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
      PAYMENT_CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      PROCESSING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
    }
    return styles[status] || styles.PENDING_PAYMENT
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />
      case "PAYMENT_REJECTED":
        return <XCircle className="w-4 h-4" />
      case "PROCESSING":
        return <Loader2 className="w-4 h-4 animate-spin" />
      case "PAYMENT_CONFIRMED":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING_PAYMENT: "Pago Pendiente",
      PAYMENT_REJECTED: "Rechazado",
      PAYMENT_CONFIRMED: "Pago Confirmado",
      PROCESSING: "En Proceso",
      COMPLETED: "Completado",
    }
    return labels[status] || status
  }

  const currentLevel = userData?.levels
  const commissionRate = (currentLevel?.commission_rate || 10) / 100
  const trenzoMargin = calcPrice * 0.4
  const sellerMargin = calcPrice * 0.6 * commissionRate

  const totalSales = orders.filter((o) => o.status === "COMPLETED").length
  const totalEarnings = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.seller_commission || 0), 0)

  const walletBalance = wallet?.balance || 0

  const isOperator = userData?.role === "OPERATOR" || userData?.role === "CEO"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Trend Digital Trade
            </h1>
            <p className="text-sm text-slate-400">
              Bienvenido, {userData?.name || user.email}
              <Badge className="ml-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                {currentLevel?.name || "Novato"}
              </Badge>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/new-order">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Pedido
              </Button>
            </Link>
            {isOperator && (
              <Link href="/dashboard/operator/orders">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Panel Operador
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Balance Disponible</CardTitle>
              <Wallet className="w-5 h-5 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${walletBalance.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Disponible para retiro</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Ventas Totales</CardTitle>
              <ShoppingCart className="w-5 h-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalSales}</div>
              <p className="text-xs text-slate-500 mt-1">{orders.length} órdenes registradas</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Comisión Actual</CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{currentLevel?.commission_rate || 10}%</div>
              <p className="text-xs text-slate-500 mt-1">Nivel {currentLevel?.name || "Novato"}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Ganancias Totales</CardTitle>
              <Award className="w-5 h-5 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Comisiones acumuladas</p>
            </CardContent>
          </Card>
        </div>

        {/* 🏛️ ADAPTIVE AUTHORITY ROADMAP (VIP ONLY) */}
        {hasVipAccess && (
          <Card className="bg-slate-950 border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.15)] overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Zap className="w-32 h-32 text-indigo-400" />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-indigo-500 text-white mb-2 uppercase font-black tracking-tighter">VIP Authority Active</Badge>
                  <CardTitle className="text-2xl text-white font-black">Adaptive Growth Roadmap</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">Path to 500k Followers • Professional Protocol V3</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-bold uppercase mb-1">Current Velocity</div>
                  <div className="text-xl font-black text-indigo-400">+1.4k / day</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Progress Tracker */}
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-indigo-400">Phase 1: Neural Warmup</span>
                  <span className="text-slate-500 tracking-normal italic font-medium">Month 2 of 5</span>
                </div>
                <div className="h-4 bg-slate-900 rounded-full border border-slate-800 p-1">
                  <div className="h-full w-[35%] bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)] relative">
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2 text-[10px] text-center font-bold text-slate-600 uppercase tracking-tighter">
                  <div className="text-indigo-400">Identity</div>
                  <div className="text-indigo-200">Expansion</div>
                  <div>Domination</div>
                  <div>Monetization</div>
                  <div>Legacy</div>
                </div>
              </div>

              {/* VIP ACTION BUTTONS */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                      <Video className="w-4 h-4 text-cyan-400" /> Content Boost Trigger
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {vipCountdown
                        ? "Priority Signal Sent to Global Network. Golden Window active."
                        : "Just uploaded? Paste the URL here to trigger high-priority AI engagement signals."}
                    </p>
                  </div>
                  {vipCountdown ? (
                    <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-xl border border-indigo-500/20">
                      <div className="w-10 h-10 rounded-full border-2 border-indigo-500/40 border-t-indigo-400 animate-spin flex items-center justify-center">
                        <Check className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Golden Window</p>
                        <p className="text-xl font-black text-white font-mono">{formatCountdown(vipCountdown)}</p>
                      </div>
                      <div className="ml-auto text-[10px] text-slate-500 font-bold uppercase tracking-widest animate-pulse">
                        Signals Propagating...
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Paste Post URL..."
                        className="bg-slate-900 border-slate-800 text-xs h-10"
                        value={vipPostUrl}
                        onChange={(e) => setVipPostUrl(e.target.value)}
                      />
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                        onClick={handleVipPost}
                        disabled={isVipSubmitting}
                      >
                        {isVipSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strategy Specialist</p>
                    <p className="text-sm font-bold text-white">Vortex Engineering Team</p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live Now</p>
                  </div>
                  <Button variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 font-bold text-xs">
                    Access Private WA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calculator and Levels Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Commission Calculator */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-400" />
                Calculadora de Comisiones
              </CardTitle>
              <CardDescription className="text-slate-400">
                Simula tus ganancias según el precio de venta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-slate-300">Precio de Venta al Cliente</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[calcPrice]}
                    onValueChange={(v) => setCalcPrice(v[0])}
                    min={100}
                    max={5000}
                    step={50}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={calcPrice}
                    onChange={(e) => setCalcPrice(Number(e.target.value))}
                    className="w-24 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Tu Comisión ({currentLevel?.commission_rate || 10}%)</p>
                  <p className="text-2xl font-bold text-green-400">${sellerMargin.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Margen Trenzo (40%)</p>
                  <p className="text-2xl font-bold text-cyan-400">${trenzoMargin.toFixed(2)}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                <p className="text-sm text-slate-300">
                  <Zap className="w-4 h-4 inline mr-1 text-yellow-400" />
                  Modelo TDT: 60% para el vendedor, 40% para Trenzo. Tu comisión se calcula sobre el 60%.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Levels Table */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Rangos y Comisiones
              </CardTitle>
              <CardDescription className="text-slate-400">Sube de nivel y aumenta tus comisiones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {levels.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">Cargando niveles...</p>
                ) : (
                  levels.map((level, index) => {
                    const isCurrentLevel = currentLevel?.id === level.id
                    const icons = [Target, Star, Award, Trophy, Zap]
                    const Icon = icons[index] || Star

                    return (
                      <div
                        key={level.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isCurrentLevel
                          ? "bg-cyan-500/10 border-cyan-500/30"
                          : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isCurrentLevel ? "bg-cyan-500/20" : "bg-slate-700/50"}`}>
                            <Icon className={`w-4 h-4 ${isCurrentLevel ? "text-cyan-400" : "text-slate-400"}`} />
                          </div>
                          <div>
                            <p className={`font-medium ${isCurrentLevel ? "text-cyan-400" : "text-white"}`}>
                              {level.name}
                              {isCurrentLevel && (
                                <Badge className="ml-2 bg-cyan-500/20 text-cyan-400 text-xs">Actual</Badge>
                              )}
                            </p>
                            <p className="text-xs text-slate-500">{level.min_sales}+ ventas</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${isCurrentLevel ? "text-cyan-400" : "text-white"}`}>
                            {level.commission_rate}%
                          </p>
                          <p className="text-xs text-slate-500">comisión</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Affiliates Info */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              Programa de Afiliados
            </CardTitle>
            <CardDescription className="text-slate-400">Gana comisiones por referir nuevos vendedores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="text-3xl font-bold text-green-400 mb-2">5%</div>
                <p className="text-sm text-slate-300">Comisión por primera venta</p>
                <p className="text-xs text-slate-500 mt-1">De cada afiliado que refieras</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="text-3xl font-bold text-white mb-2">0</div>
                <p className="text-sm text-slate-300">Afiliados activos</p>
                <p className="text-xs text-slate-500 mt-1">Vendedores referidos</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="text-3xl font-bold text-white mb-2">$0.00</div>
                <p className="text-sm text-slate-300">Ganancias por afiliados</p>
                <p className="text-xs text-slate-500 mt-1">Total acumulado</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <p className="text-sm text-slate-400">
                <strong className="text-white">¿Cómo funciona?</strong> Cuando refieres un nuevo vendedor y este realiza
                su primera venta, recibes el 5% del margen Trenzo (40%) de esa venta. ¡Construye tu red y genera
                ingresos pasivos!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Órdenes Recientes</CardTitle>
            <CardDescription className="text-slate-400">Tus últimas 10 órdenes</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No tienes órdenes aún. ¡Comienza a vender!</div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white">{order.services?.name || "Servicio"}</p>
                      <p className="text-sm text-slate-400">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">${(order.price_final || 0).toFixed(2)}</p>
                      <p className="text-xs text-green-400">+${(order.seller_commission || 0).toFixed(2)}</p>
                      <Badge className={getStatusBadge(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusLabel(order.status)}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
