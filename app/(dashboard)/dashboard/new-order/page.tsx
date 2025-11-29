'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Service } from '@/lib/supabase/types'

export default function NewOrderPage() {
    const [services, setServices] = useState<Service[]>([])
    const [selectedServiceId, setSelectedServiceId] = useState<string>('')
    const [link, setLink] = useState('')
    const [quantity, setQuantity] = useState<number>(1000)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchServices = async () => {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('is_active', true)
                .order('name')

            if (data) setServices(data)
        }
        fetchServices()
    }, [])

    const selectedService = services.find(s => s.id === selectedServiceId)
    const totalCost = selectedService ? (selectedService.base_price * quantity) / 1000 : 0

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (!selectedService) return

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setError("No estás autenticado")
            setLoading(false)
            return
        }

        // 1. Get user profile to check level (for commission calculation - simplified for now)
        // For MVP we just insert the order. 
        // In TDTv2 logic: Vendor Commission = (Sale Price - Cost) * Level %. 
        // Here we assume Sale Price = Cost for the vendor (or we need a pricing logic).
        // Let's stick to simple insertion first.

        const { error: orderError } = await supabase
            .from('orders')
            .insert({
                vendor_id: user.id,
                service_id: selectedService.id,
                client_name: 'Self-Service', // Or input field if needed
                sale_price: totalCost, // Assuming vendor pays this
                cost_price: totalCost * 0.8, // Mock cost price (80% of sale)
                status: 'PENDING',
                notes: `Link: ${link} | Quantity: ${quantity}`
            })

        if (orderError) {
            setError(orderError.message)
            setLoading(false)
        } else {
            router.push('/dashboard/orders')
            router.refresh()
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Nuevo Pedido</CardTitle>
                    <CardDescription>Selecciona un servicio y crea tu orden</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Servicio</Label>
                            <Select onValueChange={setSelectedServiceId} value={selectedServiceId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un servicio" />
                                </SelectTrigger>
                                <SelectContent>
                                    {services.map(service => (
                                        <SelectItem key={service.id} value={service.id}>
                                            {service.name} - ${service.base_price}/1k
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="link">Enlace (Link)</Label>
                            <Input
                                id="link"
                                placeholder="https://instagram.com/..."
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Cantidad</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="100"
                                step="100"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                required
                            />
                        </div>

                        {selectedService && (
                            <div className="p-4 bg-muted rounded-lg flex justify-between items-center">
                                <span className="font-medium">Costo Total:</span>
                                <span className="text-xl font-bold text-primary">
                                    ${totalCost.toFixed(2)}
                                </span>
                            </div>
                        )}

                        {error && <p className="text-sm text-destructive">{error}</p>}

                        <Button type="submit" className="w-full" disabled={loading || !selectedService}>
                            {loading ? 'Procesando...' : 'Crear Pedido'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
