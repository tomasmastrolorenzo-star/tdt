"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, DollarSign, Wallet, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AddFundsPage() {
    const router = useRouter()
    const [amount, setAmount] = useState("10")
    const [paymentMethod, setPaymentMethod] = useState("crypto")
    const [loading, setLoading] = useState(false)

    const handleAmountChange = (value: string) => {
        setAmount(value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate payment processing
        setTimeout(() => {
            setLoading(false)
            alert("Redirigiendo a la pasarela de pago...")
        }, 1500)
    }

    const presetAmounts = ["10", "25", "50", "100", "250", "500"]

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

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Agregar Fondos</h1>
                    <p className="text-zinc-400">Recarga tu saldo para comprar servicios.</p>
                </div>

                <div className="grid gap-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-emerald-500" />
                                Seleccionar Monto
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Elige un monto predefinido o ingresa uno personalizado
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-3 gap-3">
                                {presetAmounts.map((preset) => (
                                    <Button
                                        key={preset}
                                        type="button"
                                        variant={amount === preset ? "default" : "outline"}
                                        onClick={() => handleAmountChange(preset)}
                                        className={amount === preset
                                            ? "bg-emerald-600 hover:bg-emerald-700 border-transparent"
                                            : "bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"}
                                    >
                                        ${preset}
                                    </Button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="custom-amount" className="text-zinc-300">Monto Personalizado ($)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                                    <Input
                                        id="custom-amount"
                                        type="number"
                                        min="5"
                                        step="1"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="pl-8 bg-zinc-800 border-zinc-700 text-white focus:ring-emerald-500/50"
                                        placeholder="0.00"
                                    />
                                </div>
                                <p className="text-xs text-zinc-500">Mínimo de recarga: $5.00</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-emerald-500" />
                                Método de Pago
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                                <div className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === "crypto" ? "bg-emerald-900/10 border-emerald-500/50" : "bg-zinc-800/30 border-zinc-700 hover:border-zinc-600"}`}>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="crypto" id="crypto" className="text-emerald-500 border-zinc-500" />
                                        <Label htmlFor="crypto" className="cursor-pointer font-medium text-white">Criptomonedas</Label>
                                    </div>
                                    <Wallet className="w-5 h-5 text-zinc-400" />
                                </div>

                                <div className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === "stripe" ? "bg-emerald-900/10 border-emerald-500/50" : "bg-zinc-800/30 border-zinc-700 hover:border-zinc-600"}`}>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="stripe" id="stripe" className="text-emerald-500 border-zinc-500" />
                                        <Label htmlFor="stripe" className="cursor-pointer font-medium text-white">Tarjeta de Crédito / Débito</Label>
                                    </div>
                                    <CreditCard className="w-5 h-5 text-zinc-400" />
                                </div>
                            </RadioGroup>

                            {paymentMethod === "crypto" && (
                                <Alert className="mt-4 bg-blue-500/10 border-blue-500/20 text-blue-400">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Bonificación</AlertTitle>
                                    <AlertDescription>
                                        Obtén un 5% extra en recargas con criptomonedas superiores a $100.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || parseFloat(amount) < 5}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
                            >
                                {loading ? "Procesando..." : `Pagar $${parseFloat(amount || "0").toFixed(2)}`}
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Pagos seguros y encriptados</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
