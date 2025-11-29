'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Service, Package } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Instagram, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ServicePageProps {
    platform: 'INSTAGRAM' | 'TIKTOK'
    serviceType: 'FOLLOWERS' | 'LIKES' | 'VIEWS'
}

export function ServiceCheckout({ platform, serviceType }: ServicePageProps) {
    const router = useRouter()
    const [services, setServices] = useState<Service[]>([])
    const [selectedQuality, setSelectedQuality] = useState<'ACTIVE' | 'PREMIUM' | 'VIP'>('PREMIUM')
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [customerEmail, setCustomerEmail] = useState('')
    const [customerUsername, setCustomerUsername] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchServices()
    }, [platform, serviceType])

    const fetchServices = async () => {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('platform', platform)
            .eq('service_type', serviceType)
            .eq('is_active', true)
            .order('quantity', { ascending: true })

        if (data && !error) {
            setServices(data as Service[])
        }
    }

    const filteredServices = services.filter(s => s.quality === selectedQuality)

    const handleCreateOrder = async () => {
        if (!selectedService || !customerEmail || !customerUsername) {
            alert('Por favor completa todos los campos')
            return
        }

        setLoading(true)

        const orderNumber = `ORD-${Date.now()}`

        const { data, error } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                customer_email: customerEmail,
                customer_username: customerUsername,
                service_id: selectedService.id,
                platform: selectedService.platform,
                service_type: selectedService.service_type,
                quality: selectedService.quality,
                quantity: selectedService.actual_quantity,
                price: selectedService.price,
                status: 'PENDING',
                payment_status: 'PENDING'
            })
            .select()
            .single()

        setLoading(false)

        if (error) {
            alert('Error al crear la orden: ' + error.message)
        } else {
            alert(`¡Orden creada! Número: ${orderNumber}`)
            router.push('/')
        }
    }

    const getServiceIcon = () => {
        if (serviceType === 'FOLLOWERS') return '👥'
        if (serviceType === 'LIKES') return '❤️'
        return '👁️'
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Instagram className="w-8 h-8 text-pink-600" />
                        <h1 className="text-4xl font-bold text-gray-900">
                            Buy {platform === 'INSTAGRAM' ? 'Instagram' : 'TikTok'} {serviceType}
                        </h1>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">1</div>
                            <span className="text-sm font-medium">Checkout</span>
                        </div>
                        <div className="w-16 h-1 bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">2</div>
                            <span className="text-sm text-gray-500">Choose Upgrades</span>
                        </div>
                        <div className="w-16 h-1 bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">3</div>
                            <span className="text-sm text-gray-500">Start Growing</span>
                        </div>
                    </div>
                </div>

                {/* Quality Tabs */}
                <div className="flex gap-4 mb-8 justify-center">
                    <button
                        onClick={() => setSelectedQuality('ACTIVE')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${selectedQuality === 'ACTIVE'
                                ? 'bg-white shadow-lg border-2 border-gray-300'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                    >
                        👥 Active
                    </button>
                    <button
                        onClick={() => setSelectedQuality('PREMIUM')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all relative ${selectedQuality === 'PREMIUM'
                                ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-xl'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                    >
                        ⚡ Premium
                        {selectedQuality === 'PREMIUM' && (
                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
                                Most Popular
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setSelectedQuality('VIP')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${selectedQuality === 'VIP'
                                ? 'bg-white shadow-lg border-2 border-gray-300'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                    >
                        🚀 VIP
                    </button>
                </div>

                {/* Services Grid */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Choose Quantity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {filteredServices.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => setSelectedService(service)}
                                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedService?.id === service.id
                                            ? 'border-purple-600 bg-purple-50'
                                            : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-bold text-lg text-gray-900">
                                                {getServiceIcon()} {service.quantity.toLocaleString()} {serviceType}
                                            </div>
                                            {service.bonus_percentage > 0 && (
                                                <div className="text-sm text-green-600 font-medium">
                                                    ¡BONUS {service.bonus_percentage}% GRATIS! ({service.actual_quantity.toLocaleString()} {serviceType})
                                                </div>
                                            )}
                                            <div className="text-sm text-gray-500">{service.delivery_time}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-purple-600">${service.price}</div>
                                            {selectedService?.id === service.id && (
                                                <Check className="w-6 h-6 text-purple-600 ml-auto mt-1" />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Info */}
                {selectedService && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Your Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="username">Your {platform === 'INSTAGRAM' ? 'Instagram' : 'TikTok'} Username</Label>
                                <Input
                                    id="username"
                                    placeholder="@username"
                                    value={customerUsername}
                                    onChange={(e) => setCustomerUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Add to Cart Button */}
                {selectedService && (
                    <Button
                        onClick={handleCreateOrder}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-6 text-lg font-bold hover:shadow-xl transition-all"
                    >
                        {loading ? 'Creating Order...' : `🛒 Add to Cart - $${selectedService.price}`}
                    </Button>
                )}
            </div>
        </div>
    )
}
