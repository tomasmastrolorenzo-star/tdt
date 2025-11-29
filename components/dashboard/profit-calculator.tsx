'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfitCalculator() {
    const [price, setPrice] = useState(100)
    const [cost, setCost] = useState(40)
    const commissionRate = 0.40 // 40%

    const margin = price - cost
    const commission = margin * commissionRate
    const systemShare = margin * (1 - commissionRate)

    return (
        <Card className="w-full bg-white shadow-md border-gray-200">
            <CardHeader>
                <CardTitle className="text-gray-900">💰 Calculadora de Ganancias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-gray-700">Precio de Venta ($)</Label>
                        <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="border-gray-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cost" className="text-gray-700">Costo Proveedor ($)</Label>
                        <Input
                            id="cost"
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(Number(e.target.value))}
                            className="border-gray-300"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Margen Bruto:</span>
                        <span className="font-medium text-gray-900">${margin.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-green-600">
                        <span>Tu Comisión (40%):</span>
                        <span>${commission.toFixed(2)} ✅</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Sistema (60%):</span>
                        <span>${systemShare.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
