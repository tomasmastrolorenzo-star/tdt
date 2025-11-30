"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Calculator } from "lucide-react"
import Link from "next/link"
import type { Service, Level } from "@/lib/supabase/types"

export default function NewOrderPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [userLevel, setUserLevel] = useState<Level | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Form state
  const [selectedServiceId, setSelectedServiceId] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [link, setLink] = useState("")
  const [priceFinal, setPriceFinal] = useState("")
  const [notes, setNotes] = useState("")

  // Calculated values
  const [commission, setCommission] = useState(0)
  const [marginTrenzo, setMarginTrenzo] = useState(0)

  useEffect(() => {
    async function loadData() {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUserId(user.id)

      // Get user's level
      const { data: userData } = await supabase.from("users").select("*, levels(*)").eq("id", user.id).single()

      if (userData?.levels) {
        setUserLevel(userData.levels)
      }

      // Get services
      const { data: servicesData } = await supabase.from("services").select("*").eq("is_active", true).order("name")

      if (servicesData) {
        setServices(servicesData)
      }
    }

    loadData()
  }, [supabase, router])

  // Calculate commission when price or service changes
  useEffect(() => {
    if (!priceFinal || !selectedServiceId || !userLevel) {
      setCommission(0)
      setMarginTrenzo(0)
      return
    }

    const service = services.find((s) => s.id === selectedServiceId)
    if (!service) return

    const finalPrice = Number.parseFloat(priceFinal)
    const basePrice = service.base_price
    const margin = finalPrice - basePrice

    if (margin > 0) {
      const commissionRate = userLevel.commission_rate / 100
      const sellerCommission = margin * commissionRate
      const trenzoMargin = margin - sellerCommission

      setCommission(sellerCommission)
      setMarginTrenzo(trenzoMargin)
    } else {
      setCommission(0)
      setMarginTrenzo(0)
    }
  }, [priceFinal, selectedServiceId, userLevel, services])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !selectedServiceId) return

    setLoading(true)

    try {
      const { error } = await supabase.from("orders").insert({
        seller_id: userId,
        service_id: selectedServiceId,
        client_name: clientName,
        client_email: clientEmail || null,
        link: link,
        price_final: Number.parseFloat(priceFinal),
        seller_commission: commission,
        margin_trenzo: marginTrenzo,
        status: "PENDING_PAYMENT",
        notes: notes || null,
      })

      if (error) throw error

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Error al crear el pedido. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const selectedService = services.find((s) => s.id === selectedServiceId)

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </Link>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Nuevo Pedido</CardTitle>
            <CardDescription className="text-zinc-400">Crea un nuevo pedido para tu cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <div className="space-y-2">
                <Label htmlFor="service" className="text-zinc-300">
                  Servicio
                </Label>
                <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id} className="text-white hover:bg-zinc-700">
                        {service.name} - ${service.base_price.toFixed(2)} (base)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-zinc-300">
                    Nombre del Cliente *
                  </Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nombre completo"
                    required
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail" className="text-zinc-300">
                    Email del Cliente
                  </Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="email@ejemplo.com"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Link */}
              <div className="space-y-2">
                <Label htmlFor="link" className="text-zinc-300">
                  Link / URL
                </Label>
                <Input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="priceFinal" className="text-zinc-300">
                  Precio Final (USD) *
                </Label>
                <Input
                  id="priceFinal"
                  type="number"
                  step="0.01"
                  min={selectedService ? selectedService.base_price : 0}
                  value={priceFinal}
                  onChange={(e) => setPriceFinal(e.target.value)}
                  placeholder="0.00"
                  required
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
                {selectedService && (
                  <p className="text-xs text-zinc-500">Precio mínimo: ${selectedService.base_price.toFixed(2)}</p>
                )}
              </div>

              {/* Commission Calculator */}
              {selectedService && priceFinal && Number.parseFloat(priceFinal) > selectedService.base_price && (
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calculator className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-zinc-300">Vista previa de comisiones</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-zinc-500">Tu nivel</p>
                        <p className="text-white font-medium">
                          {userLevel?.name} ({userLevel?.commission_rate}%)
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Margen total</p>
                        <p className="text-white font-medium">
                          ${(Number.parseFloat(priceFinal) - selectedService.base_price).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Tu comisión</p>
                        <p className="text-emerald-500 font-bold text-lg">${commission.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Margen TDT</p>
                        <p className="text-blue-400 font-medium">${marginTrenzo.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-zinc-300">
                  Notas
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas adicionales..."
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[100px]"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !selectedServiceId || !clientName || !priceFinal}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando pedido...
                  </>
                ) : (
                  "Crear Pedido"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
