"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { VendorNav } from "@/components/dashboard/VendorNav"
import { Calculator, DollarSign, ArrowRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function VendorCalculatorPage() {
    const [servicePrice, setServicePrice] = useState("")
    const [quantity, setQuantity] = useState("1000")
    const [margin, setMargin] = useState("20")
    const [result, setResult] = useState<{
        cost: number
        salePrice: number
        profit: number
    } | null>(null)

    const calculateProfit = () => {
        const cost = Number(servicePrice) * (Number(quantity) / 1000)
        const profitMargin = Number(margin) / 100
        const salePrice = cost * (1 + profitMargin)
        const profit = salePrice - cost

        setResult({
            cost,
            salePrice,
            profit
        })
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <VendorNav />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Calculadora de Ganancias</h1>
                    <p className="text-muted-foreground">Proyecta tus márgenes y define tus precios de venta</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuración del Servicio</CardTitle>
                        <CardDescription>Ingresa los costos base del servicio</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Costo Base (por 1000 unidades)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="price"
                                    placeholder="0.00"
                                    className="pl-8"
                                    value={servicePrice}
                                    onChange={(e) => setServicePrice(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Cantidad a Vender</Label>
                            <Select value={quantity} onValueChange={setQuantity}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar cantidad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="500">500</SelectItem>
                                    <SelectItem value="1000">1,000</SelectItem>
                                    <SelectItem value="2000">2,000</SelectItem>
                                    <SelectItem value="5000">5,000</SelectItem>
                                    <SelectItem value="10000">10,000</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="margin">Tu Margen de Ganancia (%)</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="margin"
                                    type="number"
                                    value={margin}
                                    onChange={(e) => setMargin(e.target.value)}
                                />
                                <span className="text-muted-foreground">%</span>
                            </div>
                        </div>

                        <Button className="w-full mt-4" onClick={calculateProfit}>
                            <Calculator className="mr-2 h-4 w-4" />
                            Calcular
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle>Resultados Estimados</CardTitle>
                        <CardDescription>Desglose de costos y beneficios</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {result ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-background p-4 rounded-lg border">
                                        <div className="text-sm text-muted-foreground mb-1">Costo Total</div>
                                        <div className="text-2xl font-bold">${result.cost.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-background p-4 rounded-lg border">
                                        <div className="text-sm text-muted-foreground mb-1">Precio de Venta</div>
                                        <div className="text-2xl font-bold text-blue-600">${result.salePrice.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div className="bg-green-500/10 p-6 rounded-lg border border-green-500/20 text-center">
                                    <div className="text-sm text-green-600 font-medium mb-2">Tu Ganancia Neta</div>
                                    <div className="text-4xl font-bold text-green-700">${result.profit.toFixed(2)}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                <ArrowRight className="h-12 w-12 mb-4" />
                                <p>Ingresa los datos para ver la proyección</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
