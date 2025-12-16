"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ShoppingBag } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function NewOrderPage() {
    const [loading, setLoading] = useState(false)
    const [services, setServices] = useState<any[]>([])
    const [selectedService, setSelectedService] = useState("")
    const [link, setLink] = useState("")
    const [quantity, setQuantity] = useState("")
    const supabase = createClient()
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        // Ideally fetch from vendor_services, for MVP maybe fetch everything
        // For now, let's just use static or fetch from `vendor_services`
        // If no vendor services, show empty
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('vendor_services')
            .select('*')
            .eq('vendor_id', user.id)
            .eq('is_active', true)

        if (data) {
            setServices(data)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No user found")

            const service = services.find(s => s.id === selectedService)
            if (!service) throw new Error("Service not found")

            const cost = Number(service.selling_price) * (Number(quantity) / 1000)

            // Check balance (optional for MVP if we allow debt or manual invoice)
            // For MVP, just create order

            const { error } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    service_id: service.jap_service_id, // Or however we map it
                    package_id: selectedService,
                    amount: Number(quantity),
                    price: cost,
                    platform: service.platform || 'instagram', // fallback
                    status: 'pending', // or processing if auto-JAP
                    link: link
                })

            if (error) throw error

            toast({
                title: "Orden creada",
                description: "Tu orden ha sido procesada exitosamente.",
            })

            router.push("/dashboard/orders")

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Nuevo Pedido</h1>
                <p className="text-zinc-400">Crea una nueva orden de servicios.</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-emerald-500" />
                        Detalles del Pedido
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="service" className="text-zinc-300">Servicio</Label>
                            <Select value={selectedService} onValueChange={setSelectedService}>
                                <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                                    <SelectValue placeholder="Selecciona un servicio..." />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    {services.length === 0 ? (
                                        <SelectItem value="none" disabled>No tienes servicios activos</SelectItem>
                                    ) : (
                                        services.map(s => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.jap_service_id} - ${s.selling_price}/1k
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="link" className="text-zinc-300">Link (Perfil o Post)</Label>
                            <Input
                                id="link"
                                placeholder="https://instagram.com/usuario"
                                className="bg-zinc-950 border-zinc-800 text-white"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity" className="text-zinc-300">Cantidad</Label>
                            <Input
                                id="quantity"
                                type="number"
                                placeholder="1000"
                                className="bg-zinc-950 border-zinc-800 text-white"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                                min={100}
                            />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" disabled={loading || services.length === 0}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    "Confirmar Pedido"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
